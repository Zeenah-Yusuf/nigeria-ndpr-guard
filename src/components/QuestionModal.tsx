import { useState, useEffect, useRef } from "react";
import { X, ChevronLeft, ChevronRight, CheckCircle, Sparkles } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface Question {
  id: string;
  question: string;
  risk_weight: number;
  clause_ids: string[];
  explanation: string;
}

interface QuestionModalProps {
  isOpen: boolean;
  onClose: () => void;
  questions: Question[];
  answers: Record<string, boolean | null>;
  onAnswer: (questionId: string, value: boolean) => void;
  onComplete: () => void;
  activeFramework?: string;
  autoAdvance?: boolean;
}

const QuestionModal = ({
  isOpen,
  onClose,
  questions,
  answers,
  onAnswer,
  onComplete,
  activeFramework = "NDPA",
  autoAdvance = true
}: QuestionModalProps) => {
  const { t } = useLanguage();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<boolean | null>(null);
  const [isAutoAdvancing, setIsAutoAdvancing] = useState(false);
  const autoAdvanceTimeoutRef = useRef<number>();

  const currentQuestion = questions[currentIndex];
  const isLastQuestion = currentIndex === questions.length - 1;
  const isFirstQuestion = currentIndex === 0;
  const answeredCount = questions.filter(q => answers[q.id] !== undefined && answers[q.id] !== null).length;
  const progress = questions.length > 0 ? Math.round((answeredCount / questions.length) * 100) : 0;

  useEffect(() => {
    return () => {
      if (autoAdvanceTimeoutRef.current) clearTimeout(autoAdvanceTimeoutRef.current);
    };
  }, []);

  useEffect(() => {
    if (currentQuestion) {
      const existingAnswer = answers[currentQuestion.id];
      setSelectedAnswer(existingAnswer !== undefined ? existingAnswer : null);
    }
  }, [currentIndex, currentQuestion, answers]);

  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(0);
      setIsAutoAdvancing(false);
      if (autoAdvanceTimeoutRef.current) clearTimeout(autoAdvanceTimeoutRef.current);
    }
  }, [isOpen]);

  if (!isOpen || !currentQuestion) return null;

  const handleAnswer = (value: boolean) => {
    setSelectedAnswer(value);
    onAnswer(currentQuestion.id, value);
    
    if (autoAdvance && !isLastQuestion) {
      setIsAutoAdvancing(true);
      if (autoAdvanceTimeoutRef.current) clearTimeout(autoAdvanceTimeoutRef.current);
      autoAdvanceTimeoutRef.current = window.setTimeout(() => {
        setCurrentIndex(prev => prev + 1);
        setIsAutoAdvancing(false);
      }, 800);
    } else if (autoAdvance && isLastQuestion) {
      setIsAutoAdvancing(true);
      if (autoAdvanceTimeoutRef.current) clearTimeout(autoAdvanceTimeoutRef.current);
      autoAdvanceTimeoutRef.current = window.setTimeout(() => {
        onComplete();
        setIsAutoAdvancing(false);
      }, 800);
    }
  };

  const handleNext = () => {
    if (autoAdvanceTimeoutRef.current) { clearTimeout(autoAdvanceTimeoutRef.current); setIsAutoAdvancing(false); }
    if (selectedAnswer !== null) {
      if (isLastQuestion) onComplete();
      else setCurrentIndex(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (autoAdvanceTimeoutRef.current) { clearTimeout(autoAdvanceTimeoutRef.current); setIsAutoAdvancing(false); }
    if (!isFirstQuestion) setCurrentIndex(prev => prev - 1);
  };

  const handleClose = () => {
    if (autoAdvanceTimeoutRef.current) { clearTimeout(autoAdvanceTimeoutRef.current); setIsAutoAdvancing(false); }
    onClose();
  };

  const getFrameworkBadge = () => {
    const badges: Record<string, { bg: string; text: string }> = {
      "NDPA": { bg: "bg-primary/10", text: "text-primary" },
      "CBN-AML": { bg: "bg-accent/10", text: "text-accent" },
      "SEC-CF": { bg: "bg-purple-500/10", text: "text-purple-500" },
      "NITDA-DP": { bg: "bg-cyan-500/10", text: "text-cyan-500" },
    };
    return badges[activeFramework] || badges["NDPA"];
  };

  const frameworkBadge = getFrameworkBadge();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-2xl bg-card rounded-2xl shadow-2xl border border-border animate-scale-in">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-foreground">Compliance Assessment</h2>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${frameworkBadge.bg} ${frameworkBadge.text}`}>
                {activeFramework}
              </span>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <p className="text-sm text-muted-foreground">Question {currentIndex + 1} of {questions.length}</p>
              {autoAdvance && (
                <span className="text-[10px] text-primary bg-primary/10 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Sparkles className="w-2.5 h-2.5" />Auto-advance ON
                </span>
              )}
            </div>
          </div>
          <button onClick={handleClose} className="p-2 rounded-lg hover:bg-muted transition-colors" aria-label="Close">
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        <div className="px-6 pt-4">
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
            <span>Progress</span><span>{progress}%</span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div className="h-full rounded-full bg-primary transition-all duration-500" style={{ width: `${progress}%` }} />
          </div>
        </div>

        <div className="p-6">
          <div className="mb-6">
            <div className="flex items-start gap-3 mb-4">
              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 text-primary text-sm font-bold flex items-center justify-center">{currentIndex + 1}</span>
              <p className="text-lg font-medium text-foreground leading-relaxed flex-1">{currentQuestion.question}</p>
            </div>

            <div className="flex gap-4 mt-6">
              <button onClick={() => handleAnswer(true)} disabled={isAutoAdvancing}
                className={`flex-1 py-3 rounded-xl text-base font-semibold transition-all duration-200 active:scale-[0.98] ${
                  selectedAnswer === true ? "bg-secondary text-secondary-foreground shadow-lg ring-2 ring-secondary/40" : "bg-muted text-muted-foreground hover:bg-muted/80"
                } ${isAutoAdvancing ? "opacity-50 cursor-not-allowed" : ""}`}>
                {t('common.yes')}
              </button>
              <button onClick={() => handleAnswer(false)} disabled={isAutoAdvancing}
                className={`flex-1 py-3 rounded-xl text-base font-semibold transition-all duration-200 active:scale-[0.98] ${
                  selectedAnswer === false ? "bg-secondary text-secondary-foreground shadow-lg ring-2 ring-secondary/40" : "bg-muted text-muted-foreground hover:bg-muted/80"
                } ${isAutoAdvancing ? "opacity-50 cursor-not-allowed" : ""}`}>
                {t('common.no')}
              </button>
            </div>

            {isAutoAdvancing && (
              <div className="mt-3 flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                <span className="text-xs text-muted-foreground">Moving to next question...</span>
              </div>
            )}

            {selectedAnswer !== null && !isAutoAdvancing && (
              <div className="mt-6 p-4 rounded-lg bg-muted/30 border border-border animate-fade-in">
                <p className="text-sm text-muted-foreground leading-relaxed">{currentQuestion.explanation}</p>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between p-6 border-t border-border">
          <button onClick={handlePrevious} disabled={isFirstQuestion || isAutoAdvancing}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${isFirstQuestion || isAutoAdvancing ? "opacity-40 cursor-not-allowed text-muted-foreground" : "hover:bg-muted text-foreground"}`}>
            <ChevronLeft className="w-4 h-4" />Previous
          </button>
          <div className="text-sm text-muted-foreground">{answeredCount} of {questions.length} answered</div>
          <button onClick={handleNext} disabled={selectedAnswer === null || isAutoAdvancing}
            className={`flex items-center gap-2 px-6 py-2 rounded-lg font-semibold transition-all ${selectedAnswer === null || isAutoAdvancing ? "opacity-40 cursor-not-allowed bg-muted text-muted-foreground" : "bg-primary text-primary-foreground hover:bg-primary/90"}`}>
            {isLastQuestion ? <><CheckCircle className="w-4 h-4" />Complete</> : <>Next<ChevronRight className="w-4 h-4" /></>}
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuestionModal;