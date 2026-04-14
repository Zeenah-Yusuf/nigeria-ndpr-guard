import heroBg from "@/assets/hero-bg.jpg";
import { ShieldCheck, ArrowDown } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <img src={heroBg} alt="Lagos skyline" className="w-full h-full object-cover" width={1920} height={1080} />
        <div className="absolute inset-0 bg-hero-gradient opacity-90" />
      </div>
      <div className="relative z-10 container mx-auto px-4 text-center pt-20">
        <div className="animate-fade-in-up">
          <div className="inline-flex items-center gap-2 bg-primary/20 border border-primary/30 rounded-full px-4 py-1.5 mb-6">
            <ShieldCheck className="w-4 h-4 text-primary" style={{ color: "hsl(152, 69%, 50%)" }} />
            <span className="text-sm font-medium" style={{ color: "hsl(152, 69%, 70%)" }}>AI-Powered Compliance for Nigerian Startups</span>
          </div>
        </div>
        <h1 className="animate-fade-in-up font-heading text-4xl md:text-6xl lg:text-7xl font-bold max-w-4xl mx-auto leading-tight" style={{ color: "hsl(0, 0%, 100%)", animationDelay: "0.1s" }}>
          Avoid NDPR fines{" "}
          <span className="text-gradient-primary">before you launch.</span>
        </h1>
        <p className="animate-fade-in-up text-lg md:text-xl max-w-2xl mx-auto mt-6" style={{ color: "hsl(220, 14%, 75%)", animationDelay: "0.2s" }}>
          RegTrack helps Nigerian founders test compliance risks in minutes — powered by AI and the full NDPR framework.
        </p>
        <div className="animate-fade-in-up mt-8 flex flex-col sm:flex-row items-center justify-center gap-4" style={{ animationDelay: "0.3s" }}>
          <button
            onClick={() => document.getElementById("demo")?.scrollIntoView({ behavior: "smooth" })}
            className="px-8 py-4 rounded-xl bg-gradient-primary text-primary-foreground font-semibold text-lg hover:opacity-90 transition-all animate-pulse-glow"
          >
            Try the Risk Scanner
          </button>
          <button
            onClick={() => document.getElementById("solution")?.scrollIntoView({ behavior: "smooth" })}
            className="px-8 py-4 rounded-xl border font-semibold text-lg hover:bg-primary/5 transition-all"
            style={{ borderColor: "hsl(220, 14%, 30%)", color: "hsl(220, 14%, 80%)" }}
          >
            Learn More
          </button>
        </div>
        <div className="animate-fade-in-up mt-16" style={{ animationDelay: "0.5s" }}>
          <ArrowDown className="w-6 h-6 mx-auto animate-bounce" style={{ color: "hsl(220, 14%, 50%)" }} />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
