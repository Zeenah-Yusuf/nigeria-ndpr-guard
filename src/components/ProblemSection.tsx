import { AlertTriangle, TrendingDown } from "lucide-react";

const ProblemSection = () => {
  return (
    <section id="problem" className="py-24 bg-card relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-brand-gradient opacity-30" />
      
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-destructive/10 text-destructive rounded-full px-4 py-1.5 mb-5">
              <AlertTriangle className="w-4 h-4" />
              <span className="text-sm font-medium">The Problem</span>
            </div>
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground">
              Launching without compliance<br />
              <span className="text-destructive">can cost you everything</span>
            </h2>
          </div>

          <div className="rounded-2xl border border-border bg-background p-6 md:p-8 shadow-elevated relative group hover:shadow-glow transition-shadow duration-500">
            <div className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl bg-brand-gradient opacity-60" />
            <div className="flex flex-col md:flex-row items-start gap-5">
              <div className="w-14 h-14 rounded-2xl bg-destructive/10 flex items-center justify-center flex-shrink-0">
                <span className="text-3xl">🏥</span>
              </div>
              <div className="space-y-3">
                <p className="text-foreground leading-relaxed">
                  <span className="font-semibold">A Nigerian founder launches a health app.</span> Users love it — 5,000 signups in the first week. Two weeks later, NDPC sends an enforcement notice.
                </p>
                <p className="text-foreground leading-relaxed">
                  The fine? <span className="text-destructive font-bold text-lg">₦10,000,000</span> — or 2% of annual gross revenue, whichever is greater. No privacy policy. No consent mechanism. No data audit.
                </p>
                <div className="flex items-center gap-3 pt-2 border-t border-border mt-4">
                  <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center">
                    <TrendingDown className="w-5 h-5 text-secondary" />
                  </div>
                  <p className="text-secondary font-semibold text-lg">
                    RegTrack prevents this. In minutes, not months.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProblemSection;
