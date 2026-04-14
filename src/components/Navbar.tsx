import nssLogo from "@/assets/nss-logo.jpg";
import { Shield } from "lucide-react";

const Navbar = () => {
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        <div className="flex items-center gap-2">
          <img src={nssLogo} alt="NSS Logo" className="w-8 h-8" width={32} height={32} />
          <span className="font-heading font-bold text-foreground text-lg">RegTrack</span>
        </div>
        <div className="hidden md:flex items-center gap-6">
          <button onClick={() => scrollTo("problem")} className="text-sm text-muted-foreground hover:text-foreground transition-colors">Problem</button>
          <button onClick={() => scrollTo("solution")} className="text-sm text-muted-foreground hover:text-foreground transition-colors">Solution</button>
          <button onClick={() => scrollTo("demo")} className="text-sm text-muted-foreground hover:text-foreground transition-colors">Demo</button>
          <button onClick={() => scrollTo("waitlist")} className="text-sm bg-gradient-primary text-primary-foreground px-4 py-2 rounded-lg font-medium hover:opacity-90 transition-opacity flex items-center gap-1.5">
            <Shield className="w-4 h-4" />
            Join Waitlist
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
