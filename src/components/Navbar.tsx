import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import nssLogo from "@/assets/nss-logo.png";
import { Shield, Menu, X } from "lucide-react";
import { LanguageSelector } from "./layout/LanguageSelector";
import { NigeriaFlag } from "./NigeriaFlag";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isActive = (path: string) => location.pathname === path;

  // All navigation items are now proper page routes
  const navLinks = [
    { label: "Home", path: "/" },
    { label: "Compliance Gap", path: "/compliance-gap" },
    { label: "Solution", path: "/solution" },
    { label: "Demo", path: "/demo" },
    { label: "About", path: "/about" },
  ];

  const handleWaitlistClick = () => {
    setMobileOpen(false);
    if (location.pathname !== '/') {
      navigate('/', { state: { scrollTo: 'waitlist' } });
    } else {
      document.getElementById("waitlist")?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? "bg-background/90 backdrop-blur-xl border-b border-border shadow-card" 
          : "bg-transparent"
      }`}>
        <div className="container mx-auto flex items-center justify-between h-16 px-4">
          
          {/* Logo Section */}
          <Link to="/" className="flex items-center gap-2.5">
            <img src={nssLogo} alt="Nexus SafeSphere" className="h-9 w-auto" />
            <div className="hidden sm:block">
              <span className="font-heading font-bold text-foreground text-base leading-none">
                RegTrack
              </span>
              <div className="flex items-center gap-1">
                <span className="text-[10px] text-muted-foreground">Built for Naija</span>
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
                className={`px-4 py-2 text-sm rounded-lg transition-all duration-200 ${
                  isActive(link.path)
                    ? "text-primary font-semibold bg-primary/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                }`}
              >
                {link.label}
              </Link>
            ))}
            
            <LanguageSelector />
            
            <button
              onClick={handleWaitlistClick}
              className="ml-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-all duration-200 flex items-center gap-1.5 shadow-md"
            >
              <Shield className="w-4 h-4" />
              Join Waitlist
            </button>
          </div>

          {/* Mobile Controls */}
          <div className="flex items-center gap-2 md:hidden">
            <LanguageSelector />
            
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 rounded-lg hover:bg-muted/60 transition-colors text-foreground"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer */}
      <div className={`fixed inset-0 z-50 md:hidden transition-all duration-300 ${
        mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      }`}>
        <div 
          className="absolute inset-0 bg-foreground/30 backdrop-blur-sm" 
          onClick={() => setMobileOpen(false)} 
        />
        <div className={`absolute top-16 right-0 left-0 bg-card border-b border-border shadow-elevated transition-transform duration-300 ${
          mobileOpen ? "translate-y-0" : "-translate-y-4"
        }`}>
          <div className="p-4 space-y-1 max-h-[70vh] overflow-y-auto">
            {navLinks.map(link => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileOpen(false)}
                className={`block px-4 py-3 rounded-xl transition-colors ${
                  isActive(link.path)
                    ? "text-primary font-semibold bg-primary/10"
                    : "text-foreground hover:bg-muted/60"
                }`}
              >
                {link.label}
              </Link>
            ))}
            
            <div className="pt-2 mt-2 border-t border-border">
              <button
                onClick={handleWaitlistClick}
                className="w-full px-4 py-3 rounded-xl bg-primary text-primary-foreground font-semibold"
              >
                Join Waitlist
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;