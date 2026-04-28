import { useLanguage } from "@/contexts/LanguageContext";
import { ShieldCheck, Search, ArrowRight, Sparkles, Landmark, Building2, Globe, FileText } from "lucide-react";

const SolutionSection = () => {
  const { t } = useLanguage();

  const features = [
    {
      icon: ShieldCheck,
      title: t('features.complianceAssessment'),
      description: "Answer questions about your business. Get an instant compliance score with triggered sections and plain-English explanations.",
      flow: [t('results.steps.analyze'), t('results.steps.understand'), t('results.steps.fix')],
      accent: "primary",
    },
    {
      icon: Search,
      title: t('demo.tabs.finder'),
      description: "Search the full regulatory framework by keyword. Find the exact section that applies to your situation with clear summaries.",
      flow: ["Keyword Search", "Section Match", "Summary"],
      accent: "secondary",
    },
    {
      icon: Landmark,
      title: t('features.frameworks'),
      description: `${t('features.frameworksDesc')}`,
      flow: ["Select Framework", "Answer Questions", "Get Results"],
      accent: "accent",
    },
    {
      icon: FileText,
      title: t('demo.tabs.extractor'),
      description: "Upload any policy document and our AI extracts regulatory obligations automatically across all frameworks.",
      flow: [t('common.upload'), "AI Analysis", t('common.export')],
      accent: "purple",
    },
  ];

  const frameworks = [
    { name: t('frameworks.ndpa'), regulator: "NDPC", icon: ShieldCheck, color: "primary" },
    { name: t('frameworks.cbnAml'), regulator: "CBN", icon: Landmark, color: "accent" },
    { name: t('frameworks.secCf'), regulator: "SEC", icon: Building2, color: "purple" },
    { name: t('frameworks.nitdaDp'), regulator: "NITDA", icon: Globe, color: "cyan" },
  ];

  const getAccentClasses = (accent: string) => {
    switch (accent) {
      case "primary": return { bg: "bg-primary/10", text: "text-primary", line: "bg-brand-gradient" };
      case "secondary": return { bg: "bg-secondary/10", text: "text-secondary", line: "bg-brand-gradient-vivid" };
      case "accent": return { bg: "bg-accent/10", text: "text-accent", line: "bg-accent" };
      case "purple": return { bg: "bg-purple-500/10", text: "text-purple-500", line: "bg-purple-500" };
      case "cyan": return { bg: "bg-cyan-500/10", text: "text-cyan-500", line: "bg-cyan-500" };
      default: return { bg: "bg-primary/10", text: "text-primary", line: "bg-brand-gradient" };
    }
  };

  return (
    <section id="solution" className="py-24 bg-background relative">
      <div className="container mx-auto px-4">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-5 bg-secondary/10">
            <Sparkles className="w-4 h-4 text-secondary" />
            <span className="text-sm font-medium text-secondary">{t('nav.solution')}</span>
          </div>
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">
            {t('features.everythingYouNeed')}.{" "}
            <span className="text-brand-gradient">{t('results.understandImpact')}</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            {t('features.subtitle')}
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {frameworks.map(fw => {
            const Icon = fw.icon;
            const classes = getAccentClasses(fw.color);
            return (
              <div key={fw.name} className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${classes.bg} ${classes.text} text-xs font-medium`}>
                <Icon className="w-3.5 h-3.5" />
                <span>{fw.name}</span>
                <span className="opacity-60">({fw.regulator})</span>
              </div>
            );
          })}
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {features.map((f) => {
            const classes = getAccentClasses(f.accent);
            return (
              <div key={f.title}
                className="group rounded-2xl border border-border bg-card p-7 shadow-card hover:shadow-elevated hover:-translate-y-1 transition-all duration-300 relative overflow-hidden">
                <div className={`absolute top-0 left-0 right-0 h-1 ${classes.line} opacity-70 group-hover:opacity-100 transition-opacity`} />
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-5 ${classes.bg}`}>
                  <f.icon className={`w-7 h-7 ${classes.text}`} />
                </div>
                <h3 className="font-heading text-xl font-bold text-foreground mb-2">{f.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-5">{f.description}</p>
                <div className="flex flex-wrap items-center gap-2">
                  {f.flow.map((step, j, arr) => (
                    <span key={step} className="flex items-center gap-2">
                      <span className={`text-xs font-medium px-3 py-1.5 rounded-lg ${classes.bg} ${classes.text}`}>{step}</span>
                      {j < arr.length - 1 && <ArrowRight className="w-3 h-3 text-muted-foreground" />}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default SolutionSection;