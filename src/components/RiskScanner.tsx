import { useState } from "react";
import ndprData from "@/data/ndpr_dataset.json";
import RiskResults from "./RiskResults";
import SectorSelector from "./SectorSelector";
import { getSectorById } from "@/lib/sectorRecommendations";

export interface ScanResult {
  riskScore: number;
  riskLevel: "low" | "medium" | "high" | "critical";
  triggeredClauses: typeof ndprData.clauses;
  explanation: string;
  appName: string;
  sector: string;
  answers: Record<string, boolean | null>;
}

const RiskScanner = () => {
  const [answers, setAnswers] = useState<Record<string, boolean | null>>({});
  const [appName, setAppName] = useState("");
  const [sector, setSector] = useState("");
  const [result, setResult] = useState<ScanResult | null>(null);
  const [step, setStep] = useState<"form" | "result">("form");
  const [calculating, setCalculating] = useState(false);

  const questions = ndprData.risk_scanner_questions;

  const handleAnswer = (questionId: string, value: boolean) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const calculateRisk = () => {
    setCalculating(true);
    setTimeout(() => {
      let score = 0;
      const triggeredClauseIds = new Set<string>();

      questions.forEach(q => {
        const answer = answers[q.id];
        if (answer === null || answer === undefined) return;
        if (q.risk_weight > 0 && answer) {
          score += q.risk_weight;
          q.clause_ids.forEach(id => triggeredClauseIds.add(id));
        } else if (q.risk_weight < 0 && !answer) {
          score += Math.abs(q.risk_weight);
          q.clause_ids.forEach(id => triggeredClauseIds.add(id));
        }
      });

      // Add sector-specific risk boost
      const sectorProfile = getSectorById(sector);
      if (sectorProfile) {
        sectorProfile.recommendedClauses.forEach(id => triggeredClauseIds.add(id));
      }

      const maxScore = questions.reduce((sum, q) => sum + Math.abs(q.risk_weight), 0);
      const normalizedScore = Math.round((score / maxScore) * 100);
      const triggeredClauses = ndprData.clauses.filter(c => triggeredClauseIds.has(c.id));

      const riskLevel: ScanResult["riskLevel"] =
        normalizedScore <= 25 ? "low" :
        normalizedScore <= 50 ? "medium" :
        normalizedScore <= 75 ? "high" : "critical";

      const explanations: Record<string, string> = {
        low: `"${appName || "Your app"}" has a low compliance risk under the NDP Act 2023 and GAID 2025. Basic protections appear to be in place. Continue monitoring your data practices.`,
        medium: `"${appName || "Your app"}" has moderate compliance risks. Several areas need attention to avoid potential NDPC enforcement action.`,
        high: `"${appName || "Your app"}" has significant compliance risks under the NDP Act. Without remediation, you could face fines up to ₦10M or 2% of annual gross revenue.`,
        critical: `"${appName || "Your app"}" is at critical risk! Multiple high-risk factors detected under the NDP Act 2023. Immediate action required to avoid severe NDPC penalties.`,
      };

      setResult({ riskScore: normalizedScore, riskLevel, triggeredClauses, explanation: explanations[riskLevel], appName, sector, answers });
      setStep("result");
      setCalculating(false);
    }, 800);
  };

  const resetScanner = () => {
    setStep("form");
    setResult(null);
    setAnswers({});
    setAppName("");
    setSector("");
  };

  const allAnswered = questions.every(q => answers[q.id] !== undefined && answers[q.id] !== null);
  const answeredCount = questions.filter(q => answers[q.id] !== undefined && answers[q.id] !== null).length;

  if (step === "result" && result) {
    return <RiskResults result={result} onReset={resetScanner} />;
  }

  return (
    <div className="space-y-5">
      {/* Progress indicator */}
      <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
        <span>{answeredCount} of {questions.length} answered</span>
        <div className="flex-1 mx-4 h-1.5 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-brand-gradient rounded-full transition-all duration-500"
            style={{ width: `${(answeredCount / questions.length) * 100}%` }}
          />
        </div>
        <span>{Math.round((answeredCount / questions.length) * 100)}%</span>
      </div>

      {/* App name */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">What are you building?</label>
        <input
          type="text"
          placeholder="e.g., Period tracker app"
          value={appName}
          onChange={e => setAppName(e.target.value)}
          className="w-full px-4 py-3.5 rounded-xl border border-border bg-card text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all duration-200"
        />
      </div>

      {/* Sector selector */}
      <SectorSelector selected={sector} onSelect={setSector} />

      {/* Sector tips */}
      {sector && (() => {
        const sp = getSectorById(sector);
        if (!sp) return null;
        return (
          <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 animate-fade-in">
            <p className="text-xs font-semibold text-primary mb-1">{sp.emoji} {sp.name} — Key Risks</p>
            <ul className="text-xs text-muted-foreground space-y-1">
              {sp.keyRisks.slice(0, 3).map((r, i) => (
                <li key={i} className="flex items-start gap-1.5">
                  <span className="text-primary mt-0.5">•</span> {r}
                </li>
              ))}
            </ul>
          </div>
        );
      })()}

      {/* Questions */}
      <div className="space-y-3">
        {questions.map((q) => {
          const isAnswered = answers[q.id] !== undefined && answers[q.id] !== null;
          return (
            <div
              key={q.id}
              className={`rounded-xl border bg-card p-4 transition-all duration-300 ${
                isAnswered ? "border-primary/20 shadow-card" : "border-border"
              }`}
            >
              <p className="text-sm font-medium text-foreground mb-3 leading-relaxed">{q.question}</p>
              <div className="flex gap-3">
                <button
                  onClick={() => handleAnswer(q.id, true)}
                  className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 active:scale-[0.97] ${
                    answers[q.id] === true
                      ? "bg-brand-gradient text-primary-foreground shadow-sm"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  Yes
                </button>
                <button
                  onClick={() => handleAnswer(q.id, false)}
                  className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 active:scale-[0.97] ${
                    answers[q.id] === false
                      ? "bg-secondary text-secondary-foreground shadow-sm"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  No
                </button>
              </div>
              {isAnswered && (
                <p className="text-xs text-muted-foreground mt-2.5 leading-relaxed animate-fade-in border-t border-border pt-2.5">
                  💡 {q.explanation}
                </p>
              )}
            </div>
          );
        })}
      </div>

      <button
        onClick={calculateRisk}
        disabled={!allAnswered || calculating}
        className="w-full py-4 rounded-xl bg-brand-gradient-vivid text-primary-foreground font-bold text-base transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 active:scale-[0.98] animate-pulse-glow flex items-center justify-center gap-2"
      >
        {calculating ? (
          <>
            <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
            Analyzing...
          </>
        ) : (
          <>🛡 Calculate Risk Score</>
        )}
      </button>
    </div>
  );
};

export default RiskScanner;
