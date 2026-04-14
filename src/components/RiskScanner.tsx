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

  const questions = ndprData.risk_scanner_questions;

  const handleAnswer = (questionId: string, value: boolean) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const calculateRisk = () => {
    let score = 0;
    const triggeredClauseIds = new Set<string>();

    questions.forEach(q => {
      const answer = answers[q.id];
      if (answer === null || answer === undefined) return;

      // Positive weight questions: "yes" = more risk
      // Negative weight questions: "yes" = less risk (they have protective measures)
      if (q.risk_weight > 0 && answer) {
        score += q.risk_weight;
        q.clause_ids.forEach(id => triggeredClauseIds.add(id));
      } else if (q.risk_weight < 0 && !answer) {
        score += Math.abs(q.risk_weight);
        q.clause_ids.forEach(id => triggeredClauseIds.add(id));
      } else if (q.risk_weight > 0 && !answer) {
        // Not collecting data = no risk for that question
      } else if (q.risk_weight < 0 && answer) {
        // Has protective measure = reduce risk
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
      low: `${appName || "Your app"} has a low NDPR compliance risk. You appear to have basic protections in place, but continue to monitor your data practices.`,
      medium: `${appName || "Your app"} has moderate NDPR compliance risks. Several areas need attention to avoid potential enforcement action by NITDA.`,
      high: `${appName || "Your app"} has significant NDPR compliance risks. Without immediate remediation, you could face fines up to ₦10M or 2% of annual gross revenue.`,
      critical: `${appName || "Your app"} is at critical risk of NDPR violations. Multiple high-risk factors detected. Immediate action required to avoid severe penalties including fines up to ₦10M, service suspension, or criminal prosecution.`,
    };

    setResult({
      riskScore: normalizedScore,
      riskLevel,
      triggeredClauses,
      explanation: explanations[riskLevel],
    });
    setStep("result");
  };

  const allAnswered = questions.every(q => answers[q.id] !== undefined && answers[q.id] !== null);

  const riskColors = {
    low: "bg-primary",
    medium: "bg-accent",
    high: "bg-destructive/80",
    critical: "bg-destructive",
  };

  if (step === "result" && result) {
    return (
      <div className="animate-fade-in-up space-y-6">
        <div className="text-center">
          <div className={`inline-flex items-center justify-center w-24 h-24 rounded-full ${riskColors[result.riskLevel]} mb-4`}>
            <span className="text-3xl font-heading font-bold text-primary-foreground">{result.riskScore}%</span>
          </div>
          <h3 className="text-2xl font-heading font-bold text-foreground capitalize">{result.riskLevel} Risk</h3>
          <p className="text-muted-foreground mt-2 max-w-lg mx-auto">{result.explanation}</p>
        </div>

        {result.triggeredClauses.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-heading font-semibold text-foreground">Triggered NDPR Clauses:</h4>
            {result.triggeredClauses.map(clause => (
              <div key={clause.id} className="rounded-lg border border-border bg-card p-4 shadow-card">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full">{clause.article_ref}</span>
                    <h5 className="font-heading font-semibold text-foreground mt-1">{clause.title}</h5>
                    <p className="text-sm text-muted-foreground mt-1">{clause.summary}</p>
                  </div>
                </div>
                {clause.penalty_info && (
                  <p className="text-xs text-destructive mt-2 font-medium">⚠ {clause.penalty_info}</p>
                )}
              </div>
            ))}
          </div>
        )}

        <button
          onClick={() => { setStep("form"); setResult(null); setAnswers({}); setAppName(""); }}
          className="w-full py-3 rounded-lg border border-border bg-card text-foreground font-medium hover:bg-muted transition-colors"
        >
          Scan Another App
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">What are you building?</label>
        <input
          type="text"
          placeholder="e.g., Period tracker app"
          value={appName}
          onChange={e => setAppName(e.target.value)}
          className="w-full px-4 py-3 rounded-lg border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      <div className="space-y-4">
        {questions.map((q, i) => (
          <div key={q.id} className="rounded-lg border border-border bg-card p-4 shadow-card" style={{ animationDelay: `${i * 0.05}s` }}>
            <p className="text-sm font-medium text-foreground mb-3">{q.question}</p>
            <div className="flex gap-3">
              <button
                onClick={() => handleAnswer(q.id, true)}
                className={`flex-1 py-2 rounded-md text-sm font-medium transition-all ${
                  answers[q.id] === true
                    ? "bg-gradient-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                Yes
              </button>
              <button
                onClick={() => handleAnswer(q.id, false)}
                className={`flex-1 py-2 rounded-md text-sm font-medium transition-all ${
                  answers[q.id] === false
                    ? "bg-secondary text-secondary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                No
              </button>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={calculateRisk}
        disabled={!allAnswered}
        className="w-full py-3.5 rounded-lg bg-gradient-primary text-primary-foreground font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 animate-pulse-glow"
      >
        Calculate Risk Score
      </button>
    </div>
  );
};

export default RiskScanner;
