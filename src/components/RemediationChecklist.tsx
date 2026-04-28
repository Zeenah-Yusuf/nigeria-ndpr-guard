// src/components/RemediationChecklist.tsx

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/SupabaseClient";
import { RemediationItem } from "@/lib/remediationData";
import { EvidenceUploadModal } from "./EvidenceUploadModal";
import { 
  CheckCircle2, Circle, Clock, ExternalLink, AlertTriangle, 
  AlertCircle, Info, Shield, TrendingUp, Award, UserPlus, Loader2, Upload, LogIn
} from "lucide-react";

interface EvidenceData {
  fileName: string;
  fileUrl: string;
  uploadDate: string;
  fileSize: number;
  fileType: string;
}

interface Props {
  items: RemediationItem[];
  storageKey: string;
  initialRiskScore: number;
  userSector?: string;
  appId?: string | null;
  onRiskScoreUpdate?: (newScore: number, completedCount: number, totalCount: number) => void;
}

const DPCO_OFFICERS = [
  {
    id: "dpco-default",
    name: "Precious Kulutuye",
    role: "Product & Compliance Research Lead",
    email: "pkulutuye@gmail.com",
    specialization: "NDPA, CBN AML, SEC, NITDA Compliance",
  },
];

const RemediationChecklist = ({ 
  items, storageKey, initialRiskScore,
  userSector = "other", appId = null, onRiskScoreUpdate 
}: Props) => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();

  const [checked, setChecked] = useState<Record<string, boolean>>(() => {
    try { return JSON.parse(localStorage.getItem(storageKey) || "{}"); }
    catch { return {}; }
  });

  const [uploadedEvidence, setUploadedEvidence] = useState<Record<string, EvidenceData>>(() => {
    try { return JSON.parse(localStorage.getItem(`${storageKey}_evidence`) || "{}"); }
    catch { return {}; }
  });

  const [currentRiskScore, setCurrentRiskScore] = useState(initialRiskScore);
  const [showAchievement, setShowAchievement] = useState(false);
  const [linkedDPCO, setLinkedDPCO] = useState<string | null>(null);
  const [showLinkConfirm, setShowLinkConfirm] = useState(false);
  const [selectedOfficer, setSelectedOfficer] = useState<string | null>(null);
  const [linkingDPCO, setLinkingDPCO] = useState(false);

  const [evidenceModal, setEvidenceModal] = useState<{
    isOpen: boolean; itemId: string; itemTitle: string; evidenceRequired: string; framework: string;
  }>({ isOpen: false, itemId: "", itemTitle: "", evidenceRequired: "", framework: "NDPA" });

  const hasUploadedEvidence = (itemId: string) => !!uploadedEvidence[itemId];

  const calculateRiskScore = (): number => {
    if (items.length === 0) return initialRiskScore;
    const weights: Record<string, number> = { critical: 15, high: 10, medium: 5, low: 2 };
    let reduction = 0;
    const maxReduction = items.reduce((sum, i) => sum + (weights[i.priority] || 5), 0);

    items.forEach(item => {
      const isDone = checked[item.id];
      const hasEvidence = !item.requiresEvidence || hasUploadedEvidence(item.id);
      if (isDone && hasEvidence) reduction += weights[item.priority] || 5;
    });

    const pct = maxReduction > 0 ? reduction / maxReduction : 0;
    return Math.max(0, Math.min(100, initialRiskScore - Math.floor(initialRiskScore * pct)));
  };

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(checked));
    localStorage.setItem(`${storageKey}_evidence`, JSON.stringify(uploadedEvidence));

    const newScore = calculateRiskScore();
    setCurrentRiskScore(newScore);

    const completedCount = items.filter(i => {
      const isDone = checked[i.id];
      const hasEvidence = !i.requiresEvidence || hasUploadedEvidence(i.id);
      return isDone && hasEvidence;
    }).length;

    if (onRiskScoreUpdate) onRiskScoreUpdate(newScore, completedCount, items.length);
    if (completedCount === items.length && items.length > 0 && !showAchievement) {
      setShowAchievement(true);
      setTimeout(() => setShowAchievement(false), 5000);
    }
  }, [checked, uploadedEvidence, items]);

  useEffect(() => { 
    if (user) checkExistingLink(); 
  }, [user]);

  async function checkExistingLink() {
    if (!user) return;
    const { data } = await supabase.from('dpco_organization_links')
      .select('dpco_id').eq('organization_id', user.id).maybeSingle();
    if (data) setLinkedDPCO(data.dpco_id);
  }

  const toggle = async (id: string) => {
    const item = items.find(i => i.id === id);
    const newChecked = { ...checked, [id]: !checked[id] };
    setChecked(newChecked);

    if (newChecked[id] && user) {
      const hasEvidence = !item?.requiresEvidence || hasUploadedEvidence(id);
      const status = linkedDPCO ? 'pending_verification' : (hasEvidence ? 'compliant' : 'pending_verification');

      await supabase.from('user_compliance_status').upsert({
        user_id: user.id, clause_id: id, status,
        notes: `Marked complete by ${profile?.company_name || 'Organization'}`,
        last_reviewed_at: new Date().toISOString(),
      });
    }
  };

  function handleOfficerClick(officerId: string) {
    if (!user) {
      navigate('/login');
      return;
    }
    setSelectedOfficer(officerId);
    setShowLinkConfirm(true);
  }

  async function handleLinkToDPCO(officerId: string) {
    if (!user) return;
    setLinkingDPCO(true);
    const { error } = await supabase.from('dpco_organization_links').upsert({
      dpco_id: officerId, organization_id: user.id, status: 'linked',
    });
    if (!error) setLinkedDPCO(officerId);
    setShowLinkConfirm(false);
    setLinkingDPCO(false);
  }

  function handleEvidenceConfirm(evidence: EvidenceData) {
    const newEvidence = { ...uploadedEvidence, [evidenceModal.itemId]: evidence };
    setUploadedEvidence(newEvidence);
    localStorage.setItem(`${storageKey}_evidence`, JSON.stringify(newEvidence));
    setEvidenceModal({ isOpen: false, itemId: "", itemTitle: "", evidenceRequired: "", framework: "NDPA" });
  }

  const completedCount = items.filter(i => {
    const isDone = checked[i.id];
    const hasEvidence = !i.requiresEvidence || hasUploadedEvidence(i.id);
    return isDone && hasEvidence;
  }).length;
  const progress = items.length > 0 ? Math.round((completedCount / items.length) * 100) : 0;

  const getPriorityLabel = (p: string) => ({ critical: 'Critical', high: 'High', medium: 'Medium', low: 'Low' }[p] || p);
  const getPriorityIcon = (p: string) => p === 'critical' ? AlertTriangle : p === 'high' ? AlertCircle : Info;
  const getPriorityStyles = (p: string) => {
    switch (p) {
      case 'critical': return { bg: 'bg-destructive/10', text: 'text-destructive', border: 'border-destructive/20' };
      case 'high': return { bg: 'bg-accent/10', text: 'text-accent', border: 'border-accent/20' };
      case 'medium': return { bg: 'bg-primary/10', text: 'text-primary', border: 'border-primary/20' };
      default: return { bg: 'bg-secondary/10', text: 'text-secondary', border: 'border-secondary/20' };
    }
  };
  const getDifficultyColor = (d: string) => d === 'Easy' ? 'bg-secondary/15 text-secondary' : d === 'Medium' ? 'bg-accent/15 text-accent' : d === 'Hard' ? 'bg-destructive/15 text-destructive' : 'bg-muted text-muted-foreground';

  const grouped = {
    critical: items.filter(i => i.priority === 'critical'),
    high: items.filter(i => i.priority === 'high'),
    medium: items.filter(i => i.priority === 'medium'),
    low: items.filter(i => i.priority === 'low'),
  };

  return (
    <div className="space-y-5">
      {showAchievement && (
        <div className="fixed bottom-4 right-4 z-50 animate-slide-in-right">
          <div className="bg-secondary text-secondary-foreground rounded-xl p-4 shadow-elevated flex items-center gap-3">
            <Award className="w-6 h-6" />
            <div><p className="font-semibold text-sm">All Tasks Completed!</p><p className="text-xs opacity-90">Your compliance score has improved significantly</p></div>
          </div>
        </div>
      )}

      {showLinkConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-card rounded-2xl p-6 max-w-sm w-full shadow-2xl border border-border">
            <h4 className="font-semibold text-foreground mb-2">Link with Compliance Officer?</h4>
            <p className="text-sm text-muted-foreground mb-4">This officer will be able to view your compliance status and verify your remediation progress. Are you sure?</p>
            <div className="flex gap-2">
              <button onClick={() => setShowLinkConfirm(false)} className="flex-1 py-2 rounded-xl border border-border hover:bg-muted/50 transition-colors text-sm">Cancel</button>
              <button onClick={() => handleLinkToDPCO(selectedOfficer!)} disabled={linkingDPCO} className="flex-1 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2">
                {linkingDPCO ? <Loader2 className="w-4 h-4 animate-spin" /> : null} Yes, Link
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="rounded-xl border border-border bg-card p-5">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-semibold text-foreground">Remediation Progress</span>
          <span className="text-sm font-bold text-primary">{progress}%</span>
        </div>
        <div className="h-2.5 bg-muted rounded-full overflow-hidden mb-4">
          <div className="h-full bg-primary rounded-full transition-all duration-700 ease-out" style={{ width: `${progress}%` }} />
        </div>
        <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
          <div className="flex items-center gap-2"><Shield className="w-4 h-4 text-primary" /><span className="text-xs font-medium">Current Risk Score:</span></div>
          <span className={`text-lg font-bold ${currentRiskScore <= 30 ? "text-secondary" : currentRiskScore <= 60 ? "text-accent" : "text-destructive"}`}>{currentRiskScore}</span>
        </div>

        {/* DPCO Link Section - Always visible */}
        <div className="mt-3 pt-3 border-t border-border">
          {linkedDPCO ? (
            <p className="text-xs text-secondary flex items-center gap-1"><CheckCircle2 className="w-3 h-3" />Linked to Compliance Officer</p>
          ) : (
            <div className="text-xs text-muted-foreground">
              <p className="mb-2">Recommended Compliance Officer for your sector:</p>
              {DPCO_OFFICERS.map(o => (
                <button key={o.id} onClick={() => handleOfficerClick(o.id)} className="flex items-center gap-2 text-primary hover:underline w-full text-left">
                  <UserPlus className="w-3 h-3 flex-shrink-0" />
                  <span>
                    <strong>{o.name}</strong> — {o.specialization}
                    {!user && (
                      <span className="block text-[10px] text-accent">Sign in required to link</span>
                    )}
                  </span>
                  {!user && <LogIn className="w-3 h-3 ml-auto flex-shrink-0 text-muted-foreground" />}
                </button>
              ))}
              {!user && (
                <p className="text-[10px] text-muted-foreground mt-2 text-center">
                  <button onClick={() => navigate('/login')} className="text-primary hover:underline">Sign in</button> or{" "}
                  <button onClick={() => navigate('/register')} className="text-primary hover:underline">register</button> to link with this officer
                </p>
              )}
            </div>
          )}
        </div>
        
        <p className="text-xs text-muted-foreground mt-3">{completedCount} of {items.length} completed</p>
      </div>

      {(['critical', 'high', 'medium', 'low'] as const).map(priority => {
        const group = grouped[priority];
        if (group.length === 0) return null;
        const styles = getPriorityStyles(priority);
        const PriorityIcon = getPriorityIcon(priority);
        return (
          <div key={priority} className="space-y-2">
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg ${styles.bg} w-fit`}>
              <PriorityIcon className={`w-3.5 h-3.5 ${styles.text}`} />
              <span className={`text-xs font-bold ${styles.text} uppercase`}>{getPriorityLabel(priority)}</span>
              <span className={`text-xs ${styles.text} opacity-70`}>({group.length})</span>
            </div>
            {group.map((item, i) => {
              const done = !!checked[item.id];
              const evidenceUploaded = hasUploadedEvidence(item.id);
              return (
                <div key={item.id} className={`rounded-xl border p-4 transition-all animate-fade-in-up ${done ? "border-secondary/30 bg-secondary/5 opacity-75" : `${styles.border} bg-card`}`} style={{ animationDelay: `${i * 0.05}s` }}>
                  <div className="flex items-start gap-3">
                    <button onClick={() => toggle(item.id)} className="mt-0.5 flex-shrink-0 transition-transform active:scale-90">
                      {done ? <CheckCircle2 className="w-5 h-5 text-secondary" /> : <Circle className="w-5 h-5 text-muted-foreground hover:text-primary transition-colors" />}
                    </button>
                    <div className="flex-1 min-w-0">
                      <h5 className={`font-heading font-semibold text-sm ${done ? "line-through text-muted-foreground" : "text-foreground"}`}>{item.title}</h5>
                      <p className="text-xs text-muted-foreground mt-1">{item.description}</p>
                      <div className="flex flex-wrap items-center gap-2 mt-2.5">
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${getDifficultyColor(item.difficulty)}`}>{item.difficulty}</span>
                        <span className="text-[10px] text-muted-foreground flex items-center gap-1"><Clock className="w-3 h-3" />{item.timeEstimate}</span>
                        {item.framework && <span className="text-[10px] bg-muted text-muted-foreground px-2 py-0.5 rounded-full">{item.framework}</span>}
                      </div>
                      {item.resources.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2.5">
                          {item.resources.map((r, idx) => (
                            <a key={idx} href={r.url} target="_blank" rel="noopener noreferrer" className="text-[10px] text-primary hover:text-primary/80 flex items-center gap-1 underline"><ExternalLink className="w-2.5 h-2.5" />{r.label}</a>
                          ))}
                        </div>
                      )}
                      {item.requiresEvidence && (
                        <div className="mt-2.5 pt-2.5 border-t border-border">
                          {evidenceUploaded ? (
                            <div className="flex items-center gap-2 text-xs">
                              <CheckCircle2 className="w-3 h-3 text-secondary" />{uploadedEvidence[item.id].fileName}
                              <button onClick={() => setEvidenceModal({ isOpen: true, itemId: item.id, itemTitle: item.title, evidenceRequired: item.evidenceRequired || 'Upload document', framework: item.framework })} className="text-primary hover:underline text-[10px]">Change</button>
                              <button onClick={() => {
                                const e = { ...uploadedEvidence }; delete e[item.id];
                                setUploadedEvidence(e);
                                localStorage.setItem(`${storageKey}_evidence`, JSON.stringify(e));
                              }} className="text-destructive hover:underline text-[10px]">Remove</button>
                            </div>
                          ) : (
                            <button onClick={() => setEvidenceModal({ isOpen: true, itemId: item.id, itemTitle: item.title, evidenceRequired: item.evidenceRequired || 'Upload document', framework: item.framework })} className="text-xs text-primary hover:underline flex items-center gap-1">
                              <Upload className="w-3 h-3" />Upload Evidence Required
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        );
      })}

      {items.length === 0 && (
        <div className="text-center py-8">
          <CheckCircle2 className="w-12 h-12 text-secondary mx-auto mb-3" />
          <p className="font-heading font-semibold text-foreground">No remediation items found!</p>
          <p className="text-sm text-muted-foreground mt-1">Your app appears to be fully compliant.</p>
        </div>
      )}

      <EvidenceUploadModal
        isOpen={evidenceModal.isOpen}
        onClose={() => setEvidenceModal({ isOpen: false, itemId: "", itemTitle: "", evidenceRequired: "", framework: "NDPA" })}
        onConfirm={handleEvidenceConfirm}
        itemTitle={evidenceModal.itemTitle}
        evidenceRequired={evidenceModal.evidenceRequired}
        framework={evidenceModal.framework}
        existingEvidence={uploadedEvidence[evidenceModal.itemId]}
        onRemove={() => {
          const e = { ...uploadedEvidence }; delete e[evidenceModal.itemId];
          setUploadedEvidence(e);
          localStorage.setItem(`${storageKey}_evidence`, JSON.stringify(e));
        }}
      />
    </div>
  );
};

export default RemediationChecklist;