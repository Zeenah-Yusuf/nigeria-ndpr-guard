import { useLanguage } from "@/contexts/LanguageContext";
import nssLogo from "@/assets/nss-logo.png";
import { Mail, Heart, ExternalLink } from "lucide-react";

const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="py-12 bg-background border-t border-border">
      <div className="container mx-auto px-4">
        {/* Top section */}
        <div className="flex flex-col md:flex-row items-start justify-between gap-8 mb-8">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <span className="text-lg">🇳🇬</span>
              <img src={nssLogo} alt="Nexus SafeSphere Logo" className="h-8 w-auto" loading="lazy" />
              <div>
                <span className="font-heading font-bold text-foreground text-sm">{t('app.name')}</span>
                <p className="text-[11px] text-muted-foreground">{t('footer.by')}</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">
              {t('footer.tagline')}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-8">
            <div>
              <h4 className="font-heading font-semibold text-foreground text-xs uppercase tracking-wider mb-3">
                {t('footer.quickLinks')}
              </h4>
              <div className="flex flex-col gap-2 text-sm text-muted-foreground">
                <button 
                  onClick={() => document.getElementById("problem")?.scrollIntoView({ behavior: "smooth" })} 
                  className="text-left hover:text-foreground transition-colors"
                >
                  {t('footer.about')}
                </button>
                <a 
                  href="https://ndpc.gov.ng" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="hover:text-foreground transition-colors"
                >
                  {t('footer.ndpcResources')}
                </a>
                <button 
                  onClick={() => document.getElementById("waitlist")?.scrollIntoView({ behavior: "smooth" })} 
                  className="text-left hover:text-primary transition-colors font-medium"
                >
                  {t('footer.joinWaitlist')}
                </button>
              </div>
            </div>
            <div>
              <h4 className="font-heading font-semibold text-foreground text-xs uppercase tracking-wider mb-3">
                {t('footer.connect')}
              </h4>
              <div className="flex flex-col gap-2 text-sm text-muted-foreground">
                <a href="mailto:yusufzeenah12@gmail.com" className="hover:text-foreground transition-colors flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5" /> {t('footer.contact')}
                </a>
                <a href="#" className="hover:text-foreground transition-colors flex items-center gap-1.5">
                  <ExternalLink className="w-3.5 h-3.5" /> {t('footer.twitter')}
                </a>
                <a href="#" className="hover:text-foreground transition-colors flex items-center gap-1.5">
                  <ExternalLink className="w-3.5 h-3.5" /> {t('footer.linkedin')}
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Why We Built This */}
        <div className="rounded-xl border border-border bg-card p-5 mb-8">
          <h4 className="font-heading font-semibold text-foreground text-sm mb-2">
            🇳🇬 {t('footer.whyBuilt.title')}
          </h4>
          <p className="text-xs text-muted-foreground leading-relaxed">
            {t('footer.whyBuilt.description')}
          </p>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-border pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[11px] text-muted-foreground flex items-center gap-1">
            {t('footer.builtFor')} <Heart className="w-3 h-3 text-destructive inline" /> {t('footer.madeIn')} • {t('footer.poweredBy')}
          </p>
          <p className="text-[11px] text-muted-foreground">
            {t('footer.copyright')}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;