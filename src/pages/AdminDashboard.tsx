import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/SupabaseClient";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useLanguage } from "@/contexts/LanguageContext";
import { useRegulatorData } from "@/hooks/useRegulatorData";
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
  const { assessments } = useRegulatorData();
  
  const [stats, setStats] = useState<DashboardStats>({
    totalOrganizations: 0, totalDPCOs: 0, totalScans: 0,
    avgRiskScore: 0, highRiskCount: 0, compliantCount: 0,
    pendingVerifications: 0, completedVerifications: 0,
  });
  const [organizations, setOrganizations] = useState<OrgSummary[]>([]);
  const [dpcos, setDPCOs] = useState<DPCOSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"overview" | "organizations" | "dpcos">("overview");

  useEffect(() => {
    fetchAllData();
  }, []);

  useEffect(() => {
    fetchAllData();
  }, [assessments]);

  useEffect(() => {
    const channel = supabase
      .channel('admin-realtime')
      .on('postgres_changes' as any, { event: '*', schema: 'public', table: 'user_profiles' }, () => fetchAllData())
      .on('postgres_changes' as any, { event: '*', schema: 'public', table: 'compliance_scans' }, () => fetchAllData())
      .on('postgres_changes' as any, { event: '*', schema: 'public', table: 'user_compliance_status' }, () => fetchAllData())
      .on('postgres_changes' as any, { event: '*', schema: 'public', table: 'dpco_organization_links' }, () => fetchAllData())
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  async function fetchAllData() {
    await Promise.all([
      fetchStats(),
      fetchOrganizations(),
      fetchDPCOs(),
    ]);
    setLoading(false);
  }

  async function fetchStats() {
    try {
      const { count: orgCount } = await supabase
        .from('user_profiles')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'organization');

      const { count: dpcoCount } = await supabase
        .from('user_profiles')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'dpco');

      const { data: supabaseScans } = await supabase
        .from('compliance_scans')
        .select('risk_score, status');

      const supabaseScores = supabaseScans?.map(s => s.risk_score || 0) || [];
      const regulatorScores = assessments.map(a => a.riskScore);
      const allScores = [...supabaseScores, ...regulatorScores];
      
      const totalScans = allScores.length;
      const avgRisk = totalScans > 0
        ? Math.round(allScores.reduce((sum, s) => sum + s, 0) / totalScans)
        : 0;
      const highRisk = allScores.filter(s => s >= 60).length;

      const { count: pendingCount } = await supabase
        .from('user_compliance_status')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending_verification');

      const { count: completedCount } = await supabase
        .from('user_compliance_status')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'compliant');

      const supabaseCompliant = supabaseScans?.filter(s => s.status === 'compliant').length || 0;
      const regulatorCompliant = assessments.filter(a => a.status === 'compliant').length;
      const compliantCount = supabaseCompliant + regulatorCompliant;

      setStats({
        totalOrganizations: orgCount || 0,
        totalDPCOs: dpcoCount || 0,
        totalScans,
        avgRiskScore: avgRisk,
        highRiskCount: highRisk,
        compliantCount,
        pendingVerifications: pendingCount || 0,
        completedVerifications: completedCount || 0,
      });
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  }

  async function fetchOrganizations() {
    try {
      // 1. Unified Relational Query: Gather profile context and map the dynamic user_sector label
      const { data: orgs } = await supabase
        .from('user_profiles')
        .select(`
          id, 
          company_name,
          user_sectors (
            sectors (
              name
            )
          )
        `)
        .eq('role', 'organization');

      if (!orgs || orgs.length === 0) {
        setOrganizations([]);
        return;
      }

      const orgSummaries: OrgSummary[] = [];

      for (const org of orgs) {
        const { data: latestScan } = await supabase
          .from('compliance_scans')
          .select('*')
          .eq('user_id', org.id)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        const orgRegulatorAssessments = assessments.filter(a => 
          a.appName === org.company_name
        );

        // Resolve sector name gracefully from the active layout mapping array
        const sectorList: any = org.user_sectors;
        const resolvedSectorName = sectorList?.[0]?.sectors?.name || 'General';

        let riskScore = 0;
        let status = 'pending';
        let lastScanDate = '';

        if (latestScan) {
          riskScore = latestScan.risk_score || 0;
          status = latestScan.status || 'pending';
          lastScanDate = latestScan.created_at || '';
        }

        if (orgRegulatorAssessments.length > 0) {
          const maxRegScore = Math.max(...orgRegulatorAssessments.map(a => a.riskScore));
          riskScore = Math.max(riskScore, maxRegScore);
          
          const latestRegAssessment = orgRegulatorAssessments.sort(
            (a, b) => new Date(b.assessmentDate).getTime() - new Date(a.assessmentDate).getTime()
          )[0];
          
          if (!lastScanDate || new Date(latestRegAssessment.assessmentDate) > new Date(lastScanDate)) {
            lastScanDate = latestRegAssessment.assessmentDate;
            status = latestRegAssessment.status;
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

        const { count: pendingCount } = await supabase
          .from('user_compliance_status')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', org.id)
          .eq('status', 'pending_verification');

        orgSummaries.push({
          id: org.id,
          name: org.company_name || 'Unnamed',
          sector: resolvedSectorName,
          riskScore,
          status,
          dpcoLinked: !!dpcoLink,
          dpcoName,
          lastScan: lastScanDate,
          pendingVerifications: pendingCount || 0,
        });
      }

      setOrganizations(orgSummaries.sort((a, b) => b.riskScore - a.riskScore));
    } catch (err) {
      console.error('Error fetching organizations:', err);
    }
  }

  async function fetchDPCOs() {
    try {
      // 2. Fetch DPCO profiles directly from public storage tables
      const { data: dpcoProfiles } = await supabase
        .from('user_profiles')
        .select('id, company_name, phone_number, registration_number')
        .eq('role', 'dpco');

      if (!dpcoProfiles || dpcoProfiles.length === 0) {
        setDPCOs([]);
        return;
      }

      // 3. Request Admin system logs directly to resolve the masked auth email maps safely
      const { data: adminUsers, error: adminErr } = await supabase.rpc('get_user_emails');
      const emailMap: Record<string, string> = {};
      
      if (!adminErr && adminUsers) {
        adminUsers.forEach((u: { id: string; email: string }) => {
          emailMap[u.id] = u.email;
        });
      }

      const dpcoSummaries: DPCOSummary[] = [];

      for (const dpco of dpcoProfiles) {
        const { count: linkedCount } = await supabase
          .from('dpco_organization_links')
          .select('*', { count: 'exact', head: true })
          .eq('dpco_id', dpco.id);

        const { data: linkedOrgIds } = await supabase
          .from('dpco_organization_links')
          .select('organization_id')
          .eq('dpco_id', dpco.id);

        let pendingCount = 0;
        let completedCount = 0;

        if (linkedOrgIds && linkedOrgIds.length > 0) {
          const orgIds = linkedOrgIds.map(l => l.organization_id);
          
          const { count: pCount } = await supabase
            .from('user_compliance_status')
            .select('*', { count: 'exact', head: true })
            .in('user_id', orgIds)
            .eq('status', 'pending_verification');

          const { count: cCount } = await supabase
            .from('user_compliance_status')
            .select('*', { count: 'exact', head: true })
            .in('user_id', orgIds)
            .eq('status', 'compliant');

          pendingCount = pCount || 0;
          completedCount = cCount || 0;
        }

        dpcoSummaries.push({
          id: dpco.id,
          name: dpco.company_name || 'Unnamed DPCO',
          email: emailMap[dpco.id] || 'no-email@system.org', // Populates resolved email cleanly
          phone: dpco.phone_number || '',
          registrationNumber: dpco.registration_number || '',
          linkedOrgs: linkedCount || 0,
          pendingVerifications: pendingCount,
          completedVerifications: completedCount,
        });
      }

      setDPCOs(dpcoSummaries);
    } catch (err) {
      console.error('Error fetching DPCOs:', err);
    }
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
                            <span>
                              {t('dashboard.admin.lastScan')}: {org.lastScan ? new Date(org.lastScan).toLocaleDateString() : t('dashboard.admin.never')}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        {org.pendingVerifications > 0 && (
                          <span className="text-xs bg-accent/10 text-accent px-2 py-1 rounded-full">
                            {org.pendingVerifications} {t('dashboard.admin.pendingVerifications')}
                          </span>
                        )}
                        <span className={`text-sm font-bold ${getRiskColor(org.riskScore)}`}>
                          {org.riskScore || '0'}
                        </span>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          org.dpcoLinked ? 'bg-secondary/10 text-secondary' : 'bg-muted text-muted-foreground'
                        }`}>
                          {org.dpcoLinked ? `${t('dashboard.org.linkedTo')} ${org.dpcoName}` : t('dashboard.org.noOfficer')}
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
                          {dpco.linkedOrgs} {t('dashboard.admin.linkedOrgs')}
                        </span>
                        {dpco.pendingVerifications > 0 && (
                          <span className="text-xs bg-accent/10 text-accent px-2 py-1 rounded-full">
                            {dpco.pendingVerifications} {t('dashboard.admin.pendingVerifications')}
                          </span>
                        )}
                        <span className="text-xs bg-secondary/10 text-secondary px-2 py-1 rounded-full">
                          {dpco.completedVerifications} {t('dashboard.admin.completed')}
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