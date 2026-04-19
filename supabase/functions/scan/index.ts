import { serve } from "https://deno.land/std@0.192.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders, handleCors } from "../shared/cors.ts";
import { getChatCompletion } from "../shared/openai-client.ts";
import type { RiskScanAnswers, RiskScanResult, ChecklistItem } from "../shared/types.ts";

const SYSTEM_PROMPT = `You are an NDP Act 2023 and GAID 2025 compliance expert for Nigeria.

Analyze the startup's answers and provide:
1. Risk Score (0-100) based on NDP Act/GAID compliance gaps
2. Risk Level: "Low" (0-30), "Medium" (31-60), or "High" (61-100)
3. List of specific NDP Act Sections triggered (e.g., "Section 24", "Section 30")
4. Plain-English explanation (2-3 sentences)
5. One actionable recommendation
6. DCPMI tier: "UHL", "EHL", "OHL", or null

Key NDP Act 2023 Sections:
- Section 24: Principles of processing
- Section 25: Lawful basis
- Section 26: Consent
- Section 27: Transparency
- Section 30: Sensitive data
- Section 31: Children (under 18)
- Section 32: DPO appointment
- Section 39: Security measures
- Section 40: Breach notification (72 hours)
- Section 44: NDPC registration

DCPMI Classification:
- UHL: Fintech, Insurance, Healthtech, biometric data, or >10,000 data subjects
- EHL: 5,000-10,000 data subjects or sensitive data processing
- OHL: 2,000-5,000 data subjects

Respond ONLY with valid JSON:
{
  "risk_score": number,
  "risk_level": "Low" | "Medium" | "High",
  "triggered_sections": string[],
  "explanation": string,
  "recommendation": string,
  "dcpm_tier": "UHL" | "EHL" | "OHL" | null
}`;

serve(async (req: Request) => {
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  try {
    const { answers } = await req.json() as { answers: RiskScanAnswers };
    
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    const userContext = `
      COLLECTS PERSONAL DATA: ${answers.collectsData ? 'Yes' : 'No'}
      PROCESSES SENSITIVE DATA: ${answers.sensitiveData ? 'Yes' : 'No'}
      HAS PRIVACY POLICY: ${answers.hasPrivacyPolicy ? 'Yes' : 'No'}
      CROSS-BORDER TRANSFER: ${answers.crossBorderTransfer ? 'Yes' : 'No'}
      HAS CONSENT MECHANISM: ${answers.hasConsentMechanism ? 'Yes' : 'No'}
      TARGETS CHILDREN (under 18): ${answers.targetsChildren ? 'Yes' : 'No'}
      THIRD-PARTY SHARING: ${answers.thirdPartySharing ? 'Yes' : 'No'}
      HAS BREACH PROCESS: ${answers.hasBreachProcess ? 'Yes' : 'No'}
      REGISTERED WITH NDPC: ${answers.registeredWithNDPC ? 'Yes' : 'No'}
      USES AI/PROFILING: ${answers.usesAI ? 'Yes' : 'No'}
      SECTOR: ${answers.sector || 'Not specified'}
    `;

    const completion = await getChatCompletion(
      [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: userContext },
      ],
      { jsonResponse: true }
    );

    const analysis = JSON.parse(completion);
    const checklist = await generateChecklist(analysis.triggered_sections, analysis.dcpm_tier);

    await supabase.from('scan_logs').insert({
      answers,
      risk_score: analysis.risk_score,
      risk_level: analysis.risk_level,
      dcpm_tier: analysis.dcpm_tier,
      created_at: new Date().toISOString(),
    });

    const result: RiskScanResult = { ...analysis, compliance_checklist: checklist };

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Scan error:', error);
    
    const fallback: RiskScanResult = {
      risk_score: 50,
      risk_level: 'Medium',
      triggered_sections: [],
      explanation: 'Unable to complete analysis. Please try again.',
      recommendation: 'Review the NDP Act at ndpc.gov.ng',
      dcpm_tier: null,
      compliance_checklist: [],
    };
    
    return new Response(JSON.stringify(fallback), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function generateChecklist(triggeredSections: string[], dcpmTier: string | null): Promise<ChecklistItem[]> {
  const checklist: ChecklistItem[] = [];
  
  const checklistMap: Record<string, Omit<ChecklistItem, 'completed'>> = {
    'Section 27': {
      id: 'privacy-policy',
      title: 'Publish a Privacy Policy',
      description: 'Your app collects personal data but lacks a privacy policy.',
      priority: 'critical',
      difficulty: 'Easy',
      timeEstimate: '30 minutes',
      resourceLinks: [{ name: 'NDPC Template', url: 'https://ndpc.gov.ng/resources/privacy-template' }],
      sectionRef: 'Section 27',
    },
    'Section 26': {
      id: 'consent-mechanism',
      title: 'Implement Explicit Consent',
      description: 'You need a clear process to obtain user consent.',
      priority: 'critical',
      difficulty: 'Medium',
      timeEstimate: '2 hours',
      resourceLinks: [{ name: 'NDPC Consent Guidelines', url: 'https://ndpc.gov.ng/guidelines/consent' }],
      sectionRef: 'Section 26',
    },
    'Section 32': {
      id: 'appoint-dpo',
      title: 'Appoint a Data Protection Officer',
      description: 'Your processing requires a DPO under Section 32.',
      priority: 'high',
      difficulty: 'Medium',
      timeEstimate: '1 week',
      resourceLinks: [{ name: 'NDPC DPO Requirements', url: 'https://ndpc.gov.ng/dpo-requirements' }],
      sectionRef: 'Section 32',
    },
    'Section 44': {
      id: 'register-ndpc',
      title: 'Register with NDPC',
      description: 'You must register as a data controller/processor of major importance.',
      priority: 'high',
      difficulty: 'Easy',
      timeEstimate: '1 hour',
      resourceLinks: [{ name: 'NDPC Registration Portal', url: 'https://ndpc.gov.ng/registration' }],
      sectionRef: 'Section 44',
    },
  };
  
  for (const section of triggeredSections) {
    if (checklistMap[section]) {
      checklist.push({ ...checklistMap[section], completed: false });
    }
  }
  
  if (dcpmTier && !checklist.some(item => item.id === 'register-ndpc')) {
    checklist.push({ ...checklistMap['Section 44'], completed: false });
  }
  
  return checklist;
}