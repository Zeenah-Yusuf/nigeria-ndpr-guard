import { Shield, Award, Clock, AlertTriangle, Landmark, Building2, Globe } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import auditDue from "@/assets/audit-due.png";
import fineNotice from "@/assets/fine-notice.png";

export function TrustBadges() {
  const { t } = useLanguage();

  return (
    <section className="py-16 bg-gradient-to-b from-background to-muted/20 border-y border-border">
      <div className="container mx-auto px-4">
        
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary rounded-full px-4 py-1.5 mb-4">
            <Shield className="w-4 h-4" />
            <span className="text-xs font-semibold uppercase tracking-wider">{t('hero.trusted')}</span>
          </div>
          <h2 className="font-heading text-2xl md:text-3xl font-bold text-foreground mb-3">
            {t('features.everythingYouNeed')}
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {t('features.subtitle')}
          </p>
        </div>

        {/* Framework Coverage */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-medium">
            <Shield className="w-3.5 h-3.5" />{t('frameworks.ndpa')}
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/10 text-accent text-xs font-medium">
            <Landmark className="w-3.5 h-3.5" />{t('frameworks.cbnAml')}
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-500/10 text-purple-500 text-xs font-medium">
            <Building2 className="w-3.5 h-3.5" />{t('frameworks.secCf')}
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/10 text-cyan-500 text-xs font-medium">
            <Globe className="w-3.5 h-3.5" />{t('frameworks.nitdaDp')}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-12">
          
          {/* Audit Due Card */}
          <div className="group relative bg-card border border-border rounded-2xl overflow-hidden shadow-card hover:shadow-elevated hover:-translate-y-1 transition-all duration-300">
            <div className="absolute top-0 left-0 right-0 h-1 bg-amber-500" />
            <div className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-xl bg-amber-50 dark:bg-amber-950/30 flex items-center justify-center flex-shrink-0">
                  <img src={auditDue} alt="Compliance Audit Due" className="w-10 h-10 object-contain" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-4 h-4 text-amber-600 dark:text-amber-500" />
                    <span className="text-xs font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-500">{t('features.deadlines')}</span>
                  </div>
                  <h3 className="font-heading text-lg font-bold text-foreground mb-1">{t('features.deadlines')}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {t('features.deadlinesDesc')}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Fine Notice Card */}
          <div className="group relative bg-card border border-border rounded-2xl overflow-hidden shadow-card hover:shadow-elevated hover:-translate-y-1 transition-all duration-300">
            <div className="absolute top-0 left-0 right-0 h-1 bg-destructive" />
            <div className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-xl bg-destructive/10 flex items-center justify-center flex-shrink-0">
                  <img src={fineNotice} alt="Fine Notice" className="w-10 h-10 object-contain" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="w-4 h-4 text-destructive" />
                    <span className="text-xs font-semibold uppercase tracking-wider text-destructive">{t('results.consequences.title')}</span>
                  </div>
                  <h3 className="font-heading text-lg font-bold text-foreground mb-1">{t('results.consequences.title')}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {t('results.consequences.fine')}. {t('results.consequences.enforcement')}. {t('results.consequences.suspension')}.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Trust Strip */}
        <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center"><Shield className="w-5 h-5 text-primary" /></div>
            <div><p className="text-sm font-semibold text-foreground">{t('frameworks.ndpa')}</p><p className="text-xs text-muted-foreground">Current framework</p></div>
          </div>
          <div className="hidden md:block w-px h-8 bg-border" />
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center"><Award className="w-5 h-5 text-primary" /></div>
            <div><p className="text-sm font-semibold text-foreground">{t('regulator.title')}</p><p className="text-xs text-muted-foreground">NDPC, CBN, SEC, NITDA</p></div>
          </div>
          <div className="hidden md:block w-px h-8 bg-border" />
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center"><Shield className="w-5 h-5 text-primary" /></div>
            <div><p className="text-sm font-semibold text-foreground">{t('footer.madeIn')} 🇳🇬</p><p className="text-xs text-muted-foreground">{t('footer.whyBuilt.description')}</p></div>
          </div>
        </div>

        <div className="text-center mt-10">
          <p className="text-[11px] text-muted-foreground/60 max-w-2xl mx-auto">
            {t('footer.disclaimer')}
          </p>
        </div>
      </div>
    </section>
  );
}