// src/hooks/UseRiskScanner.ts
// Multi-framework risk scanner hook
// Uses Supabase Edge Functions instead of Azure

import { useState, useCallback } from 'react';
import { supabase } from '@/lib/SupabaseClient';
import type { RiskScanAnswers, RiskScanResult } from '@/types';

interface ScanOptions {
  answers: RiskScanAnswers;
  framework?: string;
  sector?: string;
}

export function useRiskScanner() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<RiskScanResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [scanMeta, setScanMeta] = useState<any>(null);

  const scanAnswers = useCallback(async (options: ScanOptions) => {
    const { answers, framework = 'NDPA', sector } = options;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      // Try Supabase Edge Function first
      const { data, error: fnError } = await supabase.functions.invoke('scan', {
        body: {
          answers,
          userId: 'anonymous',
          sectorId: sector || answers.sector || 'general',
          scanType: 'quick',
          companyInfo: {
            name: 'Startup',
            size: 'small',
            description: sector || 'general',
          },
        },
      });

      if (!fnError && data?.results) {
        const scanResult: RiskScanResult = {
          risk_score: data.results.riskScore || 50,
          risk_level: data.results.riskLevel || 'Medium',
          triggered_sections: data.results.triggeredSections || [],
          triggered_frameworks: data.results.triggeredFrameworks || [framework],
          explanation: data.results.explanation || 'Analysis completed.',
          recommendation: data.results.recommendation || 'Review applicable regulations.',
          compliance_checklist: data.results.compliance_checklist || [],
          generated_at: new Date().toISOString(),
        };
        setResult(scanResult);
        setScanMeta(data.meta || null);
        return scanResult;
      }

      // Fallback: Local risk calculation
      console.log('Edge function unavailable, using local calculation...');
      let score = 35;
      const triggeredSections: string[] = [];

      if (answers.collectsData) { score += 20; triggeredSections.push('Section 24'); }
      if (answers.sensitiveData) { score += 20; triggeredSections.push('Section 30'); }
      if (!answers.hasPrivacyPolicy) { score += 20; triggeredSections.push('Section 27'); }
      if (answers.crossBorderTransfer) { score += 15; triggeredSections.push('Section 41'); }
      if (!answers.hasConsentMechanism) { score += 15; triggeredSections.push('Section 26'); }
      if (answers.targetsChildren) { score += 25; triggeredSections.push('Section 31'); }
      if (answers.thirdPartySharing) { score += 10; triggeredSections.push('Section 25'); }
      if (!answers.hasBreachProcess) { score += 10; triggeredSections.push('Section 40'); }
      if (!answers.registeredWithNDPC) { score += 15; triggeredSections.push('Section 44'); }
      if (answers.usesAI) { score += 10; triggeredSections.push('Section 37'); }

      const normalizedScore = Math.max(0, Math.min(100, Math.round(score)));
      const riskLevel = normalizedScore <= 30 ? 'Low' : normalizedScore <= 60 ? 'Medium' : normalizedScore <= 80 ? 'High' : 'Critical';

      const fallbackResult: RiskScanResult = {
        risk_score: normalizedScore,
        risk_level: riskLevel,
        triggered_sections: triggeredSections,
        triggered_frameworks: [framework],
        explanation: `Based on your responses, your compliance risk score is ${normalizedScore}/100 under ${framework}.`,
        recommendation: 'Review the triggered regulatory sections and implement required measures.',
        compliance_checklist: [],
        generated_at: new Date().toISOString(),
      };

      setResult(fallbackResult);
      return fallbackResult;
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
    setScanMeta(null);
  }, []);

  return { scanAnswers, loading, result, error, scanMeta, reset };
}