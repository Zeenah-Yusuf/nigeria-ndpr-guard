import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { OptimizedImage } from "@/components/OptimizedImage";
import { Shield, Target, Users, MapPin, Award, ExternalLink, Home } from "lucide-react";
import nssLogo from "@/assets/nss-logo.png";
import ndpcBuilding from "@/assets/RegTrack-workflow.png";
import founderImage from "@/assets/clause-finder.png";

export default function About() {
  const navigate = useNavigate();

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
                <span className="text-xs font-semibold uppercase tracking-wider">Our Story</span>
              </div>
              <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
                Bridging Nigerian Innovation<br /> and Regulation
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                RegTrack was born from a simple observation: brilliant Nigerian founders were getting fined 
                for rules they never knew existed. We built this platform to change that narrative.
              </p>
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
                    The Compliance Gap No One Talks About
                  </h2>
                  <div className="space-y-4 text-muted-foreground leading-relaxed">
                    <p>
                      In early 2026, our team sat with a healthtech founder in Lagos. Her app had grown to 
                      five thousand users in just weeks. She was solving a real problem—connecting patients 
                      with doctors across the city. Then the NDPC enforcement notice arrived.
                    </p>
                    <p>
                      The violation wasn't malicious. She simply didn't know that collecting patient symptoms 
                      triggered specific obligations under the NDP Act. No privacy policy. No consent mechanism. 
                      No data protection officer. The potential fine reached ten million naira.
                    </p>
                    <p>
                      As we dug deeper, we discovered her story wasn't unique. It was the norm. Eighty percent 
                      of early-stage Nigerian startups cannot afford a dedicated compliance officer. Most founders 
                      have never read the NDP Act. They're building incredible products while unknowingly 
                      accumulating regulatory risk.
                    </p>
                  </div>
                </div>
                <div className="rounded-2xl overflow-hidden shadow-elevated">
                  <OptimizedImage 
                    src={founderImage} 
                    alt="Nigerian entrepreneur working on laptop" 
                    className="w-full h-full object-cover aspect-square"
                  />
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
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-6">
                Our Mission
              </h2>
              <p className="text-xl text-muted-foreground leading-relaxed">
                To ensure no Nigerian founder faces regulatory penalties for compliance gaps 
                they could have fixed in minutes, if only they knew what was required.
              </p>
            </div>
          </div>
        </section>

        {/* What RegTrack Actually Does */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="font-heading text-3xl font-bold text-foreground text-center mb-12">
                How We're Closing the Gap
              </h2>
              <div className="grid md:grid-cols-3 gap-8">
                <FeatureCard
                  icon={Shield}
                  title="Instant Risk Assessment"
                  description="Answer straightforward questions about your product. Our AI analyzes your responses against the full NDP Act 2023 and GAID 2025 framework, giving you a clear risk score in under two minutes."
                />
                <FeatureCard
                  icon={Target}
                  title="Actionable Remediation"
                  description="We don't just tell you what's wrong. You receive a personalized checklist with step-by-step guidance, difficulty ratings, time estimates, and direct links to official NDPC resources."
                />
                <FeatureCard
                  icon={Award}
                  title="Built for Nigeria, by Nigerians"
                  description="Every recommendation is grounded in the actual Nigerian regulatory environment. We understand NDPC, we understand local business realities, and we speak your language—including Hausa, Igbo, and Yoruba."
                />
              </div>
            </div>
          </div>
        </section>

        {/* The Team Behind RegTrack */}
        <section className="py-16 bg-card border-y border-border">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <div className="inline-flex items-center gap-2 bg-secondary/10 text-secondary rounded-full px-4 py-1.5 mb-6">
                  <Users className="w-4 h-4" />
                  <span className="text-xs font-semibold uppercase tracking-wider">Nexus SafeSphere</span>
                </div>
                <h2 className="font-heading text-3xl font-bold text-foreground mb-4">
                  Built by a Team That Cares
                </h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  RegTrack is the product of Nexus SafeSphere, a collective of Nigerian developers, 
                  legal researchers, and AI engineers committed to making compliance accessible.
                </p>
              </div>

              <div className="flex justify-center mb-8">
                <img src={nssLogo} alt="Nexus SafeSphere" className="h-16 w-auto" />
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <TeamMember
                  name="Zeenatudeen Zubair Yusuf"
                  role="Lead Developer"
                  description="Architected the RegTrack platform, built the frontend experience, and integrated the Supabase backend that powers everything."
                />
                <TeamMember
                  name="Innocent Ojisua"
                  role="Machine Learning Engineer"
                  description="Designed the AI prompting strategy that delivers accurate, contextual compliance analysis using OpenAI's language models."
                />
                <TeamMember
                  name="Precious Kulutuye"
                  role="Product & Compliance Research"
                  description="Led the extraction and structuring of NDP Act content, validated all AI responses, and designed the remediation framework."
                />
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
                  <OptimizedImage 
                    src={ndpcBuilding} 
                    alt="Nigeria Data Protection Commission headquarters" 
                    className="w-full h-full object-cover aspect-video"
                  />
                </div>
                <div>
                  <h2 className="font-heading text-2xl font-bold text-foreground mb-4">
                    Aligned with Nigeria's Regulatory Framework
                  </h2>
                  <div className="space-y-4 text-muted-foreground leading-relaxed">
                    <p>
                      RegTrack is built on the Nigeria Data Protection Act 2023 and the General Application 
                      and Implementation Directive 2025—the current operative framework enforced by the 
                      Nigeria Data Protection Commission.
                    </p>
                    <p>
                      Our platform incorporates official NDPC guidance on DCPMI classification, compliance 
                      audit returns, data protection impact assessments, and breach notification requirements.
                    </p>
                    <p>
                      We're proud to support NDPC's mission of protecting the data privacy rights of all 
                      Nigerians while fostering innovation in Africa's largest tech ecosystem.
                    </p>
                    <a 
                      href="https://ndpc.gov.ng" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-primary hover:underline mt-4"
                    >
                      Visit NDPC Official Website
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Location & Hackathon */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-2xl mx-auto">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-6">
                <MapPin className="w-6 h-6 text-primary" />
              </div>
              <h2 className="font-heading text-2xl font-bold text-foreground mb-4">
                Built in Abuja, for Nigeria
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                RegTrack was created for the RegTech Hackathon at AI Skills Week Abuja 2026, 
                organized by Data Science Nigeria and Microsoft. What started as a hackathon project 
                has grown into a mission-driven platform serving Nigerian founders across the country.
              </p>
              <p className="text-sm text-muted-foreground">
                Nexus SafeSphere • Abuja, Federal Capital Territory • Nigeria
              </p>
            </div>
          </div>
        </section>

        {/* Navigation Bar */}
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center max-w-4xl mx-auto">
            <button
              onClick={() => navigate("/")}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-border bg-card hover:bg-muted/60 transition-all group"
            >
              <Home className="w-4 h-4" />
              <span>Back to Home</span>
            </button>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}

function FeatureCard({ icon: Icon, title, description }: { 
  icon: React.ElementType; 
  title: string; 
  description: string;
}) {
  return (
    <div className="bg-background border border-border rounded-2xl p-6 hover:shadow-card transition-all duration-300">
      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
        <Icon className="w-6 h-6 text-primary" />
      </div>
      <h3 className="font-heading font-semibold text-foreground mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
    </div>
  );
}

function TeamMember({ name, role, description }: { 
  name: string; 
  role: string; 
  description: string;
}) {
  return (
    <div className="bg-background border border-border rounded-2xl p-6 text-center hover:shadow-card transition-all duration-300">
      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
        <Users className="w-8 h-8 text-primary" />
      </div>
      <h3 className="font-heading font-semibold text-foreground">{name}</h3>
      <p className="text-sm text-primary mb-2">{role}</p>
      <p className="text-xs text-muted-foreground leading-relaxed">{description}</p>
    </div>
  );
}