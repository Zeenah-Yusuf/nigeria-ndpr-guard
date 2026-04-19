import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
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
  const { t } = useLanguage();
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
      let score = 35;
      const triggeredClauseIds = new Set<string>();

      questions.forEach(q => {
        const answer = answers[q.id];
        if (answer === null || answer === undefined) return;
        const w = q.risk_weight;

        if (w > 0) {
          if (answer) {
            score += w * 4;
            q.clause_ids.forEach(id => triggeredClauseIds.add(id));
          } else {
            score -= Math.ceil(w * 1.5);
          }
        } else if (w < 0) {
          if (answer) {
            score -= Math.abs(w) * 4;
          } else {
            score += Math.abs(w) * 4;
            q.clause_ids.forEach(id => triggeredClauseIds.add(id));
          }
        }
      });

      const sectorProfile = getSectorById(sector);
      const highRiskSectors = ["health", "fintech"];
      if (sectorProfile) {
        sectorProfile.recommendedClauses.forEach(id => triggeredClauseIds.add(id));
        if (highRiskSectors.includes(sector)) score += 6;
      }

      const normalizedScore = Math.max(0, Math.min(100, Math.round(score)));
      const triggeredClauses = ndprData.clauses.filter(c => triggeredClauseIds.has(c.id));

      const riskLevel: ScanResult["riskLevel"] =
        normalizedScore <= 25 ? "low" :
        normalizedScore <= 50 ? "medium" :
        normalizedScore <= 75 ? "high" : "critical";

      const appDisplayName = appName || t('scanner.defaultAppName');

      const explanations: Record<string, string> = {
        low: t('scanner.explanation.low').replace('{{appName}}', appDisplayName),
        medium: t('scanner.explanation.medium').replace('{{appName}}', appDisplayName),
        high: t('scanner.explanation.high').replace('{{appName}}', appDisplayName),
        critical: t('scanner.explanation.critical').replace('{{appName}}', appDisplayName),
      };

      setResult({ 
        riskScore: normalizedScore, 
        riskLevel, 
        triggeredClauses, 
        explanation: explanations[riskLevel], 
        appName, 
        sector, 
        answers 
      });
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
        <span>{t('scanner.progress.answered', { current: answeredCount, total: questions.length })}</span>
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
        <label className="block text-sm font-medium text-foreground mb-2">
          {t('scanner.appName.label')}
        </label>
        <input
          type="text"
          placeholder={t('scanner.appName.placeholder')}
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
            <p className="text-xs font-semibold text-primary mb-1">
              {sp.emoji} {t(`sectors.${sector}.name`)} — {t('scanner.sector.keyRisks')}
            </p>
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
        {questions.map((q, idx) => {
          const isAnswered = answers[q.id] !== undefined && answers[q.id] !== null;
          const isSafeguard = q.risk_weight < 0;
          const goodAnswer = isSafeguard ? true : false;
          const userAnswer = answers[q.id];
          const isGood = isAnswered && userAnswer === goodAnswer;

          return (
            <div
              key={q.id}
              className={`group rounded-xl border bg-card p-4 transition-all duration-300 hover:shadow-elevated hover:-translate-y-0.5 animate-fade-in-up ${
                isAnswered
                  ? isGood
                    ? "border-secondary/40 shadow-card"
                    : "border-destructive/30 shadow-card"
                  : "border-border hover:border-primary/30"
              }`}
              style={{ animationDelay: `${idx * 0.04}s` }}
            >
              <div className="flex items-start gap-2 mb-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-muted text-muted-foreground text-[11px] font-bold flex items-center justify-center group-hover:bg-brand-gradient group-hover:text-primary-foreground transition-all duration-300">
                  {idx + 1}
                </span>
                <p className="text-sm font-medium text-foreground leading-relaxed flex-1">
                  {t(`scanner.questions.${q.id}`)}
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => handleAnswer(q.id, true)}
                  className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 active:scale-[0.97] hover:scale-[1.02] ${
                    answers[q.id] === true
                      ? isSafeguard
                        ? "bg-secondary text-secondary-foreground shadow-sm ring-2 ring-secondary/40"
                        : "bg-destructive/90 text-destructive-foreground shadow-sm ring-2 ring-destructive/30"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  {t('common.yes')}
                </button>
                <button
                  onClick={() => handleAnswer(q.id, false)}
                  className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 active:scale-[0.97] hover:scale-[1.02] ${
                    answers[q.id] === false
                      ? isSafeguard
                        ? "bg-destructive/90 text-destructive-foreground shadow-sm ring-2 ring-destructive/30"
                        : "bg-secondary text-secondary-foreground shadow-sm ring-2 ring-secondary/40"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  {t('common.no')}
                </button>
              </div>
              {isAnswered && (
                <div className="mt-2.5 border-t border-border pt-2.5 animate-fade-in space-y-1.5">
                  <p className={`text-[11px] font-semibold flex items-center gap-1 ${isGood ? "text-secondary" : "text-destructive"}`}>
                    {isGood ? t('scanner.feedback.lowers') : t('scanner.feedback.increases')}
                  </p>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    💡 {t(`scanner.explanations.${q.id}`)}
                  </p>
                </div>
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
            {t('scanner.analyzing')}
          </>
        ) : (
          <>🛡 {t('scanner.calculate')}</>
        )}
      </button>
    </div>
  );
};

export default RiskScanner;