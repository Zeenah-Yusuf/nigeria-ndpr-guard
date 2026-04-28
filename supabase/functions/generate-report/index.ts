// supabase/functions/generate-report/index.ts
// Multi-framework compliance report generator
// Supports NDPA, CBN, SEC, NITDA frameworks
// Output formats: TXT, JSON, HTML, MD

import { serve } from "https://deno.land/std@0.192.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import {
  corsHeaders,
  handleCors,
  successResponse,
  errorResponse,
  parseJSONBody,
  validateRequiredFields,
  fileResponse,
  logRequest,
  logResponse,
  measurePerformance,
} from "../shared/cors.ts";
import { getChatCompletion, isOpenAIAvailable } from "../shared/openai-client.ts";
import { aiService } from "../shared/ai-service.ts";
import type {
  RiskScanResult,
  RiskScanAnswers,
  Language,
  ChecklistItem,
  FrameworkBreakdown,
} from "../shared/types.ts";

// ============================================
// TYPES
// ============================================

interface ReportRequest {
  result: RiskScanResult;
  answers: RiskScanAnswers;
  language?: Language;
  format?: 'txt' | 'json' | 'html' | 'md' | 'pdf';
  includeAISummary?: boolean;
  includeLegalDisclaimer?: boolean;
}

interface ReportData {
  executiveSummary: string;
  riskAssessment: {
    score: number;
    level: string;
    dcpmTier: string | null;
    frameworks: FrameworkBreakdown[];
  };
  recommendations: string[];
  triggeredSections: string[];
  answers: RiskScanAnswers;
  checklist: ChecklistItem[];
  resources: { name: string; url: string }[];
  metadata: {
    generatedAt: string;
    language: string;
    format: string;
    aiEnhanced: boolean;
  };
}

// ============================================
// HELPER FUNCTIONS
// ============================================

const LANGUAGE_NAMES: Record<Language, string> = {
  en: 'English',
  ha: 'Hausa',
  ig: 'Igbo',
  yo: 'Yorùbá',
};

const DCPM_LABELS: Record<string, string> = {
  'UHL': 'Ultra-High Level (UHL)',
  'EHL': 'Extra-High Level (EHL)',
  'OHL': 'Ordinary-High Level (OHL)',
};

const RISK_LEVEL_LABELS: Record<string, string> = {
  'Low': 'Low Risk 🟢',
  'Medium': 'Medium Risk 🟡',
  'High': 'High Risk 🟠',
  'Critical': 'Critical Risk 🔴',
};

const RISK_LEVEL_COLORS: Record<string, string> = {
  'Low': '#22c55e',
  'Medium': '#eab308',
  'High': '#f97316',
  'Critical': '#ef4444',
};

function getCurrentDate(): string {
  return new Date().toLocaleDateString('en-NG', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Africa/Lagos',
  });
}

function formatAnswersSummary(answers: RiskScanAnswers): string {
  const lines = [
    `1. Collects Personal Data: ${answers.collectsData ? '✅ Yes' : '❌ No'}`,
    `2. Processes Sensitive Data: ${answers.sensitiveData ? '⚠️ Yes' : '✅ No'}`,
    `3. Has Privacy Policy: ${answers.hasPrivacyPolicy ? '✅ Yes' : '❌ No'}`,
    `4. Cross-Border Data Transfer: ${answers.crossBorderTransfer ? '⚠️ Yes' : '✅ No'}`,
    `5. Has Consent Mechanism: ${answers.hasConsentMechanism ? '✅ Yes' : '❌ No'}`,
    `6. Targets Children (under 18): ${answers.targetsChildren ? '⚠️ Yes' : '✅ No'}`,
    `7. Third-Party Data Sharing: ${answers.thirdPartySharing ? '⚠️ Yes' : '✅ No'}`,
    `8. Has Breach Response Process: ${answers.hasBreachProcess ? '✅ Yes' : '❌ No'}`,
    `9. Registered with NDPC: ${answers.registeredWithNDPC ? '✅ Yes' : '❌ No'}`,
    `10. Uses AI/Profiling: ${answers.usesAI ? '⚠️ Yes' : '✅ No'}`,
  ];

  if (answers.sector) lines.push(`\nSector: ${answers.sector}`);
  if (answers.dataSubjectCount) lines.push(`Data Subjects: ${answers.dataSubjectCount.toLocaleString()}`);
  if (answers.processesFinancialData !== undefined) lines.push(`Processes Financial Data: ${answers.processesFinancialData ? '⚠️ Yes' : '✅ No'}`);
  if (answers.registeredWithCBN !== undefined) lines.push(`Registered with CBN: ${answers.registeredWithCBN ? '✅ Yes' : '❌ No'}`);
  if (answers.hasAMLPolicy !== undefined) lines.push(`Has AML Policy: ${answers.hasAMLPolicy ? '✅ Yes' : '❌ No'}`);

  return lines.join('\n');
}

function extractUniqueResources(checklist: ChecklistItem[]): { name: string; url: string }[] {
  const resourceMap = new Map<string, { name: string; url: string }>();
  
  for (const item of checklist) {
    for (const link of item.resourceLinks) {
      if (!resourceMap.has(link.url)) {
        resourceMap.set(link.url, { name: link.name, url: link.url });
      }
    }
  }
  
  return Array.from(resourceMap.values());
}

// ============================================
// AI-ENHANCED REPORT GENERATION
// ============================================

async function generateAISummary(
  result: RiskScanResult,
  answers: RiskScanAnswers,
  language: Language
): Promise<string> {
  if (!isOpenAIAvailable()) {
    return result.explanation || 'No AI summary available.';
  }

  const prompt = `Generate a professional 3-paragraph executive summary for a Nigerian regulatory compliance report.

Risk Score: ${result.risk_score}/100
Risk Level: ${result.risk_level}
Frameworks Assessed: ${result.triggered_frameworks?.join(', ') || 'NDPA'}
DCPMI Tier: ${result.dcpm_tier || 'Not classified'}

Key Findings:
${result.triggered_sections?.map(s => `- ${s}`).join('\n') || 'None'}

Business Context:
- Sector: ${answers.sector || 'Not specified'}
- Data Subjects: ${answers.dataSubjectCount || 'Unknown'}
${answers.collectsData ? '- Collects personal data' : ''}
${answers.sensitiveData ? '- Processes sensitive data' : ''}
${answers.crossBorderTransfer ? '- Cross-border transfers' : ''}

Format: Professional, clear, actionable. ${language !== 'en' ? `Also provide a version in ${LANGUAGE_NAMES[language]}.` : ''}`;

  try {
    const summary = await getChatCompletion(
      [{ role: 'user', content: prompt }],
      { temperature: 0.3, maxTokens: 500 }
    );
    return summary;
  } catch (error) {
    console.error('AI summary generation failed:', error);
    return result.explanation || 'Executive summary unavailable.';
  }
}

// ============================================
// REPORT FORMAT GENERATORS
// ============================================

function generateTXTReport(data: ReportData): string {
  const lines = [
    '='.repeat(80),
    '                    RegTrack Multi-Framework Compliance Report',
    '='.repeat(80),
    '',
    `Generated: ${data.metadata.generatedAt}`,
    `Language: ${LANGUAGE_NAMES[data.metadata.language as Language] || data.metadata.language}`,
    `AI-Enhanced: ${data.metadata.aiEnhanced ? 'Yes' : 'No'}`,
    '',
    '='.repeat(80),
    '                            EXECUTIVE SUMMARY',
    '='.repeat(80),
    '',
    data.executiveSummary,
    '',
    '='.repeat(80),
    '                          RISK ASSESSMENT',
    '='.repeat(80),
    '',
    `Overall Risk Score: ${data.riskAssessment.score}/100`,
    `Risk Level: ${data.riskAssessment.level}`,
    `DCPMI Classification: ${data.riskAssessment.dcpmTier || 'Not classified'}`,
    '',
  ];

  // Framework breakdown
  if (data.riskAssessment.frameworks && data.riskAssessment.frameworks.length > 0) {
    lines.push('Framework Breakdown:');
    lines.push('-'.repeat(40));
    for (const fw of data.riskAssessment.frameworks) {
      lines.push(`  ${fw.framework_name}: Score ${fw.risk_score}/100 (${fw.risk_level})`);
      lines.push(`    Applicable Clauses: ${fw.applicable_clauses}`);
      lines.push(`    Compliant: ${fw.compliant_clauses} | Non-Compliant: ${fw.non_compliant_clauses}`);
    }
    lines.push('');
  }

  // Recommendations
  if (data.recommendations && data.recommendations.length > 0) {
    lines.push('='.repeat(80));
    lines.push('                         TOP RECOMMENDATIONS');
    lines.push('='.repeat(80));
    lines.push('');
    data.recommendations.forEach((rec, i) => {
      lines.push(`${i + 1}. ${rec}`);
    });
    lines.push('');
  }

  // Triggered sections
  if (data.triggeredSections && data.triggeredSections.length > 0) {
    lines.push('='.repeat(80));
    lines.push('                      TRIGGERED REGULATORY SECTIONS');
    lines.push('='.repeat(80));
    lines.push('');
    data.triggeredSections.forEach(section => {
      lines.push(`  • ${section}`);
    });
    lines.push('');
  }

  // Answers summary
  lines.push('='.repeat(80));
  lines.push('                         ASSESSMENT RESPONSES');
  lines.push('='.repeat(80));
  lines.push('');
  lines.push(formatAnswersSummary(data.answers));
  lines.push('');

  // Compliance checklist
  if (data.checklist && data.checklist.length > 0) {
    lines.push('='.repeat(80));
    lines.push('                       COMPLIANCE CHECKLIST');
    lines.push('='.repeat(80));
    lines.push('');
    
    data.checklist.forEach((item, i) => {
      const priorityEmoji = {
        critical: '🔴',
        high: '🟠',
        medium: '🟡',
        low: '🟢',
      }[item.priority] || '⚪';
      
      lines.push(`${priorityEmoji} [${item.priority.toUpperCase()}] ${item.title}`);
      lines.push(`   Framework: ${item.frameworkName || 'NDPA'} | Section: ${item.sectionRef}`);
      lines.push(`   ${item.description}`);
      lines.push(`   Difficulty: ${item.difficulty} | Estimated Time: ${item.timeEstimate}`);
      if (item.resourceLinks.length > 0) {
        lines.push(`   Resources:`);
        item.resourceLinks.forEach(link => {
          lines.push(`     • ${link.name}: ${link.url}`);
        });
      }
      lines.push('');
    });
  }

  // Resources
  if (data.resources && data.resources.length > 0) {
    lines.push('='.repeat(80));
    lines.push('                          RESOURCES');
    lines.push('='.repeat(80));
    lines.push('');
    data.resources.forEach(resource => {
      lines.push(`  • ${resource.name}`);
      lines.push(`    ${resource.url}`);
    });
    lines.push('');
  }

  // Disclaimer
  lines.push('='.repeat(80));
  lines.push('                           DISCLAIMER');
  lines.push('='.repeat(80));
  lines.push('');
  lines.push('This report provides educational guidance only and does not constitute');
  lines.push('legal advice. The risk scores and recommendations are generated by AI');
  lines.push('based on Nigerian regulatory frameworks including:');
  lines.push('  • NDP Act 2023 (Nigeria Data Protection Act)');
  lines.push('  • CBN Regulations (AML/CFT, Consumer Protection, etc.)');
  lines.push('  • SEC Rules (Crowdfunding, Code of Conduct, etc.)');
  lines.push('  • NITDA Frameworks (Data Protection, Local Content)');
  lines.push('');
  lines.push('Always consult with qualified legal professionals for specific');
  lines.push('compliance matters relevant to your business.');
  lines.push('');
  lines.push('For official guidance:');
  lines.push('  • NDPC: https://ndpc.gov.ng');
  lines.push('  • CBN: https://www.cbn.gov.ng');
  lines.push('  • SEC: https://sec.gov.ng');
  lines.push('  • NITDA: https://nitda.gov.ng');
  lines.push('');
  lines.push('='.repeat(80));
  lines.push('RegTrack — Bridging Nigerian Innovation and Regulation');
  lines.push('Built for Naija 🇳🇬 | Nexus SafeSphere');
  lines.push('RegTech Hackathon — AI Skills Week Abuja 2026');
  lines.push('='.repeat(80));

  return lines.join('\n');
}

function generateHTMLReport(data: ReportData): string {
  const riskColor = RISK_LEVEL_COLORS[data.riskAssessment.level] || '#6b7280';
  
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>RegTrack Compliance Report</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #1a1a1a; max-width: 900px; margin: 0 auto; padding: 20px; }
    .header { text-align: center; padding: 40px 0; border-bottom: 3px solid #16a34a; margin-bottom: 30px; }
    .header h1 { color: #16a34a; font-size: 2em; margin-bottom: 10px; }
    .header .subtitle { color: #666; font-size: 1.1em; }
    .section { margin: 30px 0; padding: 20px; background: #f9fafb; border-radius: 8px; }
    .section h2 { color: #16a34a; margin-bottom: 15px; padding-bottom: 10px; border-bottom: 2px solid #e5e7eb; }
    .risk-score { font-size: 3em; font-weight: bold; color: ${riskColor}; text-align: center; padding: 20px; }
    .risk-label { font-size: 1.5em; text-align: center; color: ${riskColor}; margin-bottom: 10px; }
    .checklist-item { margin: 15px 0; padding: 15px; border-left: 4px solid #16a34a; background: white; border-radius: 4px; }
    .priority-critical { border-left-color: #ef4444; }
    .priority-high { border-left-color: #f97316; }
    .priority-medium { border-left-color: #eab308; }
    .priority-low { border-left-color: #22c55e; }
    .resources { display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 15px; }
    .resource-card { padding: 15px; background: white; border: 1px solid #e5e7eb; border-radius: 6px; }
    .footer { text-align: center; margin-top: 40px; padding: 20px; border-top: 1px solid #e5e7eb; color: #666; }
    .badge { display: inline-block; padding: 4px 8px; border-radius: 12px; font-size: 0.85em; font-weight: 600; }
    .badge-ndpa { background: #dbeafe; color: #1e40af; }
    .badge-cbn { background: #fef3c7; color: #92400e; }
    .badge-sec { background: #f3e8ff; color: #6b21a8; }
    .badge-nitda { background: #dcfce7; color: #166534; }
  </style>
</head>
<body>
  <div class="header">
    <h1>🇳🇬 RegTrack Compliance Report</h1>
    <div class="subtitle">
      Generated: ${data.metadata.generatedAt}<br>
      AI-Enhanced Analysis: ${data.metadata.aiEnhanced ? '✅ Yes' : '❌ No'}
    </div>
  </div>

  <div class="section">
    <h2>📊 Executive Summary</h2>
    <p>${data.executiveSummary.replace(/\n/g, '<br>')}</p>
  </div>

  <div class="section">
    <h2>🎯 Risk Assessment</h2>
    <div class="risk-score">${data.riskAssessment.score}/100</div>
    <div class="risk-label">${data.riskAssessment.level}</div>
    ${data.riskAssessment.dcpmTier ? `<p style="text-align:center">DCPMI Classification: <strong>${data.riskAssessment.dcpmTier}</strong></p>` : ''}
  </div>

  ${data.recommendations?.length ? `
  <div class="section">
    <h2>💡 Top Recommendations</h2>
    <ol>
      ${data.recommendations.map(rec => `<li>${rec}</li>`).join('')}
    </ol>
  </div>
  ` : ''}

  <div class="section">
    <h2>📋 Compliance Checklist</h2>
    ${data.checklist.map(item => `
      <div class="checklist-item priority-${item.priority}">
        <strong>${item.title}</strong>
        <span class="badge badge-${(item.frameworkName || 'ndpa').toLowerCase()}">${item.frameworkName || 'NDPA'}</span>
        <span class="badge">${item.priority.toUpperCase()}</span>
        <p>${item.description}</p>
        <small>⏱️ ${item.timeEstimate} | 📊 ${item.difficulty} Difficulty</small>
        ${item.resourceLinks?.length ? `
          <div style="margin-top:10px">
            <strong>Resources:</strong>
            <ul>
              ${item.resourceLinks.map(link => `<li><a href="${link.url}" target="_blank">${link.name}</a></li>`).join('')}
            </ul>
          </div>
        ` : ''}
      </div>
    `).join('')}
  </div>

  <div class="footer">
    <p><strong>RegTrack</strong> — Bridging Nigerian Innovation and Regulation</p>
    <p>Built for Naija 🇳🇬 | Nexus SafeSphere</p>
    <p style="font-size:0.85em; color:#999; margin-top:10px">
      Disclaimer: This report provides educational guidance only and does not constitute legal advice.
    </p>
  </div>
</body>
</html>`;
}

function generateMDReport(data: ReportData): string {
  const lines = [
    `# 🇳🇬 RegTrack Multi-Framework Compliance Report`,
    '',
    `**Generated:** ${data.metadata.generatedAt}`,
    `**Language:** ${LANGUAGE_NAMES[data.metadata.language as Language] || data.metadata.language}`,
    `**AI-Enhanced:** ${data.metadata.aiEnhanced ? '✅ Yes' : '❌ No'}`,
    '',
    '---',
    '',
    '## 📊 Executive Summary',
    '',
    data.executiveSummary,
    '',
    '---',
    '',
    '## 🎯 Risk Assessment',
    '',
    `| Metric | Value |`,
    `|--------|-------|`,
    `| **Risk Score** | ${data.riskAssessment.score}/100 |`,
    `| **Risk Level** | ${data.riskAssessment.level} |`,
    `| **DCPMI Classification** | ${data.riskAssessment.dcpmTier || 'Not classified'} |`,
    '',
  ];

  // Framework breakdown table
  if (data.riskAssessment.frameworks?.length) {
    lines.push('### Framework Breakdown');
    lines.push('');
    lines.push('| Framework | Score | Level | Clauses | Compliant | Non-Compliant |');
    lines.push('|-----------|-------|-------|---------|-----------|---------------|');
    data.riskAssessment.frameworks.forEach(fw => {
      lines.push(`| ${fw.framework_name} | ${fw.risk_score}/100 | ${fw.risk_level} | ${fw.applicable_clauses} | ${fw.compliant_clauses} | ${fw.non_compliant_clauses} |`);
    });
    lines.push('');
  }

  if (data.recommendations?.length) {
    lines.push('## 💡 Recommendations');
    lines.push('');
    data.recommendations.forEach((rec, i) => {
      lines.push(`${i + 1}. ${rec}`);
    });
    lines.push('');
  }

  if (data.checklist?.length) {
    lines.push('## 📋 Compliance Checklist');
    lines.push('');
    data.checklist.forEach(item => {
      const emoji = { critical: '🔴', high: '🟠', medium: '🟡', low: '🟢' }[item.priority] || '⚪';
      lines.push(`### ${emoji} ${item.title}`);
      lines.push(`- **Framework:** ${item.frameworkName || 'NDPA'}`);
      lines.push(`- **Section:** ${item.sectionRef}`);
      lines.push(`- **Priority:** ${item.priority.toUpperCase()}`);
      lines.push(`- **Difficulty:** ${item.difficulty}`);
      lines.push(`- **Time:** ${item.timeEstimate}`);
      lines.push(`- **Description:** ${item.description}`);
      if (item.resourceLinks?.length) {
        lines.push('- **Resources:**');
        item.resourceLinks.forEach(link => {
          lines.push(`  - [${link.name}](${link.url})`);
        });
      }
      lines.push('');
    });
  }

  lines.push('---');
  lines.push('');
  lines.push('## ⚠️ Disclaimer');
  lines.push('');
  lines.push('This report provides educational guidance only and does not constitute legal advice. Always consult with qualified legal professionals for specific compliance matters.');
  lines.push('');
  lines.push('**Official Resources:**');
  lines.push('- [NDPC](https://ndpc.gov.ng)');
  lines.push('- [CBN](https://www.cbn.gov.ng)');
  lines.push('- [SEC](https://sec.gov.ng)');
  lines.push('- [NITDA](https://nitda.gov.ng)');
  lines.push('');
  lines.push('---');
  lines.push('');
  lines.push('*RegTrack — Bridging Nigerian Innovation and Regulation*');
  lines.push('*Built for Naija 🇳🇬 | Nexus SafeSphere*');

  return lines.join('\n');
}

function generateJSONReport(data: ReportData): string {
  return JSON.stringify(data, null, 2);
}

// ============================================
// MAIN REPORT GENERATOR
// ============================================

serve(async (req: Request) => {
  // Handle CORS
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  // Performance tracking
  const perf = measurePerformance();
  perf.start();

  // Log request
  logRequest('generate-report', req);

  try {
    // Parse and validate request
    const body = await parseJSONBody(req);
    const validationError = validateRequiredFields(body, ['result', 'answers']);
    if (validationError) {
      logResponse('generate-report', 400, { error: validationError });
      return errorResponse(validationError, 400);
    }

    const {
      result,
      answers,
      language = 'en',
      format = 'txt',
      includeAISummary = true,
      includeLegalDisclaimer = true,
    } = body as ReportRequest;

    const generatedAt = getCurrentDate();

    // Generate AI-enhanced summary if requested and available
    let executiveSummary = result.explanation || '';
    let aiEnhanced = false;

    if (includeAISummary && isOpenAIAvailable()) {
      try {
        executiveSummary = await generateAISummary(result, answers, language);
        aiEnhanced = true;
      } catch (error) {
        console.error('AI summary failed, using default:', error);
        executiveSummary = result.explanation || 'Executive summary unavailable.';
      }
    }

    // Extract unique resources from checklist
    const resources = extractUniqueResources(result.compliance_checklist || []);

    // Build report data
    const reportData: ReportData = {
      executiveSummary,
      riskAssessment: {
        score: result.risk_score,
        level: RISK_LEVEL_LABELS[result.risk_level] || result.risk_level,
        dcpmTier: result.dcpm_tier ? DCPM_LABELS[result.dcpm_tier] : null,
        frameworks: result.framework_breakdown || [],
      },
      recommendations: result.top_recommendations || [result.recommendation],
      triggeredSections: result.triggered_sections || [],
      answers,
      checklist: result.compliance_checklist || [],
      resources,
      metadata: {
        generatedAt,
        language: LANGUAGE_NAMES[language] || language,
        format,
        aiEnhanced,
      },
    };

    // Generate report in requested format
    let reportContent: string;
    let contentType: string;
    let filename: string;
    const dateStr = new Date().toISOString().split('T')[0];

    switch (format) {
      case 'html':
        reportContent = generateHTMLReport(reportData);
        contentType = 'text/html';
        filename = `RegTrack_Report_${dateStr}.html`;
        break;
      case 'md':
        reportContent = generateMDReport(reportData);
        contentType = 'text/markdown';
        filename = `RegTrack_Report_${dateStr}.md`;
        break;
      case 'json':
        reportContent = generateJSONReport(reportData);
        contentType = 'application/json';
        filename = `RegTrack_Report_${dateStr}.json`;
        break;
      case 'txt':
      default:
        reportContent = generateTXTReport(reportData);
        contentType = 'text/plain';
        filename = `RegTrack_Report_${dateStr}.txt`;
        break;
    }

    const processingTime = perf.end();
    logResponse('generate-report', 200, {
      format,
      aiEnhanced,
      processingTime: `${processingTime.toFixed(0)}ms`,
    });

    // Return report with metadata
    return successResponse({
      report: reportContent,
      filename,
      contentType,
      format,
      metadata: {
        generatedAt,
        language: LANGUAGE_NAMES[language] || language,
        aiEnhanced,
        processingTimeMs: Math.round(processingTime),
      },
    });

  } catch (error) {
    console.error('Report generation error:', error);
    logResponse('generate-report', 500, { error: error.message });

    return errorResponse(
      error instanceof Error ? error.message : 'Failed to generate report',
      500
    );
  }
});