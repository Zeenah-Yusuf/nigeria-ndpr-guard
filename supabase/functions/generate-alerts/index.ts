// supabase/functions/generate-alerts/index.ts
// Generate personalized compliance alerts for users
// Checks recent regulatory updates and notifies affected users

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// ============================================
// CORS
// ============================================

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

// ============================================
// HELPERS
// ============================================

function successResponse(data: any, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

function errorResponse(message: string, status = 500): Response {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

function measurePerformance() {
  let startTime = 0;
  return {
    start: () => { startTime = performance.now(); },
    end: () => performance.now() - startTime,
  };
}

/**
 * Calculate relevance score between an update and a user
 */
function calculateRelevance(
  update: Record<string, any>,
  userSectors: string[],
  userFrameworks: string[]
): number {
  let score = 0;

  if (update.affected_sectors && Array.isArray(update.affected_sectors)) {
    const matchingSectors = update.affected_sectors.filter((s: string) =>
      userSectors.includes(s)
    );
    score += (matchingSectors.length / Math.max(update.affected_sectors.length, 1)) * 0.5;
  }

  if (update.affected_frameworks && Array.isArray(update.affected_frameworks)) {
    const matchingFrameworks = update.affected_frameworks.filter((f: string) =>
      userFrameworks.includes(f)
    );
    score += (matchingFrameworks.length / Math.max(update.affected_frameworks.length, 1)) * 0.3;
  }

  const lowerTitle = (update.title || '').toLowerCase();
  const lowerContent = (update.content || '').toLowerCase();

  if (/penalty|fine|sanction|offence|prohibited|ban|suspended/i.test(lowerTitle + lowerContent)) {
    score += 0.2;
  }

  const updateDate = new Date(update.published_at || update.detected_at);
  const daysSinceUpdate = (Date.now() - updateDate.getTime()) / (1000 * 60 * 60 * 24);
  if (daysSinceUpdate <= 1) score += 0.1;
  if (daysSinceUpdate <= 7) score += 0.05;

  return Math.min(score, 1);
}

/**
 * Generate simple alert summary (no AI dependency)
 */
function generateAlertSummary(update: Record<string, any>, userSector: string): string {
  const content = update.content || update.title || '';
  const summary = content.substring(0, 200).trim();
  return summary.length < content.length ? summary + '...' : summary;
}

/**
 * Determine if an alert requires immediate action
 */
function requiresAction(update: Record<string, any>, relevanceScore: number): boolean {
  if (relevanceScore < 0.5) return false;

  const urgentKeywords = [
    'immediate', 'deadline', 'effective immediately', 'penalty',
    'fine', 'sanction', 'prohibited', 'ban', 'revoke', 'suspended',
    'must comply', 'mandatory', 'required', '72 hours', 'urgent',
    'circular', 'directive', 'warning', 'notice of violation',
  ];

  const lowerText = ((update.title || '') + ' ' + (update.content || '')).toLowerCase();
  return urgentKeywords.some(keyword => lowerText.includes(keyword));
}

// ============================================
// MAIN FUNCTION
// ============================================

serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  const perf = measurePerformance();
  perf.start();

  try {
    // Get environment variables
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!supabaseUrl || !supabaseKey) {
      return errorResponse('Missing Supabase environment variables', 500);
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log('Starting alert generation...');

    // Step 1: Get unprocessed regulatory updates (last 7 days)
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

    const { data: updates, error: updatesError } = await supabase
      .from('regulatory_updates')
      .select(`
        id,
        title,
        content,
        summary,
        published_at,
        detected_at,
        affected_sectors,
        affected_frameworks,
        relevance_score,
        processed,
        regulators!inner(name, acronym)
      `)
      .gte('detected_at', sevenDaysAgo)
      .eq('processed', false)
      .order('published_at', { ascending: false });

    if (updatesError) {
      console.error('Failed to fetch updates:', updatesError);
      return errorResponse('Failed to fetch regulatory updates', 500);
    }

    console.log(`Found ${updates?.length || 0} unprocessed updates`);

    if (!updates || updates.length === 0) {
      const processingTime = perf.end();
      return successResponse({
        success: true,
        message: 'No new regulatory updates to process',
        updatesChecked: 0,
        alertsGenerated: 0,
        usersNotified: 0,
        processingTimeMs: Math.round(processingTime),
      });
    }

    // Step 2: Get all users with their sectors
    const { data: userSectors, error: userSectorsError } = await supabase
      .from('user_sectors')
      .select(`
        user_id,
        sectors!inner(slug, name)
      `);

    if (userSectorsError) {
      console.error('Failed to fetch user sectors:', userSectorsError);
      return errorResponse('Failed to fetch user data', 500);
    }

    // Group sectors by user
    const userSectorMap = new Map<string, string[]>();
    for (const us of userSectors || []) {
      if (!userSectorMap.has(us.user_id)) {
        userSectorMap.set(us.user_id, []);
      }
      const sectorSlug = (us as any).sectors?.slug || 'general';
      userSectorMap.get(us.user_id)!.push(sectorSlug);
    }

    console.log(`Found ${userSectorMap.size} users with sector preferences`);

    // Step 3: Generate alerts for matching users
    let alertsGenerated = 0;
    let usersNotified = 0;
    let highPriorityAlerts = 0;

    for (const update of updates) {
      const matchedUsers = new Set<string>();

      for (const [userId, sectors] of userSectorMap.entries()) {
        const userFrameworks = sectors.map((s: string) => {
          if (s === 'fintech' || s === 'ecommerce') return ['NDPA', 'CBN-AML', 'SEC-CF'];
          if (s === 'healthtech') return ['NDPA', 'NITDA-DP'];
          return ['NDPA'];
        }).flat();

        const relevanceScore = calculateRelevance(update, sectors, userFrameworks);

        if (relevanceScore >= 0.3) {
          matchedUsers.add(userId);

          // Check for existing alert
          const { data: existingAlert } = await supabase
            .from('alerts')
            .select('id')
            .eq('user_id', userId)
            .eq('update_id', update.id)
            .maybeSingle();

          if (existingAlert) {
            console.log(`Alert already exists for user ${userId}`);
            continue;
          }

          const primarySector = sectors[0] || 'general';
          const summary = generateAlertSummary(update, primarySector);
          const actionRequired = requiresAction(update, relevanceScore);

          const { error: alertError } = await supabase
            .from('alerts')
            .insert({
              user_id: userId,
              update_id: update.id,
              title: update.title,
              summary: summary,
              relevance_score: Math.round(relevanceScore * 100) / 100,
              action_required: actionRequired,
              is_read: false,
              notification_type: 'in_app',
              created_at: new Date().toISOString(),
            });

          if (alertError) {
            console.error(`Failed to create alert for user ${userId}:`, alertError);
          } else {
            alertsGenerated++;
            if (actionRequired) highPriorityAlerts++;
          }
        }
      }

      // Mark update as processed
      await supabase
        .from('regulatory_updates')
        .update({
          processed: true,
          relevance_score: matchedUsers.size > 0 ? 0.7 : 0.3,
        })
        .eq('id', update.id);

      usersNotified += matchedUsers.size;
      console.log(`Update "${(update.title || '').substring(0, 50)}..." - ${matchedUsers.size} users notified`);
    }

    const processingTime = perf.end();

    const result = {
      success: true,
      updatesChecked: updates.length,
      alertsGenerated,
      usersNotified,
      processingTimeMs: Math.round(processingTime),
      details: {
        newUpdates: updates.length,
        matchedUsers: usersNotified,
        highPriorityAlerts,
      },
    };

    console.log(`Alert generation complete: ${alertsGenerated} alerts created`);

    return successResponse(result);

  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
    console.error('Alert generation error:', errorMessage);
    return errorResponse(errorMessage, 500);
  }
});