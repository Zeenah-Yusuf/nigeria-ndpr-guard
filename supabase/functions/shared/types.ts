// supabase/functions/shared/types.ts
// Shared TypeScript types for all Supabase Edge Functions
// Works with: openai-client, huggingface-client, ai-service, cors handler

// ============================================
// CORE REGULATORY TYPES
// ============================================

export interface Regulator {
  id: string;
  name: string;
  acronym: string;
  full_name?: string;
  website_url?: string;
  rss_feed_url?: string;
  logo_url?: string;
  category: 'financial' | 'data_protection' | 'health' | 'technology' | 'general' | 'securities';
  establishment_act?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Sector {
  id: string;
  name: string;
  slug: string;
  description?: string;
  risk_level: number; // 1-10
  created_at: string;
}

export interface Regulation {
  id: string;
  regulator_id: string;
  title: string;
  short_title?: string;
  document_type: 'act' | 'regulation' | 'guideline' | 'circular' | 'framework' | 'notice' | 'amendment' | 'directive' | 'code' | 'policy';
  framework_name?: string; // NDPA, CBN-AML, SEC-CROWDFUNDING, etc.
  version: string;
  effective_date?: string;
  publication_date?: string;
  source_url?: string;
  file_hash?: string;
  status: 'active' | 'amended' | 'repealed' | 'draft' | 'suspended';
  metadata?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface RegulatoryClause {
  id: string;
  regulation_id: string;
  clause_number: string;
  title?: string;
  content: string;
  content_embedding?: number[];
  clause_type: 'obligation' | 'penalty' | 'definition' | 'procedure' | 'exception' | 'amendment' | 'general' | 'principle' | 'requirement' | 'prohibition' | 'right';
  keywords: string[];
  affected_sectors: string[];
  parent_clause_id?: string;
  framework_name?: string;
  version: number;
  is_current: boolean;
  metadata?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface ClauseVersion {
  id: string;
  clause_id: string;
  version: number;
  content: string;
  change_description?: string;
  change_type: 'added' | 'modified' | 'repealed' | 'renumbered';
  detected_by: string;
  detected_at: string;
}

// ============================================
// USER & PROFILE TYPES
// ============================================

export interface UserProfile {
  id: string; // References auth.users
  company_name?: string;
  company_size?: 'solo' | 'micro' | 'small' | 'medium' | 'large';
  website_url?: string;
  phone_number?: string;
  created_at: string;
  updated_at: string;
}

export interface UserSector {
  user_id: string;
  sector_id: string;
  created_at: string;
}

export interface NotificationPreference {
  user_id: string;
  email_alerts: boolean;
  sms_alerts: boolean;
  push_alerts: boolean;
  alert_frequency: 'realtime' | 'daily' | 'weekly';
  minimum_relevance_score: number;
  sectors_of_interest: string[];
}

// ============================================
// COMPLIANCE SCAN TYPES
// ============================================

export interface RiskScanAnswers {
  collectsData: boolean;
  sensitiveData: boolean;
  hasPrivacyPolicy: boolean;
  crossBorderTransfer: boolean;
  hasConsentMechanism: boolean;
  targetsChildren: boolean;
  thirdPartySharing: boolean;
  hasBreachProcess: boolean;
  registeredWithNDPC: boolean;
  usesAI: boolean;
  sector?: string;
  dataSubjectCount?: number;
  // Additional fields for multi-framework support
  processesFinancialData?: boolean;
  hasAMLPolicy?: boolean;
  registeredWithCBN?: boolean;
  hasInvestorProtection?: boolean;
  usesCrowdfunding?: boolean;
  hasITSecurityPolicy?: boolean;
  annualRevenue?: number;
  employeeCount?: number;
}

export interface ComplianceScanRequest {
  userId: string;
  sectorId: string;
  scanType: 'full' | 'quick' | 'targeted' | 'risk_assessment';
  companyInfo?: {
    name: string;
    size: string;
    description: string;
    website?: string;
    registrationNumber?: string;
  };
  answers?: RiskScanAnswers;
  frameworkFilter?: string[]; // Specific frameworks to check (e.g., ['NDPA', 'CBN-AML'])
}

export interface RiskScanResult {
  scan_id?: string;
  risk_score: number;
  risk_level: 'Low' | 'Medium' | 'High' | 'Critical';
  triggered_sections: string[];
  triggered_frameworks: string[];
  explanation: string;
  recommendation: string;
  dcpm_tier?: 'UHL' | 'EHL' | 'OHL' | null;
  compliance_checklist: ChecklistItem[];
  framework_breakdown?: FrameworkBreakdown[];
  generated_at: string;
}

export interface FrameworkBreakdown {
  framework_name: string;
  risk_score: number;
  risk_level: string;
  applicable_clauses: number;
  compliant_clauses: number;
  non_compliant_clauses: number;
}

export interface ChecklistItem {
  id: string;
  title: string;
  description: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  difficulty: 'Easy' | 'Medium' | 'Hard';
  timeEstimate: string;
  resourceLinks: ResourceLink[];
  completed: boolean;
  sectionRef: string;
  frameworkName: string;
  clauseType: string;
}

export interface ResourceLink {
  name: string;
  url: string;
  type?: 'official' | 'template' | 'guide' | 'tool';
  isFree?: boolean;
}

// ============================================
// COMPLIANCE STATUS TYPES
// ============================================

export interface UserComplianceStatus {
  id: string;
  user_id: string;
  clause_id: string;
  status: 'compliant' | 'partially_compliant' | 'non_compliant' | 'not_applicable' | 'not_started';
  evidence?: string;
  notes?: string;
  last_reviewed_at: string;
  created_at: string;
  updated_at: string;
}

export interface ComplianceScan {
  id: string;
  user_id: string;
  sector_id: string;
  scan_type: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  results: Record<string, any>;
  risk_score: number;
  started_at: string;
  completed_at?: string;
  created_at: string;
}

// ============================================
// MONITORING & ALERTS TYPES
// ============================================

export interface RegulatoryUpdate {
  id: string;
  regulator_id: string;
  title: string;
  content?: string;
  summary?: string;
  source_url: string;
  source_type: 'rss' | 'scraping' | 'manual' | 'api';
  published_at: string;
  detected_at: string;
  processed: boolean;
  relevance_score: number;
  affected_sectors: string[];
  affected_frameworks?: string[];
  metadata?: Record<string, any>;
  created_at: string;
}

export interface Alert {
  id: string;
  user_id: string;
  update_id: string;
  title: string;
  summary: string;
  relevance_score: number;
  action_required: boolean;
  is_read: boolean;
  read_at?: string;
  notification_sent: boolean;
  notification_type: 'email' | 'sms' | 'push' | 'in_app';
  created_at: string;
}

export interface AlertPreference {
  userId: string;
  emailAlerts: boolean;
  smsAlerts: boolean;
  pushAlerts: boolean;
  alertFrequency: 'realtime' | 'daily' | 'weekly' | 'monthly';
  minimumRelevanceScore: number; // 0-1
  sectorsOfInterest: string[];
  frameworksOfInterest: string[];
}

// ============================================
// SEARCH TYPES
// ============================================

export interface SearchResult {
  section_id: string;
  title: string;
  content: string;
  relevance: number;
  language: Language;
  framework_name?: string;
  clause_type?: string;
  regulator?: string;
}

export interface SearchRequest {
  query: string;
  language?: Language;
  frameworks?: string[]; // Filter by framework
  sectors?: string[]; // Filter by sector
  clauseTypes?: string[]; // Filter by clause type
  limit?: number;
  threshold?: number; // Minimum relevance score
}

export type Language = 'en' | 'ha' | 'ig' | 'yo';

// ============================================
// AI SERVICE TYPES
// ============================================

export interface EmbeddingResult {
  embedding: number[];
  model: string;
  dimensions: number;
}

export interface ClassificationResult {
  clause_type: string;
  confidence: number;
  keywords: string[];
  sectors: string[];
  summary: string;
}

export interface ComplianceCheckResult {
  isCompliant: boolean;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  missingRequirements: string[];
  recommendations: string[];
  relevantClauses: string[];
  confidence: number;
}

export interface AIQuestionAnswer {
  question: string;
  answer: string;
  confidence: number;
  sourceClauses: string[];
  generatedAt: string;
}

export interface AIEntityExtraction {
  organizations: string[];
  dates: string[];
  amounts: string[];
  references: string[];
  penalties: string[];
}

// ============================================
// REPORT TYPES
// ============================================

export interface ComplianceReport {
  reportId: string;
  userId: string;
  generatedAt: string;
  companyInfo: {
    name: string;
    sector: string;
    size: string;
  };
  overallRiskLevel: 'low' | 'medium' | 'high' | 'critical';
  overallRiskScore: number;
  frameworkBreakdown: FrameworkBreakdown[];
  findings: ComplianceFinding[];
  recommendations: string[];
  nextSteps: string[];
  executiveSummary: string;
}

export interface ComplianceFinding {
  id: string;
  clauseReference: string;
  frameworkName: string;
  title: string;
  status: 'compliant' | 'partially_compliant' | 'non_compliant' | 'not_applicable';
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  impact: string;
  recommendation: string;
  deadline?: string;
  estimatedEffort: string;
  estimatedCost: 'low' | 'medium' | 'high';
}

// ============================================
// API REQUEST/RESPONSE TYPES
// ============================================

export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    type: string;
    message: string;
    details?: any;
    timestamp: string;
  };
  meta?: {
    service_used?: string;
    fallback_triggered?: boolean;
    timestamp: string;
    processing_time?: number;
  };
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface APIError {
  type: 'validation_error' | 'authentication_error' | 'authorization_error' | 'not_found' | 'rate_limit' | 'ai_service_error' | 'database_error' | 'internal_error';
  message: string;
  details?: any;
  timestamp: string;
  retryAfter?: number;
}

// ============================================
// FUNCTION-SPECIFIC REQUEST TYPES
// ============================================

export interface GenerateReportRequest {
  userId: string;
  scanId: string;
  format?: 'pdf' | 'json' | 'html';
  language?: Language;
  includeRecommendations?: boolean;
}

export interface MonitorRegulatorsRequest {
  regulators?: string[]; // Specific regulators to check
  forceCheck?: boolean; // Force check ignoring last_checked_at
}

export interface ParseDocumentRequest {
  documentUrl: string;
  regulatorId: string;
  documentType?: string;
  autoClassify?: boolean;
}

export interface GenerateAlertsRequest {
  userId?: string; // If not provided, generates for all users
  since?: string; // Only check updates after this date
}

// ============================================
// DATABASE QUERY TYPES
// ============================================

export interface ClauseQuery {
  frameworks?: string[];
  sectors?: string[];
  clauseTypes?: string[];
  keywords?: string[];
  searchTerm?: string;
  isCurrent?: boolean;
  limit?: number;
  offset?: number;
  orderBy?: string;
}

export interface UpdateQuery {
  regulators?: string[];
  sectors?: string[];
  frameworks?: string[];
  since?: string;
  processed?: boolean;
  minRelevance?: number;
}

// ============================================
// CONFIGURATION TYPES
// ============================================

export interface AppConfig {
  ai: {
    primaryService: 'openai' | 'huggingface';
    openaiModel: string;
    embeddingDimensions: number;
    maxRetries: number;
    fallbackEnabled: boolean;
  };
  monitoring: {
    checkInterval: string; // Cron expression
    sources: string[];
    maxConcurrentChecks: number;
  };
  alerts: {
    defaultFrequency: string;
    maxAlertsPerDay: number;
    digestTime: string; // Time to send daily digest
  };
}

// ============================================
// ANALYTICS TYPES
// ============================================

export interface AnalyticsEvent {
  eventType: string;
  userId?: string;
  timestamp: string;
  data: Record<string, any>;
  source: string;
}

export interface UsageMetrics {
  totalScans: number;
  totalReports: number;
  totalAlerts: number;
  activeUsers: number;
  popularFrameworks: { framework: string; count: number }[];
  popularSectors: { sector: string; count: number }[];
  averageRiskScore: number;
  period: {
    start: string;
    end: string;
  };
}

// ============================================
// HEALTH CHECK TYPES
// ============================================

export interface HealthCheckResult {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: string;
  services: {
    database: boolean;
    openai: boolean;
    huggingface: boolean;
    monitoring: boolean;
    alerts: boolean;
  };
  metrics?: {
    responseTime: number;
    uptime: number;
    errorRate: number;
  };
}

// ============================================
// TYPE GUARDS (Runtime type checking)
// ============================================

export function isRiskScanAnswers(obj: any): obj is RiskScanAnswers {
  return (
    typeof obj === 'object' &&
    typeof obj.collectsData === 'boolean' &&
    typeof obj.sensitiveData === 'boolean' &&
    typeof obj.hasPrivacyPolicy === 'boolean'
  );
}

export function isValidLanguage(lang: string): lang is Language {
  return ['en', 'ha', 'ig', 'yo'].includes(lang);
}

export function isValidRiskLevel(level: string): level is 'Low' | 'Medium' | 'High' | 'Critical' {
  return ['Low', 'Medium', 'High', 'Critical'].includes(level);
}

export function isValidClauseType(type: string): boolean {
  return [
    'obligation', 'penalty', 'definition', 'procedure',
    'exception', 'amendment', 'general', 'principle',
    'requirement', 'prohibition', 'right'
  ].includes(type);
}

export function isValidFramework(framework: string): boolean {
  const validFrameworks = [
    'NDPA', 'CBN-AML', 'CBN-MMO', 'CBN-CONSUMER',
    'SEC-CROWDFUNDING', 'SEC-CONDUCT',
    'NITDA-NDPR', 'NITDA-CONTENT'
  ];
  return validFrameworks.includes(framework);
}

// ============================================
// DEFAULT VALUES
// ============================================

export const DEFAULT_RISK_SCAN_ANSWERS: RiskScanAnswers = {
  collectsData: false,
  sensitiveData: false,
  hasPrivacyPolicy: false,
  crossBorderTransfer: false,
  hasConsentMechanism: false,
  targetsChildren: false,
  thirdPartySharing: false,
  hasBreachProcess: false,
  registeredWithNDPC: false,
  usesAI: false,
};

export const DEFAULT_SEARCH_REQUEST: SearchRequest = {
  query: '',
  language: 'en',
  limit: 10,
  threshold: 0.5,
};

export const DEFAULT_ALERT_PREFERENCE: AlertPreference = {
  userId: '',
  emailAlerts: true,
  smsAlerts: false,
  pushAlerts: true,
  alertFrequency: 'realtime',
  minimumRelevanceScore: 0.6,
  sectorsOfInterest: [],
  frameworksOfInterest: [],
};