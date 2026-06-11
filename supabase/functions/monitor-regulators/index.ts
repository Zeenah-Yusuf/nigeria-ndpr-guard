import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders } from "../shared/cors.ts";

interface RegulatorMonitor {
  id: string;
  name: string;
  acronym: string;
  website_url: string;
  rss_feed_url?: string;
}

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { data: regulators } = await supabase
      .from('regulators')
      .select('*')
      .eq('is_active', true);

    if (!regulators || regulators.length === 0) {
      return new Response(
        JSON.stringify({ success: true, updates_found: 0 }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    let totalInserted = 0;

    for (const regulator of regulators as RegulatorMonitor[]) {
      const updates = await scrapeRegulatorSite(regulator);

      for (const update of updates) {
        const inserted = await storeUpdate(supabase, update);
        if (inserted) totalInserted++;
      }
    }

    return new Response(
      JSON.stringify({ success: true, updates_found: totalInserted }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

async function scrapeRegulatorSite(regulator: RegulatorMonitor) {
  try {
    const response = await fetch(regulator.website_url, {
      headers: { 'User-Agent': 'RegTrack-Monitor/1.0' }
    });
    
    if (!response.ok) {
      console.error(`Failed to fetch ${regulator.acronym}: ${response.status}`);
      return [];
    }
    
    const html = await response.text();
    const updates: any[] = [];
    const seenUrls = new Set<string>();
    
    // Find all links
    const linkRegex = /<a[^>]*href="([^"]*)"[^>]*>([^<]+)<\/a>/gi;
    let match;
    
    while ((match = linkRegex.exec(html)) !== null) {
      const href = match[1].trim();
      const text = match[2].replace(/<[^>]*>/g, '').trim();
      
      // Skip empty, javascript, anchors
      if (!href || href.startsWith('#') || href.startsWith('javascript:')) continue;
      if (!text || text.length < 10 || text.length > 500) continue;
      
      // Resolve full URL
      let fullUrl: string;
      try {
        fullUrl = href.startsWith('http') ? href : new URL(href, regulator.website_url).href;
      } catch {
        continue;
      }
      
      // Skip duplicates
      if (seenUrls.has(fullUrl)) continue;
      seenUrls.add(fullUrl);
      
      // Skip non-relevant pages
      const lowerUrl = fullUrl.toLowerCase();
      if (lowerUrl.includes('/wp-content/') || 
          lowerUrl.includes('/wp-admin/') ||
          lowerUrl.includes('.png') ||
          lowerUrl.includes('.jpg') ||
          lowerUrl.includes('.pdf') ||
          lowerUrl.includes('.css') ||
          lowerUrl.includes('.js')) continue;
      
      updates.push({
        regulator_id: regulator.id,
        title: text,
        summary: text,
        source_url: fullUrl,
        published_at: new Date().toISOString(),
        source_type: 'scraping',
        affected_sectors: [] as string[],
        relevance_score: 0.5,
      });
    }
    
    // Limit to 50 per regulator per run
    return updates.slice(0, 50);
  } catch (error) {
    console.error(`Scraping failed for ${regulator.acronym}:`, error);
    return [];
  }
}

async function storeUpdate(supabase: any, update: any) {
  try {
    const { data: existing } = await supabase
      .from('regulatory_updates')
      .select('id')
      .eq('source_url', update.source_url)
      .maybeSingle();

    if (!existing) {
      const { error } = await supabase.from('regulatory_updates').insert(update);
      if (error) {
        console.error('Insert error:', error.message);
        return false;
      }
      return true;
    }
    return false;
  } catch {
    return false;
  }
}