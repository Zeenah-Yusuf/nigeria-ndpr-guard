import { useState } from "react";
import { Mail, Check } from "lucide-react";

const WaitlistSection = () => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    // In production this would call Supabase
    setSubmitted(true);
  };

  return (
    <section id="waitlist" className="py-24 bg-hero-gradient">
      <div className="container mx-auto px-4 text-center">
        <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4" style={{ color: "hsl(0, 0%, 100%)" }}>
          Get early access to RegTrack
        </h2>
        <p className="text-lg max-w-xl mx-auto mb-8" style={{ color: "hsl(220, 14%, 70%)" }}>
          Join the waitlist to be first in line when we launch the full platform with AI-powered compliance automation.
        </p>
        {submitted ? (
          <div className="animate-fade-in-up inline-flex items-center gap-3 bg-primary/20 border border-primary/30 rounded-xl px-6 py-4">
            <Check className="w-6 h-6" style={{ color: "hsl(152, 69%, 50%)" }} />
            <span className="font-medium" style={{ color: "hsl(152, 69%, 70%)" }}>You're on the list! We'll be in touch.</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="max-w-md mx-auto flex gap-3">
            <div className="relative flex-1">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: "hsl(220, 14%, 50%)" }} />
              <input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="w-full pl-12 pr-4 py-3.5 rounded-xl border bg-background/10 backdrop-blur-sm placeholder:opacity-50 focus:outline-none focus:ring-2 focus:ring-primary"
                style={{ borderColor: "hsl(220, 14%, 25%)", color: "hsl(0, 0%, 100%)" }}
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3.5 rounded-xl bg-gradient-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity whitespace-nowrap"
            >
              Join Waitlist
            </button>
          </form>
        )}
      </div>
    </section>
  );
};

export default WaitlistSection;
