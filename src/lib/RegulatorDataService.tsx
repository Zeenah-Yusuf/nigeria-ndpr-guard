// src/lib/RegulatorDataService.tsx
// Multi-framework compliance data service
// Supports: NDPA, CBN-AML, CBN-CP, SEC-CF, NITDA-DP

import { supabase } from './SupabaseClient';

// ============================================
// TYPES
// ============================================

export interface ComplianceAssessment {
  id: string;
  appName: string;
  sector: string;
  riskScore: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  framework: string; // Now supports all frameworks: 'NDPA', 'CBN-AML', 'SEC-CF', 'NITDA-DP', etc.
  assessmentDate: string;
  triggeredClausesCount: number;
  remediationCompleted: number;
  remediationTotal: number;
  status: 'compliant' | 'at_risk' | 'high_risk';
  answers?: Record<string, boolean | null>;
  triggeredClauseIds?: string[];
  triggeredFrameworks?: string[];
  dcpmTier?: string | null;
}

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
// CONSTANTS
// ============================================

const ALL_FRAMEWORKS = ['NDPA', 'CBN-AML', 'CBN-CP', 'CBN-MMO', 'SEC-CF', 'SEC-CONDUCT', 'NITDA-DP', 'NITDA-LC'];
const ALL_REGULATORS = ['NDPC', 'CBN', 'SEC', 'NITDA'];

// ============================================
// SERVICE CLASS
// ============================================

class RegulatorDataService {
  private storageKey = 'regulator_assessments_v2';
  private listeners: (() => void)[] = [];

  // Get all assessments
  getAssessments(): ComplianceAssessment[] {
    try {
      const saved = localStorage.getItem(this.storageKey);
      const assessments: ComplianceAssessment[] = saved ? JSON.parse(saved) : [];
      
      // Migrate old data
      return assessments.map(a => ({
        ...a,
        framework: a.framework || 'NDPA',
        triggeredFrameworks: a.triggeredFrameworks || [a.framework || 'NDPA'],
        remediationCompleted: a.remediationCompleted || 0,
        remediationTotal: a.remediationTotal || 0,
        status: a.status || this.calculateStatus(a.riskScore),
        dcpmTier: a.dcpmTier || null,
      }));
    } catch {
      return [];
    }
  }

  // Calculate status based on risk score
  private calculateStatus(riskScore: number): 'compliant' | 'at_risk' | 'high_risk' {
    if (riskScore <= 30) return 'compliant';
    if (riskScore <= 60) return 'at_risk';
    return 'high_risk';
  }

  // Add a new assessment
  addAssessment(assessment: Omit<ComplianceAssessment, 'id'>): ComplianceAssessment {
    const assessments = this.getAssessments();
    const newAssessment: ComplianceAssessment = {
      ...assessment,
      id: `regtrack_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      assessmentDate: new Date().toISOString(),
      status: this.calculateStatus(assessment.riskScore),
    };
    
    assessments.unshift(newAssessment);
    localStorage.setItem(this.storageKey, JSON.stringify(assessments.slice(0, 100))); // Keep last 100
    this.notifyListeners();
    
    return newAssessment;
  }

  // Update an existing assessment
  updateAssessment(id: string, updates: Partial<ComplianceAssessment>): void {
    const assessments = this.getAssessments();
    const index = assessments.findIndex(a => a.id === id);
    if (index !== -1) {
      assessments[index] = {
        ...assessments[index],
        ...updates,
        status: updates.riskScore !== undefined
          ? this.calculateStatus(updates.riskScore)
          : assessments[index].status,
      };
      localStorage.setItem(this.storageKey, JSON.stringify(assessments));
      this.notifyListeners();
    }
  }

  // Delete an assessment
  deleteAssessment(id: string): void {
    const assessments = this.getAssessments();
    const filtered = assessments.filter(a => a.id !== id);
    localStorage.setItem(this.storageKey, JSON.stringify(filtered));
    this.notifyListeners();
  }

  // Clear all assessments
  clearAllAssessments(): void {
    localStorage.removeItem(this.storageKey);
    this.notifyListeners();
  }

  // Get a single assessment by ID
  getAssessmentById(id: string): ComplianceAssessment | undefined {
    return this.getAssessments().find(a => a.id === id);
  }

  // Get assessments by framework
  getAssessmentsByFramework(framework: string): ComplianceAssessment[] {
    return this.getAssessments().filter(a =>
      a.framework === framework || a.triggeredFrameworks?.includes(framework)
    );
  }

  // Get assessments by sector
  getAssessmentsBySector(sector: string): ComplianceAssessment[] {
    return this.getAssessments().filter(a => a.sector === sector);
  }

  // Get sector statistics
  getSectorStats(): SectorStats[] {
    const assessments = this.getAssessments();
    const sectorMap = new Map<string, SectorStats>();
    
    assessments.forEach(a => {
      const sector = a.sector || 'other';
      const current = sectorMap.get(sector) || {
        name: sector,
        totalEntities: 0,
        avgRiskScore: 0,
        compliant: 0,
        atRisk: 0,
        highRisk: 0,
      };
      
      current.totalEntities++;
      if (a.status === 'compliant') current.compliant++;
      else if (a.status === 'at_risk') current.atRisk++;
      else current.highRisk++;
      
      const totalScore = current.avgRiskScore * (current.totalEntities - 1) + a.riskScore;
      current.avgRiskScore = Math.round(totalScore / current.totalEntities);
      
      sectorMap.set(sector, current);
    });
    
    return Array.from(sectorMap.values()).sort((a, b) => b.totalEntities - a.totalEntities);
  }

  // Get framework statistics
  getFrameworkStats(): FrameworkStats[] {
    const assessments = this.getAssessments();
    const frameworkMap = new Map<string, FrameworkStats>();
    
    assessments.forEach(a => {
      const frameworks = a.triggeredFrameworks || [a.framework || 'NDPA'];
      frameworks.forEach(fw => {
        const current = frameworkMap.get(fw) || {
          name: fw,
          totalAssessments: 0,
          avgRiskScore: 0,
          triggeredCount: 0,
        };
        
        current.totalAssessments++;
        current.triggeredCount++;
        
        const totalScore = current.avgRiskScore * (current.totalAssessments - 1) + a.riskScore;
        current.avgRiskScore = Math.round(totalScore / current.totalAssessments);
        
        frameworkMap.set(fw, current);
      });
    });
    
    return Array.from(frameworkMap.values()).sort((a, b) => b.totalAssessments - a.totalAssessments);
  }

  // Get dashboard summary
  getDashboardSummary(): DashboardSummary {
    const assessments = this.getAssessments();
    const totalEntities = assessments.length;
    const compliantCount = assessments.filter(a => a.status === 'compliant').length;
    const atRiskCount = assessments.filter(a => a.status === 'at_risk').length;
    const highRiskCount = assessments.filter(a => a.status === 'high_risk').length;
    const avgRiskScore = totalEntities > 0
      ? Math.round(assessments.reduce((sum, a) => sum + a.riskScore, 0) / totalEntities)
      : 0;

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const pendingCARFilings = assessments.filter(a =>
      new Date(a.assessmentDate) > thirtyDaysAgo && a.riskScore > 40
    ).length;

    // Count unique frameworks and regulators
    const allFrameworks = new Set<string>();
    assessments.forEach(a => {
      (a.triggeredFrameworks || [a.framework]).forEach(fw => allFrameworks.add(fw));
    });

    return {
      totalEntities,
      compliantCount,
      atRiskCount,
      highRiskCount,
      avgRiskScore,
      pendingCARFilings,
      frameworksMonitored: allFrameworks.size || ALL_FRAMEWORKS.length,
      regulatorsTracked: ALL_REGULATORS.length,
      lastUpdated: new Date().toLocaleDateString('en-NG', {
        year: 'numeric', month: 'long', day: 'numeric',
      }),
      frameworkBreakdown: this.getFrameworkStats(),
      sectorBreakdown: this.getSectorStats(),
    };
  }

  // Get recent assessments
  getRecentAssessments(limit: number = 10): ComplianceAssessment[] {
    return this.getAssessments().slice(0, limit);
  }

  // Get high risk assessments
  getHighRiskAssessments(): ComplianceAssessment[] {
    return this.getAssessments().filter(a => a.status === 'high_risk');
  }

  // Export data
  exportData(): string {
    return JSON.stringify({
      assessments: this.getAssessments(),
      sectorStats: this.getSectorStats(),
      frameworkStats: this.getFrameworkStats(),
      summary: this.getDashboardSummary(),
      exportDate: new Date().toISOString(),
      version: '2.0.0',
      frameworks: ALL_FRAMEWORKS,
    }, null, 2);
  }

  // Import data
  importData(jsonString: string): boolean {
    try {
      const data = JSON.parse(jsonString);
      if (data.assessments && Array.isArray(data.assessments)) {
        localStorage.setItem(this.storageKey, JSON.stringify(data.assessments));
        this.notifyListeners();
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }

  // Subscribe to changes
  subscribe(listener: () => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notifyListeners(): void {
    this.listeners.forEach(listener => listener());
  }
}

export const regulatorDataService = new RegulatorDataService();

// ============================================
// COMPATIBILITY EXPORTS
// ============================================

/** @deprecated Use `getAssessmentsByFramework` instead */
export const getAssessmentsByFramework = (fw: string) =>
  regulatorDataService.getAssessmentsByFramework(fw);

/** @deprecated Use `getAssessmentsBySector` instead */
export const getAssessmentsBySector = (sector: string) =>
  regulatorDataService.getAssessmentsBySector(sector);