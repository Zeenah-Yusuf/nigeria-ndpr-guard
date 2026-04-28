import { useLanguage } from "@/contexts/LanguageContext";
import { AlertTriangle, TrendingUp, Shield, Building, FileWarning, Clock, Ban, Landmark, Globe } from "lucide-react";

export function ComplianceGapSection() {
  const { t } = useLanguage();

  const stats = [
    { value: "80%", label: "Early stage startups without dedicated compliance support", icon: Building },
    { value: "72%", label: "Founders unfamiliar with multi-framework requirements", icon: AlertTriangle },
    { value: "₦10M", label: "Maximum penalty for non-compliance across frameworks", icon: TrendingUp },
  ];

  const impactCards = [
    {
      icon: FileWarning,
      title: "Multi-Regulator Exposure",
      description: "Operating without proper compliance frameworks exposes your business to enforcement actions from NDPC, CBN, SEC, and NITDA with significant financial penalties.",
      color: "amber"
    },
    {
      icon: Clock,
      title: t('features.deadlines'),
      description: "Annual Compliance Audit Returns must be filed by March 31st. CBN AML reports due quarterly. Late filing triggers automatic administrative penalties.",
      color: "blue"
    },
    {
      icon: Ban,
      title: "Business Disruption",
      description: "Non-compliance can result in service suspension, license revocation, public warnings, and reputational damage affecting customer trust and investor confidence.",
      color: "red"
    }
  ];

  const frameworks = [
    { name: "NDPA", regulator: "NDPC", color: "green" },
    { name: t('frameworks.cbnAml'), regulator: "CBN", color: "blue" },
    { name: t('frameworks.secCf'), regulator: "SEC", color: "purple" },
    { name: t('frameworks.nitdaDp'), regulator: "NITDA", color: "cyan" },
  ];

  return (
    <section id="problem" className="py-24 bg-gradient-to-b from-background to-muted/30 relative overflow-hidden">
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-primary rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary rounded-full blur-3xl" />
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-destructive/10 text-destructive rounded-full px-4 py-1.5 mb-6">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span className="text-xs font-semibold uppercase tracking-wider">{t('nav.solution')}</span>
          </div>
          <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            {t('nav.compliance')} <br />
            <span className="text-destructive">{t('hero.titlePart2')}</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t('hero.subtitle')}
          </p>
        </div>

        {/* Framework Badges */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {frameworks.map(fw => (
            <span key={fw.name} className="text-xs font-medium px-3 py-1.5 rounded-full bg-primary/10 text-primary border border-primary/20 flex items-center gap-1.5">
              <Globe className="w-3 h-3" />
              {fw.name} ({fw.regulator})
            </span>
          ))}
        </div>

        <div className="max-w-5xl mx-auto mb-16">
          <div className="grid md:grid-cols-3 gap-6">
            {impactCards.map((card, index) => {
              const Icon = card.icon;
              const colorClasses: Record<string, string> = {
                amber: "border-amber-500/30 bg-amber-50/50 dark:bg-amber-950/20",
                blue: "border-blue-500/30 bg-blue-50/50 dark:bg-blue-950/20",
                red: "border-red-500/30 bg-red-50/50 dark:bg-red-950/20"
              };
              const iconColors: Record<string, string> = {
                amber: "text-amber-600 dark:text-amber-500",
                blue: "text-blue-600 dark:text-blue-500",
                red: "text-red-600 dark:text-red-500"
              };
              
              return (
                <div key={index} className={`rounded-xl border p-6 ${colorClasses[card.color]} hover:shadow-card transition-all duration-300`}>
                  <div className="w-12 h-12 rounded-lg bg-background/80 flex items-center justify-center mb-4">
                    <Icon className={`w-6 h-6 ${iconColors[card.color]}`} />
                  </div>
                  <h3 className="font-heading font-semibold text-foreground mb-2">{card.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{card.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="bg-card border border-border rounded-xl p-6 text-center hover:shadow-card transition-all duration-300 group">
                  <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <div className="text-3xl font-heading font-bold text-foreground mb-2">{stat.value}</div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{stat.label}</p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="max-w-2xl mx-auto text-center mt-12">
          <div className="inline-flex items-center gap-2 bg-secondary/10 text-secondary rounded-full px-4 py-1.5 mb-4">
            <Shield className="w-4 h-4" />
            <span className="text-xs font-semibold uppercase tracking-wider">{t('footer.tagline')}</span>
          </div>
          <p className="text-xl text-foreground font-medium">{t('features.everythingYouNeed')}</p>
          <p className="text-lg text-muted-foreground">{t('features.subtitle')}</p>
        </div>
      </div>
    </section>
  );
}