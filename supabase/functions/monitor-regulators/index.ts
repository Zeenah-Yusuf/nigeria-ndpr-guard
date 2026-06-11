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
        JSON.stringify({ success: true, updates_found: 0, message: 'No active regulators found' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    let totalInserted = 0;

    for (const regulator of regulators as RegulatorMonitor[]) {
      let updates: any[] = [];

      if (regulator.rss_feed_url) {
        const rssUpdates = await checkRSSFeed(regulator);
        updates.push(...rssUpdates);
      }

      if (updates.length === 0 && regulator.website_url) {
        const scrapedUpdates = await scrapeRegulatorSite(regulator);
        updates.push(...scrapedUpdates);
      }

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

async function checkRSSFeed(regulator: RegulatorMonitor) {
  try {
    const response = await fetch(regulator.rss_feed_url!);
    if (!response.ok) return [];
    
    const xml = await response.text();
    const feed = await parseFeed(xml);
    
    return feed.entries.map((entry: any) => ({
      regulator_id: regulator.id,
      title: entry.title?.value || entry.title || '',
      summary: entry.description?.value || entry.content?.value || '',
      source_url: entry.links?.[0]?.href || '',
      published_at: entry.published || new Date().toISOString(),
      source_type: 'rss',
      affected_sectors: [] as string[],
      relevance_score: 0.5,
    }));
  } catch {
    return [];
  }
}

async function scrapeRegulatorSite(regulator: RegulatorMonitor) {
  try {
    const response = await fetch(regulator.website_url);
    if (!response.ok) return [];
    
    const html = await response.text();
    const updates: any[] = [];
    
    // Generic scraping: find all links that look like news/press releases
    const linkRegex = /<a[^>]*href="([^"]*)"[^>]*>([^<]*(?:press|release|news|guideline|circular|notice|regulation|statement|advisory)[^<]*)<\/a>/gi;
    let match;
    
    while ((match = linkRegex.exec(html)) !== null) {
      const href = match[1];
      const title = match[2].replace(/<[^>]*>/g, '').trim();
      
      if (title && href && title.length > 20 && title.length < 300) {
        const fullUrl = href.startsWith('http') ? href : new URL(href, regulator.website_url).href;
        
        updates.push({
          regulator_id: regulator.id,
          title: title,
          summary: title,
          source_url: fullUrl,
          published_at: new Date().toISOString(),
          source_type: 'scraping',
          affected_sectors: [] as string[],
          relevance_score: 0.5,
        });
      }
    }
    
    return updates.slice(0, 10);
  } catch {
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

// Import for RSS parsing
import { parseFeed } from "https://deno.land/x/rss@0.6.0/mod.ts";