// src/types/index.ts
// Multi-framework type definitions for RegTrack

// ============================================
// RISK SCAN TYPES
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
  // Multi-framework additions
  processesFinancialData?: boolean;
  hasAMLPolicy?: boolean;
  registeredWithCBN?: boolean;
  hasInvestorProtection?: boolean;
  usesCrowdfunding?: boolean;
  hasITSecurityPolicy?: boolean;
  annualRevenue?: number;
  employeeCount?: number;
}

export interface RiskScanResult {
  risk_score: number;
  risk_level: 'Low' | 'Medium' | 'High' | 'Critical';
  triggered_sections: string[];
  triggered_frameworks: string[];
  framework_breakdown?: FrameworkBreakdown[];
  explanation: string;
  recommendation: string;
  top_recommendations?: string[];
  dcpm_tier?: 'UHL' | 'EHL' | 'OHL' | null;
  compliance_checklist: ChecklistItem[];
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

// ============================================
// CHECKLIST TYPES
// ============================================

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
  frameworkName?: string;
  clauseType?: string;
}

export interface ResourceLink {
  name: string;
  url: string;
  type?: 'official' | 'template' | 'guide' | 'tool';
  isFree?: boolean;
}

// ============================================
// SEARCH TYPES
// ============================================

export interface SearchResult {
  section_id: string;
  title: string;
  content: string;
  relevance: number;
  language: string;
  framework_name?: string;
  clause_type?: string;
  regulator?: string;
}

export interface SearchRequest {
  query: string;
  language?: Language;
  frameworks?: string[];
  sectors?: string[];
  clauseTypes?: string[];
  limit?: number;
  threshold?: number;
}

// ============================================
// LANGUAGE TYPES
// ============================================

export type Language = 'en' | 'ha' | 'ig' | 'yo';

// ============================================
// COMPLIANCE ASSESSMENT TYPES
// ============================================

export interface ComplianceAssessment {
  id: string;
  appName: string;
  sector: string;
  riskScore: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  framework: string;
  assessmentDate: string;
  triggeredClausesCount: number;
  triggeredClauseIds?: string[];
  triggeredFrameworks?: string[];
  remediationCompleted: number;
  remediationTotal: number;
  status: 'compliant' | 'at_risk' | 'high_risk';
  answers?: Record<string, boolean | null>;
  dcpmTier?: string | null;
}

// ============================================
// REGULATOR / SECTOR TYPES
// ============================================

export interface SectorStats {
  name: string;
  totalEntities: number;
  avgRiskScore: number;
  compliant: number;
  atRisk: number;
  highRisk: number;
}

export interface FrameworkStats {
  name: string;
  totalAssessments: number;
  avgRiskScore: number;
  triggeredCount: number;
}

export interface DashboardSummary {
  totalEntities: number;
  compliantCount: number;
  atRiskCount: number;
  highRiskCount: number;
  avgRiskScore: number;
  pendingCARFilings: number;
  frameworksMonitored: number;
  regulatorsTracked: number;
  lastUpdated: string;
  frameworkBreakdown: FrameworkStats[];
  sectorBreakdown: SectorStats[];
}

// ============================================
// EVIDENCE TYPES
// ============================================

export interface EvidenceData {
  fileName: string;
  fileUrl: string;
  uploadDate: string;
  fileSize: number;
  fileType: string;
}

// ============================================
// REMEDIATION TYPES
// ============================================

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