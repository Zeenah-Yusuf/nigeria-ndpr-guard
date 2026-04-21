import { useLanguage } from "@/contexts/LanguageContext";
import { ShieldCheck, Search, ArrowRight, Sparkles } from "lucide-react";

const SolutionSection = () => {
  const { t } = useLanguage();

  const features = [
    {
      icon: ShieldCheck,
      titleKey: "solution.scanner.title",
      descriptionKey: "solution.scanner.description",
      flow: [
        t("solution.scanner.flow.step1"),
        t("solution.scanner.flow.step2"),
        t("solution.scanner.flow.step3"),
      ],
      accent: "primary",
    },
    {
      icon: Search,
      titleKey: "solution.finder.title",
      descriptionKey: "solution.finder.description",
      flow: [
        t("solution.finder.flow.step1"),
        t("solution.finder.flow.step2"),
        t("solution.finder.flow.step3"),
      ],
      accent: "secondary",
    },
  ];

  return (
    <section id="solution" className="py-24 bg-background relative">
      <div className="container mx-auto px-4">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-5 bg-secondary/10">
            <Sparkles className="w-4 h-4 text-secondary" />
            <span className="text-sm font-medium text-secondary">{t('solution.badge')}</span>
          </div>
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">
            {t('solution.titlePart1')}{" "}
            <span className="text-brand-gradient">{t('solution.titlePart2')}</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            {t('solution.subtitle')}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {features.map((f, i) => (
            <div
              key={f.titleKey}
              className="group rounded-2xl border border-border bg-card p-7 shadow-card hover:shadow-elevated hover:-translate-y-1 transition-all duration-300 relative overflow-hidden"
            >
              {/* Top accent line */}
              <div className={`absolute top-0 left-0 right-0 h-1 ${f.accent === "primary" ? "bg-brand-gradient" : "bg-brand-gradient-vivid"} opacity-70 group-hover:opacity-100 transition-opacity`} />
              
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-5 ${
                f.accent === "primary" ? "bg-primary/10" : "bg-secondary/10"
              }`}>
                <f.icon className={`w-7 h-7 ${f.accent === "primary" ? "text-primary" : "text-secondary"}`} />
              </div>
              <h3 className="font-heading text-xl font-bold text-foreground mb-2">{t(f.titleKey)}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed mb-5">{t(f.descriptionKey)}</p>
              
              {/* Flow indicator */}
              <div className="flex flex-wrap items-center gap-2">
                {f.flow.map((step, j, arr) => (
                  <span key={`${f.titleKey}-step-${j}`} className="flex items-center gap-2">
                    <span className={`text-xs font-medium px-3 py-1.5 rounded-lg ${
                      f.accent === "primary" ? "bg-primary/10 text-primary" : "bg-secondary/10 text-secondary"
                    }`}>{step}</span>
                    {j < arr.length - 1 && <ArrowRight className="w-3 h-3 text-muted-foreground" />}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SolutionSection;