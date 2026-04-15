import { FileText, Users, AlertTriangle, Shield, BookOpen, ClipboardList, ExternalLink } from "lucide-react";

const resources = [
  { icon: FileText, label: "Privacy Policy Template", desc: "NITDA Official", url: "https://ndpr.nitda.gov.ng/resources/privacy-template" },
  { icon: Users, label: "DPCO Directory", desc: "Find licensed compliance organizations", url: "https://ndpr.nitda.gov.ng/dpco-directory" },
  { icon: AlertTriangle, label: "Breach Notification Template", desc: "72-hour reporting", url: "https://ndpr.nitda.gov.ng/resources/breach-template" },
  { icon: Shield, label: "Data Processing Agreement", desc: "DPA template", url: "https://ndpr.nitda.gov.ng/resources/privacy-template" },
  { icon: BookOpen, label: "NDPR Full Text", desc: "Official PDF", url: "https://ndpr.nitda.gov.ng" },
  { icon: ClipboardList, label: "Audit Filing Portal", desc: "File your annual audit", url: "https://ndpr.nitda.gov.ng/audit-filing-portal" },
];

const ResourcesSidebar = () => (
  <div className="space-y-2">
    <h4 className="font-heading font-semibold text-foreground text-sm mb-3 flex items-center gap-2">
      <BookOpen className="w-4 h-4 text-primary" /> Quick Resources
    </h4>
    {resources.map(r => (
      <a
        key={r.label}
        href={r.url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-3 p-3 rounded-xl border border-border bg-card hover:shadow-card hover:border-primary/20 transition-all duration-200 group"
      >
        <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-brand-gradient group-hover:text-primary-foreground transition-all">
          <r.icon className="w-4 h-4 text-primary group-hover:text-primary-foreground" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-foreground">{r.label}</p>
          <p className="text-[10px] text-muted-foreground">{r.desc}</p>
        </div>
        <ExternalLink className="w-3 h-3 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
      </a>
    ))}
  </div>
);

export default ResourcesSidebar;
