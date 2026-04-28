import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { RegulationUpdateBanner } from "@/components/RegulationUpdateBanner";
import { useRegulatorData } from "@/hooks/useRegulatorData";
import { useRealtimeSync } from "@/hooks/useRealtimeSync";
import { Shield, TrendingUp, AlertTriangle, Building2, Activity, FileCheck, Search, BarChart3, ArrowLeft, Clock, FileJson, RefreshCw } from "lucide-react";
import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

const FRAMEWORKS = ["all", "NDPA", "CBN-AML", "SEC-CF", "NITDA-DP"] as const;

const Regulator = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { assessments, sectorStats, pendingCAR, loading, totalEntities, compliantCount, atRiskCount, highRiskCount, avgRiskScore, frameworkStats, deleteAssessment, clearAll, refreshData } = useRegulatorData();
  const [selectedSector, setSelectedSector] = useState<string>("all");
  const [selectedFramework, setSelectedFramework] = useState<string>("all");

  useRealtimeSync('compliance_scans', refreshData);
  useRealtimeSync('user_compliance_status', refreshData);

  const filteredAssessments = assessments.filter(a => {
    if (selectedSector !== "all" && a.sector !== selectedSector) return false;
    if (selectedFramework !== "all" && a.framework !== selectedFramework) return false;
    return true;
  });

  const dynamicRecentScans = filteredAssessments.slice(0, 10).map(a => ({
    entity: a.appName,
    sector: a.sector.charAt(0).toUpperCase() + a.sector.slice(1),
    risk: a.riskScore,
    status: a.status,
    date: new Date(a.assessmentDate).toLocaleDateString('en-CA'),
    framework: a.framework || "NDPA",
  }));

  const summaryStats = {
    totalEntities, compliantEntities: compliantCount, atRiskEntities: atRiskCount,
    highRiskEntities: highRiskCount, avgSectorRisk: avgRiskScore, pendingCARFilings: pendingCAR,
    frameworksMonitored: FRAMEWORKS.length - 1,
    lastUpdated: new Date().toLocaleDateString('en-NG', { year: 'numeric', month: 'long', day: 'numeric' }),
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "compliant": return { label: t('regulator.compliant'), bg: "bg-secondary/10", text: "text-secondary" };
      case "at_risk": return { label: t('regulator.atRisk'), bg: "bg-accent/10", text: "text-accent" };
      case "high_risk": return { label: t('regulator.highRisk'), bg: "bg-destructive/10", text: "text-destructive" };
      default: return { label: "Unknown", bg: "bg-muted", text: "text-muted-foreground" };
    }
  };

  const getFrameworkBadge = (fw: string) => {
    const badges: Record<string, string> = {
      "NDPA": "bg-primary/10 text-primary", "CBN-AML": "bg-accent/10 text-accent",
      "SEC-CF": "bg-purple-500/10 text-purple-500", "NITDA-DP": "bg-cyan-500/10 text-cyan-500",
    };
    return badges[fw] || "bg-muted text-muted-foreground";
  };

  const handleExportOSCAL = () => {
    const oscalReport = { "oscal-version": "1.1.2", metadata: { title: "Multi-Framework Compliance Report", "last-modified": new Date().toISOString(), publisher: "RegTrack by NSS" }, summary: summaryStats, assessments: dynamicRecentScans };
    const blob = new Blob([JSON.stringify(oscalReport, null, 2)], { type: 'application/json' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob);
    a.download = `compliance-report-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
        </div>
        <Footer />
      </div>
    );
  }

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
                  <h1 className="font-heading text-3xl font-bold text-foreground">{t('regulator.title')}</h1>
                  <p className="text-sm text-muted-foreground">{t('regulator.subtitle')}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-medium">{t('regulator.suptech')}</span>
                <button onClick={refreshData} className="px-4 py-2 rounded-xl border border-border hover:bg-muted/30 transition-colors text-sm flex items-center gap-2">
                  <RefreshCw className="w-4 h-4" />{t('common.refresh')}
                </button>
                <button onClick={handleExportOSCAL} className="px-4 py-2 rounded-xl border border-primary/30 bg-primary/5 hover:bg-primary/10 transition-colors text-sm flex items-center gap-2">
                  <FileJson className="w-4 h-4 text-primary" /><span className="text-primary">{t('common.export')}</span>
                </button>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
              <Clock className="w-3 h-3" /><span>{t('regulator.lastUpdated')}: {summaryStats.lastUpdated}</span>
              <span className="w-1 h-1 rounded-full bg-muted-foreground/40" />
              <span>{summaryStats.frameworksMonitored} {t('regulator.frameworksMonitored')}</span>
              <div className="flex gap-1 ml-2">
                <span className="px-1.5 py-0.5 rounded bg-primary/10 text-primary text-[10px]">NDPA</span>
                <span className="px-1.5 py-0.5 rounded bg-accent/10 text-accent text-[10px]">CBN</span>
                <span className="px-1.5 py-0.5 rounded bg-purple-500/10 text-purple-500 text-[10px]">SEC</span>
                <span className="px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-500 text-[10px]">NITDA</span>
              </div>
            </div>
          </div>

          <div className="max-w-7xl mx-auto space-y-6">
            <RegulationUpdateBanner />

            <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
              <div className="bg-card border border-border rounded-xl p-4"><Building2 className="w-4 h-4 text-primary mb-2" /><p className="text-2xl font-bold">{summaryStats.totalEntities}</p><p className="text-xs text-muted-foreground">{t('regulator.totalEntities')}</p></div>
              <div className="bg-secondary/10 border border-secondary/30 rounded-xl p-4"><FileCheck className="w-4 h-4 text-secondary mb-2" /><p className="text-2xl font-bold text-secondary">{summaryStats.compliantEntities}</p><p className="text-xs text-muted-foreground">{t('regulator.compliant')}</p></div>
              <div className="bg-accent/10 border border-accent/30 rounded-xl p-4"><Activity className="w-4 h-4 text-accent mb-2" /><p className="text-2xl font-bold text-accent">{summaryStats.atRiskEntities}</p><p className="text-xs text-muted-foreground">{t('regulator.atRisk')}</p></div>
              <div className="bg-destructive/10 border border-destructive/30 rounded-xl p-4"><AlertTriangle className="w-4 h-4 text-destructive mb-2" /><p className="text-2xl font-bold text-destructive">{summaryStats.highRiskEntities}</p><p className="text-xs text-muted-foreground">{t('regulator.highRisk')}</p></div>
              <div className="bg-card border border-border rounded-xl p-4"><TrendingUp className="w-4 h-4 text-primary mb-2" /><p className="text-2xl font-bold">{summaryStats.avgSectorRisk}%</p><p className="text-xs text-muted-foreground">{t('regulator.avgRisk')}</p></div>
              <div className="bg-card border border-amber-500/30 rounded-xl p-4"><FileCheck className="w-4 h-4 text-amber-500 mb-2" /><p className="text-2xl font-bold text-amber-500">{summaryStats.pendingCARFilings}</p><p className="text-xs text-muted-foreground">{t('regulator.pendingCAR')}</p></div>
            </div>

            {frameworkStats.length > 0 && (
              <div className="bg-card border border-border rounded-xl p-5">
                <h3 className="font-heading font-semibold text-foreground flex items-center gap-2 mb-4"><BarChart3 className="w-4 h-4 text-primary" />Framework Breakdown</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {frameworkStats.map(fw => (
                    <div key={fw.name} className="p-3 rounded-lg bg-muted/30 border border-border text-center">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${getFrameworkBadge(fw.name)}`}>{fw.name}</span>
                      <p className="text-lg font-bold mt-2">{fw.totalAssessments}</p>
                      <p className="text-[10px] text-muted-foreground">Avg Risk: {fw.avgRiskScore}%</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-3 flex-wrap">
              <select value={selectedSector} onChange={(e) => setSelectedSector(e.target.value)}
                className="px-3 py-2 rounded-lg border border-border bg-card text-sm" aria-label="Filter by sector" title="Filter by sector" name="sector-filter">
                <option value="all">All Sectors</option>
                {sectorStats.map(s => <option key={s.name} value={s.name}>{s.name.charAt(0).toUpperCase() + s.name.slice(1)}</option>)}
              </select>
              <select value={selectedFramework} onChange={(e) => setSelectedFramework(e.target.value)}
                className="px-3 py-2 rounded-lg border border-border bg-card text-sm" aria-label="Filter by framework" title="Filter by framework" name="framework-filter">
                {FRAMEWORKS.map(fw => <option key={fw} value={fw}>{fw === "all" ? "All Frameworks" : fw}</option>)}
              </select>
              {assessments.length > 0 && (
                <button onClick={() => { if (confirm(t('regulator.clearAll') + "?")) clearAll(); }}
                  className="px-3 py-2 rounded-lg border border-destructive/30 text-destructive hover:bg-destructive/10 text-sm">{t('regulator.clearAll')}</button>
              )}
            </div>

            <div className="bg-card border border-border rounded-xl overflow-hidden">
              <div className="p-5 border-b border-border"><h3 className="font-heading font-semibold text-foreground flex items-center gap-2"><Activity className="w-4 h-4 text-primary" />{t('regulator.recentScans')}</h3></div>
              {dynamicRecentScans.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-muted/50"><tr className="border-b border-border"><th className="text-left py-3 px-5 text-xs font-semibold text-muted-foreground uppercase">Entity</th><th className="text-left py-3 px-5 text-xs font-semibold text-muted-foreground uppercase">Sector</th><th className="text-left py-3 px-5 text-xs font-semibold text-muted-foreground uppercase">Framework</th><th className="text-left py-3 px-5 text-xs font-semibold text-muted-foreground uppercase">Risk</th><th className="text-left py-3 px-5 text-xs font-semibold text-muted-foreground uppercase">Status</th><th className="text-left py-3 px-5 text-xs font-semibold text-muted-foreground uppercase">Date</th></tr></thead>
                    <tbody>
                      {dynamicRecentScans.map((scan, i) => {
                        const badge = getStatusBadge(scan.status);
                        return (
                          <tr key={i} className="border-b border-border last:border-0 hover:bg-muted/30">
                            <td className="py-3 px-5 text-sm font-medium">{scan.entity}</td>
                            <td className="py-3 px-5 text-sm text-muted-foreground">{scan.sector}</td>
                            <td className="py-3 px-5"><span className={`text-xs px-2 py-0.5 rounded-full ${getFrameworkBadge(scan.framework)}`}>{scan.framework}</span></td>
                            <td className="py-3 px-5"><span className={`text-sm font-semibold ${scan.risk <= 30 ? "text-secondary" : scan.risk <= 60 ? "text-accent" : "text-destructive"}`}>{scan.risk}</span></td>
                            <td className="py-3 px-5"><span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium ${badge.bg} ${badge.text}`}>{badge.label}</span></td>
                            <td className="py-3 px-5 text-xs text-muted-foreground">{scan.date}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="p-8 text-center"><p className="text-muted-foreground">{t('regulator.noAssessments')}</p></div>
              )}
            </div>

            <div className="bg-primary/5 border border-primary/20 rounded-xl p-5 text-center">
              <p className="text-sm font-semibold text-primary mb-2">{t('regulator.title')}</p>
              <p className="text-sm text-muted-foreground">{t('regulator.suptechMessage')}</p>
            </div>

            <div className="flex justify-center pt-4">
              <button onClick={() => navigate("/")} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-border bg-card hover:bg-muted/60 transition-all">
                <ArrowLeft className="w-4 h-4" />{t('regulator.backToHome')}
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