import { Shield, Award, Clock, AlertTriangle } from "lucide-react";

// Your custom images
import auditDue from "@/assets/audit-due.png";
import fineNotice from "@/assets/fine-notice.png";

export function TrustBadges() {
  return (
    <section className="py-16 bg-gradient-to-b from-background to-muted/20 border-y border-border">
      <div className="container mx-auto px-4">
        
        {/* Section Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary rounded-full px-4 py-1.5 mb-4">
            <Shield className="w-4 h-4" />
            <span className="text-xs font-semibold uppercase tracking-wider">
              Why Founders Trust RegTrack
            </span>
          </div>
          <h2 className="font-heading text-2xl md:text-3xl font-bold text-foreground mb-3">
            Compliance Gaps Have Real Consequences
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            We built RegTrack so you never have to face these alone.
          </p>
        </div>

        {/* Visual Impact Cards */}
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-12">
          
          {/* Audit Due Card */}
          <div className="group relative bg-card border border-border rounded-2xl overflow-hidden shadow-card hover:shadow-elevated hover:-translate-y-1 transition-all duration-300">
            <div className="absolute top-0 left-0 right-0 h-1 bg-amber-500" />
            <div className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-xl bg-amber-50 dark:bg-amber-950/30 flex items-center justify-center flex-shrink-0">
                  <img 
                    src={auditDue} 
                    alt="Compliance Audit Due" 
                    className="w-10 h-10 object-contain"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-4 h-4 text-amber-600 dark:text-amber-500" />
                    <span className="text-xs font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-500">
                      Annual Requirement
                    </span>
                  </div>
                  <h3 className="font-heading text-lg font-bold text-foreground mb-1">
                    Compliance Audit Returns
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Data Controllers of Major Importance must file annual CAR with NDPC by March 31st. 
                    Missing this deadline triggers automatic penalties and increased scrutiny.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Fine Notice Card */}
          <div className="group relative bg-card border border-border rounded-2xl overflow-hidden shadow-card hover:shadow-elevated hover:-translate-y-1 transition-all duration-300">
            <div className="absolute top-0 left-0 right-0 h-1 bg-destructive" />
            <div className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-xl bg-destructive/10 flex items-center justify-center flex-shrink-0">
                  <img 
                    src={fineNotice} 
                    alt="NDPC Fine Notice" 
                    className="w-10 h-10 object-contain"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="w-4 h-4 text-destructive" />
                    <span className="text-xs font-semibold uppercase tracking-wider text-destructive">
                      Enforcement Reality
                    </span>
                  </div>
                  <h3 className="font-heading text-lg font-bold text-foreground mb-1">
                    NDPC Enforcement Actions
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    The Commission actively investigates and penalizes non-compliance. Fines reach 
                    ₦10,000,000 or 2% of annual gross revenue—whichever is greater.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Trust Strip */}
        <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Shield className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">NDP Act 2023 Compliant</p>
              <p className="text-xs text-muted-foreground">Current regulatory framework</p>
            </div>
          </div>

          <div className="hidden md:block w-px h-8 bg-border" />

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Award className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">NDPC Aligned</p>
              <p className="text-xs text-muted-foreground">GAID 2025 guidance followed</p>
            </div>
          </div>

          <div className="hidden md:block w-px h-8 bg-border" />

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Shield className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">Built in Abuja</p>
              <p className="text-xs text-muted-foreground">For Nigerian businesses</p>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="text-center mt-10">
          <p className="text-[11px] text-muted-foreground/60 max-w-2xl mx-auto">
            RegTrack provides educational guidance. Official compliance verification should always be 
            confirmed with the Nigeria Data Protection Commission.
          </p>
        </div>
      </div>
    </section>
  );
}