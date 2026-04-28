import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/SupabaseClient";
import { useRealtimeSync } from "@/hooks/useRealtimeSync";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Shield, CheckCircle, Clock, AlertTriangle, Users, Building2, RefreshCw } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface LinkedOrg {
  id: string;
  company_name: string;
  sector: string;
  risk_score: number;
  status: string;
  linked_at: string;
  pending_verifications: number;
}

export default function DPCODashboard() {
  const { user, profile } = useAuth();
  const { t } = useLanguage();
  const [linkedOrgs, setLinkedOrgs] = useState<LinkedOrg[]>([]);
  const [pendingVerifications, setPendingVerifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { if (user) fetchAll(); }, [user]);

  useRealtimeSync('user_compliance_status', fetchAll);
  useRealtimeSync('dpco_organization_links', fetchAll, { dpco_id: user?.id });

  async function fetchAll() {
    await Promise.all([fetchLinkedOrganizations(), fetchPendingVerifications()]);
    setLoading(false);
  }

  async function fetchLinkedOrganizations() {
    const { data } = await supabase
      .from('dpco_organization_links')
      .select('id, created_at, organization:organization_id(id, company_name)')
      .eq('dpco_id', user?.id);

    const orgs: LinkedOrg[] = [];
    for (const link of (data || [])) {
      const orgId = (link as any).organization?.id;
      if (!orgId) continue;
      const { data: scan } = await supabase.from('compliance_scans').select('*').eq('user_id', orgId).order('created_at', { ascending: false }).limit(1).maybeSingle();
      const { count } = await supabase.from('user_compliance_status').select('*', { count: 'exact', head: true }).eq('user_id', orgId).eq('status', 'pending_verification');
      orgs.push({
        id: orgId,
        company_name: (link as any).organization?.company_name || 'Unknown',
        sector: scan?.sector_id || 'General',
        risk_score: scan?.risk_score || 0,
        status: scan?.status || 'pending',
        linked_at: link.created_at,
        pending_verifications: count || 0,
      });
    }
    setLinkedOrgs(orgs);
  }

  async function fetchPendingVerifications() {
    const { data: links } = await supabase.from('dpco_organization_links').select('organization_id').eq('dpco_id', user?.id);
    const orgIds = (links || []).map(l => l.organization_id);
    if (orgIds.length === 0) { setPendingVerifications([]); return; }
    const { data } = await supabase.from('user_compliance_status').select('*, user_profiles!inner(company_name)').in('user_id', orgIds).eq('status', 'pending_verification');
    setPendingVerifications(data || []);
  }

  async function verifyItem(itemId: string, approved: boolean) {
    await supabase.from('user_compliance_status').update({
      status: approved ? 'compliant' : 'non_compliant',
      verified_by: user?.id,
      verified_at: new Date().toISOString(),
      last_reviewed_at: new Date().toISOString(),
    }).eq('id', itemId);
    fetchAll();
  }

  if (loading) {
    return <div className="min-h-screen bg-background flex flex-col"><Navbar /><div className="flex-1 flex items-center justify-center"><div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin" /></div></div>;
  }

  const compliantCount = linkedOrgs.filter(o => o.status === 'compliant').length;
  const highRiskCount = linkedOrgs.filter(o => o.risk_score >= 60).length;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 pt-24 pb-12">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center"><Shield className="w-7 h-7 text-primary" /></div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">{t('dashboard.dpco.title')}</h1>
                <p className="text-sm text-muted-foreground">
                  {t('dashboard.dpco.subtitle', { name: profile?.company_name || t('auth.dpco') })}
                </p>
              </div>
            </div>
            <button onClick={fetchAll} className="px-4 py-2 rounded-xl border border-border hover:bg-muted/50 transition-colors text-sm flex items-center gap-2">
              <RefreshCw className="w-4 h-4" />{t('common.refresh')}
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-card border border-border rounded-xl p-4">
              <Users className="w-5 h-5 text-primary mb-2" />
              <p className="text-2xl font-bold">{linkedOrgs.length}</p>
              <p className="text-xs text-muted-foreground">{t('dashboard.dpco.linkedOrgs')}</p>
            </div>
            <div className="bg-card border border-border rounded-xl p-4">
              <Clock className="w-5 h-5 text-accent mb-2" />
              <p className="text-2xl font-bold text-accent">{pendingVerifications.length}</p>
              <p className="text-xs text-muted-foreground">{t('dashboard.dpco.pending')}</p>
            </div>
            <div className="bg-card border border-border rounded-xl p-4">
              <CheckCircle className="w-5 h-5 text-secondary mb-2" />
              <p className="text-2xl font-bold text-secondary">{compliantCount}</p>
              <p className="text-xs text-muted-foreground">{t('dashboard.dpco.compliant')}</p>
            </div>
            <div className="bg-card border border-border rounded-xl p-4">
              <AlertTriangle className="w-5 h-5 text-destructive mb-2" />
              <p className="text-2xl font-bold text-destructive">{highRiskCount}</p>
              <p className="text-xs text-muted-foreground">{t('dashboard.dpco.highRisk')}</p>
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl p-6 mb-6">
            <h3 className="font-heading font-semibold text-foreground mb-4 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-primary" />{t('dashboard.dpco.linkedOrgs')}
            </h3>
            {linkedOrgs.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">{t('dashboard.dpco.noOrgs')}</p>
                <p className="text-xs text-muted-foreground mt-2">{t('dashboard.dpco.orgsWillAppear')}</p>
              </div>
            ) : (
              <div className="space-y-3">
                {linkedOrgs.map(org => (
                  <div key={org.id} className="flex items-center justify-between p-4 rounded-lg bg-muted/30 border border-border">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center"><Building2 className="w-5 h-5 text-primary" /></div>
                      <div>
                        <p className="font-semibold text-foreground">{org.company_name}</p>
                        <p className="text-xs text-muted-foreground">{t('checklist.linkedToOfficer')}: {new Date(org.linked_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {org.pending_verifications > 0 && (
                        <span className="text-xs bg-accent/10 text-accent px-2 py-1 rounded-full">
                          {org.pending_verifications} {t('dashboard.org.pending')}
                        </span>
                      )}
                      <span className={`text-sm font-bold ${org.risk_score <= 30 ? "text-secondary" : org.risk_score <= 60 ? "text-accent" : "text-destructive"}`}>
                        {org.risk_score}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-card border border-border rounded-xl p-6">
            <h3 className="font-heading font-semibold text-foreground mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-accent" />{t('dashboard.dpco.pending')}
            </h3>
            {pendingVerifications.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">{t('dashboard.dpco.noPending')}</p>
            ) : (
              <div className="space-y-3">
                {pendingVerifications.map((item: any) => (
                  <div key={item.id} className="flex items-center justify-between p-4 rounded-lg bg-muted/30 border border-border">
                    <div>
                      <p className="font-semibold text-foreground text-sm">{item.user_profiles?.company_name}</p>
                      <p className="text-xs text-muted-foreground">{item.notes || 'Compliance item completed'}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => verifyItem(item.id, true)} className="px-3 py-1.5 rounded-lg bg-secondary text-secondary-foreground text-xs font-semibold hover:opacity-90">
                        {t('common.approve')}
                      </button>
                      <button onClick={() => verifyItem(item.id, false)} className="px-3 py-1.5 rounded-lg bg-destructive/10 text-destructive text-xs font-semibold hover:bg-destructive/20">
                        {t('common.reject')}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}