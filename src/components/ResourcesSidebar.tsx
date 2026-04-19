import { useLanguage } from "@/contexts/LanguageContext";
import { FileText, Users, AlertTriangle, Shield, BookOpen, ClipboardList, ExternalLink } from "lucide-react";

const ResourcesSidebar = () => {
  const { t } = useLanguage();

  const resources = [
    { 
      icon: FileText, 
      labelKey: "resources.privacyTemplate.label", 
      descKey: "resources.privacyTemplate.desc", 
      url: "https://ndpc.gov.ng/our-data-privacy-policy/" 
    },
    { 
      icon: Users, 
      labelKey: "resources.dpcoDirectory.label", 
      descKey: "resources.dpcoDirectory.desc", 
      url: "https://ndpc.gov.ng/dpco-directory" 
    },
    { 
      icon: AlertTriangle, 
      labelKey: "resources.breachTemplate.label", 
      descKey: "resources.breachTemplate.desc", 
      url: "https://ndpc.gov.ng/resources/data-breach-response-template" 
    },
    { 
      icon: Shield, 
      labelKey: "resources.dpa.label", 
      descKey: "resources.dpa.desc", 
      url: "https://ndpc.gov.ng/our-data-privacy-policy/" 
    },
    { 
      icon: BookOpen, 
      labelKey: "resources.fullText.label", 
      descKey: "resources.fullText.desc", 
      url: "https://ndpc.gov.ng" 
    },
    { 
      icon: ClipboardList, 
      labelKey: "resources.auditPortal.label", 
      descKey: "resources.auditPortal.desc", 
      url: "https://ndpc.gov.ng/audit-filing-portal" 
    },
  ];

  return (
    <div className="space-y-2">
      <h4 className="font-heading font-semibold text-foreground text-sm mb-3 flex items-center gap-2">
        <BookOpen className="w-4 h-4 text-primary" /> {t('resources.title')}
      </h4>
      {resources.map(r => (
        <a
          key={r.labelKey}
          href={r.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 p-3 rounded-xl border border-border bg-card hover:shadow-card hover:border-primary/20 transition-all duration-200 group"
        >
          <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-brand-gradient group-hover:text-primary-foreground transition-all">
            <r.icon className="w-4 h-4 text-primary group-hover:text-primary-foreground" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-foreground">{t(r.labelKey)}</p>
            <p className="text-[10px] text-muted-foreground">{t(r.descKey)}</p>
          </div>
          <ExternalLink className="w-3 h-3 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
        </a>
      ))}
    </div>
  );
};

export default ResourcesSidebar;