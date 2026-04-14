import { useState, useEffect } from "react";
import nssLogo from "@/assets/nss-logo.png";
import { Shield, Menu, X } from "lucide-react";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (id: string) => {
    setMobileOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const links = [
    { label: "Problem", id: "problem" },
    { label: "Solution", id: "solution" },
    { label: "Demo", id: "demo" },
  ];

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-background/90 backdrop-blur-xl border-b border-border shadow-card" : "bg-transparent"
      }`}>
        <div className="container mx-auto flex items-center justify-between h-16 px-4">
          <div className="flex items-center gap-2.5">
            <img src={nssLogo} alt="Nexus SafeSphere Logo" className="h-9 w-auto" />
            <div className="hidden sm:block">
              <span className="font-heading font-bold text-foreground text-base leading-none">RegTrack</span>
              <span className="block text-[10px] text-muted-foreground leading-none mt-0.5">by NSS</span>
            </div>
          </div>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {links.map(l => (
              <button
                key={l.id}
                onClick={() => scrollTo(l.id)}
                className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted/60 transition-all duration-200"
              >
                {l.label}
              </button>
            ))}
            <button
              onClick={() => scrollTo("waitlist")}
              className="ml-2 px-5 py-2.5 rounded-xl bg-brand-gradient text-primary-foreground text-sm font-semibold hover:opacity-90 transition-all duration-200 flex items-center gap-1.5 shadow-glow"
            >
              <Shield className="w-4 h-4" />
              Join Waitlist
            </button>
          </div>

          {/* Mobile burger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-muted/60 transition-colors text-foreground"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      <div className={`fixed inset-0 z-40 md:hidden transition-all duration-300 ${
        mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      }`}>
        <div className="absolute inset-0 bg-foreground/20 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
        <div className={`absolute top-16 right-0 left-0 bg-card border-b border-border shadow-elevated transition-transform duration-300 ${
          mobileOpen ? "translate-y-0" : "-translate-y-4"
        }`}>
          <div className="p-4 space-y-1">
            {links.map(l => (
              <button
                key={l.id}
                onClick={() => scrollTo(l.id)}
                className="w-full text-left px-4 py-3 text-foreground font-medium rounded-xl hover:bg-muted/60 transition-colors"
              >
                {l.label}
              </button>
            ))}
            <button
              onClick={() => scrollTo("waitlist")}
              className="w-full mt-2 px-4 py-3 rounded-xl bg-brand-gradient text-primary-foreground font-semibold flex items-center justify-center gap-2"
            >
              <Shield className="w-4 h-4" />
              Join Waitlist
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
