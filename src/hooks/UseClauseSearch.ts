// src/hooks/UseClauseSearch.ts
// Multi-framework clause search hook
// Uses Supabase Edge Functions instead of Azure

import { useState, useCallback } from 'react';
import { supabase } from '@/lib/SupabaseClient';
import { EDGE_FUNCTIONS } from '@/lib/constants';
import type { SearchResult, Language } from '@/types';

interface SearchOptions {
  query: string;
  language?: Language;
  frameworks?: string[];
  sectors?: string[];
  clauseTypes?: string[];
  limit?: number;
  threshold?: number;
}

export function useClauseSearch() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [searchMeta, setSearchMeta] = useState<any>(null);

  const searchClauses = useCallback(async (options: SearchOptions) => {
    const { query, language = 'en', frameworks, sectors, clauseTypes, limit = 10, threshold = 0.6 } = options;

    if (!query || query.trim().length < 2) {
      setResults([]);
      return [];
    }

    setLoading(true);
    setError(null);

    try {
      // Try Supabase Edge Function first
      const { data, error: fnError } = await supabase.functions.invoke('search', {
        body: {
          query: query.trim(),
          language,
          frameworks,
          sectors,
          clauseTypes,
          limit,
          threshold,
        },
      });

      if (!fnError && data?.results) {
        setResults(data.results);
        setSearchMeta(data.meta || null);
        return data.results;
      }

      // Fallback: Local search via Supabase query
      console.log('Edge function unavailable, using local search...');
      const { data: localResults, error: localError } = await supabase
        .from('regulatory_clauses')
        .select('id, title, content, framework_name, clause_type')
        .eq('is_current', true)
        .or(`title.ilike.%${query.trim()}%,content.ilike.%${query.trim()}%`)
        .limit(limit);

      if (localError) throw new Error(localError.message);

      const mapped: SearchResult[] = (localResults || []).map(row => ({
        section_id: row.id,
        title: row.title || 'Untitled',
        content: row.content || '',
        relevance: 70,
        language,
        framework_name: row.framework_name,
        clause_type: row.clause_type,
      }));

      setResults(mapped);
      return mapped;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Search failed';
      setError(message);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const clearResults = useCallback(() => {
    setResults([]);
    setError(null);
    setSearchMeta(null);
  }, []);

  return { searchClauses, loading, results, error, searchMeta, clearResults };
}