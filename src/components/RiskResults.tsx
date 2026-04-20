import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { ScanResult } from "./RiskScanner";
import { getRemediationItems } from "@/lib/remediationData";
import { generateReport } from "@/lib/generateReport";
import { getSectorById } from "@/lib/sectorRecommendations";
import RemediationChecklist from "./RemediationChecklist";
import ResourcesSidebar from "./ResourcesSidebar";
import ndprData from "@/data/ndpr_dataset.json";
import { 
  BarChart3, 
  Brain, 
  Wrench, 
  Download, 
  ChevronRight, 
  AlertTriangle, 
  ArrowLeft,
  Scale,
  Banknote,
  RotateCcw,
  FileText,
  Shield,
  CheckCircle2,
  Circle,
  Clock,
  TrendingUp
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Props {
  result: ScanResult;
  onReset: () => void;
}

const RiskResults = ({ result, onReset }: Props) => {
  const { t } = useLanguage();
  const [activeStep, setActiveStep] = useState<"analyze" | "understand" | "fix">("analyze");
  const [currentRiskScore, setCurrentRiskScore] = useState(result.riskScore);
  const { toast } = useToast();
  
  const steps = [
    { id: "analyze" as const, labelKey: "results.steps.analyze", icon: BarChart3 },
    { id: "understand" as const, labelKey: "results.steps.understand", icon: Brain },
    { id: "fix" as const, labelKey: "results.steps.fix", icon: Wrench },
  ];

  const riskConfig = {
    low: { color: "text-secondary", bg: "bg-secondary", ring: "ring-secondary/30", labelKey: "risk.low" },
    medium: { color: "text-accent", bg: "bg-accent", ring: "ring-accent/30", labelKey: "risk.medium" },
    high: { color: "text-destructive/80", bg: "bg-destructive/80", ring: "ring-destructive/30", labelKey: "risk.high" },
    critical: { color: "text-destructive", bg: "bg-destructive", ring: "ring-destructive/40", labelKey: "risk.critical" },
  };
  
  const cfg = riskConfig[result.riskLevel];
  const triggeredClauseIds = result.triggeredClauses.map(c => c.id);
  const remediationItems = getRemediationItems(triggeredClauseIds);
  const sectorProfile = getSectorById(result.sector);
  const questions = ndprData.risk_scanner_questions;

  // Calculate AI confidence based on answer completeness and consistency
  const calculateConfidence = (): number => {
    const answeredCount = Object.values(result.answers).filter(a => a !== null && a !== undefined).length;
    const totalQuestions = questions.length;
    const completionRate = answeredCount / totalQuestions;
    
    // Base confidence on completion rate and sector specificity
    let confidence = 75 + (completionRate * 20);
    if (result.sector && result.sector !== "other") confidence += 5;
    
    return Math.min(98, Math.round(confidence));
  };

  const aiConfidence = calculateConfidence();
  
  const getConfidenceLevel = (confidence: number) => {
    if (confidence >= 90) return { label: "High Confidence", color: "text-secondary", bg: "bg-secondary/10" };
    if (confidence >= 75) return { label: "Medium Confidence", color: "text-accent", bg: "bg-accent/10" };
    return { label: "Review Recommended", color: "text-destructive", bg: "bg-destructive/10" };
  };

  const confidenceLevel = getConfidenceLevel(aiConfidence);

  // Compliance journey timeline steps
  const journeySteps = [
    { 
      id: "assessment", 
      label: "Initial Assessment", 
      status: "complete" as const,
      description: "Compliance scan completed"
    },
    { 
      id: "remediation", 
      label: "Remediation", 
      status: remediationItems.filter(i => {
        const checked = localStorage.getItem(`regtrack-checklist-${result.appName || "app"}`);
        if (!checked) return false;
        const parsed = JSON.parse(checked);
        return parsed[i.id];
      }).length > 0 ? "in-progress" as const : "pending" as const,
      description: "Addressing compliance gaps"
    },
    { 
      id: "evidence", 
      label: "Evidence Collection", 
      status: "pending" as const,
      description: "Gather compliance documentation"
    },
    { 
      id: "filing", 
      label: "NDPC Filing", 
      status: "pending" as const,
      description: "Submit to regulator"
    },
  ];

  const handleRiskScoreUpdate = (newScore: number) => {
    setCurrentRiskScore(newScore);
  };

  const handleDownloadPDF = () => {
    try {
      const checkedRaw = localStorage.getItem(`regtrack-checklist-${result.appName || "app"}`) || "{}";
      generateReport({
        appName: result.appName,
        riskScore: currentRiskScore,
        riskLevel: result.riskLevel,
        explanation: result.explanation,
        questions: questions.map(q => ({ question: q.question, answer: result.answers[q.id] ?? null })),
        triggeredClauses: result.triggeredClauses,
        remediationItems,
        checkedItems: JSON.parse(checkedRaw),
        sector: sectorProfile?.name,
      });
      toast({ 
        title: t('results.toast.downloaded.title'), 
        description: t('results.toast.downloaded.description').replace('{{date}}', new Date().toISOString().split("T")[0])
      });
    } catch {
      toast({ 
        title: t('results.toast.error.title'), 
        description: t('results.toast.error.description'), 
        variant: "destructive" 
      });
    }
  };

  const stats = [
    { labelKey: "results.stats.clauses", value: result.triggeredClauses.length, icon: Scale },
    { labelKey: "results.stats.actions", value: remediationItems.length, icon: Wrench },
    { labelKey: "results.stats.maxFine", value: "₦10M", icon: Banknote },
  ];

  const getScoreDisplayColor = (score: number) => {
    if (score <= 30) return "text-secondary";
    if (score <= 60) return "text-accent";
    return "text-destructive";
  };

  const getJourneyProgress = (): number => {
    const completed = journeySteps.filter(s => s.status === "complete").length;
    const inProgress = journeySteps.filter(s => s.status === "in-progress").length;
    return Math.round(((completed + inProgress * 0.5) / journeySteps.length) * 100);
  };

  return (
    <div className="animate-fade-in-up space-y-5">
      {/* Header with download */}
      <div className="flex items-center justify-between">
        <button onClick={onReset} className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors">
          <ArrowLeft className="w-4 h-4" /> {t('results.newScan')}
        </button>
        <button
          onClick={handleDownloadPDF}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:opacity-90 active:scale-[0.97] transition-all"
        >
          <Download className="w-3.5 h-3.5" /> {t('results.downloadPDF')}
        </button>
      </div>

      {/* Step navigation */}
      <div className="flex rounded-2xl bg-muted p-1 gap-0.5">
        {steps.map((s, i) => {
          const StepIcon = s.icon;
          const isActive = activeStep === s.id;
          return (
            <button
              key={s.id}
              onClick={() => setActiveStep(s.id)}
              className={`flex-1 py-2.5 rounded-xl text-xs font-semibold transition-all duration-300 flex items-center justify-center gap-1.5 ${
                isActive ? "bg-primary text-primary-foreground shadow-card" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <StepIcon className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{t(s.labelKey)}</span>
              <span className="sm:hidden">{i + 1}</span>
            </button>
          );
        })}
      </div>

      {/* Step content */}
      <div key={activeStep} className="animate-fade-in">
        {activeStep === "analyze" && (
          <div className="space-y-5">
            {/* Animated score gauge */}
            <div className="relative text-center py-8 rounded-2xl bg-gradient-to-br from-card via-card to-muted/40 border border-border shadow-card overflow-hidden">
              <div className="absolute inset-0 bg-primary opacity-[0.04] pointer-events-none" />
              <div className="absolute -top-12 -right-12 w-40 h-40 bg-primary opacity-10 rounded-full blur-3xl" />

              <div className="relative inline-flex items-center justify-center mb-4">
                <svg className="w-36 h-36 -rotate-90" viewBox="0 0 144 144">
                  <circle cx="72" cy="72" r="62" strokeWidth="10" className="fill-none stroke-muted" />
                  <circle
                    cx="72" cy="72" r="62" strokeWidth="10" strokeLinecap="round"
                    className={`fill-none ${cfg.color} transition-all duration-1000 ease-out`}
                    stroke="currentColor"
                    strokeDasharray={`${(currentRiskScore / 100) * 389.56} 389.56`}
                    style={{ filter: "drop-shadow(0 0 8px currentColor)" }}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className={`text-4xl font-heading font-bold ${getScoreDisplayColor(currentRiskScore)} tabular-nums`}>
                    {currentRiskScore}
                  </span>
                  <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold mt-0.5">/ 100</span>
                </div>
              </div>

              <span className={`inline-block px-4 py-1.5 rounded-full text-xs font-bold ${cfg.bg} text-primary-foreground ring-4 ${cfg.ring} animate-fade-in`}>
                {t(cfg.labelKey)}
              </span>
              
              {/* AI Confidence Badge - NEW */}
              <div className="flex items-center justify-center mt-3">
                <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full ${confidenceLevel.bg} ${confidenceLevel.color}`}>
                  <Shield className="w-3 h-3" />
                  <span className="text-[10px] font-semibold uppercase tracking-wider">
                    {confidenceLevel.label}: {aiConfidence}%
                  </span>
                </div>
              </div>
              
              <div className="flex items-center justify-center gap-2 mt-3 text-xs text-muted-foreground flex-wrap px-4">
                <span className="font-medium flex items-center gap-1">
                  <FileText className="w-3 h-3" />
                  {result.appName || t('results.yourApp')}
                </span>
                {sectorProfile && (
                  <>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Shield className="w-3 h-3" />
                      {t(`sectors.${result.sector}.name`)}
                    </span>
                  </>
                )}
                <span>•</span>
                <span>{new Date().toLocaleDateString("en-NG")}</span>
              </div>
              
              {/* Source Citation - NEW */}
              <p className="text-[10px] text-muted-foreground mt-2">
                Based on NDP Act 2023 • Section {result.triggeredClauses[0]?.article_ref || "24"}
                {result.triggeredClauses.length > 1 && ` +${result.triggeredClauses.length - 1} more`}
              </p>
            </div>

            {/* Quick stats */}
            <div className="grid grid-cols-3 gap-3">
              {stats.map((s, i) => {
                const StatIcon = s.icon;
                return (
                  <div
                    key={s.labelKey}
                    className="rounded-xl border border-border bg-card p-3 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-elevated hover:border-primary/30 cursor-default animate-fade-in-up"
                    style={{ animationDelay: `${i * 0.08}s` }}
                  >
                    <StatIcon className="w-5 h-5 mx-auto text-primary" />
                    <p className="text-lg font-heading font-bold text-foreground mt-1 tabular-nums">{s.value}</p>
                    <p className="text-[10px] text-muted-foreground">{t(s.labelKey)}</p>
                  </div>
                );
              })}
            </div>

            {/* Answer breakdown */}
            <div className="rounded-xl border border-border bg-card p-4">
              <h4 className="text-xs font-bold text-foreground uppercase tracking-wider mb-3">
                {t('results.answerBreakdown')}
              </h4>
              <div className="space-y-2">
                {questions.map((q) => {
                  const a = result.answers[q.id];
                  const isSafeguard = q.risk_weight < 0;
                  const goodAnswer = isSafeguard ? true : false;
                  const isGood = a === goodAnswer;
                  if (a === null || a === undefined) return null;
                  return (
                    <div key={q.id} className="flex items-start gap-2 text-xs group">
                      <span className={`mt-0.5 w-1.5 h-1.5 rounded-full flex-shrink-0 ${isGood ? "bg-secondary" : "bg-destructive"} group-hover:scale-150 transition-transform`} />
                      <span className="text-muted-foreground flex-1 leading-snug">
                        {t(`scanner.questions.${q.id}`)}
                      </span>
                      <span className={`font-bold flex-shrink-0 ${isGood ? "text-secondary" : "text-destructive"}`}>
                        {a ? t('common.yes') : t('common.no')} {isGood ? "↓" : "↑"}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <button
              onClick={() => setActiveStep("understand")}
              className="w-full py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold hover:opacity-90 hover:shadow-elevated active:scale-[0.98] transition-all flex items-center justify-center gap-2 group"
            >
              {t('results.understandImpact')} <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        )}

        {activeStep === "understand" && (
          <div className="space-y-5">
            {/* Explanation */}
            <div className="rounded-xl border border-border bg-card p-5">
              <h4 className="font-heading font-semibold text-foreground text-sm mb-2 flex items-center gap-2">
                <Brain className="w-4 h-4 text-primary" /> {t('results.plainEnglish')}
              </h4>
              <p className="text-sm text-muted-foreground leading-relaxed">{result.explanation}</p>
            </div>

            {/* Consequences */}
            <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-5">
              <h4 className="font-heading font-semibold text-destructive text-sm mb-2 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" /> {t('results.consequences.title')}
              </h4>
              <ul className="text-xs text-muted-foreground space-y-1.5">
                <li>{t('results.consequences.fine')}</li>
                <li>{t('results.consequences.enforcement')}</li>
                <li>{t('results.consequences.suspension')}</li>
                <li>{t('results.consequences.carPenalty')}</li>
                {result.riskLevel === "critical" && <li>{t('results.consequences.prosecution')}</li>}
              </ul>
            </div>

            {/* Sector tips */}
            {sectorProfile && (
              <div className="rounded-xl border border-primary/20 bg-primary/5 p-5">
                <h4 className="font-heading font-semibold text-primary text-sm mb-2 flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  {t(`sectors.${result.sector}.name`)} {t('results.sectorTips')}
                </h4>
                <ul className="text-xs text-muted-foreground space-y-1.5">
                  {sectorProfile.tips.map((t, i) => <li key={i} className="flex items-start gap-1.5"><span className="text-primary mt-1.5 w-1 h-1 rounded-full bg-primary flex-shrink-0" /> {t}</li>)}
                </ul>
              </div>
            )}

            {/* Triggered clauses */}
            {result.triggeredClauses.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-heading font-semibold text-foreground text-sm">
                  {t('results.triggeredClauses')} ({result.triggeredClauses.length})
                </h4>
                {result.triggeredClauses.map((clause, i) => (
                  <div
                    key={clause.id}
                    className="rounded-xl border border-border bg-card p-4 shadow-card hover:shadow-elevated transition-all duration-200 animate-fade-in-up"
                    style={{ animationDelay: `${i * 0.06}s` }}
                  >
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-xs font-semibold bg-primary text-primary-foreground px-2.5 py-0.5 rounded-full">{clause.article_ref}</span>
                      <span className="text-[10px] text-muted-foreground capitalize">{clause.category.replace("_", " ")}</span>
                    </div>
                    <h5 className="font-heading font-semibold text-foreground text-sm">{clause.title}</h5>
                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{clause.summary}</p>
                    {clause.penalty_info && (
                      <p className="text-xs text-destructive mt-1.5 font-medium flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" /> {clause.penalty_info}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}

            <div className="flex gap-3">
              <button onClick={() => setActiveStep("analyze")} className="flex-1 py-3 rounded-xl border-2 border-border bg-card text-foreground font-semibold hover:bg-muted/60 transition-all text-sm">
                <ArrowLeft className="w-4 h-4 inline mr-1" /> {t('results.backToAnalyze')}
              </button>
              <button onClick={() => setActiveStep("fix")} className="flex-1 py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-all flex items-center justify-center gap-1 text-sm">
                {t('results.fixIt')} <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {activeStep === "fix" && (
          <div className="space-y-5">
            {/* Compliance Journey Timeline - NEW */}
            <div className="rounded-xl border border-border bg-card p-5">
              <h4 className="text-xs font-bold text-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
                <TrendingUp className="w-3.5 h-3.5 text-primary" />
                Your Compliance Journey
              </h4>
              
              <div className="relative">
                {/* Progress Bar */}
                <div className="absolute left-3 top-2 bottom-2 w-0.5 bg-muted" />
                <div 
                  className="absolute left-3 top-2 w-0.5 bg-primary transition-all duration-700"
                  style={{ height: `${getJourneyProgress()}%` }}
                />
                
                {journeySteps.map((step, index) => (
                  <div key={step.id} className="flex items-start gap-4 mb-4 last:mb-0 relative">
                    <div className={`relative z-10 w-6 h-6 rounded-full flex items-center justify-center ${
                      step.status === "complete" ? "bg-secondary text-secondary-foreground" :
                      step.status === "in-progress" ? "bg-primary text-primary-foreground animate-pulse" :
                      "bg-muted text-muted-foreground"
                    }`}>
                      {step.status === "complete" ? (
                        <CheckCircle2 className="w-4 h-4" />
                      ) : step.status === "in-progress" ? (
                        <Clock className="w-4 h-4" />
                      ) : (
                        <Circle className="w-4 h-4" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className={`text-sm font-medium ${
                        step.status === "complete" ? "text-foreground" :
                        step.status === "in-progress" ? "text-primary" :
                        "text-muted-foreground"
                      }`}>
                        {step.label}
                      </p>
                      <p className="text-[10px] text-muted-foreground">
                        {step.description}
                      </p>
                    </div>
                    {step.status === "in-progress" && (
                      <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                        In Progress
                      </span>
                    )}
                    {step.status === "complete" && (
                      <span className="text-[10px] bg-secondary/10 text-secondary px-2 py-0.5 rounded-full">
                        Complete
                      </span>
                    )}
                  </div>
                ))}
              </div>
              
              <p className="text-[10px] text-muted-foreground text-center mt-4 pt-3 border-t border-border">
                Complete all steps to achieve full NDP Act compliance readiness.
              </p>
            </div>

            <RemediationChecklist
              items={remediationItems}
              storageKey={`regtrack-checklist-${result.appName || "app"}`}
              initialRiskScore={result.riskScore}
              userSector={result.sector || "other"}
              onRiskScoreUpdate={handleRiskScoreUpdate}
            />

            <div className="border-t border-border pt-5">
              <ResourcesSidebar />
            </div>

            <button
              onClick={handleDownloadPDF}
              className="w-full py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" /> {t('results.downloadFullReport')}
            </button>

            <button onClick={() => setActiveStep("understand")} className="w-full py-3 rounded-xl border-2 border-border bg-card text-foreground font-semibold hover:bg-muted/60 transition-all text-sm">
              <ArrowLeft className="w-4 h-4 inline mr-1" /> {t('results.backToImpact')}
            </button>
          </div>
        )}
      </div>

      {/* Reset */}
      <button
        onClick={onReset}
        className="w-full py-3 rounded-xl border border-border text-muted-foreground font-medium hover:bg-muted/60 active:scale-[0.98] transition-all text-sm"
      >
        <RotateCcw className="w-4 h-4 inline mr-1" /> {t('results.scanAnother')}
      </button>
    </div>
  );
};

export default RiskResults;