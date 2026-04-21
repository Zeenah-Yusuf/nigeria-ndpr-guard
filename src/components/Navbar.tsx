import { useState, useEffect, useCallback, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import nssLogo from "@/assets/nss-logo.png";
import { Shield, Menu, X } from "lucide-react";
import { LanguageSelector } from "./layout/LanguageSelector";
import { NigeriaFlag } from "./NigeriaFlag";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  // Handle scroll effect with useCallback and cleanup
  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  // Handle escape key to close mobile menu
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mobileOpen) {
        setMobileOpen(false);
      }
    };
    
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [mobileOpen]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  const isActive = useCallback((path: string) => location.pathname === path, [location.pathname]);

  // Navigation items with translation support
  const navLinks = [
    { label: t('nav.home'), path: "/" },
    { label: t('nav.compliance'), path: "/compliance-gap" },
    { label: t('nav.solution'), path: "/solution" },
    { label: t('nav.demo'), path: "/demo" },
    { label: t('nav.about'), path: "/about" },
    { label: t('nav.regulator'), path: "/regulator" },
  ];

  const handleWaitlistClick = useCallback(() => {
    setMobileOpen(false);
    if (location.pathname !== '/') {
      navigate('/', { state: { scrollTo: 'waitlist' } });
    } else {
      const waitlistElement = document.getElementById("waitlist");
      if (waitlistElement) {
        waitlistElement.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [location.pathname, navigate]);

  const toggleMobileMenu = useCallback(() => {
    setMobileOpen(prev => !prev);
  }, []);

  const closeMobileMenu = useCallback(() => {
    setMobileOpen(false);
  }, []);

  return (
    <>
      <nav 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled 
            ? "bg-background/90 backdrop-blur-xl border-b border-border shadow-card" 
            : "bg-transparent"
        }`}
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="container mx-auto flex items-center justify-between h-16 px-4">
          
          {/* Logo Section */}
          <Link 
            to="/" 
            className="flex items-center gap-2.5 group focus:outline-none focus:ring-2 focus:ring-primary rounded-lg"
            aria-label="RegTrack Home"
          >
            <img 
              src={nssLogo} 
              alt="Nexus SafeSphere" 
              className="h-9 w-auto" 
              loading="eager"
            />
            <div className="hidden sm:block">
              <span className="font-heading font-bold text-foreground text-base leading-none">
                RegTrack
              </span>
              <div className="flex items-center gap-1">
                <span className="text-[10px] text-muted-foreground">{t('app.builtFor')}</span>
                <NigeriaFlag className="w-4 h-3" />
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(link => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-4 py-2 text-sm rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary ${
                  isActive(link.path)
                    ? "text-primary font-semibold bg-primary/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                }`}
                aria-current={isActive(link.path) ? "page" : undefined}
              >
                {link.label}
              </Link>
            ))}
            
            <LanguageSelector />
            
            <button
              onClick={handleWaitlistClick}
              className="ml-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 flex items-center gap-1.5 shadow-md focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              aria-label="Join waitlist for early access"
            >
              <Shield className="w-4 h-4" />
              {t('waitlist.button')}
            </button>
          </div>

          {/* Mobile Controls */}
          <div className="flex items-center gap-2 md:hidden">
            <LanguageSelector />
            
            <button
              onClick={toggleMobileMenu}
              className="p-2 rounded-lg hover:bg-muted/60 transition-colors text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
              aria-controls="mobile-menu"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer */}
      <div 
        id="mobile-menu"
        ref={mobileMenuRef}
        className={`fixed inset-0 z-50 md:hidden transition-all duration-300 ${
          mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation menu"
      >
        {/* Backdrop */}
        <div 
          className="absolute inset-0 bg-foreground/30 backdrop-blur-sm" 
          onClick={closeMobileMenu}
          aria-hidden="true"
        />
        
        {/* Drawer Content */}
        <div 
          className={`absolute top-16 right-0 left-0 bg-card border-b border-border shadow-elevated transition-transform duration-300 ${
            mobileOpen ? "translate-y-0" : "-translate-y-4"
          }`}
        >
          <div className="p-4 space-y-1 max-h-[calc(100vh-4rem)] overflow-y-auto">
            {navLinks.map(link => (
              <Link
                key={link.path}
                to={link.path}
                onClick={closeMobileMenu}
                className={`block px-4 py-3 rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-primary ${
                  isActive(link.path)
                    ? "text-primary font-semibold bg-primary/10"
                    : "text-foreground hover:bg-muted/60"
                }`}
                aria-current={isActive(link.path) ? "page" : undefined}
              >
                {link.label}
              </Link>
            ))}
            
            <div className="pt-2 mt-2 border-t border-border">
              <button
                onClick={handleWaitlistClick}
                className="w-full px-4 py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:opacity-90 active:scale-[0.98] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                aria-label="Join waitlist for early access"
              >
                {t('waitlist.button')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;