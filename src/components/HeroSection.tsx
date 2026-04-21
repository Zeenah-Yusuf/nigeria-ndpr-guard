import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import heroBg from "@/assets/hero-bg.jpg";
import { ShieldCheck, ArrowDown, ArrowRight, BadgeCheck } from "lucide-react";
import { NigeriaFlag } from "./NigeriaFlag";

const HeroSection = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const stats = [
    { value: "52", labelKey: "hero.stats.articles" },
    { value: "₦10M", labelKey: "hero.stats.maxFine" },
    { value: "72hrs", labelKey: "hero.stats.breachDeadline" },
  ];

  const scrollToTrust = () => {
    document.getElementById("trust")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background layers */}
      <div className="absolute inset-0">
        <img src={heroBg} alt="Nigeria skyline" className="w-full h-full object-cover" width={1920} height={1080} />
        <div className="absolute inset-0 bg-hero-gradient opacity-[0.92]" />
        <div className="absolute top-1/4 -left-32 w-96 h-96 rounded-full opacity-20 blur-3xl" style={{ background: "hsl(207, 72%, 38%)" }} />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 rounded-full opacity-15 blur-3xl" style={{ background: "hsl(152, 65%, 40%)" }} />
      </div>

      <div className="relative z-10 container mx-auto px-4 text-center pt-24 pb-12">
        {/* Badge */}
        <div className="animate-fade-in-up inline-flex items-center gap-2 rounded-full px-5 py-2 mb-4 border" style={{ background: "hsl(180, 40%, 30%, 0.15)", borderColor: "hsl(180, 40%, 40%, 0.3)" }}>
          <ShieldCheck className="w-4 h-4" style={{ color: "hsl(165, 60%, 55%)" }} />
          <span className="text-sm font-medium" style={{ color: "hsl(165, 50%, 70%)" }}>
            {t('hero.badge')}
          </span>
        </div>

        {/* Trusted badge with Flag */}
        <div className="animate-fade-in-up mb-6" style={{ animationDelay: "0.05s" }}>
          <span className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-full" style={{ background: "hsl(152, 50%, 35%, 0.2)", color: "hsl(152, 60%, 65%)" }}>
            <BadgeCheck className="w-3.5 h-3.5" /> 
            {t('hero.trusted')}
            <NigeriaFlag className="w-3.5 h-3 ml-0.5" />
          </span>
        </div>

        {/* Headline - FIXED HERE */}
        <h1 className="animate-fade-in-up font-heading text-4xl md:text-6xl lg:text-7xl font-bold max-w-4xl mx-auto leading-[1.1]" style={{ animationDelay: "0.1s", color: "hsl(0, 0%, 100%)" }}>
          {t('hero.titlePart1')}{" "}
          <span className="text-brand-gradient">{t('hero.titlePart2')}</span>
        </h1>

        {/* Subtext */}
        <p className="animate-fade-in-up text-lg md:text-xl max-w-2xl mx-auto mt-6 leading-relaxed" style={{ animationDelay: "0.2s", color: "hsl(215, 15%, 65%)" }}>
          {t('hero.subtitle')}
        </p>

        {/* CTAs */}
        <div className="animate-fade-in-up mt-10 flex flex-col sm:flex-row items-center justify-center gap-4" style={{ animationDelay: "0.3s" }}>
          <button
            onClick={() => navigate("/compliance-gap")}
            className="group px-8 py-4 rounded-2xl bg-brand-gradient-vivid text-primary-foreground font-semibold text-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 animate-pulse-glow flex items-center gap-2"
          >
            {t('hero.scanner')}
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
          <button
            onClick={() => navigate("/solution")}
            className="px-8 py-4 rounded-2xl border font-semibold text-lg hover:bg-primary/5 transition-all duration-200"
            style={{ borderColor: "hsl(215, 15%, 25%)", color: "hsl(215, 15%, 75%)" }}
          >
            {t('hero.learnMore')}
          </button>
        </div>

        {/* Stats row */}
        <div className="animate-fade-in-up mt-16 flex flex-wrap items-center justify-center gap-8 md:gap-12" style={{ animationDelay: "0.5s" }}>
          {stats.map(stat => (
            <div key={stat.labelKey} className="text-center">
              <p className="text-2xl md:text-3xl font-heading font-bold text-brand-gradient">{stat.value}</p>
              <p className="text-xs mt-1" style={{ color: "hsl(215, 12%, 50%)" }}>{t(stat.labelKey)}</p>
            </div>
          ))}
        </div>

        {/* Scroll Indicator */}
        <div className="animate-fade-in mt-12" style={{ animationDelay: "0.7s" }}>
          <button
            onClick={scrollToTrust}
            className="group"
            aria-label="Scroll to learn more"
          >
            <ArrowDown className="w-5 h-5 mx-auto animate-bounce" style={{ color: "hsl(215, 12%, 40%)" }} />
          </button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;