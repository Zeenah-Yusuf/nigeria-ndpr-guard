import { useLanguage } from "@/contexts/LanguageContext";
import { AlertTriangle, TrendingUp, Shield, Building, FileWarning, Clock, Ban } from "lucide-react";

export function ComplianceGapSection() {
  const { t } = useLanguage();

  const stats = [
    { 
      value: "80%", 
      label: "Early stage startups without dedicated compliance support",
      icon: Building 
    },
    { 
      value: "72%", 
      label: "Founders unfamiliar with NDP Act requirements",
      icon: AlertTriangle 
    },
    { 
      value: "₦10M", 
      label: "Maximum penalty for non compliance",
      icon: TrendingUp 
    },
  ];

  const impactCards = [
    {
      icon: FileWarning,
      title: "Regulatory Exposure",
      description: "Operating without proper compliance frameworks exposes your business to NDPC enforcement actions and significant financial penalties.",
      color: "amber"
    },
    {
      icon: Clock,
      title: "Missed Deadlines",
      description: "Annual Compliance Audit Returns must be filed by March 31st. Late filing triggers automatic administrative penalties under GAID 2025.",
      color: "blue"
    },
    {
      icon: Ban,
      title: "Business Disruption",
      description: "Non compliance can result in service suspension, public warnings, and reputational damage that affects customer trust and investor confidence.",
      color: "red"
    }
  ];

  return (
    <section id="problem" className="py-24 bg-gradient-to-b from-background to-muted/30 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-primary rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary rounded-full blur-3xl" />
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-destructive/10 text-destructive rounded-full px-4 py-1.5 mb-6">

            <span className="text-xs font-semibold uppercase tracking-wider">
              Solutions are within reach
            </span>
          </div>
          <h2 className="font-heading text-3xl md:text-3xl lg:text-4xl font-bold text-foreground mb-4">
            Compliance Breaches can cost you <br />
            <span className="text-destructive">Yet Preventable</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            The cost of waiting until after launch is measured in millions and it is entirely preventable.
          </p>
        </div>

        {/* Impact Cards */}
        <div className="max-w-5xl mx-auto mb-16">
          <div className="grid md:grid-cols-3 gap-6">
            {impactCards.map((card, index) => {
              const Icon = card.icon;
              const colorClasses = {
                amber: "border-amber-500/30 bg-amber-50/50 dark:bg-amber-950/20",
                blue: "border-blue-500/30 bg-blue-50/50 dark:bg-blue-950/20",
                red: "border-red-500/30 bg-red-50/50 dark:bg-red-950/20"
              };
              const iconColors = {
                amber: "text-amber-600 dark:text-amber-500",
                blue: "text-blue-600 dark:text-blue-500",
                red: "text-red-600 dark:text-red-500"
              };
              
              return (
                <div 
                  key={index}
                  className={`rounded-xl border p-6 ${colorClasses[card.color as keyof typeof colorClasses]} hover:shadow-card transition-all duration-300`}
                >
                  <div className="w-12 h-12 rounded-lg bg-background/80 flex items-center justify-center mb-4">
                    <Icon className={`w-6 h-6 ${iconColors[card.color as keyof typeof iconColors]}`} />
                  </div>
                  <h3 className="font-heading font-semibold text-foreground mb-2">
                    {card.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {card.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div 
                  key={index}
                  className="bg-card border border-border rounded-xl p-6 text-center hover:shadow-card transition-all duration-300 group"
                >
                  <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <div className="text-3xl font-heading font-bold text-foreground mb-2">
                    {stat.value}
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {stat.label}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Closing Statement */}
        <div className="max-w-2xl mx-auto text-center mt-12">
          <div className="inline-flex items-center gap-2 bg-secondary/10 text-secondary rounded-full px-4 py-1.5 mb-4">
            <Shield className="w-4 h-4" />
            <span className="text-xs font-semibold uppercase tracking-wider">
              Our Position
            </span>
          </div>
          <p className="text-xl text-foreground font-medium">
            Nigeria does not have a compliance problem.
          </p>
          <p className="text-lg text-muted-foreground">
            It has a solutions gap.
          </p>
        </div>

      </div>
    </section>
  );
}