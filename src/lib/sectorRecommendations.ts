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
    description: "Health apps processing medical records, biometric data, or health metrics face the highest NDPR scrutiny.",
    keyRisks: [
      "Sensitive personal data (health records) requires explicit consent",
      "DPIA mandatory before processing health data",
      "Breach notification critical — health data breaches cause severe harm",
      "Cross-border hosting of health records needs extra safeguards",
    ],
    recommendedClauses: ["3", "4", "5", "9"],
    tips: [
      "Always encrypt health data at rest and in transit",
      "Implement granular consent for each type of health data",
      "Appoint a DPO with healthcare data expertise",
    ],
  },
  {
    id: "fintech",
    name: "Fintech & Payments",
    emoji: "💳",
    description: "Financial apps handling payment data, KYC information, and transaction records must comply with both NDPR and CBN regulations.",
    keyRisks: [
      "Financial data is sensitive — requires explicit consent",
      "Third-party payment processors must have written DPA agreements",
      "Transaction records have strict retention requirements",
      "Cross-border payment processing needs White List verification",
    ],
    recommendedClauses: ["3", "5", "7", "8", "12"],
    tips: [
      "Maintain PCI DSS compliance alongside NDPR",
      "Document all third-party payment processors publicly",
      "Implement data retention policies aligned with CBN and NDPR",
    ],
  },
  {
    id: "edtech",
    name: "EdTech & Learning",
    emoji: "📚",
    description: "Education platforms collecting student data, especially for minors, face strict consent and privacy requirements.",
    keyRisks: [
      "Children under 13 require guardian consent",
      "Student data is sensitive personal information",
      "Third-party analytics tracking on education platforms",
      "Data retention of academic records",
    ],
    recommendedClauses: ["3", "5", "8", "12"],
    tips: [
      "Create child-friendly privacy notices",
      "Implement verifiable parental consent for minors",
      "Minimize data collection to what's necessary for education",
    ],
  },
  {
    id: "ecommerce",
    name: "E-Commerce & Retail",
    emoji: "🛒",
    description: "Online retail platforms collecting customer profiles, payment info, and shopping behavior data.",
    keyRisks: [
      "Customer profiling and targeted marketing need consent",
      "Payment processor data sharing must be disclosed",
      "Cookie consent for tracking and analytics",
      "Cross-border shipping data transfers",
    ],
    recommendedClauses: ["3", "5", "7", "12"],
    tips: [
      "Implement cookie consent banner with granular options",
      "Disclose all analytics and marketing third parties",
      "Offer easy data deletion for customer accounts",
    ],
  },
  {
    id: "social",
    name: "Social & Community",
    emoji: "💬",
    description: "Social platforms handling user-generated content, messaging, and community interactions at scale.",
    keyRisks: [
      "Large-scale data processing requires annual audit filing",
      "User-generated content may contain personal data of others",
      "Direct messaging creates data retention obligations",
      "Content moderation involves processing sensitive data",
    ],
    recommendedClauses: ["3", "5", "6", "8", "9"],
    tips: [
      "Implement content reporting and takedown mechanisms",
      "Set clear data retention periods for messages and posts",
      "File annual audit if processing 2,000+ user records",
    ],
  },
  {
    id: "logistics",
    name: "Logistics & Delivery",
    emoji: "🚚",
    description: "Delivery and logistics apps tracking location data, addresses, and contact information.",
    keyRisks: [
      "Location tracking is sensitive personal data",
      "Driver and customer data sharing with third parties",
      "Cross-border logistics data transfers",
      "Retention of delivery records and addresses",
    ],
    recommendedClauses: ["3", "4", "5", "7", "12"],
    tips: [
      "Minimize location tracking to delivery period only",
      "Implement data anonymization for analytics",
      "Clearly disclose data sharing with delivery partners",
    ],
  },
];

export function getSectorById(id: string): SectorProfile | undefined {
  return sectorProfiles.find(s => s.id === id);
}
