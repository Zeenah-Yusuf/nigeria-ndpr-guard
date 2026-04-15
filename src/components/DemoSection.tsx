import { useState } from "react";
import RiskScanner from "./RiskScanner";
import ClauseFinder from "./ClauseFinder";
import ResourcesSidebar from "./ResourcesSidebar";
import { Shield, Search, BookOpen } from "lucide-react";

const DemoSection = () => {
  const [activeTab, setActiveTab] = useState<"scanner" | "finder">("scanner");

  return (
    <section id="demo" className="py-24 bg-card relative">
      <div className="absolute top-0 left-0 right-0 h-px bg-brand-gradient opacity-20" />
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-3">
            Try it <span className="text-brand-gradient">now</span>
          </h2>
          <p className="text-muted-foreground">
            Test your app's NDPR compliance risk in under 2 minutes.
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          {/* Tabs */}
          <div className="flex rounded-2xl bg-muted p-1.5 mb-8">
            <button
              onClick={() => setActiveTab("scanner")}
              className={`flex-1 py-3 rounded-xl text-sm font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
                activeTab === "scanner"
                  ? "bg-brand-gradient text-primary-foreground shadow-card"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Shield className="w-4 h-4" />
              Risk Scanner
            </button>
            <button
              onClick={() => setActiveTab("finder")}
              className={`flex-1 py-3 rounded-xl text-sm font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
                activeTab === "finder"
                  ? "bg-secondary text-secondary-foreground shadow-card"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Search className="w-4 h-4" />
              Clause Finder
            </button>
          </div>

          <div key={activeTab} className="animate-fade-in">
            {activeTab === "scanner" ? <RiskScanner /> : <ClauseFinder />}
          </div>
        </div>

        {/* Resources section */}
        <div id="resources" className="max-w-2xl mx-auto mt-16 pt-8 border-t border-border">
          <ResourcesSidebar />
        </div>
      </div>
    </section>
  );
};

export default DemoSection;
