export interface SectorProfile {
  id: string;
  name: string;
  emoji: string;
  description: string;
  keyRisks: string[];
  recommendedClauses: string[];
  tips: string[];
}

export const sectorProfiles: SectorProfile[] = [
  {
    id: "health",
    name: "Health & Wellness",
    emoji: "🏥",
    description: "Health apps processing medical records, biometric data, or health metrics. Classified as mandatory registration sector under GAID Schedule 7.",
    keyRisks: [
      "Sensitive personal data (health records) requires explicit consent under NDP Act s.25",
      "DPIA mandatory before processing health data (GAID Art. 28(3)(i))",
      "Breach notification critical — health data breaches cause severe harm",
      "Cross-border hosting of health records needs CBDTI or adequacy decision",
      "Data Subject Vulnerability Index (DSVI) must consider age and health factors",
    ],
    recommendedClauses: ["3", "4", "5", "9", "17", "18"],
    tips: [
      "Always encrypt health data at rest and in transit per GAID Art. 29",
      "Implement granular consent for each type of health data",
      "Appoint a DPO with healthcare data expertise — certified per GAID Art. 14",
      "Conduct DPIA using GAID Schedule 4 template before deployment",
    ],
  },
  {
    id: "fintech",
    name: "Fintech & Payments",
    emoji: "💳",
    description: "Financial apps classified as UHL under GAID Schedule 7. Fintechs and payment gateways must register at ₦250,000.",
    keyRisks: [
      "Fintechs are UHL category — must register with NDPC (₦250,000)",
      "Financial data processing requires DPIA (GAID Art. 28(3)(h))",
      "Third-party payment processors must have compliant DPAs (GAID Art. 34)",
      "Cross-border payment processing needs adequacy verification or CBDTI",
      "Data-driven financial assets require heightened security measures",
    ],
    recommendedClauses: ["3", "5", "7", "8", "12", "18"],
    tips: [
      "Maintain PCI DSS compliance alongside NDP Act requirements",
      "Document all third-party payment processors with full DPAs",
      "Implement MEM schedule for continuous security monitoring (GAID Art. 29)",
      "File annual CAR through a licensed DPCO by March 31st",
    ],
  },
  {
    id: "edtech",
    name: "EdTech & Learning",
    emoji: "📚",
    description: "Education platforms classified as mandatory sector under GAID Schedule 7. Higher institutions are EHL; primary/secondary schools are OHL.",
    keyRisks: [
      "Children under 13 require guardian consent — DSVI applies (GAID Sch. 6)",
      "Student data is sensitive personal information requiring DPIA",
      "Higher institutions classified EHL (₦100,000), schools OHL (₦10,000)",
      "Third-party analytics tracking on education platforms needs disclosure",
    ],
    recommendedClauses: ["3", "5", "8", "12", "16"],
    tips: [
      "Create child-friendly privacy notices as required by GAID Art. 27",
      "Implement verifiable parental consent for minors",
      "Register with NDPC based on your classification level",
      "Develop Basic Privacy Checklist for all teaching staff (GAID Art. 30)",
    ],
  },
  {
    id: "ecommerce",
    name: "E-Commerce & Retail",
    emoji: "🛒",
    description: "E-commerce is a mandatory DPIA sector under GAID Art. 28(3)(j) and a mandatory registration sector.",
    keyRisks: [
      "E-commerce requires mandatory DPIA per GAID Art. 28(3)(j)",
      "Customer profiling and targeted marketing need explicit consent",
      "Cookie consent banner must be conspicuous — not at page bottom (GAID Art. 19)",
      "Payment processor data sharing must be disclosed via DPA (GAID Art. 34)",
    ],
    recommendedClauses: ["3", "5", "7", "12", "17"],
    tips: [
      "Implement conspicuous cookie consent banner per GAID Art. 19(7)",
      "Disclose all analytics and marketing third parties with proper DPAs",
      "Offer easy data deletion and portability for customer accounts",
      "Conduct Legitimate Interest Assessment if using profiling (GAID Sch. 8)",
    ],
  },
  {
    id: "social",
    name: "Social & Community",
    emoji: "💬",
    description: "Public social media app developers are classified as UHL under GAID Schedule 7 (₦250,000 registration).",
    keyRisks: [
      "Social media platforms are UHL category — highest compliance tier",
      "User-generated content may contain personal data of others",
      "Automated content moderation involves profiling — DPIA required",
      "Direct messaging creates data retention and breach notification obligations",
    ],
    recommendedClauses: ["3", "5", "6", "8", "9", "16"],
    tips: [
      "Implement content reporting and takedown mechanisms",
      "Set clear data retention periods aligned with GAID Art. 49",
      "File annual CAR through DPCO as UHL entity",
      "Address DSVI for vulnerable users including minors and elderly",
    ],
  },
  {
    id: "logistics",
    name: "Logistics & Delivery",
    emoji: "🚚",
    description: "Delivery and logistics apps tracking location data, addresses, and contact information.",
    keyRisks: [
      "Location tracking is sensitive personal data requiring consent",
      "Driver and customer data sharing with third parties needs DPAs",
      "Cross-border logistics data transfers need compliance verification",
      "DPIA required for systematic location monitoring (GAID Art. 28(3)(c))",
    ],
    recommendedClauses: ["3", "4", "5", "7", "12"],
    tips: [
      "Minimize location tracking to delivery period only",
      "Implement data anonymization for analytics per NDP Act s.24",
      "Clearly disclose data sharing with delivery partners via DPAs",
      "Develop MEM schedule for location data security",
    ],
  },
  {
    id: "government",
    name: "Government & Public Sector",
    emoji: "🏛️",
    description: "MDAs are classified as EHL under GAID Schedule 7. Public institutions must comply with the NDP Act and designate DPOs.",
    keyRisks: [
      "MDAs classified as EHL — must register with NDPC (₦100,000)",
      "Public interest processing still requires safeguards (GAID Art. 25)",
      "Legal obligation processing must comply with necessity and proportionality",
      "Data sovereignty considerations are paramount for government data",
    ],
    recommendedClauses: ["3", "4", "5", "7", "13", "18"],
    tips: [
      "Designate a certified DPO per NDP Act s.32",
      "Conduct DPIA for new e-government systems (GAID Art. 28)",
      "File CAR through DPCO by March 31st annually",
      "Implement training schedule for all public servants handling data",
    ],
  },
];

export function getSectorById(id: string): SectorProfile | undefined {
  return sectorProfiles.find(s => s.id === id);
}
