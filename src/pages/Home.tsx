import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import type { UserRole } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import { TrustBadges } from "@/components/TrustBadges";
import WaitlistSection from "@/components/WaitlistSection";
import Footer from "@/components/Footer";
import { ChevronDown, ChevronRight, Globe, AlertTriangle, Landmark, Shield, Users, User, LogOut, ArrowLeftRight, LayoutDashboard, Building2, ArrowRight, ShieldCheck } from "lucide-react";
import { OptimizedImage } from "@/components/OptimizedImage";
import { useLanguage } from "@/contexts/LanguageContext";
import multilingualImage from "@/assets/multilingual.png";
import auditDueImage from "@/assets/audit-due.png";

const DASHBOARD_ROUTES: Record<UserRole, string> = {
  admin: "/admin-dashboard",
  dpco: "/dpco-dashboard",
  organization: "/org-dashboard",
};

const DASHBOARD_ICONS: Record<UserRole, React.ReactNode> = {
  admin: <ShieldCheck className="w-4 h-4 text-primary" />,
  dpco: <LayoutDashboard className="w-4 h-4 text-primary" />,
  organization: <Building2 className="w-4 h-4 text-primary" />,
};

const Home = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, profile, signOut, switchAccount } = useAuth();
  const { t } = useLanguage();
  const heroRef = useRef<HTMLElement>(null);
  const trustRef = useRef<HTMLElement>(null);
  const featuresRef = useRef<HTMLElement>(null);
  const waitlistRef = useRef<HTMLElement>(null);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const isLoggedIn = !!user;
  const role = profile?.role;

  const scrollToSection = (ref: React.RefObject<HTMLElement>) => {
    if (ref.current) ref.current.scrollIntoView({ behavior: "smooth" });
  };

  const handleSignOut = () => {
    setShowUserMenu(false);
    signOut();
  };

  const handleSwitchAccount = () => {
    setShowUserMenu(false);
    switchAccount();
  };

  const handleNavigate = (path: string) => {
    setShowUserMenu(false);
    navigate(path);
  };

  useEffect(() => {
    const state = location.state as { scrollTo?: string } | null;
    const scrollTarget = state?.scrollTo;
    if (scrollTarget) {
      setTimeout(() => {
        document.getElementById(scrollTarget)?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  }, [location]);

  const displayName = profile?.company_name || user?.email?.split("@")[0] || "User";

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {isLoggedIn && (
        <div className="bg-card border-b border-border relative mt-16">
          <div className="container mx-auto px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="w-4 h-4 text-primary" />
              </div>
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 hover:bg-muted/50 px-2 py-1 rounded-lg transition-colors"
              >
                <div className="text-left">
                  <p className="text-sm font-semibold text-foreground">{displayName}</p>
                  <p className="text-[10px] text-muted-foreground capitalize">{role}</p>
                </div>
                <ChevronDown
                  className={`w-4 h-4 text-muted-foreground transition-transform ${
                    showUserMenu ? "rotate-180" : ""
                  }`}
                />
              </button>
            </div>

            {showUserMenu && (
              <div className="absolute top-full left-4 mt-1 w-56 bg-card border border-border rounded-xl shadow-elevated z-50 animate-fade-in">
                <div className="p-2 space-y-1">
                  <div className="px-3 py-2 border-b border-border">
                    <p className="text-xs font-semibold text-foreground">{displayName}</p>
                    <p className="text-[10px] text-muted-foreground">{user.email}</p>
                  </div>

                  {role && DASHBOARD_ROUTES[role] && (
                    <button
                      onClick={() => handleNavigate(DASHBOARD_ROUTES[role])}
                      className="w-full px-3 py-2 text-left text-sm text-foreground hover:bg-muted/50 rounded-lg transition-colors flex items-center gap-2"
                    >
                      {DASHBOARD_ICONS[role]}
                      {t("nav.dashboard")}
                    </button>
                  )}

                  <button
                    onClick={() => handleNavigate("/demo")}
                    className="w-full px-3 py-2 text-left text-sm text-foreground hover:bg-muted/50 rounded-lg transition-colors flex items-center gap-2"
                  >
                    <Shield className="w-4 h-4 text-primary" />
                    {t("features.complianceAssessment")}
                  </button>

                  <div className="border-t border-border pt-1 mt-1">
                    <button
                      onClick={handleSwitchAccount}
                      className="w-full px-3 py-2 text-left text-sm text-muted-foreground hover:bg-muted/50 rounded-lg transition-colors flex items-center gap-2"
                    >
                      <ArrowLeftRight className="w-4 h-4" />
                      {t("nav.switchAccount")}
                    </button>
                    <button
                      onClick={handleSignOut}
                      className="w-full px-3 py-2 text-left text-sm text-destructive hover:bg-destructive/10 rounded-lg transition-colors flex items-center gap-2"
                    >
                      <LogOut className="w-4 h-4" />
                      {t("nav.signOut")}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <main className="relative">
        <section ref={heroRef} id="hero" className="relative">
          <HeroSection />
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20">
            <button
              onClick={() => scrollToSection(trustRef)}
              className="flex flex-col items-center gap-2 text-white/70 hover:text-white transition-colors group"
            >
              <span className="text-xs uppercase tracking-wider bg-black/20 backdrop-blur-sm px-4 py-1.5 rounded-full">
                {t("hero.seeWhatWeStandFor")}
              </span>
              <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center group-hover:bg-white/20 transition-all animate-bounce">
                <ChevronDown className="w-5 h-5" />
              </div>
            </button>
          </div>
        </section>

        <section ref={trustRef} id="trust" className="relative">
          <TrustBadges />
          <div className="container mx-auto px-4 pb-8">
            <div className="flex justify-center">
              <button
                onClick={() => scrollToSection(featuresRef)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground hover:opacity-90 transition-all group"
              >
                <span>{t("features.seeKeyFeatures")}</span>
                <ChevronDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
              </button>
            </div>
          </div>
        </section>

        <section ref={featuresRef} id="features" className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-10">
              <h2 className="font-heading text-3xl font-bold text-foreground mb-3">
                {t("features.everythingYouNeed")}
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                {t("features.subtitle")}
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="group relative bg-card border border-border rounded-2xl overflow-hidden shadow-card hover:shadow-elevated hover:-translate-y-1 transition-all duration-300">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-secondary" />
                <div className="p-6">
                  <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                    <Globe className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="font-heading text-xl font-bold text-foreground mb-2">
                    {t("features.multilingual")}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                    {t("features.multilingualDesc")}
                  </p>
                  <div className="rounded-xl overflow-hidden border border-border">
                    <OptimizedImage
                      src={multilingualImage}
                      alt="Multilingual support"
                      className="w-full h-40 object-cover"
                    />
                  </div>
                </div>
              </div>

              <div className="group relative bg-card border border-border rounded-2xl overflow-hidden shadow-card hover:shadow-elevated hover:-translate-y-1 transition-all duration-300">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-accent to-purple-500" />
                <div className="p-6">
                  <div className="w-14 h-14 rounded-xl bg-accent/10 flex items-center justify-center mb-4">
                    <Landmark className="w-7 h-7 text-accent" />
                  </div>
                  <h3 className="font-heading text-xl font-bold text-foreground mb-2">
                    {t("features.frameworks")}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                    {t("features.frameworksDesc")}
                  </p>
                  <div className="flex flex-wrap gap-1">
                    <span className="text-[10px] px-2 py-1 rounded bg-primary/10 text-primary">NDPA</span>
                    <span className="text-[10px] px-2 py-1 rounded bg-accent/10 text-accent">CBN</span>
                    <span className="text-[10px] px-2 py-1 rounded bg-purple-500/10 text-purple-500">SEC</span>
                    <span className="text-[10px] px-2 py-1 rounded bg-cyan-500/10 text-cyan-500">NITDA</span>
                  </div>
                </div>
              </div>

              <div className="group relative bg-card border border-border rounded-2xl overflow-hidden shadow-card hover:shadow-elevated hover:-translate-y-1 transition-all duration-300">
                <div className="absolute top-0 left-0 right-0 h-1 bg-amber-500" />
                <div className="p-6">
                  <div className="w-14 h-14 rounded-xl bg-amber-50 dark:bg-amber-950/30 flex items-center justify-center mb-4">
                    <AlertTriangle className="w-7 h-7 text-amber-600" />
                  </div>
                  <h3 className="font-heading text-xl font-bold text-foreground mb-2">
                    {t("features.deadlines")}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                    {t("features.deadlinesDesc")}
                  </p>
                  <div className="rounded-xl overflow-hidden border border-border">
                    <OptimizedImage
                      src={auditDueImage}
                      alt="Audit deadline"
                      className="w-full h-40 object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-12">
              {isLoggedIn ? (
                <>
                  <button
                    onClick={() => navigate("/demo")}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-all group shadow-md"
                  >
                    <Shield className="w-4 h-4" />
                    <span>{t("features.complianceAssessment")}</span>
                    <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                  {role && DASHBOARD_ROUTES[role] && (
                    <button
                      onClick={() => navigate(DASHBOARD_ROUTES[role])}
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border-2 border-primary text-primary font-semibold hover:bg-primary/10 transition-all"
                    >
                      {DASHBOARD_ICONS[role]}
                      <span>{t("features.myDashboard")}</span>
                      <ArrowRight className="w-5 h-5" />
                    </button>
                  )}
                </>
              ) : (
                <button
                  onClick={() => navigate("/demo")}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-all group shadow-md"
                >
                  <span>{t("features.tryDemo")}</span>
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              )}
              <button
                onClick={() => scrollToSection(waitlistRef)}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border-2 border-primary text-primary font-semibold hover:bg-primary/10 transition-all"
              >
                <span>{t("nav.joinWaitlist")}</span>
                <ChevronDown className="w-5 h-5" />
              </button>
            </div>
          </div>
        </section>

        <section ref={waitlistRef} id="waitlist">
          <WaitlistSection />
          <div className="container mx-auto px-4 pb-8">
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={() => scrollToSection(heroRef)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-border bg-card text-foreground hover:bg-muted/60 transition-all group"
              >
                <ChevronDown className="w-4 h-4 rotate-180" />
                <span>{t("features.backToTop")}</span>
              </button>
              {!isLoggedIn && (
                <Link
                  to="/register"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground hover:opacity-90 transition-all group"
                >
                  <span>{t("features.getStarted")}</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              )}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Home;