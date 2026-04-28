import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders } from "../shared/cors.ts";

// Free RSS parser
import { parseFeed } from "https://deno.land/x/rss@0.6.0/mod.ts";

// Free HTML parser
import { DOMParser } from "https://deno.land/x/deno_dom@v0.1.45/deno-dom-wasm.ts";

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

    // Fetch all active regulators
    const { data: regulators } = await supabase
      .from('regulators')
      .select('*')
      .eq('is_active', true);

    const updates = [];

    for (const regulator of regulators as RegulatorMonitor[]) {
      // Try RSS first (free and efficient)
      if (regulator.rss_feed_url) {
        const rssUpdates = await checkRSSFeed(regulator);
        updates.push(...rssUpdates);
      }
      
      // Fallback to HTML scraping
      if (regulator.website_url) {
        const htmlUpdates = await scrapeWebsite(regulator);
        updates.push(...htmlUpdates);
      }
    }

    // Store new updates
    for (const update of updates) {
      await storeUpdate(supabase, update);
    }

    return new Response(
      JSON.stringify({ success: true, updates_found: updates.length }),
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
    const xml = await response.text();
    const feed = await parseFeed(xml);
    
    return feed.entries.map((entry: any) => ({
      regulator_id: regulator.id,
      title: entry.title?.value || '',
      content: entry.description?.value || '',
      source_url: entry.links[0]?.href || '',
      published_at: entry.published || new Date().toISOString(),
      source_type: 'rss'
    }));
  } catch (error) {
    console.error(`RSS check failed for ${regulator.acronym}:`, error);
    return [];
  }
}

async function scrapeWebsite(regulator: RegulatorMonitor) {
  // Implementation depends on each regulator's website structure
  // We'll build specific scrapers for each
  
  const scrapers: Record<string, (url: string) => Promise<any[]>> = {
    'NDPC': scrapeNDPC,
    'CBN': scrapeCBN,
    'SEC': scrapeSEC,
    'NITDA': scrapeNITDA
  };
  
  const scraper = scrapers[regulator.acronym];
  if (scraper) {
    return await scraper(regulator.website_url);
  }
  
  return [];
}

// Example scraper for NDPC
async function scrapeNDPC(url: string) {
  try {
    const response = await fetch(url);
    const html = await response.text();
    const document = new DOMParser().parseFromString(html, 'text/html');
    
    const updates = [];
    const newsSection = document?.querySelector('.news-items, .press-releases');
    
    if (newsSection) {
      const items = newsSection.querySelectorAll('article, .item');
      for (const item of items) {
        const titleEl = item.querySelector('h2, h3, .title');
        const linkEl = item.querySelector('a');
        const dateEl = item.querySelector('.date, time');
        
        if (titleEl && linkEl) {
          updates.push({
            title: titleEl.textContent.trim(),
            source_url: new URL(linkEl.getAttribute('href') || '', url).href,
            published_at: dateEl?.textContent?.trim() || new Date().toISOString(),
            source_type: 'scraping'
          });
        }
      }
    }
    
    return updates;
  } catch (error) {
    console.error('NDPC scraping failed:', error);
    return [];
  }
}

// Stub for CBN scraper
async function scrapeCBN(url: string) {
  // Will implement based on CBN website structure
  return [];
}

// Stub for SEC scraper
async function scrapeSEC(url: string) {
  return [];
}

// Stub for NITDA scraper
async function scrapeNITDA(url: string) {
  return [];
}

async function storeUpdate(supabase: any, update: any) {
  // Check for duplicates using URL hash
  const { data: existing } = await supabase
    .from('regulatory_updates')
    .select('id')
    .eq('source_url', update.source_url)
    .single();

  if (!existing) {
    await supabase.from('regulatory_updates').insert(update);
  }
}