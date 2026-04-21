import { useState, useEffect, useCallback, useMemo } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { RemediationItem } from "@/lib/remediationData";
import { EvidenceUploadModal } from "./EvidenceUploadModal";
import { 
  CheckCircle2, 
  Circle, 
  Clock, 
  ExternalLink, 
  AlertTriangle, 
  AlertCircle, 
  Info,
  User,
  Mail,
  MapPin,
  Shield,
  Building2,
  Globe,
  ChevronRight,
  Stethoscope,
  Landmark,
  GraduationCap,
  ShoppingBag,
  Users,
  Truck,
  Briefcase,
  FileText,
  DollarSign,
  FileCheck,
  Eye,
  Upload
} from "lucide-react";

interface Props {
  items: RemediationItem[];
  storageKey: string;
  initialRiskScore: number;
  userSector?: string;
  activeFramework?: "ndpa" | "cbn";
  onRiskScoreUpdate?: (newScore: number) => void;
}

interface EvidenceData {
  fileName: string;
  fileUrl: string;
  uploadDate: string;
  fileSize: number;
  fileType: string;
}

// Sector-specific compliance officer mapping with framework support
const getComplianceOfficer = (sector: string, framework: "ndpa" | "cbn" = "ndpa") => {
  const officers: Record<string, {
    name: string;
    role: string;
    email: string;
    location: string;
    specialization: string;
    icon: React.ElementType;
  }> = {
    health: {
      name: "Precious Kulutuye",
      role: "Product & Compliance Research Lead",
      email: "pkulutuye@gmail.com",
      location: "Abuja, Federal Capital Territory, Nigeria",
      specialization: framework === "ndpa" 
        ? "Healthcare Data Protection & NDP Act Compliance"
        : "Healthcare Financial Compliance & AML Regulations",
      icon: Stethoscope,
    },
    fintech: {
      name: "Precious Kulutuye",
      role: "Product & Compliance Research Lead",
      email: "pkulutuye@gmail.com",
      location: "Abuja, Federal Capital Territory, Nigeria",
      specialization: framework === "ndpa" 
        ? "Financial Services Data Protection & DCPMI Registration"
        : "CBN AML/CFT Compliance & Fintech Licensing",
      icon: Landmark,
    },
    banking: {
      name: "Precious Kulutuye",
      role: "Product & Compliance Research Lead",
      email: "pkulutuye@gmail.com",
      location: "Abuja, Federal Capital Territory, Nigeria",
      specialization: "Banking Compliance & CBN AML Regulations",
      icon: DollarSign,
    },
    edtech: {
      name: "Precious Kulutuye",
      role: "Product & Compliance Research Lead",
      email: "pkulutuye@gmail.com",
      location: "Abuja, Federal Capital Territory, Nigeria",
      specialization: "Educational Data Privacy & Children's Data Protection",
      icon: GraduationCap,
    },
    ecommerce: {
      name: "Precious Kulutuye",
      role: "Product & Compliance Research Lead",
      email: "pkulutuye@gmail.com",
      location: "Abuja, Federal Capital Territory, Nigeria",
      specialization: "Consumer Data Protection & Third-Party Processor Compliance",
      icon: ShoppingBag,
    },
    social: {
      name: "Precious Kulutuye",
      role: "Product & Compliance Research Lead",
      email: "pkulutuye@gmail.com",
      location: "Abuja, Federal Capital Territory, Nigeria",
      specialization: "User Data Privacy & Consent Management",
      icon: Users,
    },
    logistics: {
      name: "Precious Kulutuye",
      role: "Product & Compliance Research Lead",
      email: "pkulutuye@gmail.com",
      location: "Abuja, Federal Capital Territory, Nigeria",
      specialization: "Operational Data Compliance & Supply Chain Privacy",
      icon: Truck,
    },
    other: {
      name: "Precious Kulutuye",
      role: "Product & Compliance Research Lead",
      email: "pkulutuye@gmail.com",
      location: "Abuja, Federal Capital Territory, Nigeria",
      specialization: framework === "ndpa"
        ? "General NDP Act Compliance & DCPMI Advisory"
        : "General CBN AML Compliance & Advisory",
      icon: Briefcase,
    },
  };
  
  return officers[sector] || officers.other;
};

// Framework-specific official resources
const getOfficialResources = (framework: "ndpa" | "cbn" = "ndpa") => {
  if (framework === "cbn") {
    return [
      {
        title: "CBN Official Website",
        description: "Central Bank of Nigeria",
        url: "https://www.cbn.gov.ng",
        icon: Landmark,
      },
      {
        title: "CBN AML/CFT Framework",
        description: "Anti-Money Laundering regulations",
        url: "https://www.cbn.gov.ng/aml-framework",
        icon: Shield,
      },
      {
        title: "NFIU STR Filing Portal",
        description: "Suspicious Transaction Reporting",
        url: "https://nfiu.gov.ng",
        icon: AlertTriangle,
      },
      {
        title: "BVN Integration Guidelines",
        description: "Bank Verification Number requirements",
        url: "https://nibss-plc.com.ng/bvn",
        icon: FileText,
      },
      {
        title: "CBN Fintech Framework",
        description: "Regulatory framework for fintechs",
        url: "https://www.cbn.gov.ng/fintech",
        icon: Building2,
      },
    ];
  }
  
  return [
    {
      title: "NDPC Official Website",
      description: "Nigeria Data Protection Commission",
      url: "https://ndpc.gov.ng",
      icon: Globe,
    },
    {
      title: "DPCO Directory",
      description: "Find licensed Data Protection Compliance Organizations",
      url: "https://ndpc.gov.ng/dpco-directory",
      icon: Building2,
    },
    {
      title: "NDP Act 2023 Full Text",
      description: "Official regulatory document",
      url: "https://ndpc.gov.ng/ndpa-2023",
      icon: Shield,
    },
    {
      title: "Data Protection Compliance Audit Filing",
      description: "Submit your annual CAR filing",
      url: "https://ndpc.gov.ng/audit-filing",
      icon: FileText,
    },
  ];
};

const RemediationChecklist = ({ 
  items, 
  storageKey, 
  initialRiskScore,
  userSector = "other",
  activeFramework = "ndpa",
  onRiskScoreUpdate 
}: Props) => {
  const { t } = useLanguage();
  
  const [checked, setChecked] = useState<Record<string, boolean>>(() => {
    try {
      const frameworkStorageKey = `${storageKey}_${activeFramework}`;
      const saved = localStorage.getItem(frameworkStorageKey);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [evidenceMap, setEvidenceMap] = useState<Record<string, EvidenceData>>(() => {
    try {
      const evidenceStorageKey = `${storageKey}_evidence_${activeFramework}`;
      const saved = localStorage.getItem(evidenceStorageKey);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [currentRiskScore, setCurrentRiskScore] = useState(initialRiskScore);
  const [showContactDetails, setShowContactDetails] = useState(false);
  const [showOfficialResources, setShowOfficialResources] = useState(false);
  const [showEvidenceModal, setShowEvidenceModal] = useState(false);
  const [selectedItemForEvidence, setSelectedItemForEvidence] = useState<RemediationItem | null>(null);

  const complianceOfficer = getComplianceOfficer(userSector, activeFramework);
  const OfficerIcon = complianceOfficer.icon;
  const officialResources = getOfficialResources(activeFramework);
  
  const frameworkName = activeFramework === "cbn" ? "CBN AML" : "NDP Act";
  const frameworkColor = activeFramework === "cbn" ? "accent" : "primary";

  // Calculate completed count and progress
  const completedCount = useMemo(() => {
    return items.filter(item => checked[item.id] || evidenceMap[item.id]).length;
  }, [items, checked, evidenceMap]);

  const progress = useMemo(() => {
    return items.length > 0 ? Math.round((completedCount / items.length) * 100) : 0;
  }, [completedCount, items.length]);

  // Calculate risk score based on completed items (checked OR has evidence)
  const calculateRiskScore = useCallback(() => {
    if (items.length === 0) return initialRiskScore;
    
    const priorityWeights: Record<string, number> = {
      critical: 15,
      high: 10,
      medium: 5,
      low: 2,
    };
    
    let totalCompletedWeight = 0;
    let totalPossibleWeight = 0;
    
    items.forEach(item => {
      const weight = priorityWeights[item.priority] || 5;
      totalPossibleWeight += weight;
      
      // Item is considered complete if either checked OR has evidence uploaded
      const isComplete = checked[item.id] || evidenceMap[item.id];
      if (isComplete) {
        totalCompletedWeight += weight;
      }
    });
    
    // Calculate reduction percentage based on completed items
    const reductionPercentage = totalPossibleWeight > 0 
      ? totalCompletedWeight / totalPossibleWeight 
      : 0;
    
    // New risk score = initial - (initial * reduction percentage)
    const newScore = Math.max(0, Math.min(100, Math.round(initialRiskScore * (1 - reductionPercentage))));
    
    return newScore;
  }, [items, checked, evidenceMap, initialRiskScore]);

  // Save to localStorage when framework changes
  useEffect(() => {
    const frameworkStorageKey = `${storageKey}_${activeFramework}`;
    localStorage.setItem(frameworkStorageKey, JSON.stringify(checked));
  }, [checked, storageKey, activeFramework]);

  // Save evidence to localStorage
  useEffect(() => {
    const evidenceStorageKey = `${storageKey}_evidence_${activeFramework}`;
    localStorage.setItem(evidenceStorageKey, JSON.stringify(evidenceMap));
  }, [evidenceMap, storageKey, activeFramework]);

  // Reset checked state when framework changes
  useEffect(() => {
    const frameworkStorageKey = `${storageKey}_${activeFramework}`;
    const evidenceStorageKey = `${storageKey}_evidence_${activeFramework}`;
    try {
      const saved = localStorage.getItem(frameworkStorageKey);
      const savedEvidence = localStorage.getItem(evidenceStorageKey);
      if (saved) {
        setChecked(JSON.parse(saved));
      } else {
        setChecked({});
      }
      if (savedEvidence) {
        setEvidenceMap(JSON.parse(savedEvidence));
      } else {
        setEvidenceMap({});
      }
    } catch {
      setChecked({});
      setEvidenceMap({});
    }
  }, [activeFramework, storageKey]);

  // Recalculate risk score whenever checked or evidenceMap changes
  useEffect(() => {
    const newScore = calculateRiskScore();
    setCurrentRiskScore(newScore);
    
    if (onRiskScoreUpdate) {
      onRiskScoreUpdate(newScore);
    }
  }, [calculateRiskScore, onRiskScoreUpdate]);

  const getScoreImprovement = (): number => {
    return initialRiskScore - currentRiskScore;
  };

  const toggle = (id: string) => {
    setChecked(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleUploadEvidence = (item: RemediationItem) => {
    setSelectedItemForEvidence(item);
    setShowEvidenceModal(true);
  };

  const handleEvidenceConfirm = (evidence: EvidenceData) => {
    if (selectedItemForEvidence) {
      setEvidenceMap(prev => ({ ...prev, [selectedItemForEvidence.id]: evidence }));
      setSelectedItemForEvidence(null);
    }
    setShowEvidenceModal(false);
  };

  const handleRemoveEvidence = (itemId: string) => {
    const newEvidenceMap = { ...evidenceMap };
    delete newEvidenceMap[itemId];
    setEvidenceMap(newEvidenceMap);
    // Also uncheck the item if evidence is removed
    if (checked[itemId]) {
      setChecked(prev => ({ ...prev, [itemId]: false }));
    }
  };

  const handleViewEvidence = (itemId: string) => {
    const evidence = evidenceMap[itemId];
    if (evidence && evidence.fileUrl) {
      window.open(evidence.fileUrl, '_blank');
    }
  };

  const scoreImprovement = getScoreImprovement();

  const priorityConfig = {
    critical: { 
      labelKey: "checklist.priority.critical", 
      icon: AlertTriangle, 
      bg: "bg-destructive/10", 
      text: "text-destructive", 
      border: "border-destructive/20" 
    },
    high: { 
      labelKey: "checklist.priority.high", 
      icon: AlertCircle, 
      bg: "bg-accent/10", 
      text: "text-accent", 
      border: "border-accent/20" 
    },
    medium: { 
      labelKey: "checklist.priority.medium", 
      icon: Info, 
      bg: "bg-primary/10", 
      text: "text-primary", 
      border: "border-primary/20" 
    },
    low: { 
      labelKey: "checklist.priority.low", 
      icon: Info, 
      bg: "bg-secondary/10", 
      text: "text-secondary", 
      border: "border-secondary/20" 
    },
  };

  const difficultyConfig: Record<string, { labelKey: string }> = {
    Easy: { labelKey: "checklist.difficulty.easy" },
    Medium: { labelKey: "checklist.difficulty.medium" },
    Hard: { labelKey: "checklist.difficulty.hard" },
  };

  const difficultyColors: Record<string, string> = {
    Easy: "bg-secondary/15 text-secondary",
    Medium: "bg-accent/15 text-accent",
    Hard: "bg-destructive/15 text-destructive",
  };

  const grouped = {
    critical: items.filter(i => i.priority === "critical"),
    high: items.filter(i => i.priority === "high"),
    medium: items.filter(i => i.priority === "medium"),
    low: items.filter(i => i.priority === "low"),
  };

  return (
    <div className="space-y-5">
      {/* Framework Indicator */}
      <div className={`text-xs font-medium px-3 py-1.5 rounded-full inline-flex items-center gap-2 ${
        activeFramework === "cbn" 
          ? "bg-accent/10 text-accent" 
          : "bg-primary/10 text-primary"
      }`}>
        <span>{frameworkName} Remediation Checklist</span>
      </div>

      {/* Progress and Score Card */}
      <div className="rounded-xl border border-border bg-card p-5">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-semibold text-foreground">
            {t('checklist.progress.title')}
          </span>
          <span className="text-sm font-bold text-primary">{progress}%</span>
        </div>
        <div className="h-2.5 bg-muted rounded-full overflow-hidden mb-4">
          <div
            className={`h-full rounded-full transition-all duration-700 ease-out ${
              activeFramework === "cbn" ? "bg-accent" : "bg-primary"
            }`}
            style={{ width: `${progress}%` }}
          />
        </div>
        
        {/* Risk Score Tracker */}
        <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-primary" />
            <span className="text-xs font-medium text-foreground">Current Risk Score:</span>
          </div>
          <div className="flex items-center gap-2">
            <span className={`text-lg font-bold ${
              currentRiskScore <= 30 ? "text-secondary" :
              currentRiskScore <= 60 ? "text-accent" : "text-destructive"
            }`}>
              {currentRiskScore}
            </span>
            {scoreImprovement > 0 && (
              <span className="text-xs text-secondary bg-secondary/10 px-2 py-0.5 rounded-full">
                Reduced by {scoreImprovement} points
              </span>
            )}
          </div>
        </div>
        
        <p className="text-xs text-muted-foreground mt-3">
          {t('checklist.progress.count')
            .replace('{{completed}}', completedCount.toString())
            .replace('{{total}}', items.length.toString())}
        </p>
      </div>

      {/* Priority groups */}
      {(["critical", "high", "medium", "low"] as const).map(priority => {
        const group = grouped[priority];
        if (group.length === 0) return null;
        const cfg = priorityConfig[priority];
        const PriorityIcon = cfg.icon;

        return (
          <div key={priority} className="space-y-2">
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg ${cfg.bg} w-fit`}>
              <PriorityIcon className={`w-3.5 h-3.5 ${cfg.text}`} />
              <span className={`text-xs font-bold ${cfg.text} uppercase tracking-wider`}>
                {t(cfg.labelKey)}
              </span>
              <span className={`text-xs ${cfg.text} opacity-70`}>({group.length})</span>
            </div>

            {group.map((item, i) => {
              const isChecked = !!checked[item.id];
              const hasEvidence = !!evidenceMap[item.id];
              const isCompleted = isChecked || hasEvidence;
              const requiresEvidence = item.requiresEvidence;
              
              return (
                <div
                  key={item.id}
                  className={`rounded-xl border p-4 transition-all duration-300 animate-fade-in-up ${
                    isCompleted ? "border-secondary/30 bg-secondary/5 opacity-75" : `${cfg.border} bg-card`
                  }`}
                  style={{ animationDelay: `${i * 0.05}s` }}
                >
                  <div className="flex items-start gap-3">
                    {/* Checkbox - can only be checked if evidence is uploaded (if required) */}
                    <button
                      onClick={() => toggle(item.id)}
                      disabled={requiresEvidence && !hasEvidence && !isChecked}
                      className="mt-0.5 flex-shrink-0 transition-transform active:scale-90"
                    >
                      {isChecked ? (
                        <CheckCircle2 className="w-5 h-5 text-secondary" />
                      ) : (
                        <Circle className={`w-5 h-5 ${
                          requiresEvidence && !hasEvidence 
                            ? "text-muted-foreground/40 cursor-not-allowed" 
                            : "text-muted-foreground hover:text-primary"
                        } transition-colors`} />
                      )}
                    </button>
                    
                    <div className="flex-1 min-w-0">
                      <h5 className={`font-heading font-semibold text-sm ${isCompleted ? "line-through text-muted-foreground" : "text-foreground"}`}>
                        {t(`checklist.items.${item.id}.title`)}
                      </h5>
                      <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                        {t(`checklist.items.${item.id}.description`)}
                      </p>

                      {/* Evidence Required Badge */}
                      {requiresEvidence && !hasEvidence && !isChecked && (
                        <div className="mt-2 inline-flex items-center gap-1 text-[10px] text-destructive bg-destructive/10 px-2 py-0.5 rounded-full">
                          <FileCheck className="w-3 h-3" />
                          Evidence Required
                        </div>
                      )}

                      {/* Evidence Uploaded Badge with Actions */}
                      {hasEvidence && (
                        <div className="mt-2 flex items-center gap-2 flex-wrap">
                          <span className="inline-flex items-center gap-1 text-[10px] text-secondary bg-secondary/10 px-2 py-0.5 rounded-full">
                            <FileCheck className="w-3 h-3" />
                            Evidence: {evidenceMap[item.id].fileName}
                          </span>
                          <button
                            onClick={() => handleViewEvidence(item.id)}
                            className="inline-flex items-center gap-1 text-[10px] text-primary hover:underline"
                          >
                            <Eye className="w-3 h-3" />
                            View
                          </button>
                          {!isChecked && (
                            <button
                              onClick={() => handleRemoveEvidence(item.id)}
                              className="inline-flex items-center gap-1 text-[10px] text-destructive hover:underline"
                            >
                              Remove
                            </button>
                          )}
                        </div>
                      )}

                      {/* Upload Evidence Button - Show if requires evidence and no evidence yet */}
                      {requiresEvidence && !hasEvidence && (
                        <button
                          onClick={() => handleUploadEvidence(item)}
                          className="mt-2 inline-flex items-center gap-1 text-[10px] text-primary hover:underline"
                        >
                          <Upload className="w-3 h-3" />
                          Upload Supporting Document
                        </button>
                      )}

                      {/* Meta */}
                      <div className="flex flex-wrap items-center gap-2 mt-2.5">
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${difficultyColors[item.difficulty]}`}>
                          {t(difficultyConfig[item.difficulty]?.labelKey)}
                        </span>
                        <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {item.timeEstimate}
                        </span>
                      </div>

                      {/* Resources */}
                      {item.resources.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2.5">
                          {item.resources.map((r, idx) => (
                            <a
                              key={idx}
                              href={r.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[10px] text-primary hover:text-primary/80 flex items-center gap-1 underline underline-offset-2"
                            >
                              <ExternalLink className="w-2.5 h-2.5" /> {r.label}
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        );
      })}

      {/* Sector-Specific Compliance Officer */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <button
          onClick={() => setShowContactDetails(!showContactDetails)}
          className="w-full p-4 flex items-center justify-between hover:bg-muted/30 transition-colors"
        >
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-primary" />
            <span className="text-sm font-semibold text-foreground">
              Your Compliance Specialist
            </span>
          </div>
          <ChevronRight className={`w-4 h-4 text-muted-foreground transition-transform ${showContactDetails ? "rotate-90" : ""}`} />
        </button>
        
        {showContactDetails && (
          <div className="p-4 pt-0 border-t border-border">
            <p className="text-xs text-muted-foreground mb-4">
              Based on your sector and {frameworkName} framework, we recommend connecting with:
            </p>
            
            <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <OfficerIcon className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h6 className="font-heading font-semibold text-foreground">
                    {complianceOfficer.name}
                  </h6>
                  <p className="text-xs text-primary mb-1">
                    {complianceOfficer.role}
                  </p>
                  <p className="text-[10px] text-muted-foreground mb-3">
                    Specialization: {complianceOfficer.specialization}
                  </p>
                  
                  <div className="space-y-2">
                    <a
                      href={`mailto:${complianceOfficer.email}`}
                      className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      <Mail className="w-4 h-4" />
                      {complianceOfficer.email}
                    </a>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="w-4 h-4" />
                      {complianceOfficer.location}
                    </div>
                  </div>
                  
                  <p className="text-[10px] text-muted-foreground mt-3 pt-3 border-t border-border">
                    Part of Nexus SafeSphere — Building compliance tools for Nigerian founders.
                  </p>
                </div>
              </div>
            </div>
            
            <p className="text-[10px] text-muted-foreground mt-3 text-center">
              As we scale, sector-specific compliance officers will be available. 
              For now, Precious is your dedicated point of contact.
            </p>
          </div>
        )}
      </div>

      {/* Official Framework Resources */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <button
          onClick={() => setShowOfficialResources(!showOfficialResources)}
          className="w-full p-4 flex items-center justify-between hover:bg-muted/30 transition-colors"
        >
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-primary" />
            <span className="text-sm font-semibold text-foreground">
              Official {activeFramework === "cbn" ? "CBN" : "NDPC"} Resources
            </span>
          </div>
          <ChevronRight className={`w-4 h-4 text-muted-foreground transition-transform ${showOfficialResources ? "rotate-90" : ""}`} />
        </button>
        
        {showOfficialResources && (
          <div className="p-4 pt-0 border-t border-border space-y-3">
            <p className="text-xs text-muted-foreground">
              Access official resources from the {activeFramework === "cbn" ? "Central Bank of Nigeria" : "Nigeria Data Protection Commission"}:
            </p>
            
            {officialResources.map((resource, index) => (
              <a
                key={index}
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block p-3 rounded-lg bg-muted/30 border border-border hover:bg-muted/50 hover:border-primary/30 transition-all group"
              >
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <resource.icon className="w-4 h-4 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h6 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                      {resource.title}
                    </h6>
                    <p className="text-xs text-muted-foreground">{resource.description}</p>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
              </a>
            ))}
            
            <p className="text-[10px] text-muted-foreground text-center pt-2">
              Always verify compliance requirements with official {activeFramework === "cbn" ? "CBN" : "NDPC"} guidance.
            </p>
          </div>
        )}
      </div>

      {items.length === 0 && (
        <div className="text-center py-8">
          <CheckCircle2 className="w-12 h-12 text-secondary mx-auto mb-3" />
          <p className="font-heading font-semibold text-foreground">
            {t('checklist.empty.title')}
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            {t('checklist.empty.message')}
          </p>
        </div>
      )}

      {/* Evidence Upload Modal */}
      {selectedItemForEvidence && (
        <EvidenceUploadModal
          isOpen={showEvidenceModal}
          onClose={() => {
            setShowEvidenceModal(false);
            setSelectedItemForEvidence(null);
          }}
          onConfirm={handleEvidenceConfirm}
          itemTitle={selectedItemForEvidence.title}
          evidenceRequired={selectedItemForEvidence.evidenceRequired || "Please upload supporting documentation for this compliance item."}
          existingEvidence={evidenceMap[selectedItemForEvidence.id]}
          onRemove={() => handleRemoveEvidence(selectedItemForEvidence.id)}
        />
      )}
    </div>
  );
};

export default RemediationChecklist;