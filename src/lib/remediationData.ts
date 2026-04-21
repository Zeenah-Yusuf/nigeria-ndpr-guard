export interface RemediationItem {
  id: string;
  clauseId: string;
  title: string;
  priority: "critical" | "high" | "medium" | "low";
  description: string;
  difficulty: "Easy" | "Medium" | "Hard";
  timeEstimate: string;
  resources: { label: string; url: string }[];
  framework: "ndpa" | "cbn";
  requiresEvidence?: boolean; // Whether evidence upload is required
  evidenceRequired?: string; // Description of required evidence
}

// ==================== NDPA REMEDIATION ITEMS ====================
const ndpaRemediationMap: Record<string, RemediationItem[]> = {
  "3": [
    {
      id: "rem-privacy-policy",
      clauseId: "3",
      title: "Publish a Privacy Policy",
      priority: "critical",
      description: "Your business collects personal data but has no privacy policy. Under the NDP Act 2023 and GAID 2025 Art. 7(j-k), you must publish a compliant privacy policy on all platforms where data processing occurs.",
      difficulty: "Easy",
      timeEstimate: "30 minutes",
      resources: [
        { label: "NDPC Privacy Template", url: "https://ndpc.gov.ng/our-data-privacy-policy/" },
        { label: "Free Privacy Policy Generator", url: "https://www.freeprivacypolicy.com/" },
      ],
      framework: "ndpa",
      requiresEvidence: false,
    },
    {
      id: "rem-appoint-dpo",
      clauseId: "3",
      title: "Appoint a Data Protection Officer",
      priority: "high",
      description: "Under NDP Act s.32 and GAID Art. 11, data controllers/processors of major importance must designate a DPO. The DPO must be certified and undergo Annual Credential Assessment (ACA) per GAID Art. 14.",
      difficulty: "Medium",
      timeEstimate: "1-2 weeks",
      resources: [
        { label: "DPCO Directory", url: "https://ndpc.gov.ng/dpco-directory" },
      ],
      framework: "ndpa",
      requiresEvidence: true,
      evidenceRequired: "Upload DPO appointment letter and certification documents",
    },
    {
      id: "rem-file-audit",
      clauseId: "3",
      title: "File NDP Act Compliance Audit Returns (CAR)",
      priority: "high",
      description: "Under GAID Art. 10, data controllers/processors of major importance (UHL/EHL) must file annual CAR by March 31st. Late filing incurs a 50% administrative penalty on the filing fee.",
      difficulty: "Hard",
      timeEstimate: "2-4 weeks",
      resources: [
        { label: "Audit Filing Portal", url: "https://ndpc.gov.ng/audit-filing-portal" },
        { label: "DPCO Directory", url: "https://ndpc.gov.ng/dpco-directory" },
      ],
      framework: "ndpa",
      requiresEvidence: true,
      evidenceRequired: "Upload CAR filing confirmation or audit report",
    },
    {
      id: "rem-register-ndpc",
      clauseId: "3",
      title: "Register with NDPC as Data Controller/Processor",
      priority: "high",
      description: "Per GAID Art. 8-9 and Schedule 7, organisations processing 200+ data subjects in 6 months must register with NDPC. Categories: UHL (₦250,000), EHL (₦100,000), OHL (₦10,000).",
      difficulty: "Medium",
      timeEstimate: "1-2 weeks",
      resources: [
        { label: "NDPC Registration", url: "https://ndpc.gov.ng" },
      ],
      framework: "ndpa",
      requiresEvidence: true,
      evidenceRequired: "Upload NDPC registration certificate",
    },
  ],
  "4": [
    {
      id: "rem-dpia",
      clauseId: "4",
      title: "Conduct a Data Privacy Impact Assessment (DPIA)",
      priority: "high",
      description: "Under NDP Act s.28 and GAID Art. 28, DPIA is mandatory for: profiling, automated decision-making, sensitive data, vulnerable data subjects, new technologies, financial services, healthcare, and e-commerce. Must be filed with NDPC.",
      difficulty: "Medium",
      timeEstimate: "1-2 weeks",
      resources: [
        { label: "Security Standards", url: "https://ndpc.gov.ng/guidelines/security-and-data-protection-standards" },
      ],
      framework: "ndpa",
      requiresEvidence: true,
      evidenceRequired: "Upload completed DPIA report",
    },
  ],
  "5": [
    {
      id: "rem-consent",
      clauseId: "5",
      title: "Implement Explicit Consent Mechanism",
      priority: "critical",
      description: "Per NDP Act s.25 and GAID Art. 17-18, consent must be freely given, specific, informed and unambiguous. No pre-ticked boxes or implied consent. Separate consent needed for different data uses.",
      difficulty: "Medium",
      timeEstimate: "2-3 hours",
      resources: [
        { label: "Consent Best Practices", url: "https://ndpc.gov.ng/guidelines/consent-management-best-practices" },
      ],
      framework: "ndpa",
      requiresEvidence: false,
    },
    {
      id: "rem-cookie-consent",
      clauseId: "5",
      title: "Add Cookie Consent Banner",
      priority: "medium",
      description: "Per GAID Art. 19, cookie banners must be conspicuous and obstruct the page significantly. Data subjects must have clear 'accept' or 'reject' options. Necessary cookies are exempt but all others require specific consent.",
      difficulty: "Easy",
      timeEstimate: "1 hour",
      resources: [
        { label: "Consent Best Practices", url: "https://ndpc.gov.ng/guidelines/consent-management-best-practices" },
      ],
      framework: "ndpa",
      requiresEvidence: false,
    },
    {
      id: "rem-children",
      clauseId: "5",
      title: "Add Guardian Consent for Minors",
      priority: "critical",
      description: "If your business targets users under 13, you must obtain verifiable parental/guardian consent. GAID Art. 43 requires special safeguards for child rights in emerging technologies.",
      difficulty: "Hard",
      timeEstimate: "1-2 weeks",
      resources: [
        { label: "NDPC Children's Data Guide", url: "https://ndpc.gov.ng/guidelines/consent-management-best-practices" },
      ],
      framework: "ndpa",
      requiresEvidence: true,
      evidenceRequired: "Upload parental consent mechanism documentation",
    },
  ],
  "7": [
    {
      id: "rem-cross-border",
      clauseId: "7",
      title: "Review Cross-Border Data Transfers",
      priority: "high",
      description: "Under NDP Act Part VIII and GAID Art. 45 & Schedule 5, cross-border transfers require: NDPC adequacy decision, approved Cross-Border Data Transfer Instrument (CBDTI), or valid lawful basis with proper safeguards.",
      difficulty: "Medium",
      timeEstimate: "1-2 days",
      resources: [
        { label: "Whitelist Countries", url: "https://ndpc.gov.ng/resources/whitelist-countries" },
      ],
      framework: "ndpa",
      requiresEvidence: true,
      evidenceRequired: "Upload CBDTI or transfer documentation",
    },
  ],
  "9": [
    {
      id: "rem-breach-plan",
      clauseId: "9",
      title: "Create Breach Notification Process",
      priority: "critical",
      description: "Per NDP Act s.40 and GAID Art. 33, you must notify NDPC within 72 hours of becoming aware of a breach. Data subjects must be notified immediately if the breach poses high risk.",
      difficulty: "Medium",
      timeEstimate: "3-4 hours",
      resources: [
        { label: "Breach Notification Template", url: "https://ndpc.gov.ng/resources/data-breach-response-template" },
      ],
      framework: "ndpa",
      requiresEvidence: true,
      evidenceRequired: "Upload breach response policy document",
    },
  ],
  "12": [
    {
      id: "rem-third-party",
      clauseId: "12",
      title: "Disclose Third-Party Data Sharing & Update DPAs",
      priority: "high",
      description: "Per GAID Art. 34, Data Processing Agreements must include: party details, purpose, location, lawful bases, technical measures, DPIA outcomes, confidentiality, and dispute resolution.",
      difficulty: "Medium",
      timeEstimate: "2-3 hours",
      resources: [
        { label: "Data Processing Agreement Template", url: "https://ndpc.gov.ng/our-data-privacy-policy/" },
      ],
      framework: "ndpa",
      requiresEvidence: true,
      evidenceRequired: "Upload signed DPA with third-party processors",
    },
  ],
  "14": [
    {
      id: "rem-agf-coord",
      clauseId: "14",
      title: "Ensure Cross-Border Transfer Compliance",
      priority: "high",
      description: "For transfers to countries without NDPC adequacy decisions, you need approved CBDTI (binding corporate rules, standard contractual clauses, certifications, or codes of conduct) per GAID Schedule 5.",
      difficulty: "Hard",
      timeEstimate: "2-4 weeks",
      resources: [
        { label: "Whitelist Countries", url: "https://ndpc.gov.ng/resources/whitelist-countries" },
      ],
      framework: "ndpa",
      requiresEvidence: true,
      evidenceRequired: "Upload CBDTI approval documentation",
    },
  ],
  "15": [
    {
      id: "rem-annual-review",
      clauseId: "15",
      title: "Conduct Annual Compliance Review",
      priority: "low",
      description: "Regular annual review of your data protection practices helps maintain compliance and identify new risks. Document findings and update policies as needed.",
      difficulty: "Medium",
      timeEstimate: "1-2 days",
      resources: [
        { label: "Compliance Checklist", url: "https://ndpc.gov.ng/compliance-checklist" },
      ],
      framework: "ndpa",
      requiresEvidence: true,
      evidenceRequired: "Upload compliance review report",
    },
    {
      id: "rem-employee-training",
      clauseId: "15",
      title: "Provide Staff Data Protection Training",
      priority: "low",
      description: "Regular training for employees on data protection principles, breach response, and handling of personal data is essential for maintaining compliance culture.",
      difficulty: "Easy",
      timeEstimate: "2-3 hours",
      resources: [
        { label: "Training Resources", url: "https://ndpc.gov.ng/training-materials" },
      ],
      framework: "ndpa",
      requiresEvidence: true,
      evidenceRequired: "Upload training attendance records or certificates",
    },
  ],
};

// ==================== CBN AML REMEDIATION ITEMS ====================
const cbnRemediationMap: Record<string, RemediationItem[]> = {
  "cbn-aml-001": [
    {
      id: "cbn-kyc-implementation",
      clauseId: "cbn-aml-001",
      title: "Implement KYC Verification System",
      priority: "critical",
      description: "CBN AML regulations require customer identification and verification using BVN, NIN, or international passport for all financial services. Must verify customer identity before establishing business relationship.",
      difficulty: "Medium",
      timeEstimate: "1-2 weeks",
      resources: [
        { label: "CBN KYC Guidelines", url: "https://www.cbn.gov.ng/kyc-guidelines" },
        { label: "BVN Integration Guide", url: "https://nibss-plc.com.ng/bvn" },
      ],
      framework: "cbn",
      requiresEvidence: true,
      evidenceRequired: "Upload KYC policy document and BVN integration proof",
    },
    {
      id: "cbn-customer-due-diligence",
      clauseId: "cbn-aml-001",
      title: "Establish Customer Due Diligence (CDD) Process",
      priority: "critical",
      description: "Implement risk-based CDD procedures including customer identification, verification, and ongoing monitoring. Enhanced due diligence required for high-risk customers.",
      difficulty: "Medium",
      timeEstimate: "2-3 weeks",
      resources: [
        { label: "CDD Guidelines", url: "https://www.cbn.gov.ng/cdd-guidelines" },
      ],
      framework: "cbn",
      requiresEvidence: true,
      evidenceRequired: "Upload CDD policy and procedure documentation",
    },
  ],
  "cbn-aml-002": [
    {
      id: "cbn-transaction-monitoring",
      clauseId: "cbn-aml-002",
      title: "Implement Transaction Monitoring System",
      priority: "critical",
      description: "Deploy real-time transaction monitoring to detect suspicious activities including unusual transaction patterns, large cash transactions, and complex/unusual large transactions.",
      difficulty: "Hard",
      timeEstimate: "2-4 weeks",
      resources: [
        { label: "Transaction Monitoring Systems", url: "https://www.cbn.gov.ng/tms-guidelines" },
      ],
      framework: "cbn",
      requiresEvidence: true,
      evidenceRequired: "Upload transaction monitoring system configuration and reports",
    },
    {
      id: "cbn-pep-screening",
      clauseId: "cbn-aml-002",
      title: "Implement PEP Screening",
      priority: "high",
      description: "Screen customers against Politically Exposed Persons (PEP) lists. Enhanced due diligence required for domestic and foreign PEPs including family members and close associates.",
      difficulty: "Medium",
      timeEstimate: "1-2 weeks",
      resources: [
        { label: "PEP Screening Solutions", url: "https://www.cbn.gov.ng/pep-screening" },
      ],
      framework: "cbn",
      requiresEvidence: true,
      evidenceRequired: "Upload PEP screening policy and vendor documentation",
    },
  ],
  "cbn-aml-003": [
    {
      id: "cbn-str-filing",
      clauseId: "cbn-aml-003",
      title: "Establish STR Filing Process",
      priority: "critical",
      description: "Create process for filing Suspicious Transaction Reports (STR) to NFIU within 24 hours of forming suspicion. Must protect staff who report suspicious activities in good faith.",
      difficulty: "Medium",
      timeEstimate: "1-2 weeks",
      resources: [
        { label: "STR Filing Portal", url: "https://nfiu.gov.ng/str-filing" },
        { label: "STR Guidelines", url: "https://www.cbn.gov.ng/str-guidelines" },
      ],
      framework: "cbn",
      requiresEvidence: true,
      evidenceRequired: "Upload STR filing procedure and sample reports",
    },
  ],
  "cbn-aml-004": [
    {
      id: "cbn-risk-assessment",
      clauseId: "cbn-aml-004",
      title: "Conduct AML Risk Assessment",
      priority: "high",
      description: "Perform annual enterprise-wide AML risk assessment covering products, services, customers, and geographic locations. Document risk assessment methodology and findings.",
      difficulty: "Medium",
      timeEstimate: "2-3 weeks",
      resources: [
        { label: "AML Risk Assessment Template", url: "https://www.cbn.gov.ng/risk-assessment" },
      ],
      framework: "cbn",
      requiresEvidence: true,
      evidenceRequired: "Upload AML risk assessment report",
    },
  ],
  "cbn-aml-005": [
    {
      id: "cbn-aml-training",
      clauseId: "cbn-aml-005",
      title: "Conduct Annual AML Training",
      priority: "medium",
      description: "Provide annual AML/CFT training to all relevant employees including board members, management, and front-line staff. Training must cover recent regulations and emerging risks.",
      difficulty: "Easy",
      timeEstimate: "1 week",
      resources: [
        { label: "AML Training Modules", url: "https://www.cbn.gov.ng/aml-training" },
      ],
      framework: "cbn",
      requiresEvidence: true,
      evidenceRequired: "Upload training attendance records and certificates",
    },
  ],
  "cbn-aml-006": [
    {
      id: "cbn-record-keeping",
      clauseId: "cbn-aml-006",
      title: "Implement Record Keeping System",
      priority: "medium",
      description: "Establish system to retain transaction records, customer identification documents, and account files for at least 5 years after account closure or transaction completion.",
      difficulty: "Easy",
      timeEstimate: "3-5 days",
      resources: [
        { label: "Record Retention Guidelines", url: "https://www.cbn.gov.ng/record-keeping" },
      ],
      framework: "cbn",
      requiresEvidence: true,
      evidenceRequired: "Upload record retention policy and system documentation",
    },
  ],
  "cbn-aml-007": [
    {
      id: "cbn-independent-audit",
      clauseId: "cbn-aml-007",
      title: "Schedule Independent AML Audit",
      priority: "medium",
      description: "Conduct independent AML compliance audit annually by internal audit or external qualified party. Audit must assess compliance with AML/CFT obligations and recommend improvements.",
      difficulty: "Hard",
      timeEstimate: "3-4 weeks",
      resources: [
        { label: "Audit Requirements", url: "https://www.cbn.gov.ng/audit-guidelines" },
      ],
      framework: "cbn",
      requiresEvidence: true,
      evidenceRequired: "Upload audit report and management response",
    },
  ],
  "cbn-aml-008": [
    {
      id: "cbn-compliance-officer",
      clauseId: "cbn-aml-008",
      title: "Designate AML Compliance Officer",
      priority: "high",
      description: "Appoint a designated AML/CFT Compliance Officer at senior management level responsible for overseeing all compliance matters including reporting suspicious transactions to NFIU.",
      difficulty: "Easy",
      timeEstimate: "3-5 days",
      resources: [
        { label: "Compliance Officer Requirements", url: "https://www.cbn.gov.ng/compliance-officer" },
      ],
      framework: "cbn",
      requiresEvidence: true,
      evidenceRequired: "Upload Compliance Officer appointment letter",
    },
  ],
};

// ==================== HELPER FUNCTIONS ====================

/**
 * Get remediation items based on triggered clause IDs and framework
 * @param triggeredClauseIds - Array of clause IDs that were triggered
 * @param framework - Either "ndpa" or "cbn"
 * @returns Array of remediation items sorted by priority
 */
export function getRemediationItems(
  triggeredClauseIds: string[], 
  framework: "ndpa" | "cbn" = "ndpa"
): RemediationItem[] {
  const items: RemediationItem[] = [];
  const seen = new Set<string>();
  
  // Select the appropriate map based on framework
  const remediationMap = framework === "ndpa" ? ndpaRemediationMap : cbnRemediationMap;
  
  triggeredClauseIds.forEach(id => {
    const clauseItems = remediationMap[id] || [];
    clauseItems.forEach(item => {
      if (!seen.has(item.id)) {
        seen.add(item.id);
        items.push(item);
      }
    });
  });
  
  // Order priorities: critical, high, medium, low
  const order = { critical: 0, high: 1, medium: 2, low: 3 };
  return items.sort((a, b) => order[a.priority] - order[b.priority]);
}

/**
 * Get remediation items for a specific clause
 * @param clauseId - The clause ID
 * @param framework - Either "ndpa" or "cbn"
 * @returns Array of remediation items for that clause
 */
export function getRemediationItemsByClause(
  clauseId: string, 
  framework: "ndpa" | "cbn" = "ndpa"
): RemediationItem[] {
  const remediationMap = framework === "ndpa" ? ndpaRemediationMap : cbnRemediationMap;
  return remediationMap[clauseId] || [];
}

/**
 * Get all remediation items for a framework
 * @param framework - Either "ndpa" or "cbn"
 * @returns Array of all remediation items for that framework
 */
export function getAllRemediationItems(framework: "ndpa" | "cbn" = "ndpa"): RemediationItem[] {
  const remediationMap = framework === "ndpa" ? ndpaRemediationMap : cbnRemediationMap;
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
  
  const order = { critical: 0, high: 1, medium: 2, low: 3 };
  return items.sort((a, b) => order[a.priority] - order[b.priority]);
}

/**
 * Get the count of remediation items by priority for a framework
 * @param framework - Either "ndpa" or "cbn"
 * @returns Object with counts for each priority level
 */
export function getRemediationStats(framework: "ndpa" | "cbn" = "ndpa"): {
  critical: number;
  high: number;
  medium: number;
  low: number;
  total: number;
} {
  const items = getAllRemediationItems(framework);
  return {
    critical: items.filter(i => i.priority === "critical").length,
    high: items.filter(i => i.priority === "high").length,
    medium: items.filter(i => i.priority === "medium").length,
    low: items.filter(i => i.priority === "low").length,
    total: items.length,
  };
}