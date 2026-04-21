import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import ndprData from "@/data/ndpr_dataset.json";
import cbnData from "@/data/cbn_dataset.json";
import RiskResults from "./RiskResults";
import SectorSelector from "./SectorSelector";
import QuestionModal from "./QuestionModal";
import { getSectorById } from "@/lib/sectorRecommendations";
import { forceScrollToTop } from "@/components/ScrollToTop";

export interface ScanResult {
  riskScore: number;
  riskLevel: "low" | "medium" | "high" | "critical";
  triggeredClauses: any[];
  explanation: string;
  appName: string;
  sector: string;
  answers: Record<string, boolean | null>;
  framework?: "ndpa" | "cbn";
}

interface RiskScannerProps {
  activeFramework?: "ndpa" | "cbn";
}

const RiskScanner = ({ activeFramework = "ndpa" }: RiskScannerProps) => {
  const { t } = useLanguage();
  const [answers, setAnswers] = useState<Record<string, boolean | null>>({});
  const [appName, setAppName] = useState("");
  const [sector, setSector] = useState("");
  const [result, setResult] = useState<ScanResult | null>(null);
  const [step, setStep] = useState<"form" | "result">("form");
  const [calculating, setCalculating] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showForm, setShowForm] = useState(true);

  // Framework-specific questions
  const ndpaQuestions = ndprData.risk_scanner_questions;
  
  const cbnQuestions = [
    { 
      id: "collectsData", 
      question: t('scanner.cbnQuestions.collectsData'),
      risk_weight: 15, 
      clause_ids: ["cbn-aml-001"],
      explanation: t('scanner.cbnExplanations.collectsData')
    },
    { 
      id: "kycVerification", 
      question: t('scanner.cbnQuestions.kycVerification'),
      risk_weight: 15, 
      clause_ids: ["cbn-aml-001"],
      explanation: t('scanner.cbnExplanations.kycVerification')
    },
    { 
      id: "pepScreening", 
      question: t('scanner.cbnQuestions.pepScreening'),
      risk_weight: 16, 
      clause_ids: ["cbn-aml-002"],
      explanation: t('scanner.cbnExplanations.pepScreening')
    },
    { 
      id: "transactionMonitoring", 
      question: t('scanner.cbnQuestions.transactionMonitoring'),
      risk_weight: 18, 
      clause_ids: ["cbn-aml-002"],
      explanation: t('scanner.cbnExplanations.transactionMonitoring')
    },
    { 
      id: "strFiling", 
      question: t('scanner.cbnQuestions.strFiling'),
      risk_weight: 14, 
      clause_ids: ["cbn-aml-003"],
      explanation: t('scanner.cbnExplanations.strFiling')
    },
    { 
      id: "amlTraining", 
      question: t('scanner.cbnQuestions.amlTraining'),
      risk_weight: 8, 
      clause_ids: ["cbn-aml-005"],
      explanation: t('scanner.cbnExplanations.amlTraining')
    },
    { 
      id: "recordKeeping", 
      question: t('scanner.cbnQuestions.recordKeeping'),
      risk_weight: 6, 
      clause_ids: ["cbn-aml-006"],
      explanation: t('scanner.cbnExplanations.recordKeeping')
    },
    { 
      id: "complianceOfficer", 
      question: t('scanner.cbnQuestions.complianceOfficer'),
      risk_weight: 14, 
      clause_ids: ["cbn-aml-008"],
      explanation: t('scanner.cbnExplanations.complianceOfficer')
    },
    { 
      id: "riskAssessment", 
      question: t('scanner.cbnQuestions.riskAssessment'),
      risk_weight: 12, 
      clause_ids: ["cbn-aml-004"],
      explanation: t('scanner.cbnExplanations.riskAssessment')
    },
    { 
      id: "independentAudit", 
      question: t('scanner.cbnQuestions.independentAudit'),
      risk_weight: 10, 
      clause_ids: ["cbn-aml-007"],
      explanation: t('scanner.cbnExplanations.independentAudit')
    },
  ];

  const questions = activeFramework === "ndpa" ? ndpaQuestions : cbnQuestions;
  
  // Get the appropriate clause data based on framework
  const clauseData = activeFramework === "ndpa" ? ndprData.clauses : cbnData.clauses;

  const handleAnswer = (questionId: string, value: boolean) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const startQuestionnaire = () => {
    setShowForm(false);
    setIsModalOpen(true);
  };

  const handleModalComplete = () => {
    setIsModalOpen(false);
    calculateRisk();
  };

  const calculateRisk = () => {
    setCalculating(true);
    setTimeout(() => {
      let score = activeFramework === "ndpa" ? 35 : 40;
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
      if (activeFramework === "ndpa") {
        const highRiskSectors = ["health", "fintech"];
        if (sectorProfile) {
          sectorProfile.recommendedClauses.forEach(id => triggeredClauseIds.add(id));
          if (highRiskSectors.includes(sector)) score += 6;
        }
      } else {
        if (sector === "fintech" || sector === "banking") {
          score += 10;
        }
      }

      const normalizedScore = Math.max(0, Math.min(100, Math.round(score)));
      const triggeredClauses = clauseData.filter(c => triggeredClauseIds.has(c.id));

      const riskLevel: ScanResult["riskLevel"] =
        normalizedScore <= 25 ? "low" :
        normalizedScore <= 50 ? "medium" :
        normalizedScore <= 75 ? "high" : "critical";

      const appDisplayName = appName || t('scanner.defaultAppName');
      const frameworkName = activeFramework === "ndpa" ? "NDP Act 2023" : "CBN AML 2022";

      const explanations: Record<string, string> = {
        low: t('scanner.explanation.low').replace('{{appName}}', appDisplayName).replace('{{framework}}', frameworkName),
        medium: t('scanner.explanation.medium').replace('{{appName}}', appDisplayName).replace('{{framework}}', frameworkName),
        high: t('scanner.explanation.high').replace('{{appName}}', appDisplayName).replace('{{framework}}', frameworkName),
        critical: t('scanner.explanation.critical').replace('{{appName}}', appDisplayName).replace('{{framework}}', frameworkName),
      };

      setResult({ 
        riskScore: normalizedScore, 
        riskLevel, 
        triggeredClauses, 
        explanation: explanations[riskLevel], 
        appName, 
        sector, 
        answers,
        framework: activeFramework
      });
      setStep("result");
      setCalculating(false);
      
      // Scroll to top when results are shown
      forceScrollToTop();
    }, 800);
  };

  const resetScanner = () => {
    setStep("form");
    setResult(null);
    setAnswers({});
    setAppName("");
    setSector("");
    setShowForm(true);
    
    // Force scroll to top when resetting to form
    forceScrollToTop();
  };

  const allAnswered = questions.every(q => answers[q.id] !== undefined && answers[q.id] !== null);
  const answeredCount = questions.filter(q => answers[q.id] !== undefined && answers[q.id] !== null).length;

  if (step === "result" && result) {
    return <RiskResults result={result} onReset={resetScanner} />;
  }

  return (
    <>
      {/* Initial Form View */}
      {showForm && (
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-2">
              {t('scanner.title')}
            </h2>
            <p className="text-muted-foreground">
              {t('scanner.subtitle')}
            </p>
          </div>

          {/* Framework Indicator */}
          <div className={`text-xs font-medium px-3 py-1.5 rounded-full inline-flex items-center gap-2 ${
            activeFramework === "ndpa" 
              ? "bg-primary/10 text-primary" 
              : "bg-accent/10 text-accent"
          }`}>
            <span>{activeFramework === "ndpa" ? t('scanner.framework.ndpa') : t('scanner.framework.cbn')}</span>
          </div>

          {/* App name */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              {activeFramework === "ndpa" ? t('scanner.appName.label') : t('scanner.appName.cbnLabel')}
            </label>
            <input
              type="text"
              placeholder={activeFramework === "ndpa" ? t('scanner.appName.placeholder') : t('scanner.appName.cbnPlaceholder')}
              value={appName}
              onChange={e => setAppName(e.target.value)}
              className="w-full px-4 py-3.5 rounded-xl border border-border bg-card text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all duration-200"
            />
          </div>

          {/* Sector selector - only show for NDPA */}
          {activeFramework === "ndpa" && (
            <SectorSelector selected={sector} onSelect={setSector} />
          )}

          {/* Sector tips */}
          {activeFramework === "ndpa" && sector && (() => {
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

          {/* Start Assessment Button */}
          <button
            onClick={startQuestionnaire}
            disabled={!appName.trim() || (activeFramework === "ndpa" && !sector)}
            className={`w-full py-4 rounded-xl text-primary-foreground font-bold text-base transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 active:scale-[0.98] flex items-center justify-center gap-2 ${
              activeFramework === "ndpa" 
                ? "bg-primary" 
                : "bg-accent"
            }`}
          >
            Start Assessment
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      )}

      {/* Question Modal */}
      <QuestionModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setShowForm(true);
          // Scroll to top when modal closes and returns to form
          forceScrollToTop();
        }}
        questions={questions}
        answers={answers}
        onAnswer={handleAnswer}
        onComplete={handleModalComplete}
        activeFramework={activeFramework}
      />

      {/* Loading Overlay */}
      {calculating && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-card rounded-2xl p-8 flex flex-col items-center gap-4 shadow-2xl">
            <div className={`w-12 h-12 border-4 border-muted ${
              activeFramework === "ndpa" ? "border-t-primary" : "border-t-accent"
            } rounded-full animate-spin`} />
            <p className="text-foreground font-medium">{t('scanner.analyzing')}</p>
            <p className="text-sm text-muted-foreground">Please wait</p>
          </div>
        </div>
      )}
    </>
  );
};

export default RiskScanner;