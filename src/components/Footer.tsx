import nssLogo from "@/assets/nss-logo.png";
import { Mail, Twitter, Linkedin, Heart } from "lucide-react";

const Footer = () => {
  return (
    <footer className="py-12 bg-background border-t border-border">
      <div className="container mx-auto px-4">
        {/* Top section */}
        <div className="flex flex-col md:flex-row items-start justify-between gap-8 mb-8">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <span className="text-lg">🇳🇬</span>
              <img src={nssLogo} alt="Nexus SafeSphere Logo" className="h-8 w-auto" loading="lazy" />
              <div>
                <span className="font-heading font-bold text-foreground text-sm">RegTrack</span>
                <p className="text-[11px] text-muted-foreground">by Nexus SafeSphere</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">
              Bridging Nigerian innovation and regulation. AI-powered NDPR compliance for the builders shaping Africa's future.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-8">
            <div>
              <h4 className="font-heading font-semibold text-foreground text-xs uppercase tracking-wider mb-3">Quick Links</h4>
              <div className="flex flex-col gap-2 text-sm text-muted-foreground">
                <button onClick={() => document.getElementById("problem")?.scrollIntoView({ behavior: "smooth" })} className="text-left hover:text-foreground transition-colors">About</button>
                <a href="https://ndpr.nitda.gov.ng" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">NDPR Resources</a>
                <button onClick={() => document.getElementById("waitlist")?.scrollIntoView({ behavior: "smooth" })} className="text-left hover:text-primary transition-colors font-medium">Join Waitlist</button>
              </div>
            </div>
            <div>
              <h4 className="font-heading font-semibold text-foreground text-xs uppercase tracking-wider mb-3">Connect</h4>
              <div className="flex flex-col gap-2 text-sm text-muted-foreground">
                <a href="mailto:yusufzeenah12@gmail.com" className="hover:text-foreground transition-colors flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5" /> Contact
                </a>
                <a href="#" className="hover:text-foreground transition-colors flex items-center gap-1.5">
                  <Twitter className="w-3.5 h-3.5" /> Twitter
                </a>
                <a href="#" className="hover:text-foreground transition-colors flex items-center gap-1.5">
                  <Linkedin className="w-3.5 h-3.5" /> LinkedIn
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Why We Built This */}
        <div className="rounded-xl border border-border bg-card p-5 mb-8">
          <h4 className="font-heading font-semibold text-foreground text-sm mb-2">🇳🇬 Why We Built This for Nigeria</h4>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Built in Lagos by Nigerian founders, for Nigerian regulations. We believe every Naija startup deserves to launch with confidence — knowing their data practices protect both their users and their business. RegTrack exists because compliance shouldn't be a barrier to innovation in Africa's largest tech ecosystem.
          </p>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-border pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[11px] text-muted-foreground flex items-center gap-1">
            Built for Naija 🇳🇬 with <Heart className="w-3 h-3 text-destructive inline" /> • Made in Lagos • Powered by AI
          </p>
          <p className="text-[11px] text-muted-foreground">
            © 2026 RegTrack by NSS. AI Skills Week Abuja Hackathon.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
