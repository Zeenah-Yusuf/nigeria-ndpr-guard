import nssLogo from "@/assets/nss-logo.png";

const Footer = () => {
  return (
    <footer className="py-12 bg-background border-t border-border">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <img src={nssLogo} alt="NSS Logo" className="w-8 h-8" width={32} height={32} loading="lazy" />
            <div>
              <span className="font-heading font-bold text-foreground">Nexus SafeSphere</span>
              <p className="text-xs text-muted-foreground">AI-Powered Compliance for Nigerian Startups</p>
            </div>
          </div>
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <a href="#" className="hover:text-foreground transition-colors">About NSS</a>
            <a href="#" className="hover:text-foreground transition-colors">Contact</a>
            <button
              onClick={() => document.getElementById("waitlist")?.scrollIntoView({ behavior: "smooth" })}
              className="hover:text-primary transition-colors font-medium"
            >
              Join Waitlist
            </button>
          </div>
        </div>
        <p className="text-center text-xs text-muted-foreground mt-8">
          © {new Date().getFullYear()} NSS (Nexus SafeSphere). Built for the NDPR compliance ecosystem.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
