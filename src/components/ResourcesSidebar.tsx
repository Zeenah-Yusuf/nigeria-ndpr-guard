import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { FileText, Users, AlertTriangle, Shield, BookOpen, ClipboardList, ExternalLink, Landmark, Globe, Building2, ChevronDown, ChevronRight } from "lucide-react";

const FRAMEWORKS = [
  {
    id: "NDPA",
    label: "NDPC Official Resources",
    icon: Shield,
    color: "primary",
    resources: [
      { icon: Shield, label: "NDPC Official Website", desc: "Nigeria Data Protection Commission", url: "https://ndpc.gov.ng" },
      { icon: FileText, label: "Privacy Policy Template", desc: "Official NDPC privacy policy template", url: "https://ndpc.gov.ng/our-data-privacy-policy/" },
      { icon: Users, label: "DPCO Directory", desc: "Licensed compliance organizations", url: "https://ndpc.gov.ng/dpco-directory" },
      { icon: AlertTriangle, label: "Breach Response Template", desc: "72-hour breach notification template", url: "https://ndpc.gov.ng/resources/data-breach-response-template" },
      { icon: ClipboardList, label: "Audit Filing Portal", desc: "Submit annual CAR filing", url: "https://ndpc.gov.ng/audit-filing-portal" },
    ],
  },
  {
    id: "CBN-AML",
    label: "CBN Official Resources",
    icon: Landmark,
    color: "accent",
    resources: [
      { icon: Landmark, label: "CBN Official Website", desc: "Central Bank of Nigeria", url: "https://www.cbn.gov.ng" },
      { icon: FileText, label: "AML/CFT Regulations 2022", desc: "Anti-Money Laundering framework", url: "https://www.cbn.gov.ng/aml-cft" },
      { icon: Shield, label: "Consumer Protection Regulations", desc: "Consumer protection framework", url: "https://www.cbn.gov.ng/consumer-protection" },
      { icon: FileText, label: "KYC Guidelines", desc: "Know Your Customer requirements", url: "https://www.cbn.gov.ng/kyc-guidelines" },
    ],
  },
  {
    id: "SEC-CF",
    label: "SEC Official Resources",
    icon: Building2,
    color: "purple",
    resources: [
      { icon: Building2, label: "SEC Official Website", desc: "Securities and Exchange Commission", url: "https://sec.gov.ng" },
      { icon: FileText, label: "Crowdfunding Rules 2021", desc: "Crowdfunding regulatory framework", url: "https://sec.gov.ng/crowdfunding" },
      { icon: Shield, label: "Investor Protection Guide", desc: "Investor education and protection", url: "https://sec.gov.ng/investor-education" },
    ],
  },
  {
    id: "NITDA-DP",
    label: "NITDA Official Resources",
    icon: Globe,
    color: "cyan",
    resources: [
      { icon: Globe, label: "NITDA Official Website", desc: "National Information Technology Development Agency", url: "https://nitda.gov.ng" },
      { icon: FileText, label: "DP Framework", desc: "Data Protection implementation framework", url: "https://nitda.gov.ng/dp-framework" },
      { icon: FileText, label: "Local Content Guidelines", desc: "Nigerian content in ICT", url: "https://nitda.gov.ng/local-content" },
    ],
  },
];

const ResourcesSidebar = () => {
  const { t } = useLanguage();
  const [openFramework, setOpenFramework] = useState<string | null>(null);

  const getColorClasses = (color: string) => {
    switch (color) {
      case "primary": return { bg: "bg-primary/10", text: "text-primary", border: "border-primary/30" };
      case "accent": return { bg: "bg-accent/10", text: "text-accent", border: "border-accent/30" };
      case "purple": return { bg: "bg-purple-500/10", text: "text-purple-500", border: "border-purple-500/30" };
      case "cyan": return { bg: "bg-cyan-500/10", text: "text-cyan-500", border: "border-cyan-500/30" };
      default: return { bg: "bg-primary/10", text: "text-primary", border: "border-primary/30" };
    }
  };

  return (
    <div className="space-y-2">
      <h4 className="font-heading font-semibold text-foreground text-sm mb-3 flex items-center gap-2">
        <BookOpen className="w-4 h-4 text-primary" /> Regulatory Resources by Framework
      </h4>
      <div className="space-y-2">
        {FRAMEWORKS.map(fw => {
          const isOpen = openFramework === fw.id;
          const colors = getColorClasses(fw.color);
          const FwIcon = fw.icon;

          return (
            <div key={fw.id} className="rounded-xl border border-border bg-card overflow-hidden">
              <button
                onClick={() => setOpenFramework(isOpen ? null : fw.id)}
                className="w-full p-3 flex items-center justify-between hover:bg-muted/30 transition-colors text-left"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-lg ${colors.bg} flex items-center justify-center`}>
                    <FwIcon className={`w-4 h-4 ${colors.text}`} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-foreground">{fw.label}</p>
                    <p className="text-[10px] text-muted-foreground">{fw.resources.length} resources</p>
                  </div>
                </div>
                {isOpen ? (
                  <ChevronDown className="w-4 h-4 text-muted-foreground" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                )}
              </button>

              {isOpen && (
                <div className="border-t border-border p-2 space-y-1 animate-fade-in">
                  {fw.resources.map((r, idx) => (
                    <a
                      key={idx}
                      href={r.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-muted/50 transition-all group"
                    >
                      <div className={`w-7 h-7 rounded-md ${colors.bg} flex items-center justify-center flex-shrink-0`}>
                        <r.icon className={`w-3.5 h-3.5 ${colors.text}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-foreground">{r.label}</p>
                        <p className="text-[10px] text-muted-foreground">{r.desc}</p>
                      </div>
                      <ExternalLink className="w-3 h-3 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
                    </a>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ResourcesSidebar;