import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { 
  Shield, 
  TrendingUp, 
  AlertTriangle, 
  Building2, 
  Activity,
  FileCheck,
  Search,
  Download,
  BarChart3,
  ArrowLeft,
  Clock,
  ChevronRight,
  Filter,
  FileJson
} from "lucide-react";

const Regulator = () => {
  const navigate = useNavigate();

  const sectorData = [
    { 
      sector: "Fintech", 
      entities: 45, 
      avgRisk: 62, 
      highRisk: 12, 
      compliant: 18, 
      trend: "up",
      framework: "NDP Act + CBN AML"
    },
    { 
      sector: "Healthtech", 
      entities: 38, 
      avgRisk: 58, 
      highRisk: 8, 
      compliant: 15, 
      trend: "stable",
      framework: "NDP Act"
    },
    { 
      sector: "Edtech", 
      entities: 22, 
      avgRisk: 41, 
      highRisk: 3, 
      compliant: 12, 
      trend: "down",
      framework: "NDP Act"
    },
    { 
      sector: "E-commerce", 
      entities: 31, 
      avgRisk: 47, 
      highRisk: 5, 
      compliant: 14, 
      trend: "stable",
      framework: "NDP Act"
    },
    { 
      sector: "Logistics", 
      entities: 15, 
      avgRisk: 38, 
      highRisk: 2, 
      compliant: 8, 
      trend: "down",
      framework: "NDP Act"
    },
    { 
      sector: "Government", 
      entities: 12, 
      avgRisk: 52, 
      highRisk: 4, 
      compliant: 5, 
      trend: "up",
      framework: "NDP Act"
    },
  ];

  const recentScans = [
    { entity: "PayStack", sector: "Fintech", risk: 34, status: "compliant", date: "2026-04-20", framework: "NDP Act 2023" },
    { entity: "Helium Health", sector: "Healthtech", risk: 58, status: "at-risk", date: "2026-04-19", framework: "NDP Act 2023" },
    { entity: "uLesson", sector: "Edtech", risk: 28, status: "compliant", date: "2026-04-19", framework: "NDP Act 2023" },
    { entity: "Konga", sector: "E-commerce", risk: 62, status: "high-risk", date: "2026-04-18", framework: "NDP Act 2023" },
    { entity: "Kobo360", sector: "Logistics", risk: 41, status: "at-risk", date: "2026-04-18", framework: "NDP Act 2023" },
    { entity: "Flutterwave", sector: "Fintech", risk: 45, status: "at-risk", date: "2026-04-17", framework: "CBN AML 2022" },
    { entity: "Reliance HMO", sector: "Healthtech", risk: 72, status: "high-risk", date: "2026-04-17", framework: "NDP Act 2023" },
  ];

  const summaryStats = {
    totalEntities: 163,
    compliantEntities: 72,
    atRiskEntities: 54,
    highRiskEntities: 37,
    avgSectorRisk: 49,
    pendingCARFilings: 28,
    frameworksMonitored: 2,
    lastUpdated: new Date().toLocaleDateString('en-NG', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "compliant":
        return { label: "Compliant", bg: "bg-secondary/10", text: "text-secondary" };
      case "at-risk":
        return { label: "At Risk", bg: "bg-accent/10", text: "text-accent" };
      case "high-risk":
        return { label: "High Risk", bg: "bg-destructive/10", text: "text-destructive" };
      default:
        return { label: "Unknown", bg: "bg-muted", text: "text-muted-foreground" };
    }
  };

  const getTrendIcon = (trend: string) => {
    if (trend === "up") return <TrendingUp className="w-3 h-3 text-destructive" />;
    if (trend === "down") return <TrendingUp className="w-3 h-3 text-secondary rotate-180" />;
    return <Activity className="w-3 h-3 text-muted-foreground" />;
  };

  const handleExportData = () => {
    alert("In production, this exports machine-readable OSCAL compliance data for NITDA/NDPC consumption. This demonstrates Problem 4: Enhanced Regulatory Visibility.");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-24 pb-12">
        <div className="container mx-auto px-4">
          
          <div className="max-w-7xl mx-auto mb-8">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Shield className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h1 className="font-heading text-3xl font-bold text-foreground">
                    NDPC Regulator Dashboard
                  </h1>
                  <p className="text-sm text-muted-foreground">
                    Real-time compliance posture across all regulated entities • Problem 4 Demonstration
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-medium">
                  SupTech Demo
                </span>
                <button
                  onClick={() => navigate("/demo")}
                  className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-all flex items-center gap-2"
                >
                  <Search className="w-4 h-4" />
                  View User Demo
                </button>
                <button
                  onClick={handleExportData}
                  className="px-4 py-2 rounded-xl border border-border hover:bg-muted/60 transition-colors text-sm flex items-center gap-2"
                >
                  <FileJson className="w-4 h-4" />
                  Export OSCAL
                </button>
              </div>
            </div>
            
            <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
              <Clock className="w-3 h-3" />
              <span>Last updated: {summaryStats.lastUpdated}</span>
              <span className="w-1 h-1 rounded-full bg-muted-foreground/40" />
              <span>{summaryStats.frameworksMonitored} frameworks monitored (NDP Act 2023 + CBN AML 2022)</span>
              <span className="w-1 h-1 rounded-full bg-muted-foreground/40" />
              <span>Data refreshed every 5 minutes</span>
            </div>
          </div>

          <div className="max-w-7xl mx-auto space-y-6">
            
            {/* Summary Stats */}
            <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
              <div className="bg-card border border-border rounded-xl p-4">
                <Building2 className="w-4 h-4 text-primary mb-2" />
                <p className="text-2xl font-bold">{summaryStats.totalEntities}</p>
                <p className="text-xs text-muted-foreground">Total Entities</p>
              </div>
              <div className="bg-secondary/10 border border-secondary/30 rounded-xl p-4">
                <FileCheck className="w-4 h-4 text-secondary mb-2" />
                <p className="text-2xl font-bold text-secondary">{summaryStats.compliantEntities}</p>
                <p className="text-xs text-muted-foreground">Compliant</p>
              </div>
              <div className="bg-accent/10 border border-accent/30 rounded-xl p-4">
                <Activity className="w-4 h-4 text-accent mb-2" />
                <p className="text-2xl font-bold text-accent">{summaryStats.atRiskEntities}</p>
                <p className="text-xs text-muted-foreground">At Risk</p>
              </div>
              <div className="bg-destructive/10 border border-destructive/30 rounded-xl p-4">
                <AlertTriangle className="w-4 h-4 text-destructive mb-2" />
                <p className="text-2xl font-bold text-destructive">{summaryStats.highRiskEntities}</p>
                <p className="text-xs text-muted-foreground">High Risk</p>
              </div>
              <div className="bg-card border border-border rounded-xl p-4">
                <TrendingUp className="w-4 h-4 text-primary mb-2" />
                <p className="text-2xl font-bold">{summaryStats.avgSectorRisk}%</p>
                <p className="text-xs text-muted-foreground">Avg Sector Risk</p>
              </div>
              <div className="bg-card border border-amber-500/30 rounded-xl p-4">
                <FileCheck className="w-4 h-4 text-amber-500 mb-2" />
                <p className="text-2xl font-bold text-amber-500">{summaryStats.pendingCARFilings}</p>
                <p className="text-xs text-muted-foreground">Pending CAR (Mar 31)</p>
              </div>
            </div>

            {/* Sector Heatmap */}
            <div className="bg-card border border-border rounded-xl p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-heading font-semibold text-foreground flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-primary" />
                  Sector Risk Heatmap
                </h3>
                <button className="text-xs text-primary flex items-center gap-1 hover:underline">
                  <Filter className="w-3 h-3" />
                  Filter Sectors
                </button>
              </div>
              
              <div className="space-y-3">
                {sectorData.map((sector) => (
                  <div key={sector.sector} className="group">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-foreground">{sector.sector}</span>
                        <span className="text-xs text-muted-foreground">({sector.entities} entities)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {getTrendIcon(sector.trend)}
                        <span className={`text-sm font-semibold ${
                          sector.avgRisk >= 60 ? "text-destructive" :
                          sector.avgRisk >= 40 ? "text-accent" : "text-secondary"
                        }`}>
                          {sector.avgRisk}%
                        </span>
                      </div>
                    </div>
                    <div className="relative h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className={`absolute top-0 left-0 h-full rounded-full transition-all ${
                          sector.avgRisk >= 60 ? "bg-destructive" :
                          sector.avgRisk >= 40 ? "bg-accent" : "bg-secondary"
                        }`}
                        style={{ width: `${sector.avgRisk}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-between mt-1">
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] text-secondary flex items-center gap-1">
                          <div className="w-2 h-2 rounded-full bg-secondary" />
                          {sector.compliant} compliant
                        </span>
                        <span className="text-[10px] text-destructive flex items-center gap-1">
                          <div className="w-2 h-2 rounded-full bg-destructive" />
                          {sector.highRisk} high risk
                        </span>
                      </div>
                      <button className="text-[10px] text-primary opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                        View Details
                        <ChevronRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Scans Table */}
            <div className="bg-card border border-border rounded-xl overflow-hidden">
              <div className="p-5 border-b border-border">
                <h3 className="font-heading font-semibold text-foreground flex items-center gap-2">
                  <Activity className="w-4 h-4 text-primary" />
                  Recent Compliance Scans
                </h3>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted/50">
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Entity</th>
                      <th className="text-left py-3 px-5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Sector</th>
                      <th className="text-left py-3 px-5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Framework</th>
                      <th className="text-left py-3 px-5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Risk Score</th>
                      <th className="text-left py-3 px-5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
                      <th className="text-left py-3 px-5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentScans.map((scan, index) => {
                      const statusBadge = getStatusBadge(scan.status);
                      return (
                        <tr key={index} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                          <td className="py-3 px-5 text-sm font-medium text-foreground">{scan.entity}</td>
                          <td className="py-3 px-5 text-sm text-muted-foreground">{scan.sector}</td>
                          <td className="py-3 px-5 text-xs text-muted-foreground">{scan.framework}</td>
                          <td className="py-3 px-5">
                            <span className={`text-sm font-semibold ${
                              scan.risk <= 30 ? "text-secondary" :
                              scan.risk <= 60 ? "text-accent" : "text-destructive"
                            }`}>
                              {scan.risk}
                            </span>
                          </td>
                          <td className="py-3 px-5">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium ${statusBadge.bg} ${statusBadge.text}`}>
                              {statusBadge.label}
                            </span>
                          </td>
                          <td className="py-3 px-5 text-xs text-muted-foreground">{scan.date}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              
              <div className="p-4 border-t border-border bg-muted/20">
                <button className="w-full text-xs text-primary hover:underline flex items-center justify-center gap-1">
                  View All 163 Entities
                  <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Demo Notice - Enhanced for Hackathon */}
            <div className="bg-primary/5 border border-primary/20 rounded-xl p-5 text-center">
              <p className="text-sm font-semibold text-primary mb-2">
                Problem 4: Enhanced Regulatory Visibility (SupTech)
              </p>
              <p className="text-sm text-muted-foreground">
                This dashboard demonstrates how NITDA/NDPC could monitor compliance posture across all regulated entities in real-time using RegTrack's API.
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                Organizations submit structured compliance evidence via API → NDPC sees real-time posture per organization → AI anomaly detection flags unusual patterns → Sector heatmaps show highest-risk industries → Early warnings enable proactive intervention.
              </p>
              <p className="text-xs text-primary mt-3">
                This directly addresses the hackathon brief: "A SupTech layer where the regulator has AI-powered oversight of the entire sector."
              </p>
            </div>
            
            {/* Navigation */}
            <div className="flex justify-center pt-4">
              <button
                onClick={() => navigate("/")}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-border bg-card hover:bg-muted/60 transition-all"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Home
              </button>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Regulator;