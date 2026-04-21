export interface RemediationItem {
  id: string;
  clauseId: string;
  title: string;
  priority: "critical" | "high" | "medium" | "low";
  description: string;
  difficulty: "Easy" | "Medium" | "Hard";
  timeEstimate: string;
  resources: { label: string; url: string }[];
  framework: "ndpa" | "cbn"; // Add framework identifier
}

// NDPA Remediation Items
const ndpaRemediationMap: Record<string, RemediationItem[]> = {
  "3": [
    {
      id: "rem-privacy-policy",
      clauseId: "3",
      title: "Publish a Privacy Policy",
      priority: "critical",
      description: "Your app collects personal data but has no privacy policy. Under the NDP Act 2023 and GAID 2025 Art. 7(j-k), you must publish a compliant privacy policy on all platforms where data processing occurs.",
      difficulty: "Easy",
      timeEstimate: "30 minutes",
      resources: [
        { label: "NDPC Privacy Template", url: "https://ndpc.gov.ng/our-data-privacy-policy/" },
        { label: "Free Privacy Policy Generator", url: "https://www.freeprivacypolicy.com/" },
      ],
      framework: "ndpa",
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
    },
    {
      id: "rem-children",
      clauseId: "5",
      title: "Add Guardian Consent for Minors",
      priority: "critical",
      description: "If your app targets users under 13, you must obtain verifiable parental/guardian consent. GAID Art. 43 requires special safeguards for child rights in emerging technologies.",
      difficulty: "Hard",
      timeEstimate: "1-2 weeks",
      resources: [
        { label: "NDPC Children's Data Guide", url: "https://ndpc.gov.ng/guidelines/consent-management-best-practices" },
      ],
      framework: "ndpa",
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
    },
  ],
  "9": [
    {
      id: "rem-breach-plan",
      clauseId: "9",
      title: "Create Breach Notification Process",
      priority: "critical",
      description: "Per NDP Act s.40 and GAID Art. 33, you must notify NDPC within 72 hours of becoming aware of a breach. Data subjects must be notified immediately if the breach poses high risk. Include: breach description, timeline, affected data, risk assessment, and mitigation steps.",
      difficulty: "Medium",
      timeEstimate: "3-4 hours",
      resources: [
        { label: "Breach Notification Template", url: "https://ndpc.gov.ng/resources/data-breach-response-template" },
      ],
      framework: "ndpa",
    },
  ],
  "12": [
    {
      id: "rem-third-party",
      clauseId: "12",
      title: "Disclose Third-Party Data Sharing & Update DPAs",
      priority: "high",
      description: "Per GAID Art. 34, Data Processing Agreements must include: party details, purpose, location, lawful bases, technical measures, DPIA outcomes, confidentiality, and dispute resolution. Controllers are liable for processor violations.",
      difficulty: "Medium",
      timeEstimate: "2-3 hours",
      resources: [
        { label: "Data Processing Agreement Template", url: "https://ndpc.gov.ng/our-data-privacy-policy/" },
      ],
      framework: "ndpa",
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
    },
  ],
};

// CBN AML Remediation Items
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
    },
  ],
  "cbn-aml-policy": [
    {
      id: "cbn-aml-policy",
      clauseId: "cbn-aml-policy",
      title: "Establish AML/CFT Policy",
      priority: "critical",
      description: "Develop and implement a comprehensive Anti-Money Laundering and Counter Financing of Terrorism policy approved by board of directors covering all regulatory requirements.",
      difficulty: "Medium",
      timeEstimate: "1-2 weeks",
      resources: [
        { label: "CBN AML/CFT Framework", url: "https://www.cbn.gov.ng/aml-framework" },
        { label: "Policy Template", url: "https://www.cbn.gov.ng/aml-policy-template" },
      ],
      framework: "cbn",
    },
  ],
  "cbn-fintech-licensing": [
    {
      id: "cbn-fintech-licensing",
      clauseId: "cbn-fintech-licensing",
      title: "Obtain CBN Fintech License",
      priority: "critical",
      description: "Secure appropriate CBN licensing for financial services operations including Payment Service Bank (PSB), Mobile Money Operator (MMO), or other relevant licenses.",
      difficulty: "Hard",
      timeEstimate: "1-3 months",
      resources: [
        { label: "Fintech Licensing Requirements", url: "https://www.cbn.gov.ng/fintech-license" },
        { label: "License Application Portal", url: "https://www.cbn.gov.ng/licensing" },
      ],
      framework: "cbn",
    },
  ],
};

// Combined function to get remediation items based on framework
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
  
  // Order priorities with low included
  const order = { critical: 0, high: 1, medium: 2, low: 3 };
  return items.sort((a, b) => order[a.priority] - order[b.priority]);
}

// Helper function to get framework-specific items for a single clause
export function getRemediationItemsByClause(
  clauseId: string, 
  framework: "ndpa" | "cbn" = "ndpa"
): RemediationItem[] {
  const remediationMap = framework === "ndpa" ? ndpaRemediationMap : cbnRemediationMap;
  return remediationMap[clauseId] || [];
}

// Helper to get all remediation items for a framework
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