import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Mail, Check, Rocket } from "lucide-react";

const WaitlistSection = () => {
  const { t } = useLanguage();
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubmitting(true);
    setTimeout(() => {
      setSubmitted(true);
      setSubmitting(false);
    }, 600);
  };

  return (
    <section id="waitlist" className="py-24 bg-hero-gradient relative overflow-hidden">
      {/* Decorative orbs */}
      <div className="absolute top-1/3 -left-24 w-72 h-72 rounded-full opacity-10 blur-3xl" style={{ background: "hsl(207, 72%, 45%)" }} />
      <div className="absolute bottom-1/3 -right-24 w-72 h-72 rounded-full opacity-10 blur-3xl" style={{ background: "hsl(152, 60%, 42%)" }} />
      <div className="absolute top-0 left-0 right-0 h-px bg-brand-gradient opacity-30" />

      <div className="relative container mx-auto px-4 text-center">
        <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-6 border" style={{ background: "hsl(180, 40%, 30%, 0.15)", borderColor: "hsl(180, 40%, 40%, 0.25)" }}>
          <Rocket className="w-4 h-4" style={{ color: "hsl(165, 60%, 55%)" }} />
          <span className="text-sm font-medium" style={{ color: "hsl(165, 50%, 65%)" }}>
            {t('waitlist.badge')}
          </span>
        </div>
        <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4" style={{ color: "hsl(0, 0%, 100%)" }}>
          {t('waitlist.title')}
        </h2>
        <p className="text-base max-w-lg mx-auto mb-8 leading-relaxed" style={{ color: "hsl(215, 15%, 60%)" }}>
          {t('waitlist.subtitle')}
        </p>

        {submitted ? (
          <div className="animate-fade-in-up inline-flex items-center gap-3 rounded-2xl px-8 py-5 border" style={{ background: "hsl(152, 40%, 30%, 0.2)", borderColor: "hsl(152, 40%, 40%, 0.3)" }}>
            <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
              <Check className="w-5 h-5 text-secondary-foreground" />
            </div>
            <div className="text-left">
              <p className="font-semibold" style={{ color: "hsl(152, 60%, 65%)" }}>
                {t('waitlist.success.title')}
              </p>
              <p className="text-sm" style={{ color: "hsl(215, 15%, 55%)" }}>
                {t('waitlist.success.message')}
              </p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="max-w-md mx-auto flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: "hsl(215, 15%, 40%)" }} />
              <input
                type="email"
                placeholder={t('waitlist.placeholder')}
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="w-full pl-12 pr-4 py-4 rounded-xl border backdrop-blur-sm placeholder:opacity-50 focus:outline-none focus:ring-2 focus:ring-secondary/50 transition-all duration-200"
                style={{ background: "hsl(215, 40%, 12%, 0.6)", borderColor: "hsl(215, 15%, 22%)", color: "hsl(0, 0%, 100%)" }}
              />
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="px-7 py-4 rounded-xl bg-brand-gradient-vivid text-primary-foreground font-bold hover:opacity-90 active:scale-[0.97] transition-all duration-200 whitespace-nowrap flex items-center justify-center gap-2 min-w-[140px]"
            >
              {submitting ? (
                <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
              ) : (
                t('waitlist.button')
              )}
            </button>
          </form>
        )}
      </div>
    </section>
  );
};

export default WaitlistSection;