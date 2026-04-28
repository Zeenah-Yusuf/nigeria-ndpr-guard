// src/lib/sectorRecommendations.ts
// Multi-framework sector profiles with recommendations
// Supports all 7 sectors and all 8 frameworks

export interface SectorProfile {
  id: string;
  name: string;
  emoji: string;
  description: string;
  keyRisks: string[];
  applicableFrameworks: string[];
  recommendedClauses: string[];
  tips: string[];
  risk_level?: number; // Optional risk level for scoring in RiskScanner
  riskLevel?: number;// Optional risk level label
}

export const sectorProfiles: SectorProfile[] = [
  {
    id: 'fintech',
    name: 'Fintech & Payments',
    emoji: '💳',
    description: 'Financial apps classified as UHL under GAID Schedule 7. Must comply with NDPA, CBN AML/CFT, and potentially SEC regulations.',
    keyRisks: [
      'UHL category — register with NDPC (₦250,000)',
      'Financial data requires DPIA (GAID Art. 28)',
      'CBN AML/CFT: KYC, CDD, STR filing to NFIU required',
      'Consumer data privacy under CBN Consumer Protection Regulations',
      'Cross-border payment processing needs adequacy verification',
    ],
    applicableFrameworks: ['NDPA', 'CBN-AML', 'CBN-CP', 'CBN-MMO', 'SEC-CF', 'SEC-CONDUCT', 'NITDA-DP'],
    recommendedClauses: ['Section 24', 'Section 26', 'Section 30', 'Section 39', 'Section 40', 'Section 44', 'Section 3.1', 'Section 6.2', 'Section 4.2', 'Rule 4.2'],
    tips: [
      'Maintain PCI DSS compliance alongside NDP Act requirements',
      'Document all third-party payment processors with full DPAs',
      'File annual CAR through DPCO by March 31st',
      'Appoint AML/CFT Compliance Officer',
      'Implement BVN/NIN verification for KYC',
    ],
  },
  {
    id: 'healthtech',
    name: 'Health & Wellness',
    emoji: '🏥',
    description: 'Health apps processing medical records, biometric data, or health metrics. Classified as mandatory registration sector under GAID Schedule 7.',
    keyRisks: [
      'Sensitive personal data requires explicit consent under NDP Act s.30',
      'DPIA mandatory before processing health data',
      'Breach notification critical — health data breaches cause severe harm',
      'Cross-border hosting of health records needs CBDTI or adequacy decision',
      'Data Subject Vulnerability Index must consider age and health factors',
    ],
    applicableFrameworks: ['NDPA', 'NITDA-DP'],
    recommendedClauses: ['Section 24', 'Section 26', 'Section 30', 'Section 39', 'Section 40', 'Section 44', 'Article 3.1'],
    tips: [
      'Always encrypt health data at rest and in transit',
      'Implement granular consent for each type of health data',
      'Appoint a DPO with healthcare data expertise',
      'Conduct DPIA using GAID Schedule 4 template before deployment',
      'Ensure GDPR compliance if handling EU patient data',
    ],
  },
  {
    id: 'ecommerce',
    name: 'E-Commerce & Retail',
    emoji: '🛒',
    description: 'E-commerce is a mandatory DPIA sector under GAID Art. 28 and mandatory registration sector under GAID Schedule 7.',
    keyRisks: [
      'E-commerce requires mandatory DPIA',
      'Customer profiling and targeted marketing need explicit consent',
      'Cookie consent banner must be conspicuous',
      'Payment processor data sharing must be disclosed via DPA',
      'Consumer protection under CBN-CP if processing payments',
    ],
    applicableFrameworks: ['NDPA', 'CBN-CP', 'NITDA-DP'],
    recommendedClauses: ['Section 24', 'Section 26', 'Section 27', 'Section 40', 'Section 44', 'Section 4.2'],
    tips: [
      'Implement conspicuous cookie consent banner',
      'Disclose all analytics and marketing third parties',
      'Offer easy data deletion and portability for customer accounts',
      'Conduct Legitimate Interest Assessment if using profiling',
      'Ensure payment gateway has CBN approval',
    ],
  },
  {
    id: 'edtech',
    name: 'EdTech & Learning',
    emoji: '📚',
    description: 'Education platforms classified as mandatory sector under GAID Schedule 7. Schools and higher institutions have specific DCPMI classifications.',
    keyRisks: [
      'Children under 18 require parental/guardian consent',
      'Student data is sensitive personal information requiring DPIA',
      'Higher institutions classified EHL (₦100,000), schools OHL (₦10,000)',
      'Third-party analytics tracking on education platforms needs disclosure',
      'NITDA Local Content guidelines may apply',
    ],
    applicableFrameworks: ['NDPA', 'NITDA-DP', 'NITDA-LC'],
    recommendedClauses: ['Section 24', 'Section 26', 'Section 31', 'Section 39', 'Section 44', 'Article 3.1'],
    tips: [
      'Create child-friendly privacy notices',
      'Implement verifiable parental consent for minors',
      'Register with NDPC based on classification level',
      'Develop Basic Privacy Checklist for teaching staff',
      'Consider NITDA local content requirements for EdTech solutions',
    ],
  },
  {
    id: 'agritech',
    name: 'Agricultural Technology',
    emoji: '🌾',
    description: 'Agricultural technology solutions including farm management, supply chain, and precision agriculture platforms.',
    keyRisks: [
      'Farmer data collection may involve sensitive location data',
      'Third-party data sharing with agricultural partners needs DPAs',
      'IoT devices on farms create unique data security challenges',
      'Cross-border data transfers for international supply chains',
    ],
    applicableFrameworks: ['NDPA', 'NITDA-DP'],
    recommendedClauses: ['Section 24', 'Section 25', 'Section 26', 'Section 39', 'Section 40'],
    tips: [
      'Implement data minimization for IoT sensor data',
      'Create clear farmer data rights documentation',
      'Ensure supply chain partners sign DPAs',
      'Consider offline data collection privacy implications',
    ],
  },
  {
    id: 'enterprise',
    name: 'Enterprise SaaS',
    emoji: '🏢',
    description: 'Business software, cloud services, and B2B platforms. May be subject to multiple frameworks depending on client industries.',
    keyRisks: [
      'Processing client employee data requires DPA with each client',
      'Cloud infrastructure must meet NDPA security standards',
      'SEC and NITDA regulations may apply depending on sector',
      'Cross-border data hosting needs adequacy verification',
      'Multi-tenant architecture creates complex compliance requirements',
    ],
    applicableFrameworks: ['NDPA', 'SEC-CF', 'NITDA-DP', 'NITDA-LC'],
    recommendedClauses: ['Section 24', 'Section 25', 'Section 39', 'Section 40', 'Section 44', 'Article 3.1'],
    tips: [
      'Implement strong data segregation between tenants',
      'Create standardized DPA templates for clients',
      'Ensure SOC 2 or ISO 27001 certification',
      'Consider NITDA local content requirements',
      'Build compliance dashboard for enterprise clients',
    ],
  },
  {
    id: 'social_media',
    name: 'Social Media & Content',
    emoji: '💬',
    description: 'Social platforms and content creation apps. Classified as UHL under GAID Schedule 7 (₦250,000 registration).',
    keyRisks: [
      'Social media platforms are UHL category — highest compliance tier',
      'User-generated content may contain personal data of others',
      'Automated content moderation involves profiling — DPIA required',
      'Direct messaging creates data retention obligations',
      'Minors on platform require special protections',
    ],
    applicableFrameworks: ['NDPA', 'NITDA-DP'],
    recommendedClauses: ['Section 24', 'Section 26', 'Section 30', 'Section 31', 'Section 39', 'Section 40', 'Section 44'],
    tips: [
      'Implement content reporting and takedown mechanisms',
      'Set clear data retention periods',
      'File annual CAR through DPCO as UHL entity',
      'Address DSVI for vulnerable users including minors and elderly',
      'Implement age verification for age-restricted content',
    ],
  },
];

// ============================================
// HELPER FUNCTIONS
// ============================================

export function getSectorById(id: string): SectorProfile | undefined {
  return sectorProfiles.find(s => s.id === id);
}

export function getSectorByName(name: string): SectorProfile | undefined {
  return sectorProfiles.find(s => s.name.toLowerCase() === name.toLowerCase());
}

export function getFrameworksForSector(sectorId: string): string[] {
  const sector = getSectorById(sectorId);
  return sector?.applicableFrameworks || ['NDPA'];
}

export function getClausesForSector(sectorId: string): string[] {
  const sector = getSectorById(sectorId);
  return sector?.recommendedClauses || [];
}

export function getAllSectorIds(): string[] {
  return sectorProfiles.map(s => s.id);
}

export function getAllSectorNames(): string[] {
  return sectorProfiles.map(s => s.name);
}