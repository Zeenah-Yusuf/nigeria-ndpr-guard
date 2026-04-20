import { useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import { TrustBadges } from "@/components/TrustBadges";
import WaitlistSection from "@/components/WaitlistSection";
import Footer from "@/components/Footer";
import { ChevronDown, ChevronRight, Globe, AlertTriangle } from "lucide-react";
import { OptimizedImage } from "@/components/OptimizedImage";
import multilingualImage from "@/assets/multilingual.png";
import auditDueImage from "@/assets/audit-due.png";

const Home = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const heroRef = useRef<HTMLElement>(null);
  const trustRef = useRef<HTMLElement>(null);
  const featuresRef = useRef<HTMLElement>(null);
  const waitlistRef = useRef<HTMLElement>(null);

  const scrollToSection = (ref: React.RefObject<HTMLElement>) => {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Handle scroll to section when navigating from other pages
  useEffect(() => {
    const state = location.state as { scrollTo?: string } | null;
    if (state?.scrollTo) {
      setTimeout(() => {
        document.getElementById(state.scrollTo)?.scrollIntoView({ 
          behavior: "smooth" 
        });
      }, 100);
    }
  }, [location]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="relative">
        {/* Hero Section */}
        <section ref={heroRef} id="hero" className="relative">
          <HeroSection />
          {/* Scroll Down Arrow */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20">
            <button
              onClick={() => scrollToSection(trustRef)}
              className="flex flex-col items-center gap-2 text-white/70 hover:text-white transition-colors group"
            >
              <span className="text-xs uppercase tracking-wider bg-black/20 backdrop-blur-sm px-4 py-1.5 rounded-full">
                See What We Stand For
              </span>
              <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center group-hover:bg-white/20 transition-all animate-bounce">
                <ChevronDown className="w-5 h-5" />
              </div>
            </button>
          </div>
        </section>

        {/* Trust Badges Section */}
        <section ref={trustRef} id="trust" className="relative">
          <TrustBadges />
          {/* Navigation Arrow to Features */}
          <div className="container mx-auto px-4 pb-8">
            <div className="flex justify-center">
              <button
                onClick={() => scrollToSection(featuresRef)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground hover:opacity-90 transition-all group"
              >
                <span>See Key Features</span>
                <ChevronDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
              </button>
            </div>
          </div>
        </section>

        {/* Feature Cards Section */}
        <section ref={featuresRef} id="features" className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-10">
              <h2 className="font-heading text-3xl font-bold text-foreground mb-3">
                Everything You Need for Compliance
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                RegTrack combines powerful features to keep your business protected and informed.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              
              {/* Multilingual Card */}
              <div className="group relative bg-card border border-border rounded-2xl overflow-hidden shadow-card hover:shadow-elevated hover:-translate-y-1 transition-all duration-300">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-secondary" />
                <div className="p-6">
                  <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                    <Globe className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="font-heading text-xl font-bold text-foreground mb-2">
                    Multilingual Support
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                    RegTrack speaks your language. Full support for English, Hausa, Igbo, and Yoruba. 
                    The entire platform scanner, results, and clause finder is available in all four 
                    languages, making compliance accessible to every Nigerian founder.
                  </p>
                  <div className="rounded-xl overflow-hidden border border-border">
                    <OptimizedImage 
                      src={multilingualImage} 
                      alt="Multilingual support in English, Hausa, Igbo, and Yoruba" 
                      className="w-full h-40 object-cover"
                    />
                  </div>
                </div>
              </div>

              {/* Audit Due Card */}
              <div className="group relative bg-card border border-border rounded-2xl overflow-hidden shadow-card hover:shadow-elevated hover:-translate-y-1 transition-all duration-300">
                <div className="absolute top-0 left-0 right-0 h-1 bg-amber-500" />
                <div className="p-6">
                  <div className="w-14 h-14 rounded-xl bg-amber-50 dark:bg-amber-950/30 flex items-center justify-center mb-4">
                    <AlertTriangle className="w-7 h-7 text-amber-600 dark:text-amber-500" />
                  </div>
                  <h3 className="font-heading text-xl font-bold text-foreground mb-2">
                    Don't Miss Your Audit Deadline
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                    Data Controllers of Major Importance must file annual Compliance Audit Returns 
                    with NDPC by March 31st. Missing this deadline triggers automatic penalties 
                    and increased regulatory scrutiny. RegTrack helps you stay ahead.
                  </p>
                  <div className="rounded-xl overflow-hidden border border-border">
                    <OptimizedImage 
                      src={auditDueImage} 
                      alt="Compliance audit deadline reminder" 
                      className="w-full h-40 object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation Options */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-12">
              <button
                onClick={() => navigate("/compliance-gap")}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-all group shadow-md"
              >
                <span>Discover the Compliance Gap</span>
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              
              <button
                onClick={() => scrollToSection(waitlistRef)}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border-2 border-primary text-primary font-semibold hover:bg-primary/10 transition-all"
              >
                <span>Join the Waitlist</span>
                <ChevronDown className="w-5 h-5" />
              </button>
            </div>
          </div>
        </section>

        {/* Waitlist Section */}
        <section ref={waitlistRef} id="waitlist">
          <WaitlistSection />
          {/* Back to Top */}
          <div className="container mx-auto px-4 pb-8">
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={() => scrollToSection(heroRef)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-border bg-card text-foreground hover:bg-muted/60 transition-all group"
              >
                <ChevronDown className="w-4 h-4 rotate-180" />
                <span>Back to Top</span>
              </button>
              <button
                onClick={() => navigate("/compliance-gap")}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground hover:opacity-90 transition-all group"
              >
                <span>Continue to Compliance Gap</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Home;