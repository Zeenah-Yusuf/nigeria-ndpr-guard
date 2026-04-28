// src/components/RiskResults.tsx

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/SupabaseClient";
import { ScanResult } from "./RiskScanner";
import { getRemediationItems } from "@/lib/remediationData";
import { generateReport } from "@/lib/generateReport";
import { getSectorById } from "@/lib/sectorRecommendations";
import { getDatasetByFramework } from "@/data/index";
import RemediationChecklist from "./RemediationChecklist";
import { forceScrollToTop } from "@/components/ScrollToTop";
import { 
  BarChart3, Brain, Wrench, Download, ChevronRight, AlertTriangle, 
  ArrowLeft, Scale, Banknote, RotateCcw, FileText, Shield, 
  CheckCircle2, Circle, Clock, TrendingUp, FileJson, FileCheck,
  Mail, MapPin, UserPlus, Loader2, Award
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Props {
  result: ScanResult;
  onReset: () => void;
}

interface EvidenceData {
  fileName: string;
  fileUrl: string;
  uploadDate: string;
  fileSize: number;
  fileType: string;
}

const DPCO_OFFICERS = [
  {
    id: "dpco-default",
    name: "Precious Kulutuye",
    role: "Product & Compliance Research Lead",
    email: "pkulutuye@gmail.com",
    location: "Abuja, FCT",
    phone: "+234",
    specialization: "NDPA, CBN AML, SEC, NITDA Compliance",
    sectors: ["fintech", "healthtech", "ecommerce", "edtech", "agritech", "enterprise", "social_media"],
  },
];

const RiskResults = ({ result, onReset }: Props) => {
  const { t } = useLanguage();
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState<"analyze" | "understand" | "fix">("analyze");
  const [currentRiskScore, setCurrentRiskScore] = useState(result.riskScore);
  const [linkedDPCO, setLinkedDPCO] = useState<string | null>(null);
  const [linkingDPCO, setLinkingDPCO] = useState(false);
  const { toast } = useToast();
  
  const framework = result.framework || "NDPA";
  const isCbnFramework = framework.startsWith("CBN");
  const isSecFramework = framework.startsWith("SEC");
  const isNitdaFramework = framework.startsWith("NITDA");
  
  const frameworkDisplayName = isCbnFramework ? t('frameworks.cbnAml') : 
    isSecFramework ? t('frameworks.secCf') : 
    isNitdaFramework ? t('frameworks.nitdaDp') : t('frameworks.ndpa');
  
  const getRegulatoryBody = () => {
    if (isCbnFramework) return "Central Bank of Nigeria (CBN)";
    if (isSecFramework) return "Securities and Exchange Commission (SEC)";
    if (isNitdaFramework) return "NITDA";
    return "Nigeria Data Protection Commission (NDPC)";
  };
  
  const regulatoryBody = getRegulatoryBody();
  const dataset = getDatasetByFramework(framework);
  const questions: any[] = dataset?.risk_scanner_questions || [];
  
  const steps = [
    { id: "analyze" as const, labelKey: "results.steps.analyze", icon: BarChart3 },
    { id: "understand" as const, labelKey: "results.steps.understand", icon: Brain },
    { id: "fix" as const, labelKey: "results.steps.fix", icon: Wrench },
  ];

  useEffect(() => { forceScrollToTop(); }, [activeStep]);
  useEffect(() => { if (user) checkExistingLink(); }, [user]);

  async function checkExistingLink() {
    if (!user) return;
    const { data } = await supabase.from('dpco_organization_links')
      .select('dpco_id').eq('organization_id', user.id).maybeSingle();
    if (data) setLinkedDPCO(data.dpco_id);
  }

  async function handleLinkToDPCO() {
    if (!user) { navigate('/login'); return; }
    setLinkingDPCO(true);
    const officer = DPCO_OFFICERS[0];
    const { error } = await supabase.from('dpco_organization_links').upsert({
      dpco_id: officer.id, organization_id: user.id, status: 'linked',
    });
    if (!error) {
      setLinkedDPCO(officer.id);
      toast({ title: t('checklist.linkConfirmation.title'), description: `${officer.name} ${t('checklist.linkedToOfficer')}.` });
    }
    setLinkingDPCO(false);
  }

  const riskConfig: Record<string, { color: string; bg: string; ring: string; labelKey: string }> = {
    low: { color: "text-secondary", bg: "bg-secondary", ring: "ring-secondary/30", labelKey: "risk.low" },
    medium: { color: "text-accent", bg: "bg-accent", ring: "ring-accent/30", labelKey: "risk.medium" },
    high: { color: "text-destructive/80", bg: "bg-destructive/80", ring: "ring-destructive/30", labelKey: "risk.high" },
    critical: { color: "text-destructive", bg: "bg-destructive", ring: "ring-destructive/40", labelKey: "risk.critical" },
  };
  
  const cfg = riskConfig[result.riskLevel] || riskConfig.medium;
  const triggeredClauseIds = result.triggeredClauses.map((c: any) => c.id);
  const remediationItems = getRemediationItems(triggeredClauseIds, framework);
  const sectorProfile = getSectorById(result.sector);
  const officer = DPCO_OFFICERS[0];

  const getEvidenceMap = (): Record<string, EvidenceData> => {
    try {
      return JSON.parse(localStorage.getItem(`regtrack-checklist-${result.appName || "app"}_evidence_${framework}`) || "{}");
    } catch { return {}; }
  };

  const calculateConfidence = (): number => {
    const answeredCount = Object.values(result.answers).filter(a => a !== null && a !== undefined).length;
    return Math.min(98, Math.round(75 + ((answeredCount / (questions.length || 10)) * 20) + (result.sector !== "other" ? 5 : 0)));
  };

  const aiConfidence = calculateConfidence();
  
  const getConfidenceLevel = (confidence: number) => {
    if (confidence >= 90) return { label: "High Confidence", color: "text-secondary", bg: "bg-secondary/10" };
    if (confidence >= 75) return { label: "Medium Confidence", color: "text-accent", bg: "bg-accent/10" };
    return { label: "Review Recommended", color: "text-destructive", bg: "bg-destructive/10" };
  };

  const confidenceLevel = getConfidenceLevel(aiConfidence);

  const handleRiskScoreUpdate = (newScore: number) => setCurrentRiskScore(newScore);

  const handleDownloadPDF = () => {
    try {
      const checkedRaw = localStorage.getItem(`regtrack-checklist-${result.appName || "app"}_${framework}`) || "{}";
      generateReport({
        appName: result.appName, riskScore: currentRiskScore, riskLevel: result.riskLevel,
        explanation: result.explanation,
        questions: questions.map((q: any) => ({ question: q.question, answer: result.answers[q.id] ?? null })),
        triggeredClauses: result.triggeredClauses, remediationItems,
        checkedItems: JSON.parse(checkedRaw), evidenceMap: getEvidenceMap(),
        sector: sectorProfile?.name, framework: framework
      });
      toast({ title: t('results.downloadPDF'), description: `RegTrack_Report_${new Date().toISOString().split("T")[0]}.pdf` });
    } catch { toast({ title: "Error", description: "Failed to generate PDF.", variant: "destructive" }); }
  };

  const handleExportOSCAL = () => {
    const checked = JSON.parse(localStorage.getItem(`regtrack-checklist-${result.appName || "app"}_${framework}`) || "{}");
    const jsonString = JSON.stringify({
      "oscal-version": "1.1.2",
      metadata: { title: `${frameworkDisplayName} Assessment`, publisher: "RegTrack by NSS", "last-modified": new Date().toISOString() },
      summary: { app_name: result.appName, sector: result.sector, framework, risk_score: currentRiskScore, risk_level: result.riskLevel },
    }, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob);
    a.download = `regtrack-oscal-${framework}-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    toast({ title: "OSCAL Exported", description: `Ready for ${regulatoryBody} consumption.` });
  };

  const stats = [
    { labelKey: "results.stats.clauses", value: result.triggeredClauses.length, icon: Scale },
    { labelKey: "results.stats.actions", value: remediationItems.length, icon: Wrench },
    { labelKey: "results.stats.maxFine", value: isCbnFramework ? "N1M/day" : isSecFramework ? "License Revocation" : "N10M", icon: Banknote },
  ];

  const getScoreDisplayColor = (score: number) => score <= 30 ? "text-secondary" : score <= 60 ? "text-accent" : "text-destructive";

  const handleStepChange = (stepId: "analyze" | "understand" | "fix") => setActiveStep(stepId);

  const handleReset = () => { forceScrollToTop(); setTimeout(() => onReset(), 50); };

  const evidenceCount = Object.keys(getEvidenceMap()).length;

  const getExplanationText = () => {
    const riskLevel = result.riskLevel;
    const key = `scanner.explanation.${riskLevel}`;
    return t(key, { appName: result.appName || t('results.yourApp') });
  };

  return (
    <div className="animate-fade-in-up space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <button onClick={handleReset} className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors">
          <ArrowLeft className="w-4 h-4" /> {t('results.newScan')}
        </button>
        <div className="flex items-center gap-2">
          {evidenceCount > 0 && (
            <div className="flex items-center gap-1 text-xs text-secondary bg-secondary/10 px-2 py-1 rounded-full">
              <FileCheck className="w-3 h-3" />{evidenceCount} file{evidenceCount !== 1 ? "s" : ""}
            </div>
          )}
          <button onClick={handleExportOSCAL} className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-border bg-card hover:bg-muted/60 text-xs font-semibold transition-all">
            <FileJson className="w-3.5 h-3.5" />OSCAL
          </button>
          <button onClick={handleDownloadPDF} className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:opacity-90 active:scale-[0.97] transition-all">
            <Download className="w-3.5 h-3.5" />{t('common.download')}
          </button>
        </div>
      </div>

      <div className="text-xs font-medium px-3 py-1.5 rounded-full inline-flex items-center gap-2 bg-primary/10 text-primary">
        <Shield className="w-3 h-3" />{frameworkDisplayName}
      </div>

      <div className="flex rounded-2xl bg-muted p-1 gap-0.5">
        {steps.map((s, i) => {
          const Icon = s.icon;
          const isActive = activeStep === s.id;
          return (
            <button key={s.id} onClick={() => handleStepChange(s.id)}
              className={`flex-1 py-2.5 rounded-xl text-xs font-semibold transition-all duration-300 flex items-center justify-center gap-1.5 ${
                isActive ? "bg-primary text-primary-foreground shadow-card" : "text-muted-foreground hover:text-foreground"
              }`}>
              <Icon className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{t(s.labelKey)}</span>
              <span className="sm:hidden">{i + 1}</span>
            </button>
          );
        })}
      </div>

      <div key={activeStep} className="animate-fade-in">
        {activeStep === "analyze" && (
          <div className="space-y-5">
            <div className="relative text-center py-8 rounded-2xl bg-gradient-to-br from-card via-card to-muted/40 border border-border shadow-card overflow-hidden">
              <div className="absolute inset-0 bg-primary opacity-[0.04] pointer-events-none" />
              <div className="relative inline-flex items-center justify-center mb-4">
                <svg className="w-36 h-36 -rotate-90" viewBox="0 0 144 144">
                  <circle cx="72" cy="72" r="62" strokeWidth="10" className="fill-none stroke-muted" />
                  <circle cx="72" cy="72" r="62" strokeWidth="10" strokeLinecap="round"
                    className={`fill-none ${cfg.color} transition-all duration-1000 ease-out`}
                    stroke="currentColor" strokeDasharray={`${(currentRiskScore / 100) * 389.56} 389.56`}
                    style={{ filter: "drop-shadow(0 0 8px currentColor)" }} />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className={`text-4xl font-heading font-bold ${getScoreDisplayColor(currentRiskScore)} tabular-nums`}>{currentRiskScore}</span>
                  <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold mt-0.5">/ 100</span>
                </div>
              </div>
              <span className={`inline-block px-4 py-1.5 rounded-full text-xs font-bold ${cfg.bg} text-primary-foreground ring-4 ${cfg.ring} animate-fade-in`}>
                {t(cfg.labelKey)}
              </span>
              <div className="flex items-center justify-center mt-3">
                <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full ${confidenceLevel.bg} ${confidenceLevel.color}`}>
                  <Shield className="w-3 h-3" />
                  <span className="text-[10px] font-semibold uppercase">{confidenceLevel.label}: {aiConfidence}%</span>
                </div>
              </div>
              <div className="flex items-center justify-center gap-2 mt-3 text-xs text-muted-foreground flex-wrap px-4">
                <span className="font-medium flex items-center gap-1"><FileText className="w-3 h-3" />{result.appName || t('results.yourApp')}</span>
                {sectorProfile && <><span>•</span><span>{sectorProfile.emoji} {sectorProfile.name}</span></>}
                <span>•</span><span>{new Date().toLocaleDateString("en-NG")}</span>
              </div>
              <p className="text-[10px] text-muted-foreground mt-2">
                {t('results.basedOn')} {frameworkDisplayName} • {result.triggeredClauses.length} {result.triggeredClauses.length !== 1 ? t('results.clauses') : t('results.clause')} {t('results.triggered')}
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {stats.map((s, i) => {
                const StatIcon = s.icon;
                return (
                  <div key={s.labelKey} className="rounded-xl border border-border bg-card p-3 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-elevated animate-fade-in-up" style={{ animationDelay: `${i * 0.08}s` }}>
                    <StatIcon className="w-5 h-5 mx-auto text-primary" />
                    <p className="text-lg font-heading font-bold text-foreground mt-1 tabular-nums">{s.value}</p>
                    <p className="text-[10px] text-muted-foreground">{t(s.labelKey)}</p>
                  </div>
                );
              })}
            </div>

            {/* Recommended Compliance Officer Card */}
            {sectorProfile && (
              <div className="rounded-xl border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10 p-5">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-xs font-semibold text-foreground flex items-center gap-2">
                    <Award className="w-4 h-4 text-primary" />
                    {t('results.officer.title')} {t('results.officer.for')} {sectorProfile.name}
                  </h4>
                  {linkedDPCO ? (
                    <span className="text-xs text-secondary bg-secondary/10 px-2 py-1 rounded-full flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />{t('results.officer.linked')}
                    </span>
                  ) : (
                    <button onClick={handleLinkToDPCO} disabled={linkingDPCO}
                      className="text-xs px-3 py-1.5 rounded-lg bg-primary text-primary-foreground font-semibold hover:opacity-90 disabled:opacity-50 flex items-center gap-1">
                      {linkingDPCO ? <Loader2 className="w-3 h-3 animate-spin" /> : <UserPlus className="w-3 h-3" />}
                      {linkingDPCO ? t('results.officer.linking') : t('results.officer.linkOfficer')}
                    </button>
                  )}
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <Shield className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-foreground">{officer.name}</p>
                    <p className="text-xs text-primary font-medium">{officer.role}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Specializes in {sectorProfile.name} compliance.
                    </p>
                    <div className="flex flex-wrap items-center gap-3 mt-2">
                      <a href={`mailto:${officer.email}`} className="text-xs text-primary hover:underline flex items-center gap-1">
                        <Mail className="w-3 h-3" /> {officer.email}
                      </a>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> {officer.location}
                      </span>
                    </div>
                  </div>
                </div>
                {!linkedDPCO && (
                  <p className="text-[10px] text-muted-foreground mt-4 pt-3 border-t border-border/50">
                    {t('results.officer.linkMessage')}
                  </p>
                )}
              </div>
            )}

            <button onClick={() => handleStepChange("understand")} className="w-full py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-all flex items-center justify-center gap-2 group">
              {t('results.understandImpact')} <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        )}

        {activeStep === "understand" && (
          <div className="space-y-5">
            <div className="rounded-xl border border-border bg-card p-5">
              <h4 className="font-heading font-semibold text-foreground text-sm mb-2 flex items-center gap-2"><Brain className="w-4 h-4 text-primary" />{t('results.plainEnglish')}</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">{getExplanationText()}</p>
            </div>
            <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-5">
              <h4 className="font-heading font-semibold text-destructive text-sm mb-2 flex items-center gap-2"><AlertTriangle className="w-4 h-4" />{t('results.consequences.title')}</h4>
              <ul className="text-xs text-muted-foreground space-y-1.5">
                {isCbnFramework && <li>{t('results.consequences.fine')}</li>}
                {isSecFramework && <li>{t('results.consequences.suspension')}</li>}
                {isNitdaFramework && <li>{t('results.consequences.enforcement')}</li>}
                {!isCbnFramework && !isSecFramework && !isNitdaFramework && <li>{t('results.consequences.fine')}</li>}
                <li>{t('results.consequences.enforcement')}</li>
                <li>{t('results.consequences.suspension')}</li>
                {result.riskLevel === "critical" && <li>{t('results.consequences.prosecution')}</li>}
              </ul>
            </div>
            {result.triggeredClauses.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-heading font-semibold text-foreground text-sm">{t('results.triggeredClauses')} ({result.triggeredClauses.length})</h4>
                {result.triggeredClauses.map((clause: any, i: number) => (
                  <div key={clause.id} className="rounded-xl border border-border bg-card p-4 shadow-card animate-fade-in-up" style={{ animationDelay: `${i * 0.06}s` }}>
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-xs font-semibold bg-primary text-primary-foreground px-2.5 py-0.5 rounded-full">{clause.article_ref || clause.id}</span>
                      <span className="text-[10px] text-muted-foreground capitalize">{clause.category?.replace(/_/g, " ") || "regulation"}</span>
                    </div>
                    <h5 className="font-heading font-semibold text-foreground text-sm">{clause.title}</h5>
                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{clause.summary}</p>
                    {clause.penalty_info && <p className="text-xs text-destructive mt-1.5 font-medium flex items-center gap-1"><AlertTriangle className="w-3 h-3" />{clause.penalty_info}</p>}
                  </div>
                ))}
              </div>
            )}
            <div className="flex gap-3">
              <button onClick={() => handleStepChange("analyze")} className="flex-1 py-3 rounded-xl border-2 border-border bg-card text-foreground font-semibold hover:bg-muted/60 transition-all text-sm">
                <ArrowLeft className="w-4 h-4 inline mr-1" />{t('results.backToAnalyze')}
              </button>
              <button onClick={() => handleStepChange("fix")} className="flex-1 py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-all flex items-center justify-center gap-1 text-sm">
                {t('results.fixIt')} <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {activeStep === "fix" && (
          <div className="space-y-5">
            <RemediationChecklist
              items={remediationItems}
              storageKey={`regtrack-checklist-${result.appName || "app"}`}
              initialRiskScore={result.riskScore}
              userSector={result.sector || "other"}
              appId={result.assessmentId}
              onRiskScoreUpdate={handleRiskScoreUpdate}
            />
            <div className="flex gap-2">
              <button onClick={handleExportOSCAL} className="flex-1 py-3.5 rounded-xl border border-primary/30 bg-primary/5 text-primary font-semibold hover:bg-primary/10 active:scale-[0.98] transition-all flex items-center justify-center gap-2">
                <FileJson className="w-4 h-4" />OSCAL
              </button>
              <button onClick={handleDownloadPDF} className="flex-1 py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2">
                <Download className="w-4 h-4" />{t('results.downloadPDF')}
              </button>
            </div>
            <button onClick={() => handleStepChange("understand")} className="w-full py-3 rounded-xl border-2 border-border bg-card text-foreground font-semibold hover:bg-muted/60 transition-all text-sm">
              <ArrowLeft className="w-4 h-4 inline mr-1" />{t('results.backToImpact')}
            </button>
          </div>
        )}
      </div>

      <button onClick={handleReset} className="w-full py-3 rounded-xl border border-border text-muted-foreground font-medium hover:bg-muted/60 active:scale-[0.98] transition-all text-sm">
        <RotateCcw className="w-4 h-4 inline mr-1" />{t('results.scanAnother')}
      </button>
    </div>
  );
};

export default RiskResults;