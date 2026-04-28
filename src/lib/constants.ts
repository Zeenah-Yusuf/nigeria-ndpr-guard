// src/lib/constants.ts
// Multi-framework constants for RegTrack
// Supports: NDPA, CBN, SEC, NITDA frameworks

// ============================================
// API & SERVICE URLS
// ============================================

export const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || '';
export const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
export const APP_URL = import.meta.env.VITE_APP_URL || 'http://localhost:5173';

// Edge Functions
export const EDGE_FUNCTIONS = {
  SCAN: `${SUPABASE_URL}/functions/v1/scan`,
  SEARCH: `${SUPABASE_URL}/functions/v1/search`,
  GENERATE_REPORT: `${SUPABASE_URL}/functions/v1/generate-report`,
  PARSE_DOCUMENT: `${SUPABASE_URL}/functions/v1/parse-document`,
  MONITOR_REGULATORS: `${SUPABASE_URL}/functions/v1/monitor-regulators`,
  GENERATE_ALERTS: `${SUPABASE_URL}/functions/v1/generate-alerts`,
} as const;

// ============================================
// AI SERVICE CONFIGURATION
// ============================================

export const AI_CONFIG = {
  // OpenAI (Primary)
  OPENAI: {
    MODEL: 'gpt-4o-mini',
    EMBEDDING_MODEL: 'text-embedding-3-small',
    EMBEDDING_DIMENSIONS: 1536,
    MAX_TOKENS: 800,
    TEMPERATURE: 0.3,
  },
  // HuggingFace (Free Fallback)
  HUGGINGFACE: {
    EMBEDDING_MODEL: 'sentence-transformers/all-MiniLM-L6-v2',
    EMBEDDING_DIMENSIONS: 384,
  },
} as const;

// ============================================
// REGULATORS
// ============================================

export const REGULATORS = {
  NDPC: {
    acronym: 'NDPC',
    name: 'Nigeria Data Protection Commission',
    fullName: 'Nigeria Data Protection Commission',
    website: 'https://ndpc.gov.ng',
    category: 'data_protection',
    color: '#16a34a', // Green
    icon: 'shield-check',
  },
  CBN: {
    acronym: 'CBN',
    name: 'Central Bank of Nigeria',
    fullName: 'Central Bank of Nigeria',
    website: 'https://www.cbn.gov.ng',
    category: 'financial',
    color: '#1e40af', // Blue
    icon: 'bank',
  },
  SEC: {
    acronym: 'SEC',
    name: 'Securities and Exchange Commission',
    fullName: 'Securities and Exchange Commission Nigeria',
    website: 'https://sec.gov.ng',
    category: 'securities',
    color: '#7c3aed', // Purple
    icon: 'trending-up',
  },
  NITDA: {
    acronym: 'NITDA',
    name: 'National Information Technology Development Agency',
    fullName: 'National Information Technology Development Agency',
    website: 'https://nitda.gov.ng',
    category: 'technology',
    color: '#0891b2', // Cyan
    icon: 'cpu',
  },
} as const;

export type RegulatorKey = keyof typeof REGULATORS;

// ============================================
// REGULATORY FRAMEWORKS
// ============================================

export const FRAMEWORKS = {
  NDPA: {
    name: 'NDPA',
    fullName: 'Nigeria Data Protection Act 2023',
    regulator: 'NDPC',
    type: 'act',
    effectiveDate: '2023-06-12',
    description: 'Primary data protection legislation for Nigeria',
    color: '#16a34a',
  },
  'NITDA-DP': {
    name: 'NITDA-DP',
    fullName: 'NITDA Data Protection Implementation Framework',
    regulator: 'NITDA',
    type: 'framework',
    effectiveDate: '2020-11-01',
    description: 'Implementation guidelines for data protection compliance',
    color: '#0891b2',
  },
  'CBN-AML': {
    name: 'CBN-AML',
    fullName: 'CBN Anti-Money Laundering/CFT Regulations 2022',
    regulator: 'CBN',
    type: 'regulation',
    effectiveDate: '2022-09-01',
    description: 'Anti-money laundering and counter-terrorism financing regulations',
    color: '#1e40af',
  },
  'CBN-CP': {
    name: 'CBN-CP',
    fullName: 'CBN Consumer Protection Regulations 2019',
    regulator: 'CBN',
    type: 'regulation',
    effectiveDate: '2019-11-01',
    description: 'Consumer protection framework for financial services',
    color: '#2563eb',
  },
  'CBN-MMO': {
    name: 'CBN-MMO',
    fullName: 'CBN Guidelines on Mobile Money Services',
    regulator: 'CBN',
    type: 'guideline',
    effectiveDate: '2021-07-01',
    description: 'Regulatory framework for mobile money operators',
    color: '#3b82f6',
  },
  'SEC-CF': {
    name: 'SEC-CF',
    fullName: 'SEC Rules on Crowdfunding 2021',
    regulator: 'SEC',
    type: 'regulation',
    effectiveDate: '2021-01-01',
    description: 'Regulatory framework for crowdfunding platforms',
    color: '#7c3aed',
  },
  'SEC-CONDUCT': {
    name: 'SEC-CONDUCT',
    fullName: 'SEC Code of Conduct for Capital Market Operators',
    regulator: 'SEC',
    type: 'code',
    effectiveDate: '2020-06-01',
    description: 'Code of conduct for capital market participants',
    color: '#8b5cf6',
  },
  'NITDA-LC': {
    name: 'NITDA-LC',
    fullName: 'NITDA Guidelines for Nigerian Content Development in ICT',
    regulator: 'NITDA',
    type: 'guideline',
    effectiveDate: '2021-03-01',
    description: 'Guidelines for promoting local content in ICT sector',
    color: '#06b6d4',
  },
} as const;

export type FrameworkKey = keyof typeof FRAMEWORKS;

// ============================================
// SECTORS
// ============================================

export const SECTORS = {
  fintech: {
    name: 'Financial Technology',
    slug: 'fintech',
    description: 'Digital financial services, payments, lending, insurance',
    riskLevel: 8,
    icon: 'wallet',
    color: '#1e40af',
    applicableFrameworks: ['NDPA', 'CBN-AML', 'CBN-CP', 'CBN-MMO', 'SEC-CF', 'SEC-CONDUCT', 'NITDA-DP'],
  },
  healthtech: {
    name: 'Health Technology',
    slug: 'healthtech',
    description: 'Digital health, telemedicine, health records management',
    riskLevel: 9,
    icon: 'heart-pulse',
    color: '#dc2626',
    applicableFrameworks: ['NDPA', 'NITDA-DP'],
  },
  ecommerce: {
    name: 'E-Commerce',
    slug: 'ecommerce',
    description: 'Online retail, marketplaces, digital services',
    riskLevel: 6,
    icon: 'shopping-cart',
    color: '#f59e0b',
    applicableFrameworks: ['NDPA', 'CBN-CP', 'NITDA-DP'],
  },
  edtech: {
    name: 'Education Technology',
    slug: 'edtech',
    description: 'Online learning, educational platforms, EdTech solutions',
    riskLevel: 5,
    icon: 'graduation-cap',
    color: '#8b5cf6',
    applicableFrameworks: ['NDPA', 'NITDA-DP'],
  },
  agritech: {
    name: 'Agricultural Technology',
    slug: 'agritech',
    description: 'Agricultural solutions, farm management, food supply chain',
    riskLevel: 5,
    icon: 'sprout',
    color: '#16a34a',
    applicableFrameworks: ['NDPA', 'NITDA-DP'],
  },
  enterprise: {
    name: 'Enterprise SaaS',
    slug: 'enterprise',
    description: 'Business software, cloud services, B2B platforms',
    riskLevel: 7,
    icon: 'building-2',
    color: '#64748b',
    applicableFrameworks: ['NDPA', 'SEC-CF', 'NITDA-DP', 'NITDA-LC'],
  },
  social_media: {
    name: 'Social Media/Content',
    slug: 'social_media',
    description: 'Social platforms, content creation, digital media',
    riskLevel: 6,
    icon: 'share-2',
    color: '#ec4899',
    applicableFrameworks: ['NDPA', 'NITDA-DP'],
  },
} as const;

export type SectorKey = keyof typeof SECTORS;

// ============================================
// DCPMI THRESHOLDS
// ============================================

export const DCPMI_THRESHOLDS = {
  ULTRA_HIGH: 10000,
  EXTRA_HIGH: 5000,
  ORDINARY_HIGH: 2000,
} as const;

export const DCPMI_TIERS = {
  UHL: {
    label: 'Ultra-High Level',
    minDataSubjects: 10001,
    description: 'Fintech, Insurance, Healthtech, biometric data, or >10,000 data subjects',
    color: '#ef4444',
    requirements: [
      'Register with NDPC',
      'Appoint DPO',
      'Annual DPIA',
      'Quarterly compliance audit',
      'Data protection by design',
    ],
  },
  EHL: {
    label: 'Extra-High Level',
    minDataSubjects: 5000,
    maxDataSubjects: 10000,
    description: '5,000-10,000 data subjects or sensitive data processing',
    color: '#f97316',
    requirements: [
      'Register with NDPC',
      'Appoint DPO',
      'Annual DPIA',
      'Bi-annual compliance audit',
    ],
  },
  OHL: {
    label: 'Ordinary-High Level',
    minDataSubjects: 2000,
    maxDataSubjects: 4999,
    description: '2,000-5,000 data subjects',
    color: '#eab308',
    requirements: [
      'Register with NDPC',
      'Appoint DPO',
      'Annual DPIA',
    ],
  },
} as const;

// ============================================
// RISK LEVELS
// ============================================

export const RISK_LEVELS = {
  LOW: { 
    threshold: 30, 
    color: '#22c55e', 
    bgColor: '#f0fdf4',
    labelKey: 'risk.low',
    icon: 'shield-check',
    description: 'Basic compliance measures in place',
  },
  MEDIUM: { 
    threshold: 60, 
    color: '#eab308', 
    bgColor: '#fefce8',
    labelKey: 'risk.medium',
    icon: 'shield-alert',
    description: 'Some compliance gaps identified',
  },
  HIGH: { 
    threshold: 80, 
    color: '#f97316', 
    bgColor: '#fff7ed',
    labelKey: 'risk.high',
    icon: 'shield-x',
    description: 'Significant compliance gaps',
  },
  CRITICAL: { 
    threshold: 100, 
    color: '#ef4444', 
    bgColor: '#fef2f2',
    labelKey: 'risk.critical',
    icon: 'shield-off',
    description: 'Critical compliance failures',
  },
} as const;

// ============================================
// CLAUSE TYPES
// ============================================

export const CLAUSE_TYPES = {
  obligation: {
    label: 'Obligation',
    color: '#3b82f6',
    icon: 'clipboard-list',
    description: 'Required actions or duties',
  },
  penalty: {
    label: 'Penalty',
    color: '#ef4444',
    icon: 'gavel',
    description: 'Fines, sanctions, or punishments',
  },
  prohibition: {
    label: 'Prohibition',
    color: '#dc2626',
    icon: 'ban',
    description: 'Actions that are forbidden',
  },
  requirement: {
    label: 'Requirement',
    color: '#f59e0b',
    icon: 'file-check',
    description: 'Conditions that must be met',
  },
  definition: {
    label: 'Definition',
    color: '#8b5cf6',
    icon: 'book-open',
    description: 'Definitions of terms',
  },
  procedure: {
    label: 'Procedure',
    color: '#06b6d4',
    icon: 'list-ordered',
    description: 'Step-by-step processes',
  },
  principle: {
    label: 'Principle',
    color: '#10b981',
    icon: 'scale',
    description: 'Fundamental guiding principles',
  },
  right: {
    label: 'Right',
    color: '#22c55e',
    icon: 'user-check',
    description: 'Rights granted to individuals',
  },
  general: {
    label: 'General',
    color: '#64748b',
    icon: 'file-text',
    description: 'General provisions',
  },
} as const;

// ============================================
// COMPLIANCE STATUS
// ============================================

export const COMPLIANCE_STATUS = {
  compliant: {
    label: 'Compliant',
    color: '#22c55e',
    icon: 'check-circle',
  },
  partially_compliant: {
    label: 'Partially Compliant',
    color: '#eab308',
    icon: 'alert-circle',
  },
  non_compliant: {
    label: 'Non-Compliant',
    color: '#ef4444',
    icon: 'x-circle',
  },
  not_applicable: {
    label: 'Not Applicable',
    color: '#64748b',
    icon: 'minus-circle',
  },
  not_started: {
    label: 'Not Started',
    color: '#94a3b8',
    icon: 'circle',
  },
} as const;

// ============================================
// RESOURCES & URLS
// ============================================

export const REGULATOR_RESOURCES = {
  NDPC: {
    OFFICIAL_WEBSITE: 'https://ndpc.gov.ng',
    NDPA_FULL_TEXT: 'https://ndpc.gov.ng/ndpa-2023',
    GAID_2025: 'https://ndpc.gov.ng/gaid-2025',
    DPCO_DIRECTORY: 'https://ndpc.gov.ng/dpco-directory',
    CAR_FILING: 'https://ndpc.gov.ng/car-filing',
    BREACH_REPORTING: 'https://ndpc.gov.ng/breach-reporting',
    REGISTRATION: 'https://ndpc.gov.ng/registration',
    PRIVACY_TEMPLATE: 'https://ndpc.gov.ng/resources/privacy-template',
    CONSENT_GUIDELINES: 'https://ndpc.gov.ng/guidelines/consent',
    DPO_REQUIREMENTS: 'https://ndpc.gov.ng/dpo-requirements',
    DPIA_TEMPLATE: 'https://ndpc.gov.ng/dpia-template',
  },
  CBN: {
    OFFICIAL_WEBSITE: 'https://www.cbn.gov.ng',
    AML_CFT_GUIDELINES: 'https://www.cbn.gov.ng/aml-cft',
    CONSUMER_PROTECTION: 'https://www.cbn.gov.ng/consumer-protection',
    MOBILE_MONEY_GUIDELINES: 'https://www.cbn.gov.ng/mobile-money',
    PAYMENT_SYSTEM: 'https://www.cbn.gov.ng/paymentsystem',
    LICENSING: 'https://www.cbn.gov.ng/licensing',
  },
  SEC: {
    OFFICIAL_WEBSITE: 'https://sec.gov.ng',
    CROWDFUNDING_RULES: 'https://sec.gov.ng/crowdfunding',
    CAPITAL_MARKET_RULES: 'https://sec.gov.ng/rules',
    REGISTRATION: 'https://sec.gov.ng/registration',
    INVESTOR_EDUCATION: 'https://sec.gov.ng/investor-education',
  },
  NITDA: {
    OFFICIAL_WEBSITE: 'https://nitda.gov.ng',
    DP_FRAMEWORK: 'https://nitda.gov.ng/dp-framework',
    LOCAL_CONTENT: 'https://nitda.gov.ng/local-content',
    ICT_GUIDELINES: 'https://nitda.gov.ng/guidelines',
    REGISTRATION: 'https://nitda.gov.ng/registration',
  },
} as const;

// ============================================
// CHECKLIST DIFFICULTY LEVELS
// ============================================

export const DIFFICULTY_LEVELS = {
  EASY: {
    label: 'Easy',
    color: '#22c55e',
    estimatedDays: '1-3 days',
  },
  MEDIUM: {
    label: 'Medium',
    color: '#eab308',
    estimatedDays: '1-2 weeks',
  },
  HARD: {
    label: 'Hard',
    color: '#f97316',
    estimatedDays: '3-8 weeks',
  },
} as const;

// ============================================
// CHECKLIST PRIORITIES
// ============================================

export const PRIORITIES = {
  critical: {
    label: 'Critical',
    color: '#ef4444',
    deadline: 'Immediate (14 days)',
    icon: 'alert-triangle',
  },
  high: {
    label: 'High',
    color: '#f97316',
    deadline: '30 days',
    icon: 'arrow-up-circle',
  },
  medium: {
    label: 'Medium',
    color: '#eab308',
    deadline: '90 days',
    icon: 'minus-circle',
  },
  low: {
    label: 'Low',
    color: '#22c55e',
    deadline: '180 days',
    icon: 'arrow-down-circle',
  },
} as const;

// ============================================
// LANGUAGE SUPPORT
// ============================================

export const LANGUAGES = {
  en: {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    flag: '🇬🇧',
    direction: 'ltr',
  },
  ha: {
    code: 'ha',
    name: 'Hausa',
    nativeName: 'Hausa',
    flag: '🇳🇬',
    direction: 'ltr',
  },
  ig: {
    code: 'ig',
    name: 'Igbo',
    nativeName: 'Igbo',
    flag: '🇳🇬',
    direction: 'ltr',
  },
  yo: {
    code: 'yo',
    name: 'Yoruba',
    nativeName: 'Yorùbá',
    flag: '🇳🇬',
    direction: 'ltr',
  },
} as const;

export type LanguageKey = keyof typeof LANGUAGES;

// ============================================
// NOTIFICATION TYPES
// ============================================

export const NOTIFICATION_TYPES = {
  email: {
    label: 'Email',
    icon: 'mail',
  },
  sms: {
    label: 'SMS',
    icon: 'message-square',
  },
  push: {
    label: 'Push Notification',
    icon: 'bell',
  },
  in_app: {
    label: 'In-App',
    icon: 'smartphone',
  },
} as const;

// ============================================
// ALERT FREQUENCIES
// ============================================

export const ALERT_FREQUENCIES = {
  realtime: {
    label: 'Real-time',
    description: 'Get alerts immediately',
  },
  daily: {
    label: 'Daily Digest',
    description: 'Summary once per day',
  },
  weekly: {
    label: 'Weekly Digest',
    description: 'Summary once per week',
  },
  monthly: {
    label: 'Monthly Report',
    description: 'Monthly compliance report',
  },
} as const;

// ============================================
// COMPANY SIZES
// ============================================

export const COMPANY_SIZES = {
  solo: {
    label: 'Solo Founder',
    employees: '1',
    dataSubjects: '< 100',
  },
  micro: {
    label: 'Micro (2-10)',
    employees: '2-10',
    dataSubjects: '100-1,000',
  },
  small: {
    label: 'Small (11-50)',
    employees: '11-50',
    dataSubjects: '1,000-5,000',
  },
  medium: {
    label: 'Medium (51-200)',
    employees: '51-200',
    dataSubjects: '5,000-20,000',
  },
  large: {
    label: 'Large (200+)',
    employees: '200+',
    dataSubjects: '20,000+',
  },
} as const;

// ============================================
// SCAN TYPES
// ============================================

export const SCAN_TYPES = {
  quick: {
    label: 'Quick Scan',
    duration: '2 minutes',
    questions: 10,
    frameworks: ['NDPA'],
  },
  full: {
    label: 'Full Compliance Scan',
    duration: '5-10 minutes',
    questions: 20,
    frameworks: ['NDPA', 'CBN-AML', 'SEC-CF', 'NITDA-DP'],
  },
  targeted: {
    label: 'Targeted Framework',
    duration: '3-5 minutes',
    questions: 15,
    frameworks: [], // User selects
  },
} as const;

// ============================================
// REPORT FORMATS
// ============================================

export const REPORT_FORMATS = {
  txt: {
    label: 'Plain Text',
    extension: '.txt',
    contentType: 'text/plain',
  },
  html: {
    label: 'HTML',
    extension: '.html',
    contentType: 'text/html',
  },
  md: {
    label: 'Markdown',
    extension: '.md',
    contentType: 'text/markdown',
  },
  json: {
    label: 'JSON',
    extension: '.json',
    contentType: 'application/json',
  },
} as const;

// ============================================
// OLD NDPC RESOURCES (Backward compatibility)
// ============================================

/** @deprecated Use REGULATOR_RESOURCES.NDPC instead */
export const NDPC_RESOURCES = REGULATOR_RESOURCES.NDPC;

/** @deprecated Use AI_CONFIG.OPENAI instead */
export const AZURE_FUNCTION_URL = ''; // No longer using Azure

// ============================================
// TYPE EXPORTS
// ============================================

export type RiskLevel = keyof typeof RISK_LEVELS;
export type DCPMITier = keyof typeof DCPMI_TIERS;
export type ComplianceStatus = keyof typeof COMPLIANCE_STATUS;
export type ClauseType = keyof typeof CLAUSE_TYPES;
export type Priority = keyof typeof PRIORITIES;
export type Difficulty = keyof typeof DIFFICULTY_LEVELS;
export type ScanType = keyof typeof SCAN_TYPES;
export type ReportFormat = keyof typeof REPORT_FORMATS;