import { useState } from "react";
import { ScanResult } from "./RiskScanner";
import { getRemediationItems } from "@/lib/remediationData";
import { generateReport } from "@/lib/generateReport";
import { getSectorById } from "@/lib/sectorRecommendations";
import RemediationChecklist from "./RemediationChecklist";
import ResourcesSidebar from "./ResourcesSidebar";
import ndprData from "@/data/ndpr_dataset.json";
import { BarChart3, Brain, Wrench, Download, ChevronRight, AlertTriangle, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Props {
  result: ScanResult;
  onReset: () => void;
}

const steps = [
  { id: "analyze", label: "Analyze", icon: BarChart3 },
  { id: "understand", label: "Understand", icon: Brain },
  { id: "fix", label: "Fix It", icon: Wrench },
] as const;

type StepId = typeof steps[number]["id"];

const riskConfig = {
  low: { color: "text-secondary", bg: "bg-secondary", ring: "ring-secondary/30", label: "Low Risk" },
  medium: { color: "text-accent", bg: "bg-accent", ring: "ring-accent/30", label: "Medium Risk" },
  high: { color: "text-destructive/80", bg: "bg-destructive/80", ring: "ring-destructive/30", label: "High Risk" },
  critical: { color: "text-destructive", bg: "bg-destructive", ring: "ring-destructive/40", label: "Critical Risk" },
};

const RiskResults = ({ result, onReset }: Props) => {
  const [activeStep, setActiveStep] = useState<StepId>("analyze");
  const { toast } = useToast();
  const cfg = riskConfig[result.riskLevel];
  const triggeredClauseIds = result.triggeredClauses.map(c => c.id);
  const remediationItems = getRemediationItems(triggeredClauseIds);
  const sectorProfile = getSectorById(result.sector);
  const questions = ndprData.risk_scanner_questions;

  const handleDownloadPDF = () => {
    try {
      const checkedRaw = localStorage.getItem(`regtrack-checklist-${result.appName || "app"}`) || "{}";
      generateReport({
        appName: result.appName,
        riskScore: result.riskScore,
        riskLevel: result.riskLevel,
        explanation: result.explanation,
        questions: questions.map(q => ({ question: q.question, answer: result.answers[q.id] ?? null })),
        triggeredClauses: result.triggeredClauses,
        remediationItems,
        checkedItems: JSON.parse(checkedRaw),
        sector: sectorProfile?.name,
      });
      toast({ title: "📄 Report downloaded!", description: `RegTrack_Report_${new Date().toISOString().split("T")[0]}.pdf` });
    } catch {
      toast({ title: "Error", description: "Failed to generate PDF. Please try again.", variant: "destructive" });
    }
  };

  return (
    <div className="animate-fade-in-up space-y-5">
      {/* Header with download */}
      <div className="flex items-center justify-between">
        <button onClick={onReset} className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors">
          <ArrowLeft className="w-4 h-4" /> New Scan
        </button>
        <button
          onClick={handleDownloadPDF}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-gradient text-primary-foreground text-xs font-semibold hover:opacity-90 active:scale-[0.97] transition-all"
        >
          <Download className="w-3.5 h-3.5" /> Download PDF
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
                isActive ? "bg-brand-gradient text-primary-foreground shadow-card" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <StepIcon className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{s.label}</span>
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
              <div className="absolute inset-0 bg-brand-gradient opacity-[0.04] pointer-events-none" />
              <div className="absolute -top-12 -right-12 w-40 h-40 bg-brand-gradient opacity-10 rounded-full blur-3xl" />

              {/* SVG circular progress */}
              <div className="relative inline-flex items-center justify-center mb-4">
                <svg className="w-36 h-36 -rotate-90" viewBox="0 0 144 144">
                  <circle cx="72" cy="72" r="62" strokeWidth="10" className="fill-none stroke-muted" />
                  <circle
                    cx="72" cy="72" r="62" strokeWidth="10" strokeLinecap="round"
                    className={`fill-none ${cfg.color} transition-all duration-1000 ease-out`}
                    stroke="currentColor"
                    strokeDasharray={`${(result.riskScore / 100) * 389.56} 389.56`}
                    style={{ filter: "drop-shadow(0 0 8px currentColor)" }}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className={`text-4xl font-heading font-bold ${cfg.color} tabular-nums`}>{result.riskScore}</span>
                  <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold mt-0.5">/ 100</span>
                </div>
              </div>

              <span className={`inline-block px-4 py-1.5 rounded-full text-xs font-bold ${cfg.bg} text-primary-foreground ring-4 ${cfg.ring} animate-fade-in`}>
                {cfg.label}
              </span>
              <div className="flex items-center justify-center gap-2 mt-4 text-xs text-muted-foreground flex-wrap px-4">
                <span className="font-medium">📱 {result.appName || "Your App"}</span>
                {sectorProfile && <><span>•</span><span>{sectorProfile.emoji} {sectorProfile.name}</span></>}
                <span>•</span><span>{new Date().toLocaleDateString("en-NG")}</span>
              </div>
            </div>

            {/* Quick stats with hover */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: "Clauses Triggered", value: result.triggeredClauses.length, icon: "⚖️" },
                { label: "Actions Needed", value: remediationItems.length, icon: "🔧" },
                { label: "Max Fine", value: "₦10M", icon: "💰" },
              ].map((s, i) => (
                <div
                  key={s.label}
                  className="rounded-xl border border-border bg-card p-3 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-elevated hover:border-primary/30 cursor-default animate-fade-in-up"
                  style={{ animationDelay: `${i * 0.08}s` }}
                >
                  <span className="text-lg">{s.icon}</span>
                  <p className="text-lg font-heading font-bold text-foreground mt-1 tabular-nums">{s.value}</p>
                  <p className="text-[10px] text-muted-foreground">{s.label}</p>
                </div>
              ))}
            </div>

            {/* Answer breakdown summary */}
            <div className="rounded-xl border border-border bg-card p-4">
              <h4 className="text-xs font-bold text-foreground uppercase tracking-wider mb-3">Answer Breakdown</h4>
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
                      <span className="text-muted-foreground flex-1 leading-snug">{q.question}</span>
                      <span className={`font-bold flex-shrink-0 ${isGood ? "text-secondary" : "text-destructive"}`}>
                        {a ? "Yes" : "No"} {isGood ? "↓" : "↑"}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <button
              onClick={() => setActiveStep("understand")}
              className="w-full py-3.5 rounded-xl bg-brand-gradient text-primary-foreground font-semibold hover:opacity-90 hover:shadow-elevated active:scale-[0.98] transition-all flex items-center justify-center gap-2 group"
            >
              Understand Impact <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        )}

        {activeStep === "understand" && (
          <div className="space-y-5">
            {/* Explanation */}
            <div className="rounded-xl border border-border bg-card p-5">
              <h4 className="font-heading font-semibold text-foreground text-sm mb-2 flex items-center gap-2">
                <Brain className="w-4 h-4 text-primary" /> Plain-English Explanation
              </h4>
              <p className="text-sm text-muted-foreground leading-relaxed">{result.explanation}</p>
            </div>

            {/* Consequences */}
            <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-5">
              <h4 className="font-heading font-semibold text-destructive text-sm mb-2 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" /> Potential Consequences
              </h4>
              <ul className="text-xs text-muted-foreground space-y-1.5">
                <li>• Fines up to <strong className="text-destructive">₦10,000,000</strong> or 2% of annual gross revenue</li>
                <li>• NDPC enforcement notice and investigation</li>
                <li>• Service suspension and public warning</li>
                <li>• Late CAR filing: 50% administrative penalty on filing fee (GAID Art. 10)</li>
                {result.riskLevel === "critical" && <li>• Criminal prosecution under the NDP Act 2023</li>}
              </ul>
            </div>

            {/* Sector tips */}
            {sectorProfile && (
              <div className="rounded-xl border border-primary/20 bg-primary/5 p-5">
                <h4 className="font-heading font-semibold text-primary text-sm mb-2">
                  {sectorProfile.emoji} {sectorProfile.name} Tips
                </h4>
                <ul className="text-xs text-muted-foreground space-y-1.5">
                  {sectorProfile.tips.map((t, i) => <li key={i}>• {t}</li>)}
                </ul>
              </div>
            )}

            {/* Triggered clauses */}
            {result.triggeredClauses.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-heading font-semibold text-foreground text-sm">
                  Triggered Clauses ({result.triggeredClauses.length})
                </h4>
                {result.triggeredClauses.map((clause, i) => (
                  <div
                    key={clause.id}
                    className="rounded-xl border border-border bg-card p-4 shadow-card hover:shadow-elevated transition-all duration-200 animate-fade-in-up"
                    style={{ animationDelay: `${i * 0.06}s` }}
                  >
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-xs font-semibold bg-brand-gradient text-primary-foreground px-2.5 py-0.5 rounded-full">{clause.article_ref}</span>
                      <span className="text-[10px] text-muted-foreground capitalize">{clause.category.replace("_", " ")}</span>
                    </div>
                    <h5 className="font-heading font-semibold text-foreground text-sm">{clause.title}</h5>
                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{clause.summary}</p>
                    {clause.penalty_info && (
                      <p className="text-xs text-destructive mt-1.5 font-medium flex items-center gap-1">
                        <span>⚠</span> {clause.penalty_info}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}

            <div className="flex gap-3">
              <button onClick={() => setActiveStep("analyze")} className="flex-1 py-3 rounded-xl border-2 border-border bg-card text-foreground font-semibold hover:bg-muted/60 transition-all text-sm">
                ← Analyze
              </button>
              <button onClick={() => setActiveStep("fix")} className="flex-1 py-3 rounded-xl bg-brand-gradient-vivid text-primary-foreground font-semibold hover:opacity-90 transition-all flex items-center justify-center gap-1 text-sm">
                Fix It <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {activeStep === "fix" && (
          <div className="space-y-5">
            <RemediationChecklist
              items={remediationItems}
              storageKey={`regtrack-checklist-${result.appName || "app"}`}
            />

            {/* Resources */}
            <div className="border-t border-border pt-5">
              <ResourcesSidebar />
            </div>

            {/* Download */}
            <button
              onClick={handleDownloadPDF}
              className="w-full py-3.5 rounded-xl bg-brand-gradient text-primary-foreground font-semibold hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" /> Download Full Report (PDF)
            </button>

            <button onClick={() => setActiveStep("understand")} className="w-full py-3 rounded-xl border-2 border-border bg-card text-foreground font-semibold hover:bg-muted/60 transition-all text-sm">
              ← Back to Impact
            </button>
          </div>
        )}
      </div>

      {/* Reset */}
      <button
        onClick={onReset}
        className="w-full py-3 rounded-xl border border-border text-muted-foreground font-medium hover:bg-muted/60 active:scale-[0.98] transition-all text-sm"
      >
        🔄 Scan Another App
      </button>
    </div>
  );
};

export default RiskResults;
