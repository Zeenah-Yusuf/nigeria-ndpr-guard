// src/hooks/useRegulatorData.ts
// Multi-framework regulator data hook
// Supports: NDPA, CBN-AML, CBN-CP, SEC-CF, NITDA-DP

import { useState, useEffect, useCallback } from "react";
import { 
  regulatorDataService, 
  ComplianceAssessment, 
  SectorStats, 
  DashboardSummary,
  FrameworkStats,
} from "@/lib/RegulatorDataService";

interface UseRegulatorDataReturn {
  // Data
  assessments: ComplianceAssessment[];
  sectorStats: SectorStats[];
  frameworkStats: FrameworkStats[];
  summary: DashboardSummary;
  loading: boolean;
  error: string | null;
  
  // Statistics
  totalEntities: number;
  compliantCount: number;
  atRiskCount: number;
  highRiskCount: number;
  avgRiskScore: number;
  pendingCAR: number;
  
  // Actions
  addAssessment: (assessment: Omit<ComplianceAssessment, "id">) => ComplianceAssessment;
  updateAssessment: (id: string, updates: Partial<ComplianceAssessment>) => void;
  deleteAssessment: (id: string) => void;
  clearAll: () => void;
  refreshData: () => void;
  getAssessmentById: (id: string) => ComplianceAssessment | undefined;
  getAssessmentsByFramework: (framework: string) => ComplianceAssessment[];
  getAssessmentsBySector: (sector: string) => ComplianceAssessment[];
  getHighRiskAssessments: () => ComplianceAssessment[];
  getRecentAssessments: (limit?: number) => ComplianceAssessment[];
  exportData: () => string;
  importData: (jsonString: string) => boolean;
}

export function useRegulatorData(): UseRegulatorDataReturn {
  const [assessments, setAssessments] = useState<ComplianceAssessment[]>([]);
  const [sectorStats, setSectorStats] = useState<SectorStats[]>([]);
  const [frameworkStats, setFrameworkStats] = useState<FrameworkStats[]>([]);
  const [summary, setSummary] = useState<DashboardSummary>({
    totalEntities: 0,
    compliantCount: 0,
    atRiskCount: 0,
    highRiskCount: 0,
    avgRiskScore: 0,
    pendingCARFilings: 0,
    frameworksMonitored: 4,
    regulatorsTracked: 4,
    lastUpdated: new Date().toLocaleDateString('en-NG'),
    frameworkBreakdown: [],
    sectorBreakdown: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Refresh all data
  const refreshData = useCallback(() => {
    try {
      const allAssessments = regulatorDataService.getAssessments();
      setAssessments(allAssessments);
      setSectorStats(regulatorDataService.getSectorStats());
      setFrameworkStats(regulatorDataService.getFrameworkStats());
      setSummary(regulatorDataService.getDashboardSummary());
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load regulator data");
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial load and subscribe to changes
  useEffect(() => {
    refreshData();
    const unsubscribe = regulatorDataService.subscribe(refreshData);
    return unsubscribe;
  }, [refreshData]);

  // Computed statistics
  const totalEntities = assessments.length;
  const compliantCount = assessments.filter(a => a.status === "compliant").length;
  const atRiskCount = assessments.filter(a => a.status === "at_risk").length;
  const highRiskCount = assessments.filter(a => a.status === "high_risk").length;
  const avgRiskScore = totalEntities > 0 
    ? Math.round(assessments.reduce((sum, a) => sum + a.riskScore, 0) / totalEntities)
    : 0;
  const pendingCAR = summary.pendingCARFilings;

  // Actions
  const addAssessment = useCallback((assessment: Omit<ComplianceAssessment, "id">) => {
    const newAssessment = regulatorDataService.addAssessment(assessment);
    return newAssessment;
  }, []);

  const updateAssessment = useCallback((id: string, updates: Partial<ComplianceAssessment>) => {
    regulatorDataService.updateAssessment(id, updates);
  }, []);

  const deleteAssessment = useCallback((id: string) => {
    if (confirm("Are you sure you want to delete this assessment?")) {
      regulatorDataService.deleteAssessment(id);
    }
  }, []);

  const clearAll = useCallback(() => {
    if (confirm("⚠️ WARNING: This will delete ALL assessment data. This action cannot be undone. Are you sure?")) {
      regulatorDataService.clearAllAssessments();
    }
  }, []);

  const getAssessmentById = useCallback((id: string) => {
    return regulatorDataService.getAssessmentById(id);
  }, []);

  const getAssessmentsByFramework = useCallback((framework: string) => {
    return regulatorDataService.getAssessmentsByFramework(framework);
  }, []);

  const getAssessmentsBySector = useCallback((sector: string) => {
    return regulatorDataService.getAssessmentsBySector(sector);
  }, []);

  const getHighRiskAssessments = useCallback(() => {
    return regulatorDataService.getHighRiskAssessments();
  }, []);

  const getRecentAssessments = useCallback((limit: number = 10) => {
    return regulatorDataService.getRecentAssessments(limit);
  }, []);

  const exportData = useCallback(() => {
    return regulatorDataService.exportData();
  }, []);

  const importData = useCallback((jsonString: string) => {
    const success = regulatorDataService.importData(jsonString);
    if (success) refreshData();
    return success;
  }, [refreshData]);

  return {
    assessments,
    sectorStats,
    frameworkStats,
    summary,
    loading,
    error,
    totalEntities,
    compliantCount,
    atRiskCount,
    highRiskCount,
    avgRiskScore,
    pendingCAR,
    addAssessment,
    updateAssessment,
    deleteAssessment,
    clearAll,
    refreshData,
    getAssessmentById,
    getAssessmentsByFramework,
    getAssessmentsBySector,
    getHighRiskAssessments,
    getRecentAssessments,
    exportData,
    importData,
  };
}