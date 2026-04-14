import { useState } from "react";
import ndprData from "@/data/ndpr_dataset.json";

interface ScanResult {
  riskScore: number;
  riskLevel: "low" | "medium" | "high" | "critical";
  triggeredClauses: typeof ndprData.clauses;
  explanation: string;
}

const RiskScanner = () => {
  const [answers, setAnswers] = useState<Record<string, boolean | null>>({});
  const [appName, setAppName] = useState("");
  const [result, setResult] = useState<ScanResult | null>(null);
  const [step, setStep] = useState<"form" | "result">("form");
  const [calculating, setCalculating] = useState(false);

  const questions = ndprData.risk_scanner_questions;

  const handleAnswer = (questionId: string, value: boolean) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const calculateRisk = () => {
    setCalculating(true);
    // Simulate brief processing for UX feel
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

      const maxScore = questions.reduce((sum, q) => sum + Math.abs(q.risk_weight), 0);
      const normalizedScore = Math.round((score / maxScore) * 100);
      const triggeredClauses = ndprData.clauses.filter(c => triggeredClauseIds.has(c.id));

      const riskLevel: ScanResult["riskLevel"] =
        normalizedScore <= 25 ? "low" :
        normalizedScore <= 50 ? "medium" :
        normalizedScore <= 75 ? "high" : "critical";

      const explanations: Record<string, string> = {
        low: `"${appName || "Your app"}" has a low NDPR compliance risk. Basic protections appear to be in place. Continue monitoring your data practices.`,
        medium: `"${appName || "Your app"}" has moderate NDPR risks. Several areas need attention to avoid potential NITDA enforcement.`,
        high: `"${appName || "Your app"}" has significant NDPR risks. Without remediation, you could face fines up to ₦10M or 2% of annual gross revenue.`,
        critical: `"${appName || "Your app"}" is at critical risk! Multiple high-risk factors detected. Immediate action required to avoid severe penalties.`,
      };

      setResult({ riskScore: normalizedScore, riskLevel, triggeredClauses, explanation: explanations[riskLevel] });
      setStep("result");
      setCalculating(false);
    }, 800);
  };

  const allAnswered = questions.every(q => answers[q.id] !== undefined && answers[q.id] !== null);
  const answeredCount = questions.filter(q => answers[q.id] !== undefined && answers[q.id] !== null).length;

  const riskConfig = {
    low: { color: "text-secondary", bg: "bg-secondary", ring: "ring-secondary/30" },
    medium: { color: "text-accent", bg: "bg-accent", ring: "ring-accent/30" },
    high: { color: "text-destructive/80", bg: "bg-destructive/80", ring: "ring-destructive/30" },
    critical: { color: "text-destructive", bg: "bg-destructive", ring: "ring-destructive/40" },
  };

  if (step === "result" && result) {
    const cfg = riskConfig[result.riskLevel];
    return (
      <div className="animate-fade-in-up space-y-6">
        {/* Score display */}
        <div className="text-center py-6">
          <div className={`inline-flex items-center justify-center w-28 h-28 rounded-full ${cfg.bg} ring-8 ${cfg.ring} mb-5`}>
            <span className="text-4xl font-heading font-bold text-primary-foreground">{result.riskScore}%</span>
          </div>
          <h3 className={`text-2xl font-heading font-bold ${cfg.color} capitalize`}>{result.riskLevel} Risk</h3>
          <p className="text-muted-foreground mt-3 max-w-lg mx-auto text-sm leading-relaxed">{result.explanation}</p>
        </div>

        {/* Triggered clauses */}
        {result.triggeredClauses.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-heading font-semibold text-foreground text-sm">
              Triggered NDPR Clauses ({result.triggeredClauses.length})
            </h4>
            {result.triggeredClauses.map((clause, i) => (
              <div
                key={clause.id}
                className="rounded-xl border border-border bg-card p-4 shadow-card hover:shadow-elevated transition-all duration-200 animate-fade-in-up"
                style={{ animationDelay: `${i * 0.08}s` }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-semibold bg-brand-gradient text-primary-foreground px-2.5 py-0.5 rounded-full">{clause.article_ref}</span>
                  <span className="text-xs text-muted-foreground capitalize">{clause.category.replace("_", " ")}</span>
                </div>
                <h5 className="font-heading font-semibold text-foreground text-sm">{clause.title}</h5>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{clause.summary}</p>
                {clause.penalty_info && (
                  <p className="text-xs text-destructive mt-2 font-medium flex items-center gap-1">
                    <span>⚠</span> {clause.penalty_info}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}

        <button
          onClick={() => { setStep("form"); setResult(null); setAnswers({}); setAppName(""); }}
          className="w-full py-3.5 rounded-xl border-2 border-border bg-card text-foreground font-semibold hover:bg-muted/60 active:scale-[0.98] transition-all duration-200"
        >
          🔄 Scan Another App
        </button>
      </div>
    );
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

      {/* Questions */}
      <div className="space-y-3">
        {questions.map((q, i) => {
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
              {/* Explanation preview on answer */}
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
