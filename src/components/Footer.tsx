import nssLogo from "@/assets/nss-logo.png";
import { Mail } from "lucide-react";

const Footer = () => {
  return (
    <footer className="py-10 bg-background border-t border-border">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <img src={nssLogo} alt="Nexus SafeSphere Logo" className="h-8 w-auto" loading="lazy" />
            <div>
              <span className="font-heading font-bold text-foreground text-sm">Nexus SafeSphere</span>
              <p className="text-[11px] text-muted-foreground">AI-Powered Compliance for Nigerian Startups</p>
            </div>
          </div>
          <div className="flex items-center gap-5 text-sm text-muted-foreground">
            <a href="#" className="hover:text-foreground transition-colors duration-200">About NSS</a>
            <a href="mailto:yusufzeenah12@gmail.com" className="hover:text-foreground transition-colors duration-200 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5" />
              Contact
            </a>
            <button
              onClick={() => document.getElementById("waitlist")?.scrollIntoView({ behavior: "smooth" })}
              className="hover:text-primary transition-colors duration-200 font-medium"
            >
              Join Waitlist
            </button>
          </div>
        </div>
        <p className="text-center text-[11px] text-muted-foreground mt-8">
          © {new Date().getFullYear()} NSS (Nexus SafeSphere). Built for the NDPR compliance ecosystem.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
