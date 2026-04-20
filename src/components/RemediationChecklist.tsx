import { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { RemediationItem } from "@/lib/remediationData";
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
  Briefcase
} from "lucide-react";

interface Props {
  items: RemediationItem[];
  storageKey: string;
  initialRiskScore: number;
  userSector?: string;
  onRiskScoreUpdate?: (newScore: number) => void;
}

// Sector-specific compliance officer mapping
// Currently all map to Precious as placeholder for future scaling
const getComplianceOfficer = (sector: string) => {
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
      specialization: "Healthcare Data Protection & NDP Act Compliance",
      icon: Stethoscope,
    },
    fintech: {
      name: "Precious Kulutuye",
      role: "Product & Compliance Research Lead",
      email: "pkulutuye@gmail.com",
      location: "Abuja, Federal Capital Territory, Nigeria",
      specialization: "Financial Services Compliance & DCPMI Registration",
      icon: Landmark,
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
      specialization: "General NDP Act Compliance & DCPMI Advisory",
      icon: Briefcase,
    },
  };
  
  return officers[sector] || officers.other;
};

const RemediationChecklist = ({ 
  items, 
  storageKey, 
  initialRiskScore,
  userSector = "other",
  onRiskScoreUpdate 
}: Props) => {
  const { t } = useLanguage();
  
  const [checked, setChecked] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [currentRiskScore, setCurrentRiskScore] = useState(initialRiskScore);
  const [showContactDetails, setShowContactDetails] = useState(false);
  const [showOfficialResources, setShowOfficialResources] = useState(false);

  const complianceOfficer = getComplianceOfficer(userSector);
  const OfficerIcon = complianceOfficer.icon;

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(checked));
    
    const newScore = calculateRiskScore();
    setCurrentRiskScore(newScore);
    
    if (onRiskScoreUpdate) {
      onRiskScoreUpdate(newScore);
    }
  }, [checked, items]);

  const calculateRiskScore = (): number => {
    if (items.length === 0) return initialRiskScore;
    
    const priorityWeights: Record<string, number> = {
      critical: 15,
      high: 10,
      medium: 5,
    };
    
    let totalReduction = 0;
    const maxPossibleReduction = items.reduce((sum, item) => {
      return sum + (priorityWeights[item.priority] || 5);
    }, 0);
    
    items.forEach(item => {
      if (checked[item.id]) {
        totalReduction += priorityWeights[item.priority] || 5;
      }
    });
    
    const reductionPercentage = maxPossibleReduction > 0 
      ? totalReduction / maxPossibleReduction 
      : 0;
    const maxAllowedReduction = initialRiskScore * 0.7;
    const actualReduction = Math.floor(maxAllowedReduction * reductionPercentage);
    
    return Math.max(0, Math.min(100, initialRiskScore - actualReduction));
  };

  const getScoreImprovement = (): number => {
    return initialRiskScore - currentRiskScore;
  };

  const toggle = (id: string) => {
    setChecked(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const completedCount = items.filter(i => checked[i.id]).length;
  const progress = items.length > 0 ? Math.round((completedCount / items.length) * 100) : 0;
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
  };

  const officialResources = [
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
  ];

  return (
    <div className="space-y-5">
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
            className="h-full bg-primary rounded-full transition-all duration-700 ease-out"
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
      {(["critical", "high", "medium"] as const).map(priority => {
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
              const done = !!checked[item.id];
              return (
                <div
                  key={item.id}
                  className={`rounded-xl border p-4 transition-all duration-300 animate-fade-in-up ${
                    done ? "border-secondary/30 bg-secondary/5 opacity-75" : `${cfg.border} bg-card`
                  }`}
                  style={{ animationDelay: `${i * 0.05}s` }}
                >
                  <div className="flex items-start gap-3">
                    <button
                      onClick={() => toggle(item.id)}
                      className="mt-0.5 flex-shrink-0 transition-transform active:scale-90"
                    >
                      {done ? (
                        <CheckCircle2 className="w-5 h-5 text-secondary" />
                      ) : (
                        <Circle className="w-5 h-5 text-muted-foreground hover:text-primary transition-colors" />
                      )}
                    </button>
                    <div className="flex-1 min-w-0">
                      <h5 className={`font-heading font-semibold text-sm ${done ? "line-through text-muted-foreground" : "text-foreground"}`}>
                        {t(`checklist.items.${item.id}.title`)}
                      </h5>
                      <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                        {t(`checklist.items.${item.id}.description`)}
                      </p>

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
              Based on your sector, we recommend connecting with:
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

      {/* Official NDPC Resources */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <button
          onClick={() => setShowOfficialResources(!showOfficialResources)}
          className="w-full p-4 flex items-center justify-between hover:bg-muted/30 transition-colors"
        >
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-primary" />
            <span className="text-sm font-semibold text-foreground">
              Official NDPC Resources
            </span>
          </div>
          <ChevronRight className={`w-4 h-4 text-muted-foreground transition-transform ${showOfficialResources ? "rotate-90" : ""}`} />
        </button>
        
        {showOfficialResources && (
          <div className="p-4 pt-0 border-t border-border space-y-3">
            <p className="text-xs text-muted-foreground">
              Access official resources from the Nigeria Data Protection Commission:
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
              Always verify compliance requirements with official NDPC guidance.
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
    </div>
  );
};

export default RemediationChecklist;