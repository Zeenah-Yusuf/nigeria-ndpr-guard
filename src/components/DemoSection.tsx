import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import RiskScanner from "./RiskScanner";
import ClauseFinder from "./ClauseFinder";
import { ObligationExtractor } from "./ObligationExtractor";
import { RegulationUpdateBanner } from "./RegulationUpdateBanner";
import ResourcesSidebar from "./ResourcesSidebar";
import { Shield, Search, FileText, Building2, ChevronDown, ChevronRight, ExternalLink, ClipboardCheck } from "lucide-react";

// Import framework data for policy-as-code demonstration
import ndpaFramework from "@/lib/frameworks/ndpa-obligations.json";
import cbnFramework from "@/lib/frameworks/cbn-aml.json";

const DemoSection = () => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<"scanner" | "finder" | "extractor">("scanner");
  const [activeFramework, setActiveFramework] = useState<"ndpa" | "cbn">("ndpa");
  const [showFrameworkInfo, setShowFrameworkInfo] = useState(false);
  // Add key to force re-render of RiskScanner when framework changes
  const [scannerKey, setScannerKey] = useState(0);

  const currentFramework = activeFramework === "ndpa" ? ndpaFramework : cbnFramework;
  const frameworkColor = activeFramework === "ndpa" ? "primary" : "accent";

  const handleFrameworkChange = (framework: "ndpa" | "cbn") => {
    setActiveFramework(framework);
    // Increment key to force RiskScanner to re-mount with new framework
    setScannerKey(prev => prev + 1);
  };

  return (
    <section id="demo" className="py-24 bg-card relative">
      <div className="absolute top-0 left-0 right-0 h-px bg-brand-gradient opacity-20" />
      <div className="container mx-auto px-4">
        
        {/* Section Header */}
        <div className="text-center mb-6">
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-3">
            {t('demo.title.part1')}{" "}
            <span className="text-brand-gradient">{t('demo.title.part2')}</span>
          </h2>
          <p className="text-muted-foreground">
            {t('demo.subtitle')}
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          
          {/* Regulation Update Banner */}
          <div className="mb-6">
            <RegulationUpdateBanner />
          </div>

          {/* Framework Selector - Policy-as-Code Demo */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-muted-foreground" />
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Active Framework
                </span>
              </div>
              <button
                onClick={() => setShowFrameworkInfo(!showFrameworkInfo)}
                className="text-xs text-primary flex items-center gap-1 hover:underline"
              >
                {showFrameworkInfo ? "Hide Details" : "Show Details"}
                {showFrameworkInfo ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
              </button>
            </div>
            
            {/* Framework Toggle */}
            <div className="flex rounded-xl bg-muted p-1">
              <button
                onClick={() => handleFrameworkChange("ndpa")}
                className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
                  activeFramework === "ndpa"
                    ? "bg-primary text-primary-foreground shadow-card"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Shield className="w-4 h-4" />
                NDP Act 2023
              </button>
              <button
                onClick={() => handleFrameworkChange("cbn")}
                className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
                  activeFramework === "cbn"
                    ? "bg-accent text-accent-foreground shadow-card"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Building2 className="w-4 h-4" />
                CBN AML 2024
              </button>
            </div>
            
            {/* Framework Info Panel - Expandable */}
            {showFrameworkInfo && (
              <div className={`mt-3 p-4 rounded-xl border bg-muted/30 animate-fade-in ${
                activeFramework === "ndpa" 
                  ? "border-primary/30 bg-primary/5" 
                  : "border-accent/30 bg-accent/5"
              }`}>
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className={`font-semibold ${activeFramework === "ndpa" ? "text-primary" : "text-accent"}`}>
                      {currentFramework.framework.name}
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      {currentFramework.framework.agency} • Effective: {currentFramework.framework.effective_date}
                    </p>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    activeFramework === "ndpa" 
                      ? "bg-primary/10 text-primary" 
                      : "bg-accent/10 text-accent"
                  }`}>
                    v{currentFramework.framework.version}
                  </span>
                </div>
                
                <p className="text-xs text-muted-foreground mb-3">
                  {currentFramework.framework.description}
                </p>
                
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">
                    <span className="font-medium text-foreground">{currentFramework.obligations.length}</span> obligations loaded
                  </span>
                  <a
                    href={currentFramework.framework.source_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary flex items-center gap-1 hover:underline"
                  >
                    <FileText className="w-3 h-3" />
                    Official Document
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                
                {/* Policy-as-Code Demo Badge */}
                <div className="mt-3 pt-3 border-t border-border">
                  <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                    Policy-as-Code: This framework loaded from JSON. Adding new frameworks requires zero code changes.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Main Tabs - Now with 3 options */}
          <div className="flex rounded-2xl bg-muted p-1.5 mb-6">
            <button
              onClick={() => setActiveTab("scanner")}
              className={`flex-1 py-3 rounded-xl text-sm font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
                activeTab === "scanner"
                  ? "bg-brand-gradient text-primary-foreground shadow-card"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <ClipboardCheck className="w-4 h-4" />
              {t('demo.tabs.scanner')}
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
              {t('demo.tabs.finder')}
            </button>
            <button
              onClick={() => setActiveTab("extractor")}
              className={`flex-1 py-3 rounded-xl text-sm font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
                activeTab === "extractor"
                  ? "bg-accent text-accent-foreground shadow-card"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <FileText className="w-4 h-4" />
              Obligation Extractor
            </button>
          </div>

          {/* Tab Content */}
          <div key={`${activeTab}-${activeFramework}`} className="animate-fade-in">
            {activeTab === "scanner" && (
              <RiskScanner 
                key={scannerKey}
                activeFramework={activeFramework} 
              />
            )}
            {activeTab === "finder" && <ClauseFinder framework={activeFramework} />}
            {activeTab === "extractor" && <ObligationExtractor framework={activeFramework} />}
          </div>
          
          {/* Framework Context Indicator */}
          {activeTab === "scanner" && (
            <div className="mt-6 text-center">
              <p className="text-xs text-muted-foreground">
                <span className={`font-medium ${activeFramework === "ndpa" ? "text-primary" : "text-accent"}`}>
                  {currentFramework.framework.name}
                </span>
                {" • "}
                <span className="text-muted-foreground">
                  {currentFramework.obligations.length} regulatory obligations
                </span>
                {" • "}
                <button 
                  onClick={() => handleFrameworkChange(activeFramework === "ndpa" ? "cbn" : "ndpa")}
                  className="text-primary hover:underline font-medium"
                >
                  Switch Framework
                </button>
              </p>
            </div>
          )}
        </div>

        {/* Resources section */}
        <div id="resources" className="max-w-3xl mx-auto mt-16 pt-8 border-t border-border">
          <ResourcesSidebar />
        </div>
        
        {/* Continuous Monitoring Notice */}
        <div className="max-w-3xl mx-auto mt-6 text-center">
          <p className="text-[10px] text-muted-foreground">
            RegTrack continuously monitors NDPC, CBN, and NITDA for regulatory updates.
            Last synced: {new Date().toLocaleDateString('en-NG', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
      </div>
    </section>
  );
};

export default DemoSection;