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
      description: "Your app collects personal data but has no privacy policy. NDPR Art. 2.5 requires publishing one within 3 months of business commencement.",
      difficulty: "Easy",
      timeEstimate: "30 minutes",
      resources: [
        { label: "NITDA Privacy Template", url: "https://ndpr.nitda.gov.ng/resources/privacy-template" },
        { label: "Free Privacy Policy Generator", url: "https://www.freeprivacypolicy.com/" },
      ],
    },
    {
      id: "rem-appoint-dpo",
      clauseId: "3",
      title: "Appoint a Data Protection Officer",
      priority: "high",
      description: "If you process data of 10,000+ subjects, you must designate a DPO responsible for compliance, monitoring, and NITDA liaison.",
      difficulty: "Medium",
      timeEstimate: "1-2 weeks",
      resources: [
        { label: "DPCO Directory", url: "https://ndpr.nitda.gov.ng/dpco-directory" },
      ],
    },
    {
      id: "rem-file-audit",
      clauseId: "3",
      title: "File Annual Data Protection Audit",
      priority: "high",
      description: "Annual data protection audits are mandatory. Engage a licensed DPCO and file your audit report with NITDA.",
      difficulty: "Hard",
      timeEstimate: "2-4 weeks",
      resources: [
        { label: "Audit Filing Portal", url: "https://ndpr.nitda.gov.ng/audit-filing-portal" },
        { label: "DPCO Directory", url: "https://ndpr.nitda.gov.ng/dpco-directory" },
      ],
    },
  ],
  "4": [
    {
      id: "rem-dpia",
      clauseId: "4",
      title: "Conduct a Data Protection Impact Assessment",
      priority: "high",
      description: "High-impact processing (profiling, automated decisions, sensitive data) requires a DPIA before processing begins.",
      difficulty: "Medium",
      timeEstimate: "1-2 weeks",
      resources: [
        { label: "DPIA Guide", url: "https://ndpr.nitda.gov.ng/guidelines/security-standards" },
      ],
    },
  ],
  "5": [
    {
      id: "rem-consent",
      clauseId: "5",
      title: "Implement Explicit Consent Mechanism",
      priority: "critical",
      description: "Users must actively opt-in to data collection. No pre-ticked boxes or implied consent. Separate consent needed for different data uses.",
      difficulty: "Medium",
      timeEstimate: "2-3 hours",
      resources: [
        { label: "Consent Best Practices", url: "https://ndpr.nitda.gov.ng/guidelines/consent-best-practices" },
      ],
    },
    {
      id: "rem-cookie-consent",
      clauseId: "5",
      title: "Add Cookie Consent Banner",
      priority: "medium",
      description: "If your app uses cookies, you must obtain consent before setting non-essential cookies.",
      difficulty: "Easy",
      timeEstimate: "1 hour",
      resources: [
        { label: "Consent Best Practices", url: "https://ndpr.nitda.gov.ng/guidelines/consent-best-practices" },
      ],
    },
    {
      id: "rem-children",
      clauseId: "5",
      title: "Add Guardian Consent for Minors",
      priority: "critical",
      description: "If your app targets users under 13, you must obtain verifiable parental/guardian consent and use child-friendly privacy notices.",
      difficulty: "Hard",
      timeEstimate: "1-2 weeks",
      resources: [
        { label: "NDPR Children's Data Guide", url: "https://ndpr.nitda.gov.ng/guidelines/consent-best-practices" },
      ],
    },
  ],
  "7": [
    {
      id: "rem-cross-border",
      clauseId: "7",
      title: "Review Cross-Border Data Transfers",
      priority: "high",
      description: "Verify your hosting country is on the NDPR White List. If not, obtain documented consent per Art. 2.12 and implement BCR or SCC.",
      difficulty: "Medium",
      timeEstimate: "1-2 days",
      resources: [
        { label: "Whitelist Countries", url: "https://ndpr.nitda.gov.ng/whitelist-countries" },
      ],
    },
  ],
  "9": [
    {
      id: "rem-breach-plan",
      clauseId: "9",
      title: "Create Breach Notification Process",
      priority: "critical",
      description: "You must have a documented process to detect, report and investigate data breaches, and self-report to NITDA within 72 hours.",
      difficulty: "Medium",
      timeEstimate: "3-4 hours",
      resources: [
        { label: "Breach Notification Template", url: "https://ndpr.nitda.gov.ng/resources/breach-template" },
      ],
    },
  ],
  "12": [
    {
      id: "rem-third-party",
      clauseId: "12",
      title: "Disclose Third-Party Data Sharing",
      priority: "high",
      description: "Publish a list of all third parties receiving user data (analytics, payment processors, etc.) with written data protection agreements.",
      difficulty: "Medium",
      timeEstimate: "2-3 hours",
      resources: [
        { label: "Data Processing Agreement Template", url: "https://ndpr.nitda.gov.ng/resources/privacy-template" },
      ],
    },
  ],
  "14": [
    {
      id: "rem-agf-coord",
      clauseId: "14",
      title: "Coordinate Cross-Border Transfers with AGF",
      priority: "high",
      description: "For transfers to non-White-List countries, coordinate with the Attorney-General's office to ensure compliance.",
      difficulty: "Hard",
      timeEstimate: "2-4 weeks",
      resources: [
        { label: "Whitelist Countries", url: "https://ndpr.nitda.gov.ng/whitelist-countries" },
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
  // Sort by priority
  const order = { critical: 0, high: 1, medium: 2 };
  return items.sort((a, b) => order[a.priority] - order[b.priority]);
}
