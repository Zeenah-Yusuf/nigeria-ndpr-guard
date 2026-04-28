// supabase/functions/scan/index.ts
// Multi-framework compliance scanner supporting NDPA, CBN, SEC, NITDA
// Uses AI-powered analysis with intelligent fallbacks

import { serve } from "https://deno.land/std@0.192.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import {
  corsHeaders,
  handleCors,
  successResponse,
  errorResponse,
  typedErrorResponse,
  ErrorType,
  parseJSONBody,
  validateRequiredFields,
  logRequest,
  logResponse,
  measurePerformance,
} from "../shared/cors.ts";
import { getChatCompletion, isOpenAIAvailable } from "../shared/openai-client.ts";
import { hfClient } from "../shared/huggingface-client.ts";
import { aiService } from "../shared/ai-service.ts";
import type {
  RiskScanAnswers,
  RiskScanResult,
  ChecklistItem,
  ResourceLink,
  FrameworkBreakdown,
  ComplianceScanRequest,
} from "../shared/types.ts";

// ============================================
// AI SYSTEM PROMPTS
// ============================================

const MULTI_FRAMEWORK_SYSTEM_PROMPT = `You are a Nigerian regulatory compliance expert covering NDP Act 2023, CBN regulations, SEC rules, and NITDA frameworks.

Analyze the startup's answers and provide:

1. **Risk Score** (0-100) based on compliance gaps across ALL applicable frameworks
2. **Risk Level**: "Low" (0-30), "Medium" (31-60), "High" (61-100), "Critical" (100+)
3. **Triggered Sections**: List specific regulatory sections triggered (include framework prefix)
   - NDPA: "Section 24", "Section 25", etc.
   - CBN: "CBN-AML 3.1", "CBN-CP 4.2", etc.
   - SEC: "SEC-CF Rule 4.2", "SEC-CC Section 5", etc.
   - NITDA: "NITDA-DP Art. 3.1", "NITDA-LC Guideline 2.3", etc.
4. **Framework Breakdown**: For each applicable framework, provide risk assessment
5. **Plain-English Explanation** (3-4 sentences covering ALL frameworks)
6. **Actionable Recommendations** (top 3 recommendations)
7. **DCPMI Tier** (for NDPA): "UHL", "EHL", "OHL", or null

## NDP Act 2023 Key Sections:
- Section 24: Principles of processing
- Section 25: Lawful basis for processing
- Section 26: Consent requirements
- Section 27: Transparency & privacy notices
- Section 30: Sensitive personal data
- Section 31: Children's data (under 18)
- Section 32: Data Protection Officer appointment
- Section 39: Security measures
- Section 40: Breach notification (72 hours)
- Section 41: Data Protection Impact Assessment
- Section 44: NDPC registration (DCPMI)

## CBN Key Regulations:
- CBN-AML/CFT: Anti-money laundering requirements
- CBN-CP: Consumer protection regulations
- CBN-MMO: Mobile money operator guidelines
- CBN-PSP: Payment service provider guidelines

## SEC Key Rules:
- SEC-CF: Crowdfunding rules
- SEC-CC: Code of conduct for capital market operators
- SEC-ISA: Investment and securities regulations

## NITDA Key Frameworks:
- NITDA-DP: Data protection implementation framework
- NITDA-LC: Local content development guidelines
- NITDA-Cloud: Cloud computing policy

## DCPMI Classification:
- UHL: Fintech, Insurance, Health, biometric data, or >10,000 data subjects
- EHL: 5,000-10,000 data subjects, sensitive data processing
- OHL: 2,000-5,000 data subjects

Respond ONLY with valid JSON:
{
  "risk_score": number,
  "risk_level": "Low" | "Medium" | "High" | "Critical",
  "triggered_sections": string[],
  "triggered_frameworks": string[],
  "framework_breakdown": [
    {
      "framework_name": string,
      "risk_score": number,
      "risk_level": string,
      "applicable_clauses": number,
      "compliant_clauses": number,
      "non_compliant_clauses": number
    }
  ],
  "explanation": string,
  "recommendation": string,
  "top_recommendations": string[],
  "dcpm_tier": "UHL" | "EHL" | "OHL" | null
}`;

// ============================================
// FALLBACK ANALYSIS (When AI is unavailable)
// ============================================

function performFallbackAnalysis(answers: RiskScanAnswers): RiskScanResult {
  let riskScore = 0;
  const triggeredSections: string[] = [];
  const triggeredFrameworks: string[] = ['NDPA']; // NDPA applies to all
  
  // NDPA Analysis
  if (!answers.hasPrivacyPolicy) {
    riskScore += 20;
    triggeredSections.push('Section 27');
  }
  if (!answers.hasConsentMechanism && answers.collectsData) {
    riskScore += 15;
    triggeredSections.push('Section 26');
  }
  if (answers.sensitiveData) {
    riskScore += 20;
    triggeredSections.push('Section 30');
  }
  if (answers.targetsChildren) {
    riskScore += 25;
    triggeredSections.push('Section 31');
  }
  if (answers.crossBorderTransfer) {
    riskScore += 15;
    triggeredSections.push('Section 41');
  }
  if (!answers.hasBreachProcess) {
    riskScore += 10;
    triggeredSections.push('Section 40');
  }
  if (!answers.registeredWithNDPC) {
    riskScore += 15;
    triggeredSections.push('Section 44');
  }
  if (answers.usesAI) {
    riskScore += 10;
    triggeredSections.push('Section 39');
  }
  if (answers.thirdPartySharing) {
    riskScore += 10;
    triggeredSections.push('Section 25');
  }

  // CBN Analysis (if financial sector)
  if (answers.sector === 'fintech' || answers.sector === 'ecommerce') {
    triggeredFrameworks.push('CBN-AML');
    if (answers.collectsData && !answers.hasConsentMechanism) {
      riskScore += 10;
      triggeredSections.push('CBN-AML 3.1');
    }
    if (!answers.hasPrivacyPolicy) {
      triggeredSections.push('CBN-CP 4.2');
      riskScore += 5;
    }
  }

  // SEC Analysis (if applicable)
  if (answers.sector === 'fintech' || answers.sector === 'enterprise') {
    triggeredFrameworks.push('SEC-CF');
    riskScore += 5;
    triggeredSections.push('SEC-CF Rule 4.2');
  }

  // NITDA Analysis
  triggeredFrameworks.push('NITDA-DP');
  if (!answers.hasPrivacyPolicy || !answers.hasConsentMechanism) {
    triggeredSections.push('NITDA-DP Art. 3.1');
    riskScore += 5;
  }

  // DCPMI Tier
  let dcpmTier: 'UHL' | 'EHL' | 'OHL' | null = null;
  if (
    answers.sector === 'fintech' || 
    answers.sector === 'healthtech' || 
    answers.sensitiveData ||
    (answers.dataSubjectCount && answers.dataSubjectCount > 10000)
  ) {
    dcpmTier = 'UHL';
  } else if (
    (answers.dataSubjectCount && answers.dataSubjectCount >= 5000) ||
    answers.sensitiveData
  ) {
    dcpmTier = 'EHL';
  } else if (answers.dataSubjectCount && answers.dataSubjectCount >= 2000) {
    dcpmTier = 'OHL';
  }

  // Determine risk level
  let riskLevel: 'Low' | 'Medium' | 'High' | 'Critical';
  if (riskScore >= 80) riskLevel = 'Critical';
  else if (riskScore >= 61) riskLevel = 'High';
  else if (riskScore >= 31) riskLevel = 'Medium';
  else riskLevel = 'Low';

  // Generate explanation
  const explanationParts: string[] = [];
  if (triggeredSections.some(s => s.includes('Section 27'))) {
    explanationParts.push('Missing privacy policy');
  }
  if (triggeredSections.some(s => s.includes('Section 26'))) {
    explanationParts.push('No consent mechanism');
  }
  if (triggeredSections.some(s => s.includes('Section 30'))) {
    explanationParts.push('Processing sensitive data without adequate safeguards');
  }
  if (triggeredSections.some(s => s.includes('Section 44'))) {
    explanationParts.push('Not registered with NDPC');
  }

  const explanation = explanationParts.length > 0
    ? `Your startup has compliance gaps: ${explanationParts.join(', ')}. `
    : 'Your startup appears to have basic compliance measures in place. ';

  return {
    risk_score: Math.min(riskScore, 100),
    risk_level: riskLevel,
    triggered_sections: triggeredSections,
    triggered_frameworks: triggeredFrameworks,
    framework_breakdown: [
      {
        framework_name: 'NDPA',
        risk_score: Math.min(riskScore, 100),
        risk_level: riskLevel,
        applicable_clauses: triggeredSections.filter(s => s.startsWith('Section')).length,
        compliant_clauses: 0,
        non_compliant_clauses: triggeredSections.filter(s => s.startsWith('Section')).length,
      },
    ],
    explanation: explanation,
    recommendation: 'Review all triggered regulatory sections and implement required compliance measures.',
    top_recommendations: [
      'Register with NDPC if required',
      'Implement privacy policy and consent mechanisms',
      'Appoint a Data Protection Officer if processing sensitive data',
    ],
    dcpm_tier: dcpmTier,
    compliance_checklist: [],
    generated_at: new Date().toISOString(),
  };
}

// ============================================
// CHECKLIST GENERATOR
// ============================================

async function generateChecklist(
  triggeredSections: string[],
  dcpmTier: string | null,
  triggeredFrameworks: string[]
): Promise<ChecklistItem[]> {
  const checklist: ChecklistItem[] = [];
  
  // Comprehensive checklist map for ALL frameworks
  const checklistMap: Record<string, Omit<ChecklistItem, 'completed' | 'frameworkName' | 'clauseType'>> = {
    // NDPA Sections
    'Section 24': {
      id: 'principle-compliance',
      title: 'Comply with Data Protection Principles',
      description: 'Ensure all data processing follows NDPA principles: lawfulness, fairness, transparency, purpose limitation, data minimization, accuracy, storage limitation, integrity, and confidentiality.',
      priority: 'critical',
      difficulty: 'Hard',
      timeEstimate: '2-4 weeks',
      resourceLinks: [
        { name: 'NDPA Principles Guide', url: 'https://ndpc.gov.ng/principles', type: 'guide', isFree: true },
      ],
      sectionRef: 'Section 24',
    },
    'Section 25': {
      id: 'lawful-basis',
      title: 'Establish Lawful Basis for Processing',
      description: 'Identify and document your lawful basis for processing personal data (consent, contract, legal obligation, vital interests, public interest, legitimate interests).',
      priority: 'critical',
      difficulty: 'Medium',
      timeEstimate: '1-2 weeks',
      resourceLinks: [
        { name: 'NDPA Lawful Basis Guide', url: 'https://ndpc.gov.ng/lawful-basis', type: 'guide', isFree: true },
      ],
      sectionRef: 'Section 25',
    },
    'Section 26': {
      id: 'consent-mechanism',
      title: 'Implement Explicit Consent Mechanism',
      description: 'Create a clear, specific, informed, and unambiguous consent process. Consent must be freely given and withdrawable. Implement age verification for children.',
      priority: 'critical',
      difficulty: 'Medium',
      timeEstimate: '1-2 weeks',
      resourceLinks: [
        { name: 'NDPC Consent Guidelines', url: 'https://ndpc.gov.ng/guidelines/consent', type: 'guide', isFree: true },
        { name: 'Consent Template', url: 'https://ndpc.gov.ng/templates/consent', type: 'template', isFree: true },
      ],
      sectionRef: 'Section 26',
    },
    'Section 27': {
      id: 'privacy-policy',
      title: 'Publish a Comprehensive Privacy Policy',
      description: 'Create and publish a clear privacy notice covering: identity of controller, purposes of processing, legal basis, recipients, retention period, data subject rights, right to complain, automated decision-making.',
      priority: 'critical',
      difficulty: 'Easy',
      timeEstimate: '1-2 days',
      resourceLinks: [
        { name: 'NDPC Privacy Policy Template', url: 'https://ndpc.gov.ng/resources/privacy-template', type: 'template', isFree: true },
        { name: 'Privacy Policy Generator', url: 'https://ndpc.gov.ng/tools/policy-generator', type: 'tool', isFree: true },
      ],
      sectionRef: 'Section 27',
    },
    'Section 30': {
      id: 'sensitive-data-safeguards',
      title: 'Implement Sensitive Data Safeguards',
      description: 'Implement additional safeguards for sensitive data: explicit consent, necessity, heightened security, impact assessment. Categories include: health, genetics, biometrics, race, ethnicity, political opinions, religious beliefs, trade union membership, sexual orientation.',
      priority: 'critical',
      difficulty: 'Hard',
      timeEstimate: '3-4 weeks',
      resourceLinks: [
        { name: 'Sensitive Data Guidelines', url: 'https://ndpc.gov.ng/sensitive-data', type: 'guide', isFree: true },
      ],
      sectionRef: 'Section 30',
    },
    'Section 31': {
      id: 'children-data-protection',
      title: 'Implement Children\'s Data Protection',
      description: 'Obtain parental/guardian consent for processing children\'s data (under 18). Implement age verification mechanisms. Conduct child-specific impact assessments.',
      priority: 'critical',
      difficulty: 'Hard',
      timeEstimate: '2-4 weeks',
      resourceLinks: [
        { name: 'Children\'s Data Protection Code', url: 'https://ndpc.gov.ng/children-code', type: 'guide', isFree: true },
      ],
      sectionRef: 'Section 31',
    },
    'Section 32': {
      id: 'appoint-dpo',
      title: 'Appoint a Data Protection Officer',
      description: 'Appoint a qualified DPO responsible for: advising on compliance, monitoring adherence to NDPA, cooperating with NDPC, acting as contact point for data subjects.',
      priority: 'high',
      difficulty: 'Medium',
      timeEstimate: '1-2 weeks',
      resourceLinks: [
        { name: 'DPO Requirements', url: 'https://ndpc.gov.ng/dpo-requirements', type: 'guide', isFree: true },
        { name: 'DPO Certification Programs', url: 'https://ndpc.gov.ng/dpo-certification', type: 'guide', isFree: true },
      ],
      sectionRef: 'Section 32',
    },
    'Section 39': {
      id: 'security-measures',
      title: 'Implement Security Measures',
      description: 'Implement appropriate technical and organizational measures: encryption, access controls, regular testing, incident response, business continuity.',
      priority: 'high',
      difficulty: 'Hard',
      timeEstimate: '4-8 weeks',
      resourceLinks: [
        { name: 'Security Guidelines', url: 'https://ndpc.gov.ng/security-guidelines', type: 'guide', isFree: true },
        { name: 'NIST Cybersecurity Framework', url: 'https://www.nist.gov/cyberframework', type: 'guide', isFree: true },
      ],
      sectionRef: 'Section 39',
    },
    'Section 40': {
      id: 'breach-notification',
      title: 'Establish Breach Notification Process',
      description: 'Create a process to: detect breaches, notify NDPC within 72 hours, notify affected data subjects without undue delay, document all breaches.',
      priority: 'high',
      difficulty: 'Medium',
      timeEstimate: '2-4 weeks',
      resourceLinks: [
        { name: 'Breach Notification Template', url: 'https://ndpc.gov.ng/breach-template', type: 'template', isFree: true },
        { name: 'Incident Response Guide', url: 'https://ndpc.gov.ng/incident-response', type: 'guide', isFree: true },
      ],
      sectionRef: 'Section 40',
    },
    'Section 44': {
      id: 'register-ndpc',
      title: 'Register with NDPC as DCPMI',
      description: 'Complete NDPC registration as a Data Controller/Processor of Major Importance. Submit required documentation: privacy policy, DPO details, processing activities, security measures.',
      priority: 'high',
      difficulty: 'Easy',
      timeEstimate: '1-3 days',
      resourceLinks: [
        { name: 'NDPC Registration Portal', url: 'https://ndpc.gov.ng/registration', type: 'official', isFree: true },
        { name: 'Registration Checklist', url: 'https://ndpc.gov.ng/registration-checklist', type: 'guide', isFree: true },
      ],
      sectionRef: 'Section 44',
    },
    'Section 41': {
      id: 'dpia',
      title: 'Conduct Data Protection Impact Assessment',
      description: 'Perform DPIA for high-risk processing: systematic profiling, large-scale sensitive data, systematic monitoring, new technologies.',
      priority: 'high',
      difficulty: 'Medium',
      timeEstimate: '1-2 weeks',
      resourceLinks: [
        { name: 'DPIA Template', url: 'https://ndpc.gov.ng/dpia-template', type: 'template', isFree: true },
        { name: 'DPIA Guidance', url: 'https://ndpc.gov.ng/dpia-guidance', type: 'guide', isFree: true },
      ],
      sectionRef: 'Section 41',
    },
    
    // CBN Sections
    'CBN-AML 3.1': {
      id: 'customer-due-diligence',
      title: 'Implement Customer Due Diligence (CDD)',
      description: 'Establish CDD measures: verify customer identity, identify beneficial owners, understand business purpose, ongoing monitoring, enhanced due diligence for high-risk.',
      priority: 'critical',
      difficulty: 'Hard',
      timeEstimate: '4-8 weeks',
      resourceLinks: [
        { name: 'CBN AML/CFT Guidelines', url: 'https://www.cbn.gov.ng/aml-cft', type: 'official', isFree: true },
      ],
      sectionRef: 'CBN-AML 3.1',
    },
    'CBN-CP 4.2': {
      id: 'consumer-protection',
      title: 'Implement Consumer Protection Measures',
      description: 'Ensure transparent disclosure, fair treatment, complaint handling, data privacy, transaction security, and consumer education.',
      priority: 'high',
      difficulty: 'Medium',
      timeEstimate: '3-6 weeks',
      resourceLinks: [
        { name: 'CBN Consumer Protection', url: 'https://www.cbn.gov.ng/consumer-protection', type: 'official', isFree: true },
      ],
      sectionRef: 'CBN-CP 4.2',
    },
    
    // SEC Sections
    'SEC-CF Rule 4.2': {
      id: 'crowdfunding-compliance',
      title: 'Register Crowdfunding Portal',
      description: 'Register with SEC, maintain minimum capital (N100M), implement investor protection, conduct issuer due diligence, provide risk disclosures.',
      priority: 'high',
      difficulty: 'Hard',
      timeEstimate: '8-12 weeks',
      resourceLinks: [
        { name: 'SEC Crowdfunding Rules', url: 'https://sec.gov.ng/crowdfunding', type: 'official', isFree: true },
      ],
      sectionRef: 'SEC-CF Rule 4.2',
    },
    
    // NITDA Sections
    'NITDA-DP Art. 3.1': {
      id: 'nitda-dp-compliance',
      title: 'Implement NITDA Data Protection Framework',
      description: 'Appoint DPO, conduct annual DPIAs, publish privacy policy, maintain data inventory, implement breach notification, register with NITDA if processing >1000 data subjects.',
      priority: 'high',
      difficulty: 'Medium',
      timeEstimate: '4-8 weeks',
      resourceLinks: [
        { name: 'NITDA DP Framework', url: 'https://nitda.gov.ng/dp-framework', type: 'official', isFree: true },
      ],
      sectionRef: 'NITDA-DP Art. 3.1',
    },
  };

  // Add triggered sections to checklist
  for (const section of triggeredSections) {
    if (checklistMap[section]) {
      checklist.push({
        ...checklistMap[section],
        completed: false,
        frameworkName: section.includes('CBN') ? 'CBN' : 
                      section.includes('SEC') ? 'SEC' : 
                      section.includes('NITDA') ? 'NITDA' : 'NDPA',
        clauseType: 'obligation',
      });
    }
  }
  
  // Ensure NDPC registration is included if DCPMI tier exists
  if (dcpmTier && !checklist.some(item => item.id === 'register-ndpc')) {
    checklist.push({
      ...checklistMap['Section 44'],
      completed: false,
      frameworkName: 'NDPA',
      clauseType: 'obligation',
    });
  }

  // Add framework-specific default items
  for (const framework of triggeredFrameworks) {
    if (framework === 'CBN-AML' && !checklist.some(i => i.id === 'customer-due-diligence')) {
      checklist.push({
        ...checklistMap['CBN-AML 3.1'],
        completed: false,
        frameworkName: 'CBN',
        clauseType: 'obligation',
      });
    }
    if (framework === 'NITDA-DP' && !checklist.some(i => i.id === 'nitda-dp-compliance')) {
      checklist.push({
        ...checklistMap['NITDA-DP Art. 3.1'],
        completed: false,
        frameworkName: 'NITDA',
        clauseType: 'obligation',
      });
    }
  }
  
  return checklist;
}

// ============================================
// MAIN SCAN FUNCTION
// ============================================

serve(async (req: Request) => {
  // Handle CORS
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  // Performance tracking
  const perf = measurePerformance();
  perf.start();

  // Log request
  logRequest('scan', req);

  try {
    // Parse and validate request
    const body = await parseJSONBody(req);
    const validationError = validateRequiredFields(body, ['answers']);
    if (validationError) {
      logResponse('scan', 400, { error: validationError });
      return errorResponse(validationError, 400);
    }

    const { answers } = body as { answers: RiskScanAnswers };
    
    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    // ============================================
    // ATTEMPT AI-POWERED ANALYSIS
    // ============================================
    
    let analysis: RiskScanResult;
    let usedAI = false;

    if (isOpenAIAvailable()) {
      try {
        // Build comprehensive context for AI
        const userContext = `
STARTUP COMPLIANCE ASSESSMENT:

DATA PROCESSING PROFILE:
- Collects Personal Data: ${answers.collectsData ? 'YES ⚠️' : 'No'}
- Processes Sensitive Data: ${answers.sensitiveData ? 'YES ⚠️' : 'No'}
- Has Privacy Policy: ${answers.hasPrivacyPolicy ? 'Yes ✅' : 'NO ⚠️'}
- Cross-Border Data Transfer: ${answers.crossBorderTransfer ? 'YES ⚠️' : 'No'}
- Has Consent Mechanism: ${answers.hasConsentMechanism ? 'Yes ✅' : 'NO ⚠️'}
- Targets Children (under 18): ${answers.targetsChildren ? 'YES ⚠️' : 'No'}
- Third-Party Data Sharing: ${answers.thirdPartySharing ? 'YES ⚠️' : 'No'}
- Has Breach Response Process: ${answers.hasBreachProcess ? 'Yes ✅' : 'NO ⚠️'}
- Registered with NDPC: ${answers.registeredWithNDPC ? 'Yes ✅' : 'NO ⚠️'}
- Uses AI/Automated Profiling: ${answers.usesAI ? 'YES ⚠️' : 'No'}

BUSINESS PROFILE:
- Sector: ${answers.sector || 'Not specified'}
- Data Subjects: ${answers.dataSubjectCount || 'Unknown'}
- Processes Financial Data: ${answers.processesFinancialData ? 'Yes ⚠️' : 'Not specified'}
- Has AML Policy: ${answers.hasAMLPolicy ? 'Yes ✅' : 'Not specified'}
- Registered with CBN: ${answers.registeredWithCBN ? 'Yes ✅' : 'Not specified'}
- Uses Crowdfunding: ${answers.usesCrowdfunding ? 'Yes ⚠️' : 'Not specified'}
- Has IT Security Policy: ${answers.hasITSecurityPolicy ? 'Yes ✅' : 'Not specified'}
- Annual Revenue: ${answers.annualRevenue || 'Unknown'}
- Employee Count: ${answers.employeeCount || 'Unknown'}

Analyze compliance gaps across NDPA, CBN, SEC, and NITDA frameworks.`;

        const completion = await getChatCompletion(
          [
            { role: 'system', content: MULTI_FRAMEWORK_SYSTEM_PROMPT },
            { role: 'user', content: userContext },
          ],
          { jsonResponse: true, temperature: 0.3, maxTokens: 1500 }
        );

        const aiAnalysis = JSON.parse(completion);
        usedAI = true;

        // Generate checklist based on AI findings
        const checklist = await generateChecklist(
          aiAnalysis.triggered_sections || [],
          aiAnalysis.dcpm_tier || null,
          aiAnalysis.triggered_frameworks || ['NDPA']
        );

        analysis = {
          ...aiAnalysis,
          compliance_checklist: checklist,
          generated_at: new Date().toISOString(),
        };

        console.log('✅ AI analysis completed successfully');
      } catch (aiError) {
        console.error('AI analysis failed, using fallback:', aiError);
        usedAI = false;
        analysis = performFallbackAnalysis(answers);
        analysis.compliance_checklist = await generateChecklist(
          analysis.triggered_sections,
          analysis.dcpm_tier,
          analysis.triggered_frameworks
        );
      }
    } else {
      // No AI available, use fallback
      console.log('ℹ️  OpenAI not available, using rule-based analysis');
      analysis = performFallbackAnalysis(answers);
      analysis.compliance_checklist = await generateChecklist(
        analysis.triggered_sections,
        analysis.dcpm_tier,
        analysis.triggered_frameworks
      );
    }

    // ============================================
    // STORE SCAN RESULTS
    // ============================================
    
    try {
      await supabase.from('scan_logs').insert({
        answers,
        risk_score: analysis.risk_score,
        risk_level: analysis.risk_level,
        dcpm_tier: analysis.dcpm_tier,
        triggered_sections: analysis.triggered_sections,
        triggered_frameworks: analysis.triggered_frameworks,
        used_ai: usedAI,
        created_at: new Date().toISOString(),
      });
    } catch (dbError) {
      console.error('Failed to store scan log:', dbError);
      // Continue even if logging fails
    }

    // ============================================
    // RETURN RESULTS
    // ============================================
    
    const processingTime = perf.end();
    logResponse('scan', 200, { 
      riskScore: analysis.risk_score, 
      usedAI, 
      processingTime: `${processingTime.toFixed(0)}ms` 
    });

    return successResponse({
      ...analysis,
      meta: {
        analysis_method: usedAI ? 'ai_powered' : 'rule_based',
        processing_time_ms: Math.round(processingTime),
        timestamp: new Date().toISOString(),
      },
    });

  } catch (error) {
    console.error('Scan error:', error);
    logResponse('scan', 500, { error: error.message });

    // Always return a useful fallback
    const fallback: RiskScanResult = {
      risk_score: 50,
      risk_level: 'Medium',
      triggered_sections: ['Section 24', 'Section 27'],
      triggered_frameworks: ['NDPA'],
      framework_breakdown: [],
      explanation: 'Unable to complete full analysis. Basic compliance review recommended.',
      recommendation: 'Review the NDP Act at ndpc.gov.ng and consult a compliance professional.',
      top_recommendations: [
        'Review privacy policy requirements',
        'Implement data protection measures',
        'Consult compliance professional',
      ],
      dcpm_tier: null,
      compliance_checklist: [],
      generated_at: new Date().toISOString(),
    };
    
    return successResponse(fallback); // Return 200 with fallback instead of error
  }
});