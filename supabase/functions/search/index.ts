import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders, handleCors } from "../shared/cors.ts";
import { getEmbedding } from "../shared/openai-client.ts";
import type { SearchResult, Language } from "../shared/types.ts";

interface SearchRequest {
  query: string;
  language?: Language;
}

serve(async (req: Request) => {
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  try {
    const { query, language = 'en' } = await req.json() as SearchRequest;

    if (!query || query.trim().length < 2) {
      return new Response(JSON.stringify({ results: [] }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    // Generate embedding for the search query
    const queryEmbedding = await getEmbedding(query.trim());

    // Search using pgvector similarity
    const { data, error } = await supabase.rpc('match_ndpa_sections', {
      query_embedding: queryEmbedding,
      match_threshold: 0.6,
      match_count: 10,
      language_filter: language,
    });

    if (error) {
      console.error('Supabase RPC error:', error);
      throw error;
    }

    const results: SearchResult[] = (data || []).map((row: any) => ({
      section_id: row.section_id,
      title: row.title,
      content: row.content,
      relevance: Math.round(row.similarity * 100),
      language: language,
    }));

    return new Response(JSON.stringify({ results }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Search error:', error);
    
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Search failed',
      results: [] 
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});