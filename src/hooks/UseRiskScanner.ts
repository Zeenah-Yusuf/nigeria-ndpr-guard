import { useState, useCallback } from 'react';
import type { RiskScanAnswers, RiskScanResult } from '../types';
import { AZURE_FUNCTION_URL } from '../lib/constants';

export function useRiskScanner() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<RiskScanResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const scanAnswers = useCallback(async (answers: RiskScanAnswers) => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch(`${AZURE_FUNCTION_URL}/scan`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers }),
      });

      if (!response.ok) throw new Error(`Scan failed: ${response.status}`);
      
      const data = await response.json();
      setResult(data);
      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to analyze compliance risk';
      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setResult(null);
    setError(null);
  }, []);

  return { scanAnswers, loading, result, error, reset };
}