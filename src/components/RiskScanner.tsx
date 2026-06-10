import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { getDatasetByFramework } from "@/data/index";
import { supabase } from "@/lib/SupabaseClient";
import RiskResults from "./RiskResults";
import SectorSelector from "./SectorSelector";
import QuestionModal from "./QuestionModal";
import { getSectorById, getFrameworksForSector } from "@/lib/sectorRecommendations";
import { useRegulatorData } from "@/hooks/useRegulatorData";
import { useToast } from "@/hooks/use-toast";

export interface ScanResult {
  riskScore: number;
  riskLevel: "low" | "medium" | "high" | "critical";
  triggeredClauses: any[];
  triggeredFrameworks: string[];
  explanation: string;
  appName: string;
  sector: string;
  answers: Record<string, boolean | null>;
  framework: string;
  assessmentId?: string;
}

interface RiskScannerProps {
  activeFramework?: string;
}

const RiskScanner = ({ activeFramework = "NDPA" }: RiskScannerProps) => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const { addAssessment } = useRegulatorData();
  const { toast } = useToast();

  const [answers, setAnswers] = useState<Record<string, boolean | null>>({});
  const [appName, setAppName] = useState("");
  const [sector, setSector] = useState("");
  const [result, setResult] = useState<ScanResult | null>(null);
  const [step, setStep] = useState<"form" | "result">("form");
  const [calculating, setCalculating] = useState(false);
  const [showQuestions, setShowQuestions] = useState(false);

  const dataset = getDatasetByFramework(activeFramework);
  const questions: any[] = dataset?.risk_scanner_questions || [];
  const clauses: any[] = (dataset?.clauses || []).map((c: any) => ({
    ...c,
    keywords: c.keywords || [],
    penalty_info: c.penalty_info || undefined,
    summary: c.summary || c.description || "",
  }));

  const handleAnswer = (questionId: string, value: boolean) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  /**
   * Safe check to retrieve UUID of a sector by its unique slug string.
   */
  async function getSectorUuid(sectorSlug: string): Promise<string | null> {
    if (!sectorSlug) return null;
    try {
      const { data, error } = await supabase
        .from('sectors')
        .select('id')
        .eq('slug', sectorSlug)
        .maybeSingle(); // Avoids throwing errors on miss 
      
      if (error) {
        console.warn('Sector reference lookup mismatch:', error.message);
        return null;
      }
      
      return data?.id || null;
    } catch (err) {
      console.error('getSectorUuid runtime error:', err);
      return null;
    }
  }

  /**
   * Saves the structured risk results payload safely to Supabase compliance_scans table.
   * Resolves issues with strict RLS execution chains failing on client-enforced `.single()`.
   */
  async function saveToSupabase(
    normalizedScore: number,
    riskLevel: string,
    triggeredClausesLength: number,
    triggeredFrameworksArray: string[],
    appDisplayName: string,
    goodPracticesCount: number,
    badAnswersLength: number,
    sectorUuid: string | null,
  ): Promise<boolean> {
    try {
      const scanPayload = {
        user_id: user?.id || null,
        sector_id: sectorUuid,
        scan_type: 'quick',
        status: 'completed',
        results: {
          riskScore: normalizedScore,
          riskLevel,
          triggeredClauses: triggeredClausesLength,
          triggeredFrameworks: triggeredFrameworksArray,
          framework: activeFramework,
          appName: appDisplayName,
          goodPractices: goodPracticesCount,
          badPractices: badAnswersLength,
          totalQuestions: questions.length,
          answers: answers,
          sector: sector,
        },
        risk_score: normalizedScore,
        used_ai: false,
        completed_at: new Date().toISOString(),
      };

      console.log('Synchronizing active scan payload to database...', scanPayload);

      // CRITICAL FIX: Removed .single() invocation which breaks inside secure RLS tables
      // when PostgREST transient states hide immediate return visibilities.
      const { data, error: scanError } = await supabase
        .from('compliance_scans')
        .insert(scanPayload)
        .select('id');

      if (scanError) {
        console.error('Supabase scan synchronization aborted:', scanError.message, scanError.details);
        toast({
          title: t('common.error', { defaultValue: "Sync Warning" }),
          description: "Assessment verified locally, but historical cloud tracking failed.",
          variant: "destructive",
        });
        return false;
      }

      const generatedId = data && data.length > 0 ? data[0].id : null;
      console.log('Successfully completed database write with structural confirmation ID:', generatedId);
      return true;
    } catch (err) {
      console.error('Failed compliance database pipeline logging execution:', err);
      return false;
    }
  }

  /**
   * Updates user preference metrics safely for cross-dashboard evaluation context
   */
  async function saveUserSector(sectorUuid: string | null) {
    if (!user?.id || !sectorUuid) return;
    try {
      const { error } = await supabase
        .from('user_sectors')
        .upsert({
          user_id: user.id,
          sector_id: sectorUuid,
        }, { 
          onConflict: 'user_id' 
        });
      
      if (error) {
        console.warn('Asynchronous organizational sector alignment warning:', error.message);
      }
    } catch (err) {
      console.error('Failed to update dashboard user tracking state:', err);
    }
  }

  const calculateRisk = async () => {
    setShowQuestions(false);
    setCalculating(true);
    
    // UI layout optimization block
    await new Promise(r => setTimeout(r, 600));

    let totalRiskScore = 0;
    let maxPossibleScore = 0;
    const triggeredClauseIds = new Set<string>();
    const triggeredFrameworks = new Set<string>([activeFramework]);

    if (sector) {
      getFrameworksForSector(sector).forEach(fw => triggeredFrameworks.add(fw));
    }

    // Process structured questions data
    questions.forEach(q => {
      const answer = answers[q.id];
      if (answer === null || answer === undefined) return;

      const weight = Math.abs(q.risk_weight || 1);
      maxPossibleScore += weight;

      const isSafeguard = q.risk_weight < 0;
      const goodAnswer = isSafeguard ? true : false;
      const userGaveGoodAnswer = answer === goodAnswer;

      if (!userGaveGoodAnswer) {
        totalRiskScore += weight;
        q.clause_ids?.forEach((id: string) => triggeredClauseIds.add(id));
      } else if (isSafeguard && answer === true) {
        q.clause_ids?.forEach((id: string) => triggeredClauseIds.add(id));
      }
    });

    // Handle context risks for African operational parameters
    const sectorProfile = getSectorById(sector);
    if (sectorProfile) {
      sectorProfile.recommendedClauses.forEach(id => triggeredClauseIds.add(id));
      const sectorRisk = sectorProfile.riskLevel ?? sectorProfile.risk_level ?? 5;
      totalRiskScore += (sectorRisk / 10) * 5;
      maxPossibleScore += 5;
    }

    const normalizedScore = maxPossibleScore > 0
      ? Math.max(5, Math.min(100, Math.round((totalRiskScore / maxPossibleScore) * 100)))
      : 35;

    const triggeredClauses = clauses.filter((c: any) => triggeredClauseIds.has(c.id));

    let riskLevel: ScanResult["riskLevel"];
    if (normalizedScore <= 25) riskLevel = "low";
    else if (normalizedScore <= 50) riskLevel = "medium";
    else if (normalizedScore <= 75) riskLevel = "high";
    else riskLevel = "critical";

    const appDisplayName = appName.trim() || t('scanner.defaultAppName');

    const badAnswers = questions.filter(q => {
      const answer = answers[q.id];
      if (answer === null || answer === undefined) return false;
      const isSafeguard = q.risk_weight < 0;
      return answer !== (isSafeguard ? true : false);
    });

    const goodPracticesCount = questions.length - badAnswers.length;
    const explanation = getExplanationText(appDisplayName, riskLevel, goodPracticesCount, badAnswers.length);

    const status: "compliant" | "at_risk" | "high_risk" =
      normalizedScore <= 30 ? "compliant" : 
      normalizedScore <= 60 ? "at_risk" : 
      "high_risk";

    const assessmentResult: ScanResult = {
      riskScore: normalizedScore,
      riskLevel,
      triggeredClauses,
      triggeredFrameworks: Array.from(triggeredFrameworks),
      explanation,
      appName: appDisplayName,
      sector,
      answers,
      framework: activeFramework,
    };

    // 1. Local context state sync
    const newAssessment = addAssessment({
      appName: appDisplayName,
      sector: sector || "other",
      riskScore: normalizedScore,
      riskLevel,
      framework: activeFramework,
      triggeredClausesCount: triggeredClauses.length,
      triggeredClauseIds: Array.from(triggeredClauseIds),
      triggeredFrameworks: Array.from(triggeredFrameworks),
      remediationCompleted: 0,
      remediationTotal: badAnswers.length,
      answers,
      status,
      assessmentDate: new Date().toISOString(),
    });

    assessmentResult.assessmentId = newAssessment.id;

    // 2. Fetch dependencies and coordinate Supabase cluster sync securely
    const sectorUuid = await getSectorUuid(sector);
    
    await Promise.all([
      saveToSupabase(
        normalizedScore, 
        riskLevel, 
        triggeredClauses.length,
        Array.from(triggeredFrameworks), 
        appDisplayName,
        goodPracticesCount, 
        badAnswers.length, 
        sectorUuid,
      ),
      saveUserSector(sectorUuid)
    ]);

    setResult(assessmentResult);
    setStep("result");
    setCalculating(false);
  };

  const getExplanationText = (appName: string, riskLevel: string, goodPractices: number, badPractices: number) => {
    const key = `scanner.explanation.${riskLevel}`;
    return t(key, { appName: appName || t('scanner.defaultAppName') });
  };

  const resetScanner = () => {
    setStep("form");
    setResult(null);
    setAnswers({});
    setAppName("");
    setSector("");
    setShowQuestions(false);
  };

  if (step === "result" && result) {
    return <RiskResults result={result} onReset={resetScanner} />;
  }

  const canStart = appName.trim().length > 0 && sector !== "";

  return (
    <div className="space-y-5">
      <div className="text-xs font-medium px-3 py-1.5 rounded-full inline-flex items-center gap-2 bg-primary/10 text-primary">
        <span>{activeFramework}</span>
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-2">{t('scanner.appName')}</label>
        <input
          type="text"
          placeholder={t('scanner.appNamePlaceholder')}
          value={appName}
          onChange={e => setAppName(e.target.value)}
          className="w-full px-4 py-3.5 rounded-xl border border-border bg-card text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all duration-200"
        />
      </div>

      <SectorSelector selected={sector} onSelect={setSector} />

      {sector && (() => {
        const sp = getSectorById(sector);
        if (!sp) return null;
        return (
          <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 animate-fade-in">
            <p className="text-xs font-semibold text-primary mb-1">{sp.emoji} {sp.name} — Key Risks</p>
            <ul className="text-xs text-muted-foreground space-y-1">
              {sp.keyRisks.slice(0, 3).map((r, i) => (
                <li key={i} className="flex items-start gap-1.5"><span className="text-primary mt-0.5">•</span> {r}</li>
              ))}
            </ul>
          </div>
        );
      })()}

      {!canStart && (
        <p className="text-sm text-muted-foreground text-center py-4">{t('scanner.enterAppAndSector')}</p>
      )}

      {canStart && !calculating && (
        <button onClick={() => setShowQuestions(true)}
          className="w-full py-4 rounded-xl bg-primary text-primary-foreground font-bold text-base transition-all duration-200 hover:opacity-90 active:scale-[0.98] animate-pulse-glow">
          {t('scanner.startAssessment')}
        </button>
      )}

      {calculating && (
        <div className="text-center py-8">
          <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm text-muted-foreground">{t('scanner.analyzing')}</p>
        </div>
      )}

      <QuestionModal
        isOpen={showQuestions}
        onClose={() => setShowQuestions(false)}
        questions={questions}
        answers={answers}
        onAnswer={handleAnswer}
        onComplete={calculateRisk}
        activeFramework={activeFramework}
        autoAdvance={false}
      />
    </div>
  );
};

export default RiskScanner;