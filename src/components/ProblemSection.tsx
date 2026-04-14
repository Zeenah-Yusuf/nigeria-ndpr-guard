import { AlertTriangle } from "lucide-react";

const ProblemSection = () => {
  return (
    <section id="problem" className="py-24 bg-card">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-destructive/10 text-destructive rounded-full px-4 py-1.5 mb-6">
            <AlertTriangle className="w-4 h-4" />
            <span className="text-sm font-medium">The Problem</span>
          </div>
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-6">
            Launching without compliance can cost you everything
          </h2>
          <div className="rounded-2xl border border-border bg-background p-8 shadow-elevated text-left">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-2xl">🏥</span>
              </div>
              <div>
                <p className="text-foreground leading-relaxed">
                  <span className="font-semibold">A Lagos founder launches a health app.</span> Users love it — 5,000 signups in the first week. Two weeks later, NITDA sends an enforcement notice. 
                </p>
                <p className="text-foreground leading-relaxed mt-3">
                  The fine? <span className="text-destructive font-bold">₦10,000,000</span> — or 2% of annual gross revenue, whichever is greater. No privacy policy. No consent mechanism. No data audit. No DPO.
                </p>
                <p className="text-primary font-semibold mt-4 text-lg">
                  RegTrack prevents this. In minutes, not months.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProblemSection;
