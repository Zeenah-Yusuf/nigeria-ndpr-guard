export interface RemediationItem {
  id: string;
  clauseId: string;
  title: string;
  priority: "critical" | "high" | "medium";
  description: string;
  difficulty: "Easy" | "Medium" | "Hard";
  timeEstimate: string;
  resources: { label: string; url: string }[];
}

const remediationMap: Record<string, RemediationItem[]> = {
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
    },
  ],
};

export function getRemediationItems(triggeredClauseIds: string[]): RemediationItem[] {
  const items: RemediationItem[] = [];
  const seen = new Set<string>();
  triggeredClauseIds.forEach(id => {
    const clauseItems = remediationMap[id] || [];
    clauseItems.forEach(item => {
      if (!seen.has(item.id)) {
        seen.add(item.id);
        items.push(item);
      }
    });
  });
  const order = { critical: 0, high: 1, medium: 2 };
  return items.sort((a, b) => order[a.priority] - order[b.priority]);
}
