import { useState, useEffect, useCallback, useRef } from "react";
import { supabase } from "@/lib/SupabaseClient";
import { 
  regulatorDataService, 
  ComplianceAssessment, 
  SectorStats, 
  DashboardSummary,
  FrameworkStats,
} from "@/lib/RegulatorDataService";

interface UseRegulatorDataReturn {
  assessments: ComplianceAssessment[];
  sectorStats: SectorStats[];
  frameworkStats: FrameworkStats[];
  summary: DashboardSummary;
  loading: boolean;
  error: string | null;
  totalEntities: number;
  compliantCount: number;
  atRiskCount: number;
  highRiskCount: number;
  avgRiskScore: number;
  pendingCAR: number;
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

const SESSION_SYNC_KEY = 'regulator_synced_session';

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
  const hasSynced = useRef(false);

  const loadFromLocalStorage = useCallback(() => {
    const allAssessments = regulatorDataService.getAssessments();
    setAssessments(allAssessments);
    setSectorStats(regulatorDataService.getSectorStats());
    setFrameworkStats(regulatorDataService.getFrameworkStats());
    setSummary(regulatorDataService.getDashboardSummary());
  }, []);

  const syncFromSupabase = useCallback(async () => {
    if (hasSynced.current) {
      loadFromLocalStorage();
      setLoading(false);
      return;
    }

    try {
      const { data: scans } = await supabase
        .from('compliance_scans')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      if (scans && scans.length > 0) {
        const localAssessments = regulatorDataService.getAssessments();
        const localIds = new Set(localAssessments.map(a => a.id));

        for (const scan of scans) {
          if (!localIds.has(scan.id)) {
            const results = scan.results || {};
            const status = scan.risk_score <= 30 ? 'compliant' : scan.risk_score <= 60 ? 'at_risk' : 'high_risk';
            const riskLevel = scan.risk_score <= 25 ? 'low' : scan.risk_score <= 50 ? 'medium' : scan.risk_score <= 75 ? 'high' : 'critical';

            regulatorDataService.addAssessment({
              appName: results.appName || 'Untitled Assessment',
              sector: results.sector || scan.sector_id || 'General',
              riskScore: scan.risk_score || 50,
              riskLevel: riskLevel as 'low' | 'medium' | 'high' | 'critical',
              framework: results.framework || 'NDPA',
              assessmentDate: scan.created_at || new Date().toISOString(),
              triggeredClausesCount: results.triggeredClauses || 0,
              remediationCompleted: 0,
              remediationTotal: results.remediationTotal || 0,
              status: status as 'compliant' | 'at_risk' | 'high_risk',
              triggeredClauseIds: results.triggeredClauseIds || [],
              triggeredFrameworks: results.triggeredFrameworks || [results.framework || 'NDPA'],
            });
          }
        }
      }

      hasSynced.current = true;
      loadFromLocalStorage();
    } catch {
      loadFromLocalStorage();
    } finally {
      setLoading(false);
    }
  }, [loadFromLocalStorage]);

  const refreshData = useCallback(() => {
    loadFromLocalStorage();
  }, [loadFromLocalStorage]);

  useEffect(() => {
    syncFromSupabase();
    const unsubscribe = regulatorDataService.subscribe(loadFromLocalStorage);
    return () => unsubscribe();
  }, []);

  const totalEntities = assessments.length;
  const compliantCount = assessments.filter(a => a.status === "compliant").length;
  const atRiskCount = assessments.filter(a => a.status === "at_risk").length;
  const highRiskCount = assessments.filter(a => a.status === "high_risk").length;
  const avgRiskScore = totalEntities > 0 
    ? Math.round(assessments.reduce((sum, a) => sum + a.riskScore, 0) / totalEntities)
    : 0;
  const pendingCAR = summary.pendingCARFilings;

  const addAssessment = useCallback((assessment: Omit<ComplianceAssessment, "id">) => {
    return regulatorDataService.addAssessment(assessment);
  }, []);

  const updateAssessment = useCallback((id: string, updates: Partial<ComplianceAssessment>) => {
    regulatorDataService.updateAssessment(id, updates);
  }, []);

  const deleteAssessment = useCallback((id: string) => {
    regulatorDataService.deleteAssessment(id);
  }, []);

  const clearAll = useCallback(() => {
    regulatorDataService.clearAllAssessments();
    hasSynced.current = false;
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