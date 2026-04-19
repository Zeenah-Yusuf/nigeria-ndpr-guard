import { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { RemediationItem } from "@/lib/remediationData";
import { CheckCircle2, Circle, Clock, ExternalLink, AlertTriangle, AlertCircle, Info } from "lucide-react";

interface Props {
  items: RemediationItem[];
  storageKey: string;
}

const RemediationChecklist = ({ items, storageKey }: Props) => {
  const { t } = useLanguage();
  
  const [checked, setChecked] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(checked));
  }, [checked, storageKey]);

  const toggle = (id: string) => setChecked(prev => ({ ...prev, [id]: !prev[id] }));

  const completedCount = items.filter(i => checked[i.id]).length;
  const progress = items.length > 0 ? Math.round((completedCount / items.length) * 100) : 0;

  const priorityConfig = {
    critical: { 
      labelKey: "checklist.priority.critical", 
      icon: AlertTriangle, 
      bg: "bg-destructive/10", 
      text: "text-destructive", 
      border: "border-destructive/20" 
    },
    high: { 
      labelKey: "checklist.priority.high", 
      icon: AlertCircle, 
      bg: "bg-accent/10", 
      text: "text-accent", 
      border: "border-accent/20" 
    },
    medium: { 
      labelKey: "checklist.priority.medium", 
      icon: Info, 
      bg: "bg-primary/10", 
      text: "text-primary", 
      border: "border-primary/20" 
    },
  };

  const difficultyConfig: Record<string, { labelKey: string }> = {
    Easy: { labelKey: "checklist.difficulty.easy" },
    Medium: { labelKey: "checklist.difficulty.medium" },
    Hard: { labelKey: "checklist.difficulty.hard" },
  };

  const difficultyColors: Record<string, string> = {
    Easy: "bg-secondary/15 text-secondary",
    Medium: "bg-accent/15 text-accent",
    Hard: "bg-destructive/15 text-destructive",
  };

  const grouped = {
    critical: items.filter(i => i.priority === "critical"),
    high: items.filter(i => i.priority === "high"),
    medium: items.filter(i => i.priority === "medium"),
  };

  return (
    <div className="space-y-5">
      {/* Progress bar */}
      <div className="rounded-xl border border-border bg-card p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold text-foreground">
            {t('checklist.progress.title')}
          </span>
          <span className="text-sm font-bold text-brand-gradient">{progress}%</span>
        </div>
        <div className="h-2.5 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-brand-gradient rounded-full transition-all duration-700 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          {t('checklist.progress.count')
            .replace('{{completed}}', completedCount.toString())
            .replace('{{total}}', items.length.toString())}
        </p>
      </div>

      {/* Priority groups */}
      {(["critical", "high", "medium"] as const).map(priority => {
        const group = grouped[priority];
        if (group.length === 0) return null;
        const cfg = priorityConfig[priority];
        const PriorityIcon = cfg.icon;

        return (
          <div key={priority} className="space-y-2">
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg ${cfg.bg} w-fit`}>
              <PriorityIcon className={`w-3.5 h-3.5 ${cfg.text}`} />
              <span className={`text-xs font-bold ${cfg.text} uppercase tracking-wider`}>
                {t(cfg.labelKey)}
              </span>
              <span className={`text-xs ${cfg.text} opacity-70`}>({group.length})</span>
            </div>

            {group.map((item, i) => {
              const done = !!checked[item.id];
              return (
                <div
                  key={item.id}
                  className={`rounded-xl border p-4 transition-all duration-300 animate-fade-in-up ${
                    done ? "border-secondary/30 bg-secondary/5 opacity-75" : `${cfg.border} bg-card`
                  }`}
                  style={{ animationDelay: `${i * 0.05}s` }}
                >
                  <div className="flex items-start gap-3">
                    <button
                      onClick={() => toggle(item.id)}
                      className="mt-0.5 flex-shrink-0 transition-transform active:scale-90"
                    >
                      {done ? (
                        <CheckCircle2 className="w-5 h-5 text-secondary" />
                      ) : (
                        <Circle className="w-5 h-5 text-muted-foreground hover:text-primary transition-colors" />
                      )}
                    </button>
                    <div className="flex-1 min-w-0">
                      <h5 className={`font-heading font-semibold text-sm ${done ? "line-through text-muted-foreground" : "text-foreground"}`}>
                        {t(`checklist.items.${item.id}.title`, item.title)}
                      </h5>
                      <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                        {t(`checklist.items.${item.id}.description`, item.description)}
                      </p>

                      {/* Meta */}
                      <div className="flex flex-wrap items-center gap-2 mt-2.5">
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${difficultyColors[item.difficulty]}`}>
                          {t(difficultyConfig[item.difficulty]?.labelKey || item.difficulty)}
                        </span>
                        <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {item.timeEstimate}
                        </span>
                      </div>

                      {/* Resources */}
                      {item.resources.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2.5">
                          {item.resources.map(r => (
                            <a
                              key={r.url}
                              href={r.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[10px] text-primary hover:text-primary/80 flex items-center gap-1 underline underline-offset-2"
                            >
                              <ExternalLink className="w-2.5 h-2.5" /> {r.label}
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        );
      })}

      {items.length === 0 && (
        <div className="text-center py-8">
          <CheckCircle2 className="w-12 h-12 text-secondary mx-auto mb-3" />
          <p className="font-heading font-semibold text-foreground">
            {t('checklist.empty.title')}
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            {t('checklist.empty.message')}
          </p>
        </div>
      )}
    </div>
  );
};

export default RemediationChecklist;