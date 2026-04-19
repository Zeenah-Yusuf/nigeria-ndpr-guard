import { serve } from "https://deno.land/std@0.192.0/http/server.ts";
import { corsHeaders, handleCors } from "../shared/cors.ts";
import type { RiskScanResult, RiskScanAnswers, Language } from "../shared/types.ts";

interface ReportRequest {
  result: RiskScanResult;
  answers: RiskScanAnswers;
  language?: Language;
}

serve(async (req: Request) => {
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  try {
    const { result, answers, language = 'en' } = await req.json() as ReportRequest;

    const date = new Date().toLocaleDateString('en-NG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    const languageNames: Record<Language, string> = {
      en: 'English',
      ha: 'Hausa',
      ig: 'Igbo',
      yo: 'Yorùbá',
    };

    const dcpmLabels: Record<string, string> = {
      'UHL': 'Ultra-High Level',
      'EHL': 'Extra-High Level',
      'OHL': 'Ordinary-High Level',
    };

    const riskLevelLabels: Record<string, string> = {
      'Low': 'Low Risk',
      'Medium': 'Medium Risk',
      'High': 'High Risk',
    };

    // Build the answers summary
    const answersSummary = `
1. Collects personal data: ${answers.collectsData ? 'Yes' : 'No'}
2. Processes sensitive data: ${answers.sensitiveData ? 'Yes' : 'No'}
3. Has privacy policy: ${answers.hasPrivacyPolicy ? 'Yes' : 'No'}
4. Cross-border transfer: ${answers.crossBorderTransfer ? 'Yes' : 'No'}
5. Has consent mechanism: ${answers.hasConsentMechanism ? 'Yes' : 'No'}
6. Targets children (under 18): ${answers.targetsChildren ? 'Yes' : 'No'}
7. Third-party sharing: ${answers.thirdPartySharing ? 'Yes' : 'No'}
8. Has breach process: ${answers.hasBreachProcess ? 'Yes' : 'No'}
9. Registered with NDPC: ${answers.registeredWithNDPC ? 'Yes' : 'No'}
10. Uses AI/profiling: ${answers.usesAI ? 'Yes' : 'No'}
${answers.sector ? `Sector: ${answers.sector}` : ''}
${answers.dataSubjectCount ? `Data subjects: ${answers.dataSubjectCount}` : ''}`;

    // Build the triggered sections list
    const sectionsList = result.triggered_sections?.length 
      ? result.triggered_sections.map(s => `• ${s}`).join('\n')
      : '• None';

    // Build the checklist
    const checklistItems = result.compliance_checklist?.length
      ? result.compliance_checklist.map(item => 
          `[${item.priority.toUpperCase()}] ${item.title}\n   ${item.description}\n   Difficulty: ${item.difficulty} | Time: ${item.timeEstimate}`
        ).join('\n\n')
      : 'No action items needed.';

    // Build resources section
    const resources = result.compliance_checklist
      ?.flatMap(item => item.resourceLinks)
      .filter((link, index, self) => 
        index === self.findIndex(l => l.url === link.url)
      )
      .map(link => `• ${link.name}: ${link.url}`)
      .join('\n') || '• NDPC Official Website: https://ndpc.gov.ng';

    const pdfContent = `================================================================================
                    RegTrack NDP Act Compliance Assessment Report
================================================================================

Generated: ${date}
Language: ${languageNames[language] || language.toUpperCase()}

================================================================================
                               EXECUTIVE SUMMARY
================================================================================

Risk Score: ${result.risk_score}/100
Risk Level: ${riskLevelLabels[result.risk_level] || result.risk_level}
DCPMI Classification: ${result.dcpm_tier ? dcpmLabels[result.dcpm_tier] : 'Not classified as DCPMI'}

${result.explanation}

================================================================================
                               RECOMMENDATION
================================================================================

${result.recommendation}

================================================================================
                         TRIGGERED NDP ACT SECTIONS
================================================================================

${sectionsList}

================================================================================
                            YOUR RESPONSES
================================================================================
${answersSummary}

================================================================================
                           COMPLIANCE CHECKLIST
================================================================================

${checklistItems}

================================================================================
                               RESOURCES
================================================================================

${resources}

================================================================================
                                 DISCLAIMER
================================================================================

This report provides educational guidance only and does not constitute legal 
advice. The risk scores and recommendations are generated by AI based on the 
NDP Act 2023 and GAID 2025 framework. Always consult with a qualified legal 
professional for specific compliance matters.

For official guidance, visit: https://ndpc.gov.ng

================================================================================
RegTrack — Bridging Nigerian innovation and regulation
Built for Naija 🇳🇬 | Nexus SafeSphere
RegTech Hackathon — AI Skills Week Abuja 2026
================================================================================`;

    return new Response(JSON.stringify({ 
      pdfContent,
      filename: `RegTrack_Report_${date.replace(/\s/g, '_')}.txt`,
      language: languageNames[language],
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Report generation error:', error);
    
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Failed to generate report' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});