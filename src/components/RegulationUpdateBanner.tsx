import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/SupabaseClient";
import { useRegulatorData } from "@/hooks/useRegulatorData";
import { AlertTriangle, RefreshCw, ChevronDown, ChevronRight, Calendar, FileText, ExternalLink, Bell, X, Shield, Clock, CheckCircle2, AlertCircle, TrendingUp, Users, Globe } from "lucide-react";

interface RegulatoryUpdate {
  id: string;
  title: string;
  agency: string;
  agency_code: string;
  date: string;
  summary: string;
  affected_sections: string[];
  affected_sectors: string[];
  impact_level: "high" | "medium" | "low";
  source_url: string;
  effective_date?: string;
  framework: string;
}

interface AffectedControl {
  id: string;
  name: string;
  currentStatus: "compliant" | "at-risk" | "non-compliant";
  newRequirement: string;
  affectedApps?: string[];
  remediationSteps?: string[];
}

export function RegulationUpdateBanner() {
  const [isVisible, setIsVisible] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);
  const [updates, setUpdates] = useState<RegulatoryUpdate[]>([]);
  const [currentUpdateIndex, setCurrentUpdateIndex] = useState(0);
  const [affectedControls, setAffectedControls] = useState<AffectedControl[]>([]);
  const [lastChecked, setLastChecked] = useState<Date>(new Date());
  const [isReassessing, setIsReassessing] = useState(false);
  const [reassessMessage, setReassessMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { assessments, getAssessmentsBySector } = useRegulatorData();

  /**
   * Fetch real regulatory updates from Supabase
   */
  const fetchUpdates = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Get updates from the last 30 days
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
      
      const { data, error: fetchError } = await supabase
        .from('regulatory_updates')
        .select(`
          id,
          title,
          summary,
          source_url,
          source_type,
          published_at,
          affected_sectors,
          relevance_score,
          regulators!inner(name, acronym)
        `)
        .gte('published_at', thirtyDaysAgo)
        .order('published_at', { ascending: false })
        .limit(5);

      if (fetchError) {
        console.error('Failed to fetch updates:', fetchError);
        setError('Unable to fetch regulatory updates');
        setLoading(false);
        return;
      }

      if (data && data.length > 0) {
        const formattedUpdates: RegulatoryUpdate[] = data.map((update: any) => ({
          id: update.id,
          title: update.title,
          agency: update.regulators?.name || 'Nigerian Regulator',
          agency_code: update.regulators?.acronym || 'NDPC',
          date: new Date(update.published_at).toLocaleDateString('en-NG', { year: 'numeric', month: 'long', day: 'numeric' }),
          summary: update.summary || update.title,
          affected_sections: [],
          affected_sectors: update.affected_sectors || [],
          impact_level: (update.relevance_score || 0) > 0.7 ? 'high' : (update.relevance_score || 0) > 0.4 ? 'medium' : 'low',
          source_url: update.source_url || '#',
          effective_date: update.published_at,
          framework: update.regulators?.acronym || 'NDPA',
        }));
        
        setUpdates(formattedUpdates);
      } else {
        // No updates in database, try edge function
        await triggerMonitorAndFetch();
      }
    } catch (err) {
      console.error('Error fetching updates:', err);
      setError('Failed to load regulatory updates');
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Trigger the monitor-regulators edge function and fetch results
   */
  const triggerMonitorAndFetch = async () => {
    try {
      // Call the monitor-regulators edge function
      const { data: monitorResult, error: monitorError } = await supabase.functions.invoke('monitor-regulators', {
        body: { forceCheck: true },
      });

      if (!monitorError) {
        // Wait a moment then fetch again
        await new Promise(resolve => setTimeout(resolve, 2000));
        await fetchUpdates();
      }
    } catch (err) {
      console.log('Monitor function not available, using fallback');
      setError('No recent updates found. Monitoring service will check automatically.');
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchUpdates();
    
    // Set up real-time subscription for new updates
    const channel = supabase
      .channel('regulatory-updates')
      .on('postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'regulatory_updates' },
        (payload) => {
          console.log('New regulatory update detected:', payload);
          fetchUpdates(); // Refresh updates
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchUpdates]);

  // Generate affected controls based on current assessments
  useEffect(() => {
    if (assessments.length === 0) {
      setAffectedControls([]);
      return;
    }

    const fintechAssessments = getAssessmentsBySector("fintech");
    const healthAssessments = getAssessmentsBySector("healthtech");
    const allHighRisk = assessments.filter(a => a.status === "high_risk");
    const allAtRisk = assessments.filter(a => a.status === "at_risk");

    const controls: AffectedControl[] = [
      {
        id: "ctrl-ndpa-reg",
        name: "NDPA DCPMI Registration",
        currentStatus: allHighRisk.length > 0 ? "non-compliant" : allAtRisk.length > 0 ? "at-risk" : "compliant",
        newRequirement: "Verify DCPMI status and register with NDPC if processing >1,000 data subjects in 6 months.",
        affectedApps: allHighRisk.slice(0, 3).map(a => a.appName),
        remediationSteps: ["Count total data subjects processed", "Complete registration via NDPC portal", "Pay applicable fee", "Submit registration certificate"],
      },
      {
        id: "ctrl-cbn-aml",
        name: "CBN AML/CFT Compliance",
        currentStatus: fintechAssessments.length > 0 ? "at-risk" : "compliant",
        newRequirement: "Ensure CDD, transaction monitoring, and STR filing comply with CBN AML Regulations 2022.",
        affectedApps: fintechAssessments.slice(0, 3).map(a => a.appName),
        remediationSteps: ["Implement CDD procedures", "Set up transaction monitoring", "Establish STR filing process", "Appoint AML Compliance Officer"],
      },
      {
        id: "ctrl-sec-cf",
        name: "SEC Crowdfunding Compliance",
        currentStatus: assessments.some(a => a.sector === "fintech") ? "at-risk" : "compliant",
        newRequirement: "Crowdfunding portals must register with SEC and maintain N100 million minimum capital.",
        affectedApps: fintechAssessments.slice(0, 2).map(a => a.appName),
        remediationSteps: ["Register portal with SEC", "Meet capital requirements", "Implement investor protection measures"],
      },
      {
        id: "ctrl-nitda-dp",
        name: "NITDA Data Protection",
        currentStatus: allAtRisk.length > 0 ? "at-risk" : "compliant",
        newRequirement: "Organizations processing 1000+ data subjects must comply with NITDA DP Framework.",
        affectedApps: allAtRisk.slice(0, 3).map(a => a.appName),
        remediationSteps: ["Appoint DPO if required", "Conduct annual DPIA", "Publish privacy policy", "Maintain data inventory"],
      },
    ];

    setAffectedControls(controls);
  }, [assessments, getAssessmentsBySector]);

  const currentUpdate = updates[currentUpdateIndex];

  const getImpactColor = (impact: string) => {
    switch (impact) { 
      case "high": return "bg-destructive/10 border-destructive/30 text-destructive"; 
      case "medium": return "bg-accent/10 border-accent/30 text-accent"; 
      default: return "bg-secondary/10 border-secondary/30 text-secondary"; 
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) { 
      case "compliant": return { label: "Compliant", bg: "bg-secondary/10", text: "text-secondary", icon: CheckCircle2 }; 
      case "at-risk": return { label: "At Risk", bg: "bg-accent/10", text: "text-accent", icon: AlertCircle }; 
      default: return { label: "Non-Compliant", bg: "bg-destructive/10", text: "text-destructive", icon: AlertTriangle }; 
    }
  };

  const handleReassess = async () => {
    setIsReassessing(true);
    setReassessMessage(null);
    
    // Trigger fresh monitoring
    try {
      await supabase.functions.invoke('monitor-regulators', { body: { forceCheck: true } });
      await new Promise(resolve => setTimeout(resolve, 3000));
      await fetchUpdates();
    } catch (err) {
      console.log('Monitor function unavailable');
    }
    
    setLastChecked(new Date());
    setReassessMessage("Reassessment complete! All controls updated.");
    setIsReassessing(false);
    setTimeout(() => setReassessMessage(null), 5000);
  };

  const handleDismiss = () => { 
    setIsVisible(false); 
    if (currentUpdate) localStorage.setItem("regulation_banner_dismissed", currentUpdate.id);
  };

  const handleNextUpdate = () => {
    setCurrentUpdateIndex(prev => (prev + 1) % updates.length);
    setIsExpanded(false);
  };

  // Check if banner was dismissed
  useEffect(() => {
    const dismissed = localStorage.getItem("regulation_banner_dismissed");
    if (dismissed === currentUpdate?.id) setIsVisible(false);
    else setIsVisible(true);
  }, [currentUpdate]);

  if (loading) {
    return (
      <div className="rounded-xl border border-border bg-card p-4 animate-pulse">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 bg-muted rounded-full" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-muted rounded w-3/4" />
            <div className="h-3 bg-muted rounded w-1/2" />
          </div>
        </div>
      </div>
    );
  }

  if (!isVisible || !currentUpdate) {
    if (error) {
      return (
        <div className="rounded-xl border border-border bg-card p-3 text-xs text-muted-foreground text-center">
          <Globe className="w-3 h-3 inline mr-1" />
          {error}. <button onClick={fetchUpdates} className="text-primary hover:underline">Retry</button>
        </div>
      );
    }
    return null;
  }

  const nonCompliantCount = affectedControls.filter(c => c.currentStatus === "non-compliant").length;
  const atRiskCount = affectedControls.filter(c => c.currentStatus === "at-risk").length;

  return (
    <div className={`rounded-xl border-2 overflow-hidden transition-all animate-fade-in-up ${getImpactColor(currentUpdate.impact_level)}`}>
      <div className="p-4">
        <div className="flex items-start gap-3">
          <Bell className="w-5 h-5 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <h4 className="font-semibold text-foreground">{currentUpdate.title}</h4>
              <span className="text-[10px] px-2 py-0.5 rounded-full font-medium uppercase bg-destructive text-destructive-foreground">
                {currentUpdate.impact_level} Impact
              </span>
              {updates.length > 1 && (
                <button onClick={handleNextUpdate} className="text-[10px] text-primary hover:underline">
                  Next update →
                </button>
              )}
            </div>
            <div className="flex items-center gap-3 text-xs text-muted-foreground mb-2 flex-wrap">
              <span className="flex items-center gap-1"><Shield className="w-3 h-3" />{currentUpdate.agency} ({currentUpdate.agency_code})</span>
              <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{currentUpdate.date}</span>
            </div>
            <p className="text-sm text-foreground/80 mb-3">{currentUpdate.summary}</p>
            
            {currentUpdate.affected_sectors.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-3">
                {currentUpdate.affected_sectors.map(sector => (
                  <span key={sector} className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground">{sector}</span>
                ))}
              </div>
            )}

            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex items-center gap-2 text-xs">
                <span className="font-medium">Your Status:</span>
                <span className="text-destructive font-bold">{nonCompliantCount} non-compliant</span>
                <span className="text-accent font-bold">{atRiskCount} at risk</span>
              </div>
              <button onClick={() => setIsExpanded(!isExpanded)} className="text-xs text-primary flex items-center gap-1 hover:underline">
                {isExpanded ? <><ChevronDown className="w-3 h-3" />Hide</> : <><ChevronRight className="w-3 h-3" />Details</>}
              </button>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <button onClick={handleReassess} disabled={isReassessing} className="p-2 rounded-lg hover:bg-background/50 transition-colors disabled:opacity-50" title="Reassess Compliance">
              <RefreshCw className={`w-4 h-4 ${isReassessing ? "animate-spin" : ""}`} />
            </button>
            <button onClick={handleDismiss} className="p-2 rounded-lg hover:bg-background/50 transition-colors" title="Dismiss"><X className="w-4 h-4" /></button>
          </div>
        </div>
        {reassessMessage && (
          <div className="mt-3 p-2 rounded-lg bg-secondary/10 text-secondary text-xs flex items-center gap-2 animate-fade-in">
            <CheckCircle2 className="w-3 h-3" />{reassessMessage}
          </div>
        )}
      </div>

      {isExpanded && affectedControls.length > 0 && (
        <div className="border-t border-inherit bg-background/30 p-4 animate-fade-in space-y-4">
          <h5 className="text-xs font-semibold uppercase tracking-wider mb-3 flex items-center gap-2">
            <AlertTriangle className="w-3 h-3" />Your Affected Controls
          </h5>
          <div className="space-y-3">
            {affectedControls.map(control => {
              const statusBadge = getStatusBadge(control.currentStatus);
              const StatusIcon = statusBadge.icon;
              return (
                <div key={control.id} className="bg-background/50 rounded-lg p-3 border border-border">
                  <div className="flex items-start justify-between mb-2 flex-wrap gap-2">
                    <span className="font-medium text-sm text-foreground">{control.name}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1 ${statusBadge.bg} ${statusBadge.text}`}>
                      <StatusIcon className="w-3 h-3" />{statusBadge.label}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">{control.newRequirement}</p>
                  {control.affectedApps && control.affectedApps.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {control.affectedApps.map((app, idx) => (
                        <span key={idx} className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground">{app}</span>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          
          <div className="flex items-center justify-between pt-2 border-t border-border flex-wrap gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1"><Clock className="w-3 h-3" />Last check: {lastChecked.toLocaleTimeString()}</span>
            <a href={currentUpdate.source_url} target="_blank" rel="noopener noreferrer" className="text-primary flex items-center gap-1 hover:underline">
              <FileText className="w-3 h-3" />Source <ExternalLink className="w-3 h-3" />
            </a>
          </div>
          
          <p className="text-[10px] text-muted-foreground text-center pt-2 border-t border-border/50">
            🔍 RegTrack monitors regulatory updates every 6 hours. Based on {assessments.length} active assessments.
          </p>
        </div>
      )}
    </div>
  );
}