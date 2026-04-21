import { useState, useEffect } from "react";
import { 
  AlertTriangle, 
  RefreshCw, 
  ChevronDown, 
  ChevronRight,
  Calendar,
  FileText,
  ExternalLink,
  Bell,
  X,
  Shield,
  Clock
} from "lucide-react";

interface RegulatoryUpdate {
  id: string;
  title: string;
  agency: string;
  date: string;
  summary: string;
  affectedSections: string[];
  impactLevel: "high" | "medium" | "low";
  sourceUrl: string;
}

interface AffectedControl {
  id: string;
  name: string;
  currentStatus: "compliant" | "at-risk" | "non-compliant";
  newRequirement: string;
}

export function RegulationUpdateBanner() {
  const [isVisible, setIsVisible] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentUpdate, setCurrentUpdate] = useState<RegulatoryUpdate | null>(null);
  const [affectedControls, setAffectedControls] = useState<AffectedControl[]>([]);
  const [lastChecked, setLastChecked] = useState<Date>(new Date());

  // Simulate fetching latest regulatory update
  useEffect(() => {
    // Mock data - in production, fetch from Supabase or NDPC API
    const mockUpdate: RegulatoryUpdate = {
      id: "gaid-2025-amd3",
      title: "GAID 2025 Amendment 3: DCPMI Registration Threshold Revised",
      agency: "Nigeria Data Protection Commission",
      date: "April 19, 2026",
      summary: "The Data Controller/Processor of Major Importance registration threshold has been lowered from 2,000 to 1,000 data subjects. Additional sector-specific requirements for fintech and healthtech have been introduced.",
      affectedSections: ["Section 44", "Section 32", "Section 28"],
      impactLevel: "high",
      sourceUrl: "https://ndpc.gov.ng/regulations/gaid-2025-amendment-3"
    };

    const mockControls: AffectedControl[] = [
      {
        id: "ctrl-1",
        name: "DCPMI Registration Status",
        currentStatus: "non-compliant",
        newRequirement: "Must register if processing >1,000 data subjects (previously 2,000)"
      },
      {
        id: "ctrl-2",
        name: "Data Protection Officer Appointment",
        currentStatus: "at-risk",
        newRequirement: "Fintech DPO must have CBN compliance certification"
      },
      {
        id: "ctrl-3",
        name: "Data Protection Impact Assessment",
        currentStatus: "compliant",
        newRequirement: "DPIA now required annually, not just at project initiation"
      }
    ];

    setCurrentUpdate(mockUpdate);
    setAffectedControls(mockControls);
  }, []);

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "high": return "bg-destructive/10 border-destructive/30 text-destructive";
      case "medium": return "bg-accent/10 border-accent/30 text-accent";
      case "low": return "bg-secondary/10 border-secondary/30 text-secondary";
      default: return "bg-muted border-border text-muted-foreground";
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "compliant": 
        return { label: "Compliant", bg: "bg-secondary/10", text: "text-secondary" };
      case "at-risk": 
        return { label: "At Risk", bg: "bg-accent/10", text: "text-accent" };
      case "non-compliant": 
        return { label: "Non-Compliant", bg: "bg-destructive/10", text: "text-destructive" };
      default: 
        return { label: "Unknown", bg: "bg-muted", text: "text-muted-foreground" };
    }
  };

  const handleReassess = () => {
    // Update last checked time
    setLastChecked(new Date());
    
    // Show confirmation instead of error
  const message = "Reassessment triggered. In production, this would re-scan all affected controls against the updated regulation and flag any new compliance gaps.";
    
    // Use console.log instead of alert for better UX
    console.log(message);
    
    // Optionally show a toast notification if you have toast hook
    // toast({ title: "Reassessment Started", description: "Scanning affected controls..." });
  };

  const handleDismiss = () => {
    setIsVisible(false);
    // In production, store dismissed state in localStorage
  };

  if (!isVisible || !currentUpdate) return null;

  return (
    <div className={`rounded-xl border-2 overflow-hidden transition-all ${getImpactColor(currentUpdate.impactLevel)}`}>
      {/* Header - Always Visible */}
      <div className="p-4">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">
            <Bell className="w-5 h-5" />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <h4 className="font-semibold text-foreground">
                {currentUpdate.title}
              </h4>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium uppercase ${
                currentUpdate.impactLevel === "high" ? "bg-destructive text-destructive-foreground" :
                currentUpdate.impactLevel === "medium" ? "bg-accent text-accent-foreground" :
                "bg-secondary text-secondary-foreground"
              }`}>
                {currentUpdate.impactLevel} Impact
              </span>
            </div>
            
            <div className="flex items-center gap-3 text-xs text-muted-foreground mb-2">
              <span className="flex items-center gap-1">
                <Shield className="w-3 h-3" />
                {currentUpdate.agency}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {currentUpdate.date}
              </span>
            </div>
            
            <p className="text-sm text-foreground/80 mb-3">
              {currentUpdate.summary}
            </p>
            
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-xs font-medium">
                Affected Controls: 
                <span className="ml-1 text-destructive font-bold">{affectedControls.filter(c => c.currentStatus === "non-compliant").length} non-compliant</span>
                <span className="mx-1">•</span>
                <span className="text-accent">{affectedControls.filter(c => c.currentStatus === "at-risk").length} at risk</span>
              </span>
              
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-xs text-primary flex items-center gap-1 hover:underline"
              >
                {isExpanded ? (
                  <>Hide Details <ChevronDown className="w-3 h-3" /></>
                ) : (
                  <>Show Details <ChevronRight className="w-3 h-3" /></>
                )}
              </button>
            </div>
          </div>
          
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={handleReassess}
              className="p-2 rounded-lg hover:bg-background/50 transition-colors"
              title="Reassess Compliance"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              onClick={handleDismiss}
              className="p-2 rounded-lg hover:bg-background/50 transition-colors"
              title="Dismiss"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
      
      {/* Expanded Details */}
      {isExpanded && (
        <div className="border-t border-inherit bg-background/30 p-4 animate-fade-in">
          <h5 className="text-xs font-semibold uppercase tracking-wider mb-3 flex items-center gap-2">
            <AlertTriangle className="w-3 h-3" />
            Affected Controls ({affectedControls.length})
          </h5>
          
          <div className="space-y-2 mb-4">
            {affectedControls.map((control) => {
              const statusBadge = getStatusBadge(control.currentStatus);
              return (
                <div key={control.id} className="bg-background/50 rounded-lg p-3 border border-border">
                  <div className="flex items-start justify-between mb-2">
                    <span className="font-medium text-sm">{control.name}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full ${statusBadge.bg} ${statusBadge.text}`}>
                      {statusBadge.label}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    <span className="font-medium">New Requirement:</span> {control.newRequirement}
                  </p>
                </div>
              );
            })}
          </div>
          
          <div className="flex items-center justify-between pt-2 border-t border-border">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Clock className="w-3 h-3" />
              <span>Last checked: {lastChecked.toLocaleTimeString()}</span>
            </div>
            
            <div className="flex items-center gap-3">
              <a
                href={currentUpdate.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-primary flex items-center gap-1 hover:underline"
              >
                <FileText className="w-3 h-3" />
                View Official Document
                <ExternalLink className="w-3 h-3" />
              </a>
              
              <button
                onClick={handleReassess}
                className="px-4 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:opacity-90 transition-all flex items-center gap-1"
              >
                <RefreshCw className="w-3 h-3" />
                Reassess Now
              </button>
            </div>
          </div>
          
          {/* Automated Monitoring Notice */}
          <div className="mt-4 pt-3 border-t border-border/50">
            <p className="text-[10px] text-muted-foreground text-center">
              RegTrack continuously monitors NDPC, CBN, and NITDA regulatory updates.
              Affected controls are flagged within 24 hours of publication.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}