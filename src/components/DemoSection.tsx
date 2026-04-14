import { useState } from "react";
import RiskScanner from "./RiskScanner";
import ClauseFinder from "./ClauseFinder";

const DemoSection = () => {
  const [activeTab, setActiveTab] = useState<"scanner" | "finder">("scanner");

  return (
    <section id="demo" className="py-24 bg-card">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">
            Try it now
          </h2>
          <p className="text-muted-foreground text-lg">
            Test your app's NDPR compliance risk in under 2 minutes.
          </p>
        </div>
        <div className="max-w-2xl mx-auto">
          <div className="flex rounded-xl bg-muted p-1 mb-8">
            <button
              onClick={() => setActiveTab("scanner")}
              className={`flex-1 py-3 rounded-lg text-sm font-semibold transition-all ${
                activeTab === "scanner"
                  ? "bg-gradient-primary text-primary-foreground shadow-card"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              🛡 Risk Scanner
            </button>
            <button
              onClick={() => setActiveTab("finder")}
              className={`flex-1 py-3 rounded-lg text-sm font-semibold transition-all ${
                activeTab === "finder"
                  ? "bg-secondary text-secondary-foreground shadow-card"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              🔍 Clause Finder
            </button>
          </div>
          {activeTab === "scanner" ? <RiskScanner /> : <ClauseFinder />}
        </div>
      </div>
    </section>
  );
};

export default DemoSection;
