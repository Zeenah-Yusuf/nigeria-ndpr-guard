import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import nssLogo from "@/assets/nss-logo.png";
import { Mail, Heart, ExternalLink, Shield, FileText, Scale } from "lucide-react";
import { NigeriaFlag } from "./NigeriaFlag";

const Footer = () => {
  const { t } = useLanguage();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="pt-16 pb-8 bg-card border-t border-border">
      <div className="container mx-auto px-4">
        
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          
          {/* Brand Column */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <NigeriaFlag className="w-6 h-4" />
              <img src={nssLogo} alt="Nexus SafeSphere" className="h-8 w-auto" loading="lazy" />
            </div>
            <p className="font-heading font-bold text-foreground text-lg mb-1">
              {t('app.name')}
            </p>
            <p className="text-xs text-muted-foreground mb-3">
              {t('footer.by')}
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {t('footer.tagline')}
            </p>
          </div>

          {/* Quick Links Column */}
          <div className="md:col-span-1">
            <h4 className="font-heading font-semibold text-foreground text-xs uppercase tracking-wider mb-4">
              {t('footer.quickLinks')}
            </h4>
            <ul className="space-y-2">
              <li>
                <Link 
                  to="/about" 
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {t('footer.about')}
                </Link>
              </li>
              <li>
                <a 
                  href="https://ndpc.gov.ng" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1"
                >
                  {t('footer.ndpcResources')}
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <button 
                  onClick={() => document.getElementById("waitlist")?.scrollIntoView({ behavior: "smooth" })} 
                  className="text-sm text-primary hover:text-primary/80 transition-colors font-medium"
                >
                  {t('footer.joinWaitlist')}
                </button>
              </li>
            </ul>
          </div>

          {/* Legal Column */}
          <div className="md:col-span-1">
            <h4 className="font-heading font-semibold text-foreground text-xs uppercase tracking-wider mb-4">
              Legal
            </h4>
            <ul className="space-y-2">
              <li>
                <Link 
                  to="/privacy" 
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1.5"
                >
                  <Shield className="w-3.5 h-3.5" />
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link 
                  to="/terms" 
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1.5"
                >
                  <Scale className="w-3.5 h-3.5" />
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          {/* Connect Column */}
          <div className="md:col-span-1">
            <h4 className="font-heading font-semibold text-foreground text-xs uppercase tracking-wider mb-4">
              {t('footer.connect')}
            </h4>
            <ul className="space-y-2">
              <li>
                <a 
                  href="mailto:yusufzeenah12@gmail.com" 
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1.5"
                >
                  <Mail className="w-3.5 h-3.5" /> 
                  {t('footer.contact')}
                </a>
              </li>
              <li>
                <a 
                  href="#" 
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1.5"
                >
                  <ExternalLink className="w-3.5 h-3.5" /> 
                  {t('footer.twitter')}
                </a>
              </li>
              <li>
                <a 
                  href="#" 
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1.5"
                >
                  <ExternalLink className="w-3.5 h-3.5" /> 
                  {t('footer.linkedin')}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Why We Built This */}
        <div className="rounded-xl border border-border bg-background p-5 mb-8">
          <h4 className="font-heading font-semibold text-foreground text-sm mb-2 flex items-center gap-2">
            <NigeriaFlag className="w-4 h-3" />
            {t('footer.whyBuilt.title')}
          </h4>
          <p className="text-xs text-muted-foreground leading-relaxed">
            {t('footer.whyBuilt.description')}
          </p>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            {t('footer.builtFor')} 
            <Heart className="w-3 h-3 text-destructive inline mx-0.5" /> 
            {t('footer.madeIn')} • {t('footer.poweredBy')}
          </p>
          
          <div className="flex items-center gap-4">
            <p className="text-xs text-muted-foreground">
              © {currentYear} RegTrack by NSS
            </p>
            <span className="text-border">|</span>
            <p className="text-xs text-muted-foreground">
              {t('footer.hackathon')}
            </p>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-6 text-center">
          <p className="text-[10px] text-muted-foreground/60 max-w-2xl mx-auto">
            RegTrack provides educational guidance only and does not constitute legal advice. 
            Always consult with a qualified legal professional for compliance matters.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;