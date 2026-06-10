import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/SupabaseClient";
import { useRealtimeSync } from "@/hooks/useRealtimeSync";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useLanguage } from "@/contexts/LanguageContext";
import { useRegulatorData } from "@/hooks/useRegulatorData";
import { 
  Building2, TrendingUp, AlertTriangle, CheckCircle2, 
  Clock, UserPlus, Send, BarChart3, FileText, RefreshCw, 
  Users, Plus, Eye, Bell, Loader2
} from "lucide-react";

interface Business {
  id: string;
  appName: string;
  sector: string;
  framework: string;
  riskScore: number;
  riskLevel: string;
  status: string;
  lastScanDate: string;
  triggeredClauses: number;
  completedItems: number;
  totalItems: number;
  dpcoLinked: boolean;
  dpcoName: string;
  dpcoEmail: string;
  pendingApprovals: number;
}

export default function OrganizationDashboard() {
  const { user, profile } = useAuth();
  const { t } = useLanguage();
  const { assessments } = useRegulatorData();
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [sendingReminder, setSendingReminder] = useState<string | null>(null);

  // Fetch data on mount and when user identity resolves
  useEffect(() => { 
    if (user) fetchBusinesses(); 
  }, [user]);

  // Refresh when external fallback regulator data syncs
  useEffect(() => {
    if (user) fetchBusinesses();
  }, [assessments]);

  // Realtime subscription pipelines
  useRealtimeSync('compliance_scans', fetchBusinesses, { user_id: user?.id });
  useRealtimeSync('user_compliance_status', fetchBusinesses, { user_id: user?.id });
  useRealtimeSync('dpco_organization_links', fetchBusinesses, { organization_id: user?.id });

  async function fetchBusinesses() {
    if (!user?.id) return;
    
    const businessesData: Business[] = [];
    const processedAppNames = new Set<string>();

    // 1. Fetch all root compliance scans for this organization in a single operation
    const { data: scans } = await supabase
      .from('compliance_scans')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    // 2. Fetch parallel global relational datasets to eliminate structural inner loops
    const [dpcoLinkResponse, pendingStatusResponse] = await Promise.all([
      supabase
        .from('dpco_organization_links')
        .select(`
          dpco_id, 
          user_profiles!dpco_id (
            company_name,
            email
          )
        `)
        .eq('organization_id', user.id)
        .maybeSingle(),
      supabase
        .from('user_compliance_status')
        .select('id, status')
        .eq('user_id', user.id)
        .eq('status', 'pending_verification')
    ]);

    // Parse DPCO mapping criteria safely 
    const dpcoLink = dpcoLinkResponse.data;
    const dpcoProfile: any = dpcoLink?.user_profiles;
    const dpcoName = dpcoProfile?.company_name || t('auth.dpco');
    const dpcoEmail = dpcoProfile?.email || '';
    const totalPendingCount = pendingStatusResponse.data?.length || 0;

    // 3. Process database results with zero downstream network dependencies
    if (scans && scans.length > 0) {
      for (const scan of scans) {
        const results = scan.results || {};
        const appName = results.appName || 'Untitled Assessment';
        processedAppNames.add(appName.toLowerCase());

        // Read dynamic local remediation logs safely
        const storageKey = `regtrack-checklist-${appName}`;
        let completedItems = 0;
        let totalItems = 0;
        try {
          const saved = JSON.parse(localStorage.getItem(storageKey) || '{}');
          completedItems = Object.values(saved).filter(v => v === true).length;
          totalItems = Object.keys(saved).length;
        } catch (e) {
          console.error("Failed parsing localStorage layout reference tracking keys", e);
        }

        businessesData.push({
          id: scan.id,
          appName,
          sector: scan.sector_id || results.sector || 'General',
          framework: results.framework || 'NDPA',
          riskScore: scan.risk_score || 50,
          riskLevel: results.riskLevel || 'medium',
          status: scan.status || 'completed',
          lastScanDate: scan.created_at || scan.completed_at || new Date().toISOString(),
          triggeredClauses: results.triggeredClauses || 0,
          completedItems,
          totalItems: totalItems || (results.remediationTotal || 0),
          dpcoLinked: !!dpcoLink,
          dpcoName: dpcoLink ? dpcoName : '',
          dpcoEmail: dpcoLink ? dpcoEmail : '',
          pendingApprovals: totalPendingCount,
        });
      }
    }

    // 4. Incorporate unique items from external Regulator Data sync hook
    const userAssessments = assessments.filter(a => {
      const matchesOrg = profile?.company_name && 
        (a.appName === profile.company_name || 
          a.appName.toLowerCase().includes(profile.company_name.toLowerCase()));
      
      const notDuplicate = !processedAppNames.has(a.appName.toLowerCase());
      return matchesOrg && notDuplicate;
    });

    for (const assessment of userAssessments) {
      businessesData.push({
        id: assessment.id,
        appName: assessment.appName,
        sector: assessment.sector,
        framework: assessment.framework || 'NDPA',
        riskScore: assessment.riskScore,
        riskLevel: assessment.riskLevel,
        status: assessment.status,
        lastScanDate: assessment.assessmentDate,
        triggeredClauses: assessment.triggeredClausesCount || 0,
        completedItems: assessment.remediationCompleted || 0,
        totalItems: assessment.remediationTotal || 0,
        dpcoLinked: false,
        dpcoName: '',
        dpcoEmail: '',
        pendingApprovals: 0,
      });
    }

    // Sort evaluation rows chronologically (Newest first)
    businessesData.sort((a, b) => 
      new Date(b.lastScanDate).getTime() - new Date(a.lastScanDate).getTime()
    );

    setBusinesses(businessesData);
    setLoading(false);
  }

  async function handleSendReminder(business: Business) {
    setSendingReminder(business.id);
    try {
      await supabase.functions.invoke('send-reminder', {
        body: {
          to: business.dpcoEmail || 'pkulutuye@gmail.com',
          dpcoName: business.dpcoName,
          organizationName: profile?.company_name || 'Organization',
          appName: business.appName,
          pendingCount: business.pendingApprovals,
        },
      });
    } catch (err) {
      console.error('Failed to dispatch alert transaction routing:', err);
    } finally {
      setSendingReminder(null);
    }
  }

  function getRiskColor(score: number) {
    if (score <= 30) return "text-secondary";
    if (score <= 60) return "text-accent";
    return "text-destructive";
  }

  function getRiskBg(score: number) {
    if (score <= 30) return "bg-secondary/10";
    if (score <= 60) return "bg-accent/10";
    return "bg-destructive/10";
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

  const totalAssessments = businesses.length;
  const avgRiskScore = totalAssessments > 0 
    ? Math.round(businesses.reduce((sum, b) => sum + b.riskScore, 0) / totalAssessments) : 0;
  const highRiskCount = businesses.filter(b => b.riskScore >= 60).length;
  const linkedDPCOs = businesses.filter(b => b.dpcoLinked).length;
  const totalPendingApprovals = businesses.reduce((sum, b) => sum + b.pendingApprovals, 0);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <style>{`
        ${Array.from({ length: 101 }).map((_, i) => `.w-p-${i}{width:${i}%}`).join('\n')}
      `}</style>
      <main className="flex-1 pt-24 pb-12">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Header layout */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center">
                <Building2 className="w-7 h-7 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">
                  {profile?.company_name || t('auth.organization')}
                </h1>
                <p className="text-sm text-muted-foreground">{t('dashboard.org.subtitle')}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={fetchBusinesses} 
                className="px-3 py-2 rounded-xl border border-border hover:bg-muted/50 transition-colors text-sm flex items-center gap-2"
                title={t('dashboard.org.refreshData')}>
                <RefreshCw className="w-4 h-4" />
              </button>
              <Link to="/demo" 
                className="px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-all flex items-center gap-2">
                <Plus className="w-4 h-4" />{t('dashboard.org.newAssessment')}
              </Link>
            </div>
          </div>

          {/* Metric KPI Readout Row */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
            <div className="bg-card border border-border rounded-xl p-4">
              <BarChart3 className="w-5 h-5 text-primary mb-2" />
              <p className="text-2xl font-bold">{totalAssessments}</p>
              <p className="text-xs text-muted-foreground">{t('dashboard.org.totalAssessments')}</p>
            </div>
            <div className={`rounded-xl p-4 transition-all duration-300 ${getRiskBg(avgRiskScore)}`}>
              <TrendingUp className={`w-5 h-5 ${getRiskColor(avgRiskScore)} mb-2`} />
              <p className={`text-2xl font-bold ${getRiskColor(avgRiskScore)}`}>{avgRiskScore}</p>
              <p className="text-xs text-muted-foreground">{t('dashboard.org.avgRiskScore')}</p>
            </div>
            <div className="bg-card border border-border rounded-xl p-4">
              <AlertTriangle className="w-5 h-5 text-destructive mb-2" />
              <p className="text-2xl font-bold text-destructive">{highRiskCount}</p>
              <p className="text-xs text-muted-foreground">{t('dashboard.org.highRisk')}</p>
            </div>
            <div className="bg-card border border-border rounded-xl p-4">
              <Users className="w-5 h-5 text-primary mb-2" />
              <p className="text-2xl font-bold">{linkedDPCOs}</p>
              <p className="text-xs text-muted-foreground">{t('dashboard.org.linkedOfficers')}</p>
            </div>
            <div className="bg-card border border-border rounded-xl p-4">
              <Clock className="w-5 h-5 text-accent mb-2" />
              <p className="text-2xl font-bold text-accent">{totalPendingApprovals}</p>
              <p className="text-xs text-muted-foreground">{t('dashboard.org.pendingApprovals')}</p>
            </div>
          </div>

          {/* Interactive Core Assessment Grid Area */}
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="p-5 border-b border-border flex items-center justify-between">
              <h3 className="font-heading font-semibold text-foreground flex items-center gap-2">
                <Building2 className="w-5 h-5 text-primary" />{t('dashboard.org.assessedBusinesses')}
              </h3>
            </div>
            {businesses.length === 0 ? (
              <div className="p-12 text-center">
                <FileText className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
                <p className="text-muted-foreground mb-2">{t('dashboard.org.noAssessments')}</p>
                <Link to="/demo" className="text-primary hover:underline text-sm font-medium">
                  {t('dashboard.org.startFirst')}
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-border">
                {businesses.map(business => {
                  const progressPercentage = business.totalItems > 0 
                    ? Math.round((business.completedItems / business.totalItems) * 100) 
                    : 0;
                  const isReminderLoading = sendingReminder === business.id;

                  return (
                    <div key={business.id} className="p-5 hover:bg-muted/20 transition-colors">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h4 className="font-semibold text-foreground text-lg">{business.appName}</h4>
                          <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                            <span className="capitalize">{business.sector}</span>
                            <span>•</span>
                            <span>{business.framework}</span>
                            <span>•</span>
                            <span>{new Date(business.lastScanDate).toLocaleDateString('en-NG')}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`text-lg font-bold ${getRiskColor(business.riskScore)}`}>
                            {business.riskScore}
                          </span>
                          <span className="text-xs text-muted-foreground">/100</span>
                        </div>
                      </div>

                      {/* Execution Progress Metric Tracker */}
                      <div className="mb-4">
                        <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                          <span>{t('dashboard.org.remediationProgress')}</span>
                          <span>{progressPercentage}%</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div 
                            className={`h-full bg-primary rounded-full transition-all duration-500 w-p-${progressPercentage}`}
                          />
                        </div>
                      </div>

                      {/* Diagnostic Badges Row */}
                      <div className="flex flex-wrap items-center gap-3">
                        <span className={`text-xs px-2 py-1 rounded-full capitalize ${
                          business.riskLevel === 'critical' ? 'bg-destructive/10 text-destructive' : 
                          business.riskLevel === 'high' ? 'bg-accent/10 text-accent' : 
                          'bg-secondary/10 text-secondary'
                        }`}>
                          {business.riskLevel} {t('dashboard.org.riskLevel')}
                        </span>
                        
                        {business.pendingApprovals > 0 && (
                          <span className="text-xs px-2 py-1 rounded-full bg-accent/10 text-accent flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {business.pendingApprovals} {t('dashboard.org.pending')}
                          </span>
                        )}
                        
                        {business.dpcoLinked ? (
                          <div className="flex items-center gap-2">
                            <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" />
                              {t('dashboard.org.linkedTo')} {business.dpcoName}
                            </span>
                            {business.pendingApprovals > 0 && (
                              <button 
                                onClick={() => handleSendReminder(business)} 
                                disabled={isReminderLoading}
                                className="text-xs px-2 py-1 rounded-full bg-accent/10 text-accent hover:bg-accent/20 active:scale-95 transition-all flex items-center gap-1 disabled:opacity-50 disabled:pointer-events-none"
                              >
                                {isReminderLoading ? (
                                  <Loader2 className="w-3 h-3 animate-spin" />
                                ) : (
                                  <Send className="w-3 h-3" />
                                )}
                                {isReminderLoading ? t('dashboard.org.sending') : t('dashboard.org.sendReminder')}
                              </button>
                            )}
                          </div>
                        ) : (
                          <span className="text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground flex items-center gap-1">
                            <UserPlus className="w-3 h-3" />{t('dashboard.org.noOfficer')}
                          </span>
                        )}
                      </div>

                      {/* Explicit Action Triggers */}
                      <div className="flex items-center gap-3 mt-4 pt-4 border-t border-border">
                        <Link to="/demo" className="text-xs text-primary hover:underline flex items-center gap-1">
                          <Eye className="w-3 h-3" />{t('dashboard.org.viewDetails')}
                        </Link>
                        <span className="text-border">|</span>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <FileText className="w-3 h-3" />
                          {business.triggeredClauses} {t('dashboard.org.clausesTriggered')}
                        </span>
                        <span className="text-border">|</span>
                        <span className="text-xs text-muted-foreground">
                          {business.completedItems}/{business.totalItems} {t('dashboard.org.itemsCompleted')}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Navigational Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <Link to="/demo" className="bg-card border border-border rounded-xl p-5 hover:shadow-card transition-all group">
              <Plus className="w-6 h-6 text-primary mb-3 group-hover:scale-110 transition-transform" />
              <h4 className="font-semibold text-foreground mb-1">{t('dashboard.org.newAssessment')}</h4>
              <p className="text-xs text-muted-foreground">Scan a new business or application architecture</p>
            </Link>
            <button onClick={fetchBusinesses} className="bg-card border border-border rounded-xl p-5 hover:shadow-card transition-all group text-left">
              <RefreshCw className="w-6 h-6 text-primary mb-3 group-hover:rotate-180 transition-transform duration-500" />
              <h4 className="font-semibold text-foreground mb-1">{t('dashboard.org.refreshData')}</h4>
              <p className="text-xs text-muted-foreground">Update data cache sync parameters directly</p>
            </button>
            <div className="bg-card border border-border rounded-xl p-5">
              <Bell className="w-6 h-6 text-primary mb-3" />
              <h4 className="font-semibold text-foreground mb-1">{t('dashboard.org.reminders')}</h4>
              <p className="text-xs text-muted-foreground">
                {totalPendingApprovals > 0 
                  ? `${totalPendingApprovals} ${t('dashboard.org.itemsAwaiting')}` 
                  : t('dashboard.org.allUpToDate')}
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}