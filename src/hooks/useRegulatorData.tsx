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
  const initialized = useRef(false);

  const loadFromLocalStorage = () => {
    const allAssessments = regulatorDataService.getAssessments();
    setAssessments(allAssessments);
    setSectorStats(regulatorDataService.getSectorStats());
    setFrameworkStats(regulatorDataService.getFrameworkStats());
    setSummary(regulatorDataService.getDashboardSummary());
  };

  useEffect(() => {
    let mounted = true;

    async function syncOnce() {
      if (initialized.current) {
        loadFromLocalStorage();
        if (mounted) setLoading(false);
        return;
      }

      try {
        const { data: scans } = await supabase
          .from('compliance_scans')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(100);

        if (scans && scans.length > 0) {
          regulatorDataService.clearAllAssessments();

          for (const scan of scans) {
            const results = scan.results || {};
            const status = scan.risk_score <= 30 ? 'compliant' as const : scan.risk_score <= 60 ? 'at_risk' as const : 'high_risk' as const;
            const riskLevel = scan.risk_score <= 25 ? 'low' as const : scan.risk_score <= 50 ? 'medium' as const : scan.risk_score <= 75 ? 'high' as const : 'critical' as const;

            regulatorDataService.addAssessment({
              appName: results.appName || 'Untitled Assessment',
              sector: results.sector || scan.sector_id || 'General',
              riskScore: scan.risk_score || 50,
              riskLevel,
              framework: results.framework || 'NDPA',
              assessmentDate: scan.created_at || new Date().toISOString(),
              triggeredClausesCount: results.triggeredClauses || 0,
              remediationCompleted: 0,
              remediationTotal: results.remediationTotal || 0,
              status,
              triggeredClauseIds: results.triggeredClauseIds || [],
              triggeredFrameworks: results.triggeredFrameworks || [results.framework || 'NDPA'],
            });
          }
        }

        initialized.current = true;
      } catch {
        // Sync failed, use whatever is in localStorage
      }

      if (mounted) {
        loadFromLocalStorage();
        setLoading(false);
      }
    }

    syncOnce();

    const unsubscribe = regulatorDataService.subscribe(loadFromLocalStorage);

    return () => {
      mounted = false;
      unsubscribe();
    };
  }, []);

  const totalEntities = assessments.length;
  const compliantCount = assessments.filter(a => a.status === "compliant").length;
  const atRiskCount = assessments.filter(a => a.status === "at_risk").length;
  const highRiskCount = assessments.filter(a => a.status === "high_risk").length;
  const avgRiskScore = totalEntities > 0 
    ? Math.round(assessments.reduce((sum, a) => sum + a.riskScore, 0) / totalEntities)
    : 0;
  const pendingCAR = summary.pendingCARFilings;

  const refreshData = useCallback(() => {
    loadFromLocalStorage();
  }, []);

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
    initialized.current = false;
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
    error: null,
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