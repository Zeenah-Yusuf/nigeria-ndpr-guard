import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import nssLogo from "@/assets/nss-logo.png";
import { Shield, Menu, X, User, LogOut, LayoutDashboard, Building2 } from "lucide-react";
import { LanguageSelector } from "./layout/LanguageSelector";
import { NigeriaFlag } from "./NigeriaFlag";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, profile, signOut } = useAuth();
  const { t } = useLanguage();
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const toggleButtonRef = useRef<HTMLButtonElement>(null);

  const isAdmin = profile?.role === "admin";
  const isDPCO = profile?.role === "dpco";
  const isOrganization = profile?.role === "organization";

  const navLinks = useMemo(() => {
    const links = [
      { label: t('nav.home'), path: "/" },
      { label: t('nav.compliance'), path: "/compliance-gap" },
      { label: t('nav.solution'), path: "/solution" },
      { label: t('nav.demo'), path: "/demo" },
      { label: t('nav.about'), path: "/about" },
    ];

    if (isAdmin) {
      links.push({ label: t('nav.regulator'), path: "/regulator" });
      links.push({ label: t('nav.admin'), path: "/admin-dashboard" });
    }

    return links;
  }, [isAdmin, t]);

  // FIXED: Logic mapping to match your App.tsx routes
  const dashboardPath = useMemo(() => {
    if (isAdmin) return "/admin-dashboard";
    if (isDPCO) return "/dpco-dashboard";
    if (isOrganization) return "/org-dashboard";
    return "/";
  }, [isAdmin, isDPCO, isOrganization]);

  const dashboardTitle = useMemo(() => {
    if (isAdmin) return t('dashboard.admin.title');
    if (isDPCO) return "DPCO Dashboard";
    if (isOrganization) return t('features.myDashboard');
    return t('nav.dashboard');
  }, [isAdmin, isDPCO, isOrganization, t]);

  const roleBadge = useMemo(() => {
    if (isAdmin) return { label: "Admin", classes: "bg-destructive/10 text-destructive" };
    if (isDPCO) return { label: "DPCO", classes: "bg-primary/10 text-primary" };
    if (isOrganization) return { label: "Org", classes: "bg-primary/10 text-primary" };
    return null;
  }, [isAdmin, isDPCO, isOrganization]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setMobileOpen(false), [location.pathname]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && mobileOpen) {
        setMobileOpen(false);
        toggleButtonRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [mobileOpen]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  useEffect(() => {
    if (!mobileOpen || !mobileMenuRef.current) return;
    const focusableElements = mobileMenuRef.current.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );
    if (focusableElements.length === 0) return;
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    firstElement.focus();

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;
      if (e.shiftKey) {
        if (document.activeElement === firstElement) { e.preventDefault(); lastElement.focus(); }
      } else {
        if (document.activeElement === lastElement) { e.preventDefault(); firstElement.focus(); }
      }
    };
    document.addEventListener("keydown", handleTabKey);
    return () => document.removeEventListener("keydown", handleTabKey);
  }, [mobileOpen]);

  const isActive = useCallback((path: string) => location.pathname === path, [location.pathname]);

  const handleWaitlistClick = useCallback(() => {
    setMobileOpen(false);
    if (location.pathname !== "/") {
      navigate("/", { state: { scrollTo: "waitlist" } });
    } else {
      document.getElementById("waitlist")?.scrollIntoView({ behavior: "smooth" });
    }
  }, [location.pathname, navigate]);

  // FIXED: Force hard reload to reset Router state
  const handleSignOut = useCallback(async () => {
    await signOut();
    setMobileOpen(false);
    window.location.href = "/";
  }, [signOut]);

  const handleDashboardClick = useCallback(() => {
    navigate(dashboardPath);
  }, [dashboardPath, navigate]);

  const handleToggleMenu = useCallback(() => setMobileOpen(prev => !prev), []);
  const handleCloseMenu = useCallback(() => setMobileOpen(false), []);

  const ariaExpandedValue = mobileOpen ? "true" : "false";

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? "bg-background/90 backdrop-blur-xl border-b border-border shadow-card" : "bg-transparent"
        }`}
        role="navigation" aria-label="Main navigation"
      >
        <div className="container mx-auto flex items-center justify-between h-16 px-4">
          <Link to="/" className="flex items-center gap-2.5 group focus:outline-none focus:ring-2 focus:ring-primary rounded-lg" aria-label="RegTrack Home">
            <img src={nssLogo} alt="Nexus SafeSphere" className="h-9 w-auto" loading="eager" width={36} height={36} />
            <div className="hidden sm:block">
              <span className="font-heading font-bold text-foreground text-base leading-none">{t('app.name')}</span>
              <div className="flex items-center gap-1">
                <span className="text-[10px] text-muted-foreground">{t('app.builtFor')}</span>
                <NigeriaFlag className="w-4 h-3" />
              </div>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(link => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-4 py-2 text-sm rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary ${
                  isActive(link.path) ? "text-primary font-semibold bg-primary/10" : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                }`}
                aria-current={isActive(link.path) ? "page" : undefined}
              >
                {link.label}
              </Link>
            ))}
            <LanguageSelector />

            {user ? (
              <div className="flex items-center gap-2 ml-2">
                <button
                  onClick={handleDashboardClick}
                  className="p-2 rounded-lg hover:bg-primary/10 transition-colors text-primary"
                  aria-label={t('nav.dashboard')}
                  type="button"
                  title={dashboardTitle}
                >
                  <LayoutDashboard className="w-4 h-4" />
                </button>

                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-muted/50 text-xs text-foreground">
                  <User className="w-3.5 h-3.5 text-primary" />
                  <span className="max-w-[120px] truncate">
                    {profile?.company_name || user.email?.split('@')[0]}
                  </span>
                  {roleBadge && (
                    <span className={`text-[9px] px-1.5 py-0.5 rounded-full ${roleBadge.classes}`}>
                      {roleBadge.label}
                    </span>
                  )}
                </div>

                <button
                  onClick={handleSignOut}
                  className="p-2 rounded-lg hover:bg-muted/60 transition-colors text-muted-foreground hover:text-foreground"
                  aria-label={t('nav.signOut')}
                  type="button"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 ml-2">
                <Link to="/login" className="px-4 py-2 text-sm rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-all">
                  {t('nav.signIn')}
                </Link>
                <Link to="/register" className="px-4 py-2 text-sm rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-all">
                  {t('nav.register')}
                </Link>
              </div>
            )}

            <button
              onClick={handleWaitlistClick}
              className="ml-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 flex items-center gap-1.5 shadow-md focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              aria-label={t('nav.joinWaitlist')}
              type="button"
            >
              <Shield className="w-4 h-4" />{t('nav.joinWaitlist')}
            </button>
          </div>

          <div className="flex items-center gap-2 md:hidden">
            <LanguageSelector />
            <button
              ref={toggleButtonRef}
              type="button"
              onClick={handleToggleMenu}
              className="p-2 rounded-lg hover:bg-muted/60 transition-colors text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              aria-label={mobileOpen ? t('common.close') : "Open menu"}
              aria-expanded={ariaExpandedValue}
              aria-controls="mobile-menu"
              aria-haspopup="true"
            >
              {mobileOpen ? <X className="w-5 h-5" aria-hidden="true" /> : <Menu className="w-5 h-5" aria-hidden="true" />}
            </button>
          </div>
        </div>
      </nav>

      <div
        id="mobile-menu"
        ref={mobileMenuRef}
        className={`fixed inset-0 z-50 md:hidden transition-all duration-300 ${
          mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        role="dialog" aria-modal="true" aria-label="Mobile navigation menu" aria-hidden={!mobileOpen}
      >
        <div className="absolute inset-0 bg-foreground/30 backdrop-blur-sm" onClick={handleCloseMenu} aria-hidden="true" />
        <div className={`absolute top-16 right-0 left-0 bg-card border-b border-border shadow-elevated transition-transform duration-300 ${
          mobileOpen ? "translate-y-0" : "-translate-y-4"
        }`}>
          <div className="p-4 space-y-1 max-h-[calc(100vh-4rem)] overflow-y-auto">
            {navLinks.map(link => (
              <Link
                key={link.path}
                to={link.path}
                onClick={handleCloseMenu}
                className={`block px-4 py-3 rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-primary ${
                  isActive(link.path) ? "text-primary font-semibold bg-primary/10" : "text-foreground hover:bg-muted/60"
                }`}
                aria-current={isActive(link.path) ? "page" : undefined}
              >
                {link.label}
              </Link>
            ))}

            <div className="pt-2 mt-2 border-t border-border space-y-1">
              {user ? (
                <>
                  <div className="flex items-center gap-2 px-4 py-2 text-sm text-foreground">
                    <User className="w-4 h-4 text-primary" />
                    <span>{profile?.company_name || user.email}</span>
                  </div>
                  <button
                    onClick={handleDashboardClick}
                    className="w-full px-4 py-3 rounded-xl text-left text-sm text-primary hover:bg-primary/5 transition-colors flex items-center gap-2"
                  >
                    <LayoutDashboard className="w-4 h-4" />{t('nav.dashboard')}
                  </button>
                  <button
                    onClick={handleSignOut}
                    className="w-full px-4 py-3 rounded-xl text-left text-sm text-muted-foreground hover:bg-muted/60 transition-colors flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />{t('nav.signOut')}
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={handleCloseMenu} className="block px-4 py-3 rounded-xl text-sm text-foreground hover:bg-muted/60 transition-colors">
                    {t('nav.signIn')}
                  </Link>
                  <Link to="/register" onClick={handleCloseMenu} className="block px-4 py-3 rounded-xl text-sm bg-primary text-primary-foreground text-center">
                    {t('nav.register')}
                  </Link>
                </>
              )}
              <button
                onClick={handleWaitlistClick}
                className="w-full px-4 py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-all"
              >
                {t('nav.joinWaitlist')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;