import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/SupabaseClient";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useLanguage } from "@/contexts/LanguageContext";
import { 
  Shield, Building2, TrendingUp, AlertTriangle, CheckCircle2, 
  Clock, Users, RefreshCw, BarChart3,
  Mail, Phone
} from "lucide-react";

interface OrgSummary {
  id: string;
  name: string;
  sector: string;
  riskScore: number;
  status: string;
  dpcoLinked: boolean;
  dpcoName?: string;
  lastScan: string;
  pendingVerifications: number;
  totalScans: number;
}

interface DPCOSummary {
  id: string;
  name: string;
  email: string;
  phone?: string;
  registrationNumber?: string;
  linkedOrgs: number;
  pendingVerifications: number;
  completedVerifications: number;
}

interface DashboardStats {
  totalOrganizations: number;
  totalDPCOs: number;
  totalScans: number;
  avgRiskScore: number;
  highRiskCount: number;
  compliantCount: number;
  pendingVerifications: number;
  completedVerifications: number;
}

export default function AdminDashboard() {
  const { profile } = useAuth();
  const { t } = useLanguage();
  
  const [stats, setStats] = useState<DashboardStats>({
    totalOrganizations: 0, totalDPCOs: 0, totalScans: 0,
    avgRiskScore: 0, highRiskCount: 0, compliantCount: 0,
    pendingVerifications: 0, completedVerifications: 0,
  });
  const [organizations, setOrganizations] = useState<OrgSummary[]>([]);
  const [dpcos, setDPCOs] = useState<DPCOSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"overview" | "organizations" | "dpcos">("overview");

  const fetchAllData = useCallback(async () => {
    setLoading(true);
    await Promise.all([
      fetchStats(),
      fetchOrganizations(),
      fetchDPCOs(),
    ]);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  useEffect(() => {
    const channel = supabase
      .channel('admin-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'user_profiles' }, () => fetchAllData())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'compliance_scans' }, () => fetchAllData())
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchAllData]);

  async function fetchStats() {
    const { data: orgs } = await supabase
      .from('user_profiles')
      .select('id')
      .eq('role', 'organization');

    const { data: dpcos } = await supabase
      .from('user_profiles')
      .select('id')
      .eq('role', 'dpco');

    const { data: scans } = await supabase
      .from('compliance_scans')
      .select('risk_score, status');

    const allScores = scans?.map(s => s.risk_score || 0) || [];
    const totalScans = allScores.length;
    const avgRisk = totalScans > 0
      ? Math.round(allScores.reduce((sum, s) => sum + s, 0) / totalScans)
      : 0;
    const highRisk = allScores.filter(s => s >= 60).length;
    const compliant = scans?.filter(s => s.status === 'compliant').length || 0;

    setStats({
      totalOrganizations: orgs?.length || 0,
      totalDPCOs: dpcos?.length || 0,
      totalScans,
      avgRiskScore: avgRisk,
      highRiskCount: highRisk,
      compliantCount: compliant,
      pendingVerifications: 0,
      completedVerifications: 0,
    });
  }

  async function fetchOrganizations() {
    const { data: orgs } = await supabase
      .from('user_profiles')
      .select('id, company_name')
      .eq('role', 'organization');

    if (!orgs || orgs.length === 0) {
      setOrganizations([]);
      return;
    }

    const orgSummaries: OrgSummary[] = [];

    for (const org of orgs) {
      const { data: scans } = await supabase
        .from('compliance_scans')
        .select('id, risk_score, status, created_at')
        .eq('user_id', org.id)
        .order('created_at', { ascending: false });

      const latestScan = scans?.[0];

      let sector = 'General';
      const { data: userSector } = await supabase
        .from('user_sectors')
        .select('sectors(name)')
        .eq('user_id', org.id)
        .maybeSingle();

      if (userSector) {
        const sectorData = userSector as any;
        if (sectorData?.sectors?.name) {
          sector = sectorData.sectors.name;
        }
      }

      const { data: dpcoLink } = await supabase
        .from('dpco_organization_links')
        .select('dpco_id')
        .eq('organization_id', org.id)
        .maybeSingle();

      let dpcoName = '';
      if (dpcoLink) {
        const { data: dpco } = await supabase
          .from('user_profiles')
          .select('company_name')
          .eq('id', dpcoLink.dpco_id)
          .maybeSingle();
        dpcoName = dpco?.company_name || '';
      }

      orgSummaries.push({
        id: org.id,
        name: org.company_name || 'Unnamed',
        sector,
        riskScore: latestScan?.risk_score || 0,
        status: latestScan?.status || 'pending',
        dpcoLinked: !!dpcoLink,
        dpcoName,
        lastScan: latestScan?.created_at || '',
        pendingVerifications: 0,
        totalScans: scans?.length || 0,
      });
    }

    setOrganizations(orgSummaries.sort((a, b) => b.riskScore - a.riskScore));
  }

  async function fetchDPCOs() {
    const { data: dpcoProfiles } = await supabase
      .from('user_profiles')
      .select('id, company_name, phone_number, registration_number')
      .eq('role', 'dpco');

    if (!dpcoProfiles || dpcoProfiles.length === 0) {
      setDPCOs([]);
      return;
    }

    let emailMap: Record<string, string> = {};
    try {
      const { data: adminUsers } = await supabase.rpc('get_user_emails');
      if (adminUsers) {
        adminUsers.forEach((u: { id: string; email: string }) => {
          emailMap[u.id] = u.email;
        });
      }
    } catch {
      // RPC may not exist, continue without emails
    }

    const dpcoSummaries: DPCOSummary[] = [];

    for (const dpco of dpcoProfiles) {
      const { data: links } = await supabase
        .from('dpco_organization_links')
        .select('organization_id')
        .eq('dpco_id', dpco.id);

      const linkedOrgs = links?.length || 0;

      dpcoSummaries.push({
        id: dpco.id,
        name: dpco.company_name || 'Unnamed DPCO',
        email: emailMap[dpco.id] || 'N/A',
        phone: dpco.phone_number || '',
        registrationNumber: dpco.registration_number || '',
        linkedOrgs,
        pendingVerifications: 0,
        completedVerifications: 0,
      });
    }

    setDPCOs(dpcoSummaries);
  }

  function getRiskColor(score: number) {
    if (score === 0) return "text-muted-foreground";
    if (score <= 30) return "text-secondary";
    if (score <= 60) return "text-accent";
    return "text-destructive";
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 pt-24 pb-12">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-destructive/10 flex items-center justify-center">
                <Shield className="w-7 h-7 text-destructive" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">{t('dashboard.admin.title')}</h1>
                <p className="text-sm text-muted-foreground">{t('dashboard.admin.subtitle')}</p>
              </div>
            </div>
            <button onClick={fetchAllData} className="px-4 py-2 rounded-xl border border-border hover:bg-muted/50 transition-colors text-sm flex items-center gap-2">
              <RefreshCw className="w-4 h-4" />{t('dashboard.org.refreshData')}
            </button>
          </div>

          <div className="flex rounded-xl bg-muted p-1 mb-8 w-fit">
            {(["overview", "organizations", "dpcos"] as const).map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all capitalize ${
                  activeTab === tab ? "bg-primary text-primary-foreground shadow-card" : "text-muted-foreground hover:text-foreground"
                }`}>
                {tab === "overview" ? t('dashboard.admin.overview') : 
                 tab === "organizations" ? t('dashboard.admin.organizations') : 
                 t('dashboard.admin.dpcos')}
              </button>
            ))}
          </div>

          {activeTab === "overview" && (
            <>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-card border border-border rounded-xl p-4">
                  <Building2 className="w-5 h-5 text-primary mb-2" />
                  <p className="text-2xl font-bold">{stats.totalOrganizations}</p>
                  <p className="text-xs text-muted-foreground">{t('dashboard.admin.organizations')}</p>
                </div>
                <div className="bg-card border border-border rounded-xl p-4">
                  <Users className="w-5 h-5 text-primary mb-2" />
                  <p className="text-2xl font-bold">{stats.totalDPCOs}</p>
                  <p className="text-xs text-muted-foreground">{t('dashboard.admin.dpcos')}</p>
                </div>
                <div className="bg-card border border-border rounded-xl p-4">
                  <BarChart3 className="w-5 h-5 text-primary mb-2" />
                  <p className="text-2xl font-bold">{stats.totalScans}</p>
                  <p className="text-xs text-muted-foreground">{t('dashboard.admin.totalScans')}</p>
                </div>
                <div className={`rounded-xl p-4 ${stats.avgRiskScore >= 60 ? 'bg-destructive/10' : stats.avgRiskScore >= 30 ? 'bg-accent/10' : 'bg-secondary/10'}`}>
                  <TrendingUp className={`w-5 h-5 ${getRiskColor(stats.avgRiskScore)} mb-2`} />
                  <p className={`text-2xl font-bold ${getRiskColor(stats.avgRiskScore)}`}>{stats.avgRiskScore}</p>
                  <p className="text-xs text-muted-foreground">{t('dashboard.admin.avgRiskScore')}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-card border border-border rounded-xl p-4">
                  <AlertTriangle className="w-5 h-5 text-destructive mb-2" />
                  <p className="text-2xl font-bold text-destructive">{stats.highRiskCount}</p>
                  <p className="text-xs text-muted-foreground">{t('dashboard.admin.highRisk')}</p>
                </div>
                <div className="bg-card border border-border rounded-xl p-4">
                  <CheckCircle2 className="w-5 h-5 text-secondary mb-2" />
                  <p className="text-2xl font-bold text-secondary">{stats.compliantCount}</p>
                  <p className="text-xs text-muted-foreground">{t('dashboard.admin.compliant')}</p>
                </div>
                <div className="bg-card border border-border rounded-xl p-4">
                  <Clock className="w-5 h-5 text-accent mb-2" />
                  <p className="text-2xl font-bold text-accent">{stats.pendingVerifications}</p>
                  <p className="text-xs text-muted-foreground">{t('dashboard.admin.pending')}</p>
                </div>
                <div className="bg-card border border-border rounded-xl p-4">
                  <CheckCircle2 className="w-5 h-5 text-primary mb-2" />
                  <p className="text-2xl font-bold text-primary">{stats.completedVerifications}</p>
                  <p className="text-xs text-muted-foreground">{t('dashboard.admin.completed')}</p>
                </div>
              </div>
            </>
          )}

          {activeTab === "organizations" && (
            <div className="bg-card border border-border rounded-xl overflow-hidden">
              <div className="p-5 border-b border-border">
                <h3 className="font-heading font-semibold text-foreground">
                  {t('dashboard.admin.organizations')} ({organizations.length})
                </h3>
              </div>
              {organizations.length === 0 ? (
                <div className="p-12 text-center text-muted-foreground">
                  {t('dashboard.admin.noOrganizations')}
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {organizations.map(org => (
                    <div key={org.id} className="p-4 flex items-center justify-between hover:bg-muted/20 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <Building2 className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-semibold text-foreground">{org.name}</p>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span className="capitalize">{org.sector}</span>
                            <span>•</span>
                            <span>{org.totalScans} scans</span>
                            <span>•</span>
                            <span>
                              {org.lastScan ? new Date(org.lastScan).toLocaleDateString() : 'No scans'}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className={`text-sm font-bold ${getRiskColor(org.riskScore)}`}>
                          {org.riskScore || '0'}
                        </span>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          org.dpcoLinked ? 'bg-secondary/10 text-secondary' : 'bg-muted text-muted-foreground'
                        }`}>
                          {org.dpcoLinked ? org.dpcoName : t('dashboard.org.noOfficer')}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "dpcos" && (
            <div className="bg-card border border-border rounded-xl overflow-hidden">
              <div className="p-5 border-b border-border">
                <h3 className="font-heading font-semibold text-foreground">
                  {t('dashboard.admin.dpcos')} ({dpcos.length})
                </h3>
              </div>
              {dpcos.length === 0 ? (
                <div className="p-12 text-center text-muted-foreground">
                  {t('dashboard.admin.noDPCOs')}
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {dpcos.map(dpco => (
                    <div key={dpco.id} className="p-4 flex items-center justify-between hover:bg-muted/20 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <Users className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-semibold text-foreground">{dpco.name}</p>
                          <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
                            {dpco.email && <span className="flex items-center gap-1"><Mail className="w-3 h-3" />{dpco.email}</span>}
                            {dpco.phone && <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{dpco.phone}</span>}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                          {dpco.linkedOrgs} linked
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {dpco.registrationNumber || t('dashboard.admin.noLicense')}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}