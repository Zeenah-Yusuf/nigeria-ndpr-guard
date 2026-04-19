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
}

export interface RiskScanResult {
  risk_score: number;
  risk_level: 'Low' | 'Medium' | 'High';
  triggered_sections: string[];
  explanation: string;
  recommendation: string;
  dcpm_tier?: 'UHL' | 'EHL' | 'OHL' | null;
  compliance_checklist: ChecklistItem[];
}

export interface ChecklistItem {
  id: string;
  title: string;
  description: string;
  priority: 'critical' | 'high' | 'medium';
  difficulty: 'Easy' | 'Medium' | 'Hard';
  timeEstimate: string;
  resourceLinks: ResourceLink[];
  completed: boolean;
  sectionRef: string;
}

export interface ResourceLink {
  name: string;
  url: string;
}

export interface SearchResult {
  section_id: string;
  title: string;
  content: string;
  relevance: number;
  language: string;
}

export type Language = 'en' | 'ha' | 'ig' | 'yo';