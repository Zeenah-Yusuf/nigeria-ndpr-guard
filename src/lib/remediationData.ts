// src/lib/remediationData.ts
// Multi-framework remediation checklist
// Supports: NDPA, CBN-AML, CBN-CP, SEC-CF, NITDA-DP

export interface RemediationItem {
  id: string;
  clauseId: string;
  title: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  timeEstimate: string;
  resources: { label: string; url: string }[];
  framework: string;
  requiresEvidence?: boolean;
  evidenceRequired?: string;
}

// ============================================
// NDPA REMEDIATION ITEMS
// ============================================
const ndpaRemediationMap: Record<string, RemediationItem[]> = {
  'ndpa-001': [
    {
      id: 'rem-ndpa-awareness',
      clauseId: 'ndpa-001',
      title: 'Understand NDP Act Compliance Obligations',
      priority: 'high',
      description: 'Familiarize yourself with the NDP Act 2023 framework. All data controllers and processors in Nigeria must comply with this primary data protection law.',
      difficulty: 'Easy',
      timeEstimate: '1-2 hours',
      resources: [
        { label: 'NDP Act Full Text', url: 'https://ndpc.gov.ng/ndpa-2023' },
        { label: 'NDPC Official Website', url: 'https://ndpc.gov.ng' },
      ],
      framework: 'NDPA',
      requiresEvidence: false,
    },
  ],
  'ndpa-002': [
    {
      id: 'rem-privacy-policy',
      clauseId: 'ndpa-002',
      title: 'Publish a Privacy Policy',
      priority: 'critical',
      description: 'Your business collects personal data but has no privacy policy. Under NDP Act s.24, you must publish a compliant privacy policy on all platforms where data processing occurs.',
      difficulty: 'Easy',
      timeEstimate: '30 minutes',
      resources: [
        { label: 'NDPC Privacy Template', url: 'https://ndpc.gov.ng/resources/privacy-template' },
      ],
      framework: 'NDPA',
      requiresEvidence: false,
    },
    {
      id: 'rem-appoint-dpo',
      clauseId: 'ndpa-002',
      title: 'Appoint a Data Protection Officer',
      priority: 'high',
      description: 'Under NDP Act s.32, data controllers/processors of major importance must designate a certified DPO.',
      difficulty: 'Medium',
      timeEstimate: '1-2 weeks',
      resources: [
        { label: 'DPCO Directory', url: 'https://ndpc.gov.ng/dpco-directory' },
      ],
      framework: 'NDPA',
      requiresEvidence: true,
      evidenceRequired: 'Upload DPO appointment letter and certification',
    },
  ],
  'ndpa-003': [
    {
      id: 'rem-consent-mechanism',
      clauseId: 'ndpa-003',
      title: 'Implement Explicit Consent Mechanism',
      priority: 'critical',
      description: 'Per NDP Act s.25-26, consent must be freely given, specific, informed and unambiguous. No pre-ticked boxes or implied consent.',
      difficulty: 'Medium',
      timeEstimate: '2-3 hours',
      resources: [
        { label: 'NDPC Consent Guidelines', url: 'https://ndpc.gov.ng/guidelines/consent' },
      ],
      framework: 'NDPA',
      requiresEvidence: false,
    },
  ],
  'ndpa-004': [
    {
      id: 'rem-dpia',
      clauseId: 'ndpa-004',
      title: 'Conduct Data Protection Impact Assessment',
      priority: 'high',
      description: 'DPIA is mandatory for high-risk processing activities under NDP Act s.28. Must be filed with NDPC.',
      difficulty: 'Medium',
      timeEstimate: '1-2 weeks',
      resources: [
        { label: 'DPIA Template', url: 'https://ndpc.gov.ng/dpia-template' },
      ],
      framework: 'NDPA',
      requiresEvidence: true,
      evidenceRequired: 'Upload completed DPIA report',
    },
  ],
  'ndpa-005': [
    {
      id: 'rem-sensitive-data',
      clauseId: 'ndpa-005',
      title: 'Implement Sensitive Data Safeguards',
      priority: 'critical',
      description: 'Processing sensitive personal data (health, biometric, religious, political) requires explicit consent and enhanced security measures under NDP Act s.30.',
      difficulty: 'Hard',
      timeEstimate: '2-4 weeks',
      resources: [
        { label: 'Sensitive Data Guidelines', url: 'https://ndpc.gov.ng/sensitive-data' },
      ],
      framework: 'NDPA',
      requiresEvidence: true,
      evidenceRequired: 'Upload sensitive data processing policy',
    },
  ],
  'ndpa-006': [
    {
      id: 'rem-children-data',
      clauseId: 'ndpa-006',
      title: 'Implement Children Data Protection',
      priority: 'critical',
      description: 'If targeting users under 18, obtain verifiable parental/guardian consent and implement age verification per NDP Act s.31.',
      difficulty: 'Hard',
      timeEstimate: '1-2 weeks',
      resources: [
        { label: 'NDPC Children Data Guide', url: 'https://ndpc.gov.ng/children-code' },
      ],
      framework: 'NDPA',
      requiresEvidence: true,
      evidenceRequired: 'Upload parental consent mechanism documentation',
    },
  ],
  'ndpa-007': [
    {
      id: 'rem-dpo-certification',
      clauseId: 'ndpa-007',
      title: 'Ensure DPO Certification and Training',
      priority: 'high',
      description: 'DPOs must undergo Annual Credential Assessment (ACA) and maintain certification per NDP Act s.32 and GAID Art. 14.',
      difficulty: 'Medium',
      timeEstimate: '1-2 weeks',
      resources: [
        { label: 'DPO Certification', url: 'https://ndpc.gov.ng/dpo-certification' },
      ],
      framework: 'NDPA',
      requiresEvidence: true,
      evidenceRequired: 'Upload DPO certification and training records',
    },
  ],
  'ndpa-008': [
    {
      id: 'rem-security-measures',
      clauseId: 'ndpa-008',
      title: 'Implement Technical Security Measures',
      priority: 'high',
      description: 'Implement encryption, access controls, MEM schedules, and regular security testing per NDP Act s.39.',
      difficulty: 'Hard',
      timeEstimate: '4-8 weeks',
      resources: [
        { label: 'Security Standards', url: 'https://ndpc.gov.ng/security-guidelines' },
      ],
      framework: 'NDPA',
      requiresEvidence: true,
      evidenceRequired: 'Upload security policy and encryption documentation',
    },
  ],
  'ndpa-009': [
    {
      id: 'rem-breach-plan',
      clauseId: 'ndpa-009',
      title: 'Create Breach Notification Process',
      priority: 'critical',
      description: 'Per NDP Act s.40, notify NDPC within 72 hours of becoming aware of a breach. Notify affected data subjects if high risk.',
      difficulty: 'Medium',
      timeEstimate: '3-4 hours',
      resources: [
        { label: 'Breach Notification Template', url: 'https://ndpc.gov.ng/breach-template' },
      ],
      framework: 'NDPA',
      requiresEvidence: true,
      evidenceRequired: 'Upload breach response policy document',
    },
  ],
  'ndpa-010': [
    {
      id: 'rem-register-ndpc',
      clauseId: 'ndpa-010',
      title: 'Register with NDPC as DCPMI',
      priority: 'high',
      description: 'Data controllers/processors of major importance must register with NDPC. Registration fees: UHL (N250,000), EHL (N100,000), OHL (N10,000). File annual CAR by March 31st.',
      difficulty: 'Medium',
      timeEstimate: '1-2 weeks',
      resources: [
        { label: 'NDPC Registration Portal', url: 'https://ndpc.gov.ng/registration' },
      ],
      framework: 'NDPA',
      requiresEvidence: true,
      evidenceRequired: 'Upload NDPC registration certificate',
    },
  ],
};

// ============================================
// CBN-AML REMEDIATION ITEMS
// ============================================
const cbnAmlRemediationMap: Record<string, RemediationItem[]> = {
  'cbn-aml-001': [
    {
      id: 'cbn-kyc-implementation',
      clauseId: 'cbn-aml-001',
      title: 'Implement KYC Verification System',
      priority: 'critical',
      description: 'CBN AML regulations require customer identification and verification using BVN, NIN, or international passport before establishing business relationship.',
      difficulty: 'Medium',
      timeEstimate: '1-2 weeks',
      resources: [
        { label: 'CBN KYC Guidelines', url: 'https://www.cbn.gov.ng/kyc-guidelines' },
        { label: 'BVN Integration Guide', url: 'https://nibss-plc.com.ng/bvn' },
      ],
      framework: 'CBN-AML',
      requiresEvidence: true,
      evidenceRequired: 'Upload KYC policy and BVN integration proof',
    },
    {
      id: 'cbn-cdd-process',
      clauseId: 'cbn-aml-001',
      title: 'Establish Customer Due Diligence Process',
      priority: 'critical',
      description: 'Implement risk-based CDD including customer identification, beneficial owner verification, and ongoing monitoring.',
      difficulty: 'Medium',
      timeEstimate: '2-3 weeks',
      resources: [
        { label: 'CDD Guidelines', url: 'https://www.cbn.gov.ng/cdd-guidelines' },
      ],
      framework: 'CBN-AML',
      requiresEvidence: true,
      evidenceRequired: 'Upload CDD policy documentation',
    },
  ],
  'cbn-aml-002': [
    {
      id: 'cbn-transaction-monitoring',
      clauseId: 'cbn-aml-002',
      title: 'Implement Transaction Monitoring System',
      priority: 'critical',
      description: 'Deploy real-time transaction monitoring to detect suspicious activities including unusual patterns and large cash transactions.',
      difficulty: 'Hard',
      timeEstimate: '2-4 weeks',
      resources: [
        { label: 'Transaction Monitoring Guide', url: 'https://www.cbn.gov.ng/tms-guidelines' },
      ],
      framework: 'CBN-AML',
      requiresEvidence: true,
      evidenceRequired: 'Upload transaction monitoring system documentation',
    },
    {
      id: 'cbn-pep-screening',
      clauseId: 'cbn-aml-002',
      title: 'Implement PEP Screening',
      priority: 'high',
      description: 'Screen customers against Politically Exposed Persons lists. Enhanced due diligence required for high-risk customers.',
      difficulty: 'Medium',
      timeEstimate: '1-2 weeks',
      resources: [
        { label: 'PEP Screening Guide', url: 'https://www.cbn.gov.ng/pep-screening' },
      ],
      framework: 'CBN-AML',
      requiresEvidence: true,
      evidenceRequired: 'Upload PEP screening policy',
    },
  ],
  'cbn-aml-003': [
    {
      id: 'cbn-str-filing',
      clauseId: 'cbn-aml-003',
      title: 'Establish STR Filing Process',
      priority: 'critical',
      description: 'Report suspicious transactions to NFIU within 24 hours. Create process for filing Suspicious Transaction Reports.',
      difficulty: 'Medium',
      timeEstimate: '1-2 weeks',
      resources: [
        { label: 'STR Filing Portal', url: 'https://nfiu.gov.ng/str-filing' },
      ],
      framework: 'CBN-AML',
      requiresEvidence: true,
      evidenceRequired: 'Upload STR filing procedure documentation',
    },
  ],
  'cbn-aml-004': [
    {
      id: 'cbn-risk-assessment',
      clauseId: 'cbn-aml-004',
      title: 'Conduct Enterprise-wide AML Risk Assessment',
      priority: 'high',
      description: 'Perform annual AML risk assessment covering products, services, customers, and geographic locations.',
      difficulty: 'Medium',
      timeEstimate: '2-3 weeks',
      resources: [
        { label: 'Risk Assessment Template', url: 'https://www.cbn.gov.ng/risk-assessment' },
      ],
      framework: 'CBN-AML',
      requiresEvidence: true,
      evidenceRequired: 'Upload AML risk assessment report',
    },
  ],
  'cbn-aml-005': [
    {
      id: 'cbn-aml-training',
      clauseId: 'cbn-aml-005',
      title: 'Conduct Annual AML/CFT Training',
      priority: 'medium',
      description: 'Provide annual AML/CFT training to all relevant employees including board members and management.',
      difficulty: 'Easy',
      timeEstimate: '1 week',
      resources: [
        { label: 'AML Training Modules', url: 'https://www.cbn.gov.ng/aml-training' },
      ],
      framework: 'CBN-AML',
      requiresEvidence: true,
      evidenceRequired: 'Upload training attendance records',
    },
  ],
  'cbn-aml-006': [
    {
      id: 'cbn-record-keeping',
      clauseId: 'cbn-aml-006',
      title: 'Implement Record Keeping System',
      priority: 'medium',
      description: 'Retain transaction records, customer identification documents, and account files for at least 5 years.',
      difficulty: 'Easy',
      timeEstimate: '3-5 days',
      resources: [
        { label: 'Record Retention Guidelines', url: 'https://www.cbn.gov.ng/record-keeping' },
      ],
      framework: 'CBN-AML',
      requiresEvidence: true,
      evidenceRequired: 'Upload record retention policy',
    },
  ],
  'cbn-aml-007': [
    {
      id: 'cbn-independent-audit',
      clauseId: 'cbn-aml-007',
      title: 'Schedule Independent AML Audit',
      priority: 'medium',
      description: 'Conduct independent AML compliance audit annually by internal audit or external qualified party.',
      difficulty: 'Hard',
      timeEstimate: '3-4 weeks',
      resources: [
        { label: 'Audit Requirements', url: 'https://www.cbn.gov.ng/audit-guidelines' },
      ],
      framework: 'CBN-AML',
      requiresEvidence: true,
      evidenceRequired: 'Upload audit report and management response',
    },
  ],
  'cbn-aml-008': [
    {
      id: 'cbn-compliance-officer',
      clauseId: 'cbn-aml-008',
      title: 'Designate AML/CFT Compliance Officer',
      priority: 'high',
      description: 'Appoint a designated AML/CFT Compliance Officer at senior management level responsible for overseeing all compliance matters.',
      difficulty: 'Easy',
      timeEstimate: '3-5 days',
      resources: [
        { label: 'Compliance Officer Requirements', url: 'https://www.cbn.gov.ng/compliance-officer' },
      ],
      framework: 'CBN-AML',
      requiresEvidence: true,
      evidenceRequired: 'Upload Compliance Officer appointment letter',
    },
  ],
};

// ============================================
// CBN-CP REMEDIATION ITEMS
// ============================================
const cbnCpRemediationMap: Record<string, RemediationItem[]> = {
  'cbn-cp-001': [
    {
      id: 'cbn-consumer-privacy',
      clauseId: 'cbn-cp-001',
      title: 'Implement Consumer Data Privacy Protection',
      priority: 'high',
      description: 'Financial service providers must protect consumer privacy, not disclose information without consent, and comply with data protection laws.',
      difficulty: 'Medium',
      timeEstimate: '2-3 weeks',
      resources: [
        { label: 'CBN Consumer Protection', url: 'https://www.cbn.gov.ng/consumer-protection' },
      ],
      framework: 'CBN-CP',
      requiresEvidence: true,
      evidenceRequired: 'Upload consumer data privacy policy',
    },
  ],
};

// ============================================
// SEC-CF REMEDIATION ITEMS
// ============================================
const secCfRemediationMap: Record<string, RemediationItem[]> = {
  'sec-cf-001': [
    {
      id: 'sec-portal-registration',
      clauseId: 'sec-cf-001',
      title: 'Register Crowdfunding Portal with SEC',
      priority: 'critical',
      description: 'Crowdfunding portals must register with SEC and maintain minimum N100 million paid-up capital.',
      difficulty: 'Hard',
      timeEstimate: '8-12 weeks',
      resources: [
        { label: 'SEC Crowdfunding Rules', url: 'https://sec.gov.ng/crowdfunding' },
      ],
      framework: 'SEC-CF',
      requiresEvidence: true,
      evidenceRequired: 'Upload SEC registration certificate',
    },
    {
      id: 'sec-due-diligence',
      clauseId: 'sec-cf-001',
      title: 'Implement Issuer Due Diligence Process',
      priority: 'high',
      description: 'Conduct thorough background checks and verification of business information for all issuers on your platform.',
      difficulty: 'Medium',
      timeEstimate: '2-3 weeks',
      resources: [
        { label: 'SEC Due Diligence Guide', url: 'https://sec.gov.ng/due-diligence' },
      ],
      framework: 'SEC-CF',
      requiresEvidence: true,
      evidenceRequired: 'Upload due diligence procedure documentation',
    },
  ],
  'sec-cf-002': [
    {
      id: 'sec-investor-protection',
      clauseId: 'sec-cf-002',
      title: 'Implement Investor Protection Measures',
      priority: 'high',
      description: 'Implement risk disclosure, investment limits (10% of annual income), 48-hour cooling-off period, and escrow arrangements.',
      difficulty: 'Medium',
      timeEstimate: '2-4 weeks',
      resources: [
        { label: 'SEC Investor Protection', url: 'https://sec.gov.ng/investor-education' },
      ],
      framework: 'SEC-CF',
      requiresEvidence: true,
      evidenceRequired: 'Upload investor protection policy',
    },
  ],
  'sec-cc-001': [
    {
      id: 'sec-code-conduct',
      clauseId: 'sec-cc-001',
      title: 'Implement Code of Conduct Compliance',
      priority: 'medium',
      description: 'Ensure all capital market operations adhere to SEC Code of Conduct covering transparency, fair dealing, and conflict of interest management.',
      difficulty: 'Medium',
      timeEstimate: '2-3 weeks',
      resources: [
        { label: 'SEC Code of Conduct', url: 'https://sec.gov.ng/code-of-conduct' },
      ],
      framework: 'SEC-CF',
      requiresEvidence: true,
      evidenceRequired: 'Upload code of conduct compliance policy',
    },
  ],
};

// ============================================
// NITDA-DP REMEDIATION ITEMS
// ============================================
const nitdaDpRemediationMap: Record<string, RemediationItem[]> = {
  'nitda-dp-001': [
    {
      id: 'nitda-dp-compliance',
      clauseId: 'nitda-dp-001',
      title: 'Implement NITDA Data Protection Framework',
      priority: 'high',
      description: 'Organizations processing 1000+ data subjects must: appoint DPO, conduct annual DPIAs, publish privacy policy, maintain data inventory.',
      difficulty: 'Medium',
      timeEstimate: '4-8 weeks',
      resources: [
        { label: 'NITDA DP Framework', url: 'https://nitda.gov.ng/dp-framework' },
      ],
      framework: 'NITDA-DP',
      requiresEvidence: true,
      evidenceRequired: 'Upload DPO appointment and DPIA documentation',
    },
  ],
  'nitda-dp-002': [
    {
      id: 'nitda-breach-notification',
      clauseId: 'nitda-dp-002',
      title: 'Implement NITDA Breach Notification',
      priority: 'high',
      description: 'Report data breaches to NITDA within 72 hours. Notify affected data subjects if high risk to rights and freedoms.',
      difficulty: 'Medium',
      timeEstimate: '1-2 weeks',
      resources: [
        { label: 'NITDA Incident Response', url: 'https://nitda.gov.ng/incident-response' },
      ],
      framework: 'NITDA-DP',
      requiresEvidence: true,
      evidenceRequired: 'Upload breach notification procedure',
    },
  ],
  'nitda-lc-001': [
    {
      id: 'nitda-local-content',
      clauseId: 'nitda-lc-001',
      title: 'Prioritize Nigerian Content in Procurement',
      priority: 'low',
      description: 'Prioritize Nigerian-made software, hardware, and services in procurement and development to comply with NITDA Local Content Guidelines.',
      difficulty: 'Easy',
      timeEstimate: '1-2 days',
      resources: [
        { label: 'NITDA Local Content', url: 'https://nitda.gov.ng/local-content' },
      ],
      framework: 'NITDA-DP',
      requiresEvidence: false,
    },
  ],
};

// ============================================
// COMBINED REMEDIATION MAP
// ============================================
const allRemediationMaps: Record<string, Record<string, RemediationItem[]>> = {
  'NDPA': ndpaRemediationMap,
  'CBN-AML': cbnAmlRemediationMap,
  'CBN-CP': cbnCpRemediationMap,
  'SEC-CF': secCfRemediationMap,
  'NITDA-DP': nitdaDpRemediationMap,
};

// ============================================
// DEFAULT REMEDIATION PER FRAMEWORK
// ============================================
function getDefaultRemediation(framework: string): RemediationItem[] {
  const defaults: Record<string, RemediationItem[]> = {
    'NDPA': [{
      id: 'rem-ndpa-default',
      clauseId: 'default',
      title: 'Review NDP Act 2023 Compliance',
      priority: 'high',
      description: 'Your assessment indicates compliance gaps under the NDP Act 2023. Review the NDP Act and implement required data protection measures.',
      difficulty: 'Medium',
      timeEstimate: '1-2 weeks',
      resources: [
        { label: 'NDPC Official Website', url: 'https://ndpc.gov.ng' },
        { label: 'NDP Act 2023', url: 'https://ndpc.gov.ng/ndpa-2023' },
      ],
      framework: 'NDPA',
      requiresEvidence: false,
    }],
    'CBN-AML': [{
      id: 'rem-cbn-default',
      clauseId: 'default',
      title: 'Review CBN AML/CFT Compliance',
      priority: 'high',
      description: 'Your assessment indicates compliance gaps under CBN AML/CFT Regulations 2022. Implement required anti-money laundering measures.',
      difficulty: 'Medium',
      timeEstimate: '2-3 weeks',
      resources: [
        { label: 'CBN AML/CFT Guidelines', url: 'https://www.cbn.gov.ng/aml-cft' },
      ],
      framework: 'CBN-AML',
      requiresEvidence: false,
    }],
    'CBN-CP': [{
      id: 'rem-cbn-cp-default',
      clauseId: 'default',
      title: 'Review Consumer Protection Compliance',
      priority: 'medium',
      description: 'Your assessment indicates compliance gaps under CBN Consumer Protection Regulations.',
      difficulty: 'Medium',
      timeEstimate: '1-2 weeks',
      resources: [
        { label: 'CBN Consumer Protection', url: 'https://www.cbn.gov.ng/consumer-protection' },
      ],
      framework: 'CBN-CP',
      requiresEvidence: false,
    }],
    'SEC-CF': [{
      id: 'rem-sec-default',
      clauseId: 'default',
      title: 'Review SEC Crowdfunding Compliance',
      priority: 'high',
      description: 'Your assessment indicates compliance gaps under SEC Crowdfunding Rules 2021.',
      difficulty: 'Hard',
      timeEstimate: '3-4 weeks',
      resources: [
        { label: 'SEC Crowdfunding Rules', url: 'https://sec.gov.ng/crowdfunding' },
      ],
      framework: 'SEC-CF',
      requiresEvidence: false,
    }],
    'NITDA-DP': [{
      id: 'rem-nitda-default',
      clauseId: 'default',
      title: 'Review NITDA Data Protection Compliance',
      priority: 'high',
      description: 'Your assessment indicates compliance gaps under NITDA DP Framework.',
      difficulty: 'Medium',
      timeEstimate: '2-3 weeks',
      resources: [
        { label: 'NITDA DP Framework', url: 'https://nitda.gov.ng/dp-framework' },
      ],
      framework: 'NITDA-DP',
      requiresEvidence: false,
    }],
  };
  return defaults[framework] || defaults['NDPA'];
}

// ============================================
// HELPER FUNCTIONS
// ============================================

export function getRemediationItems(
  triggeredClauseIds: string[],
  framework: string = 'NDPA'
): RemediationItem[] {
  const items: RemediationItem[] = [];
  const seen = new Set<string>();
  const remediationMap = allRemediationMaps[framework] || ndpaRemediationMap;

  triggeredClauseIds.forEach(id => {
    // Try exact match first
    let clauseItems = remediationMap[id];

    // If no match, try partial match (check if any key is contained in the ID)
    if (!clauseItems || clauseItems.length === 0) {
      for (const key of Object.keys(remediationMap)) {
        if (id.includes(key) || key.includes(id)) {
          clauseItems = remediationMap[key];
          break;
        }
      }
    }

    // If still no match, use default for the framework
    if (!clauseItems || clauseItems.length === 0) {
      clauseItems = getDefaultRemediation(framework);
    }

    clauseItems.forEach(item => {
      if (!seen.has(item.id)) {
        seen.add(item.id);
        items.push(item);
      }
    });
  });

  // If no items found at all, return default
  if (items.length === 0) {
    return getDefaultRemediation(framework);
  }

  const order = { critical: 0, high: 1, medium: 2, low: 3 };
  return items.sort((a, b) => order[a.priority] - order[b.priority]);
}

export function getRemediationItemsByClause(
  clauseId: string,
  framework: string = 'NDPA'
): RemediationItem[] {
  const remediationMap = allRemediationMaps[framework] || ndpaRemediationMap;
  return remediationMap[clauseId] || getDefaultRemediation(framework);
}

export function getAllRemediationItems(framework: string = 'NDPA'): RemediationItem[] {
  const remediationMap = allRemediationMaps[framework] || ndpaRemediationMap;
  const items: RemediationItem[] = [];
  const seen = new Set<string>();

  Object.values(remediationMap).forEach(clauseItems => {
    clauseItems.forEach(item => {
      if (!seen.has(item.id)) {
        seen.add(item.id);
        items.push(item);
      }
    });
  });

  if (items.length === 0) {
    return getDefaultRemediation(framework);
  }

  const order = { critical: 0, high: 1, medium: 2, low: 3 };
  return items.sort((a, b) => order[a.priority] - order[b.priority]);
}

export function getRemediationStats(framework: string = 'NDPA'): {
  critical: number;
  high: number;
  medium: number;
  low: number;
  total: number;
} {
  const items = getAllRemediationItems(framework);
  return {
    critical: items.filter(i => i.priority === 'critical').length,
    high: items.filter(i => i.priority === 'high').length,
    medium: items.filter(i => i.priority === 'medium').length,
    low: items.filter(i => i.priority === 'low').length,
    total: items.length,
  };
}

export function getMultiFrameworkRemediation(
  triggeredClausesByFramework: Record<string, string[]>
): RemediationItem[] {
  const items: RemediationItem[] = [];
  const seen = new Set<string>();

  Object.entries(triggeredClausesByFramework).forEach(([framework, clauseIds]) => {
    const frameworkItems = getRemediationItems(clauseIds, framework);
    frameworkItems.forEach(item => {
      if (!seen.has(item.id)) {
        seen.add(item.id);
        items.push(item);
      }
    });
  });

  if (items.length === 0) {
    return getDefaultRemediation('NDPA');
  }

  const order = { critical: 0, high: 1, medium: 2, low: 3 };
  return items.sort((a, b) => order[a.priority] - order[b.priority]);
}