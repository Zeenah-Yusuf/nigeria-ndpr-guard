import { useState, useCallback } from 'react';
import type { SearchResult, Language } from '../types';
import { AZURE_FUNCTION_URL } from '../lib/constants';

export function useClauseSearch() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [error, setError] = useState<string | null>(null);

  const searchClauses = useCallback(async (query: string, language: Language) => {
    if (!query.trim() || query.trim().length < 2) {
      setResults([]);
      return [];
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${AZURE_FUNCTION_URL}/search`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: query.trim(), language }),
      });

      if (!response.ok) throw new Error(`Search failed: ${response.status}`);
      
      const data = await response.json();
      setResults(data.results || []);
      return data.results;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Search failed');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const clearResults = useCallback(() => setResults([]), []);

  return { searchClauses, loading, results, error, clearResults };
}