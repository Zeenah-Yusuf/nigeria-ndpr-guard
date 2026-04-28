import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { OptimizedImage } from "@/components/OptimizedImage";
import { Shield, Target, Users, MapPin, Award, ExternalLink, Home, Landmark, Building2, Globe } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import nssLogo from "@/assets/nss-logo.png";
import ndpcBuilding from "@/assets/RegTrack-workflow.png";
import founderImage from "@/assets/clause-finder.png";

export default function About() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main>
        {/* Hero Section */}
        <section className="pt-32 pb-16 bg-gradient-to-b from-muted/30 to-background">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary rounded-full px-4 py-1.5 mb-6">
                <Shield className="w-4 h-4" />
                <span className="text-xs font-semibold uppercase tracking-wider">{t('nav.about')}</span>
              </div>
              <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
                {t('footer.tagline')}
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                RegTrack was born from a simple observation: brilliant Nigerian founders were getting fined 
                for rules they never knew existed — across NDPA, CBN, SEC, and NITDA. We built this platform to change that.
              </p>
              <div className="flex flex-wrap justify-center gap-2 mt-6">
                <span className="text-xs px-3 py-1 rounded-full bg-primary/10 text-primary">{t('frameworks.ndpa')}</span>
                <span className="text-xs px-3 py-1 rounded-full bg-accent/10 text-accent">{t('frameworks.cbnAml')}</span>
                <span className="text-xs px-3 py-1 rounded-full bg-purple-500/10 text-purple-500">{t('frameworks.secCf')}</span>
                <span className="text-xs px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-500">{t('frameworks.nitdaDp')}</span>
              </div>
            </div>
          </div>
        </section>

        {/* The Problem We Saw */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div>
                  <h2 className="font-heading text-2xl md:text-3xl font-bold text-foreground mb-6">
                    {t('nav.compliance')}
                  </h2>
                  <div className="space-y-4 text-muted-foreground leading-relaxed">
                    <p>
                      In early 2026, our team sat with a fintech founder in Lagos. Her payment platform had grown to 
                      thousands of users in weeks. Then the CBN AML enforcement notice arrived — alongside an NDPC 
                      data protection query and SEC registration requirement. Three regulators, three deadlines, 
                      and potential fines exceeding fifteen million naira.
                    </p>
                    <p>
                      The violations weren't malicious. She simply didn't know that processing payments triggered 
                      obligations under multiple regulatory frameworks simultaneously. No KYC process for CBN. 
                      No privacy policy for NDPA. No crowdfunding registration for SEC.
                    </p>
                    <p>
                      Her story isn't unique. It's the norm. Most Nigerian startups face overlapping regulatory 
                      requirements they never knew existed. RegTrack exists to ensure no founder faces this alone.
                    </p>
                  </div>
                </div>
                <div className="rounded-2xl overflow-hidden shadow-elevated">
                  <OptimizedImage src={founderImage} alt="Nigerian entrepreneur" className="w-full h-full object-cover aspect-square" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Our Mission */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
                <Target className="w-8 h-8 text-primary" />
              </div>
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-6">Our Mission</h2>
              <p className="text-xl text-muted-foreground leading-relaxed">
                To ensure no Nigerian founder faces regulatory penalties for compliance gaps 
                they could have fixed in minutes — across NDPA, CBN, SEC, and NITDA — if only they knew what was required.
              </p>
            </div>
          </div>
        </section>

        {/* What RegTrack Does */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="font-heading text-3xl font-bold text-foreground text-center mb-12">{t('nav.solution')}</h2>
              <div className="grid md:grid-cols-3 gap-8">
                <FeatureCard icon={Shield} title="Multi-Framework Risk Assessment"
                  description="Answer straightforward questions. Our AI analyzes your responses against NDPA, CBN AML, SEC, and NITDA frameworks simultaneously, giving you a clear risk score per framework." />
                <FeatureCard icon={Target} title="Actionable Remediation"
                  description="Get personalized checklists with step-by-step guidance, difficulty ratings, time estimates, and links to official resources from NDPC, CBN, SEC, and NITDA." />
                <FeatureCard icon={Award} title={t('app.builtFor')}
                  description={`Every recommendation is grounded in Nigerian regulatory reality. We understand NDPC, CBN, SEC, and NITDA — and we speak your language: English, Hausa, Igbo, and Yoruba.`} />
              </div>
            </div>
          </div>
        </section>

        {/* The Team */}
        <section className="py-16 bg-card border-y border-border">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <div className="inline-flex items-center gap-2 bg-secondary/10 text-secondary rounded-full px-4 py-1.5 mb-6">
                  <Users className="w-4 h-4" />
                  <span className="text-xs font-semibold uppercase tracking-wider">{t('footer.by')}</span>
                </div>
                <h2 className="font-heading text-3xl font-bold text-foreground mb-4">Built by a Team That Cares</h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  RegTrack is the product of Nexus SafeSphere — Nigerian developers, legal researchers, and AI engineers 
                  committed to making multi-framework compliance accessible.
                </p>
              </div>
              <div className="flex justify-center mb-8">
                <img src={nssLogo} alt="Nexus SafeSphere" className="h-16 w-auto" />
              </div>
              <div className="grid md:grid-cols-3 gap-6">
                <TeamMember name="Zeenatudeen Zubair Yusuf" role="Lead Developer"
                  description="Architected the RegTrack platform, built the frontend, and integrated the Supabase backend powering multi-framework compliance." />
                <TeamMember name="Innocent Ojisua" role="Machine Learning Engineer"
                  description="Designed the AI prompting strategy delivering accurate compliance analysis using OpenAI across all regulatory frameworks." />
                <TeamMember name="Precious Kulutuye" role="Product & Compliance Research"
                  description="Led extraction and structuring of NDPA, CBN, SEC, and NITDA content, validated AI responses, and designed the remediation framework." />
              </div>
            </div>
          </div>
        </section>

        {/* Regulatory Alignment */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div className="rounded-2xl overflow-hidden shadow-elevated">
                  <OptimizedImage src={ndpcBuilding} alt="Regulatory" className="w-full h-full object-cover aspect-video" />
                </div>
                <div>
                  <h2 className="font-heading text-2xl font-bold text-foreground mb-4">
                    Aligned with Nigeria's Regulatory Ecosystem
                  </h2>
                  <div className="space-y-4 text-muted-foreground leading-relaxed">
                    <p>RegTrack covers the {t('frameworks.ndpa')}, {t('frameworks.cbnAml')}, {t('frameworks.secCf')}, and {t('frameworks.nitdaDp')} — the core frameworks affecting Nigerian startups.</p>
                    <p>Our platform incorporates official guidance from NDPC, CBN, SEC, and NITDA on registration, compliance audits, impact assessments, and breach notification.</p>
                    <p>We support Nigeria's regulatory mission of protecting citizens while fostering innovation in Africa's largest tech ecosystem.</p>
                    <div className="flex flex-wrap gap-3 mt-4">
                      <a href="https://ndpc.gov.ng" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs text-primary hover:underline"><ExternalLink className="w-3 h-3" />NDPC</a>
                      <a href="https://www.cbn.gov.ng" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs text-accent hover:underline"><ExternalLink className="w-3 h-3" />CBN</a>
                      <a href="https://sec.gov.ng" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs text-purple-500 hover:underline"><ExternalLink className="w-3 h-3" />SEC</a>
                      <a href="https://nitda.gov.ng" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs text-cyan-500 hover:underline"><ExternalLink className="w-3 h-3" />NITDA</a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Hackathon */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-2xl mx-auto">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-6">
                <MapPin className="w-6 h-6 text-primary" />
              </div>
              <h2 className="font-heading text-2xl font-bold text-foreground mb-4">{t('footer.madeIn')}</h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Created for the {t('footer.hackathon')}, organized by Data Science Nigeria and Microsoft.
                What started as a hackathon project has grown into a mission-driven platform serving Nigerian founders nationwide.
              </p>
              <p className="text-sm text-muted-foreground">Nexus SafeSphere • Abuja, FCT • Nigeria</p>
            </div>
          </div>
        </section>

        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center">
            <button onClick={() => navigate("/")} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-border bg-card hover:bg-muted/60 transition-all group">
              <Home className="w-4 h-4" /><span>{t('nav.home')}</span>
            </button>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}

function FeatureCard({ icon: Icon, title, description }: { icon: React.ElementType; title: string; description: string }) {
  return (
    <div className="bg-background border border-border rounded-2xl p-6 hover:shadow-card transition-all duration-300">
      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4"><Icon className="w-6 h-6 text-primary" /></div>
      <h3 className="font-heading font-semibold text-foreground mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
    </div>
  );
}

function TeamMember({ name, role, description }: { name: string; role: string; description: string }) {
  return (
    <div className="bg-background border border-border rounded-2xl p-6 text-center hover:shadow-card transition-all duration-300">
      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center"><Users className="w-8 h-8 text-primary" /></div>
      <h3 className="font-heading font-semibold text-foreground">{name}</h3>
      <p className="text-sm text-primary mb-2">{role}</p>
      <p className="text-xs text-muted-foreground leading-relaxed">{description}</p>
    </div>
  );
}