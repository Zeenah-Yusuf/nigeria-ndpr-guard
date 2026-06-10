import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import RiskScanner from "./RiskScanner";
import ClauseFinder from "./ClauseFinder";
import { ObligationExtractor } from "./ObligationExtractor";
import { RegulationUpdateBanner } from "./RegulationUpdateBanner";
import ResourcesSidebar from "./ResourcesSidebar";
import { Shield, Search, FileText, Building2, ClipboardCheck } from "lucide-react";

// CRITICAL FIX: Explicitly map fully qualified static classes to guarantee Tailwind compiler bundle visibility
const FRAMEWORKS = [
  { 
    id: "NDPA", 
    name: "NDP Act 2023", 
    regulator: "NDPC", 
    icon: Shield, 
    activeClasses: "bg-primary text-primary-foreground shadow-card" 
  },
  { 
    id: "CBN-AML", 
    name: "CBN AML/CFT", 
    regulator: "CBN", 
    icon: Building2, 
    activeClasses: "bg-accent text-accent-foreground shadow-card" 
  },
  { 
    id: "SEC-CF", 
    name: "SEC Crowdfunding", 
    regulator: "SEC", 
    icon: Building2, 
    activeClasses: "bg-purple-600 text-white shadow-card" 
  },
  { 
    id: "NITDA-DP", 
    name: "NITDA DP", 
    regulator: "NITDA", 
    icon: Building2, 
    activeClasses: "bg-cyan-600 text-white shadow-card" 
  },
];

const DemoSection = () => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<"scanner" | "finder" | "extractor">("scanner");
  const [activeFramework, setActiveFramework] = useState("NDPA");
  const [scannerKey, setScannerKey] = useState(0);

  const handleFrameworkChange = (framework: string) => {
    setActiveFramework(framework);
    setScannerKey(prev => prev + 1);
  };

  const activeFw = FRAMEWORKS.find(fw => fw.id === activeFramework) || FRAMEWORKS[0];

  return (
    <section id="demo" className="py-24 bg-card relative">
      <div className="absolute top-0 left-0 right-0 h-px bg-brand-gradient opacity-20" />
      <div className="container mx-auto px-4">
        
        <div className="text-center mb-6">
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-3">
            {t('demo.title.part1')}{" "}<span className="text-brand-gradient">{t('demo.title.part2')}</span>
          </h2>
          <p className="text-muted-foreground">{t('demo.subtitle')}</p>
        </div>

        <div className="max-w-3xl mx-auto">
          
          <div className="mb-6">
            <RegulationUpdateBanner />
          </div>

          {/* Framework Selector */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-2">
              <Building2 className="w-4 h-4 text-muted-foreground" />
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Active Framework</span>
            </div>
            
            <div className="flex flex-wrap rounded-xl bg-muted p-1 gap-1">
              {FRAMEWORKS.map(fw => {
                const Icon = fw.icon;
                const isActive = activeFramework === fw.id;
                return (
                  <button 
                    key={fw.id} 
                    onClick={() => handleFrameworkChange(fw.id)}
                    className={`flex-1 min-w-[120px] py-2.5 rounded-lg text-xs font-semibold transition-all duration-300 flex items-center justify-center gap-1.5 ${
                      isActive ? fw.activeClasses : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />{fw.name}
                  </button>
                );
              })}
            </div>
            
            <p className="text-[10px] text-muted-foreground mt-2">
              <span className="font-medium">{activeFw.regulator}</span> • {activeFw.name} framework active
            </p>
          </div>

          {/* Main Tabs */}
          <div className="flex rounded-2xl bg-muted p-1.5 mb-6">
            <button onClick={() => setActiveTab("scanner")}
              className={`flex-1 py-3 rounded-xl text-sm font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
                activeTab === "scanner" ? "bg-brand-gradient text-primary-foreground shadow-card" : "text-muted-foreground hover:text-foreground"
              }`}>
              <ClipboardCheck className="w-4 h-4" />{t('demo.tabs.scanner')}
            </button>
            <button onClick={() => setActiveTab("finder")}
              className={`flex-1 py-3 rounded-xl text-sm font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
                activeTab === "finder" ? "bg-secondary text-secondary-foreground shadow-card" : "text-muted-foreground hover:text-foreground"
              }`}>
              <Search className="w-4 h-4" />{t('demo.tabs.finder')}
            </button>
            <button onClick={() => setActiveTab("extractor")}
              className={`flex-1 py-3 rounded-xl text-sm font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
                activeTab === "extractor" ? "bg-accent text-accent-foreground shadow-card" : "text-muted-foreground hover:text-foreground"
              }`}>
              <FileText className="w-4 h-4" />Extractor
            </button>
          </div>

          {/* Tab Content (FIXED: Standardized activeFramework prop consistency across components) */}
          <div key={`${activeTab}-${activeFramework}`} className="animate-fade-in">
            {activeTab === "scanner" && <RiskScanner key={scannerKey} activeFramework={activeFramework} />}
            {activeTab === "finder" && <ClauseFinder activeFramework={activeFramework} />}
            {activeTab === "extractor" && <ObligationExtractor activeFramework={activeFramework} />}
          </div>

          {/* Switch Framework */}
          <div className="mt-6 text-center">
            <p className="text-xs text-muted-foreground">
              Using: <span className="font-medium text-primary">{activeFw.name}</span> ({activeFw.regulator})
              {" • "}
              <button onClick={() => {
                const currentIdx = FRAMEWORKS.findIndex(f => f.id === activeFramework);
                const nextIdx = (currentIdx + 1) % FRAMEWORKS.length;
                handleFrameworkChange(FRAMEWORKS[nextIdx].id);
              }} className="text-primary hover:underline font-medium">Switch Framework</button>
            </p>
          </div>
        </div>

        <div id="resources" className="max-w-3xl mx-auto mt-16 pt-8 border-t border-border">
          <ResourcesSidebar />
        </div>
        
        <div className="max-w-3xl mx-auto mt-6 text-center">
          <p className="text-[10px] text-muted-foreground">
            RegTrack continuously monitors NDPC, CBN, SEC, and NITDA for regulatory updates.
            Last synced: {new Date().toLocaleDateString('en-NG', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
      </div>
    </section>
  );
};

export default DemoSection;