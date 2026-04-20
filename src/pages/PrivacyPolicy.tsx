import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Shield, Lock, Eye, Mail, Database, Globe, Cookie } from "lucide-react";

export default function PrivacyPolicy() {
  const lastUpdated = "April 20, 2026";

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 pt-32 pb-16">
        <div className="max-w-3xl mx-auto">
          
          {/* Header */}
          <div className="mb-12 text-center">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary rounded-full px-4 py-1.5 mb-6">
              <Shield className="w-4 h-4" />
              <span className="text-xs font-semibold uppercase tracking-wider">Your Data Rights</span>
            </div>
            <h1 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-4">
              Privacy Policy
            </h1>
            <p className="text-muted-foreground">
              Last Updated: {lastUpdated}
            </p>
          </div>

          {/* Our Promise */}
          <div className="bg-primary/5 border border-primary/20 rounded-2xl p-8 mb-8">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Lock className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h2 className="font-heading text-xl font-semibold text-foreground mb-2">
                  Our Promise to You
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  RegTrack was built with privacy at its core. We believe compliance tools should respect 
                  the same principles they help others uphold. We collect only what's necessary, we never 
                  sell your data, and we're transparent about everything we do.
                </p>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="prose prose-gray dark:prose-invert max-w-none">
            <div className="space-y-8">
              
              <Section title="1. Information We Collect" icon={Database}>
                <p className="font-medium">We keep data collection minimal by design.</p>
                
                <h3 className="text-base font-semibold mt-4 mb-2">Compliance Assessments</h3>
                <p>
                  The answers you provide in our risk scanner are processed in your browser session only. 
                  We do not store your questionnaire responses on our servers. Results are generated in 
                  real-time and exist only for the duration of your session unless you choose to download 
                  a report for your own records.
                </p>
                
                <h3 className="text-base font-semibold mt-4 mb-2">Waitlist Signups</h3>
                <p>
                  If you choose to join our waitlist, we store only the email address you provide. This 
                  is used exclusively to notify you about platform updates and is never shared with third 
                  parties. You can request removal at any time.
                </p>
                
                <h3 className="text-base font-semibold mt-4 mb-2">Anonymous Usage Analytics</h3>
                <p>
                  We collect anonymous usage data to improve our recommendations and platform performance. 
                  This includes which regulatory sections are searched most frequently, general geographic 
                  region (country level only), and broad device categories. No personal data is included 
                  in this collection.
                </p>
              </Section>

              <Section title="2. How We Use Your Information" icon={Eye}>
                <p>We use information for the following limited purposes:</p>
                <ul>
                  <li>
                    <strong>To provide the Service:</strong> Generating compliance assessments based on 
                    the answers you provide during your session.
                  </li>
                  <li>
                    <strong>To communicate with you:</strong> Sending waitlist updates or responding to 
                    inquiries you initiate.
                  </li>
                  <li>
                    <strong>To improve RegTrack:</strong> Analyzing anonymous usage patterns to enhance 
                    our recommendations and user experience.
                  </li>
                  <li>
                    <strong>To maintain security:</strong> Monitoring for unusual activity that could 
                    indicate misuse of the platform.
                  </li>
                </ul>
                <p className="mt-4">
                  We do not use your information for automated decision-making that produces legal effects, 
                  and we do not engage in profiling for marketing purposes.
                </p>
              </Section>

              <Section title="3. Data Storage and Security" icon={Shield}>
                <p>
                  RegTrack operates on Supabase infrastructure with enterprise-grade security. Our security 
                  measures include:
                </p>
                <ul>
                  <li>Encryption of all data transmission using TLS (Transport Layer Security)</li>
                  <li>Database row-level security policies ensuring strict access controls</li>
                  <li>Regular security updates and vulnerability monitoring</li>
                  <li>Secure API endpoints with authentication requirements</li>
                </ul>
                <p className="mt-4">
                  The regulatory clause data we reference is sourced directly from publicly available NDPC 
                  documentation—the Nigeria Data Protection Act 2023 and the General Application and 
                  Implementation Directive 2025. This content is stored securely and served to users 
                  without modification.
                </p>
              </Section>

              <Section title="4. Cookies and Similar Technologies" icon={Cookie}>
                <p>
                  RegTrack uses minimal cookies to provide core functionality:
                </p>
                <ul>
                  <li>
                    <strong>Essential cookies:</strong> We store your language preference (English, Hausa, 
                    Igbo, or Yoruba) to maintain your selected language across sessions. This is a functional 
                    cookie necessary for the multilingual feature.
                  </li>
                  <li>
                    <strong>Local storage:</strong> Your remediation checklist progress is saved locally 
                    in your browser using localStorage. This data never leaves your device and is only 
                    accessible to you.
                  </li>
                </ul>
                <p className="mt-4">
                  We do not use tracking cookies, advertising cookies, or third-party analytics cookies. 
                  Your activity on RegTrack is not tracked across other websites.
                </p>
              </Section>

              <Section title="5. Third-Party Services" icon={Globe}>
                <p>
                  We use the following trusted services to power RegTrack. Each maintains its own privacy 
                  practices aligned with global standards:
                </p>
                <ul>
                  <li>
                    <strong>Supabase:</strong> Provides our database and backend infrastructure. Supabase 
                    is GDPR compliant and maintains industry-standard security certifications.
                  </li>
                  <li>
                    <strong>OpenAI API:</strong> Powers our AI compliance analysis. OpenAI does not train 
                    on data submitted through their API and deletes inputs after processing.
                  </li>
                  <li>
                    <strong>Vercel:</strong> Hosts our frontend and provides content delivery. Vercel 
                    processes only technical data necessary for content delivery.
                  </li>
                </ul>
                <p className="mt-4">
                  We do not sell, rent, or trade your information with any third parties for marketing 
                  or commercial purposes.
                </p>
              </Section>

              <Section title="6. Your Rights Under the NDP Act 2023" icon={Shield}>
                <p>
                  As a Nigerian data subject, you have specific rights regarding your personal data:
                </p>
                <ul>
                  <li>
                    <strong>Right to be informed:</strong> You have the right to know what personal data 
                    we process and why. This policy fulfills that obligation.
                  </li>
                  <li>
                    <strong>Right of access:</strong> You may request confirmation of whether we process 
                    your personal data and receive a copy of that data.
                  </li>
                  <li>
                    <strong>Right to rectification:</strong> You may request correction of inaccurate or 
                    incomplete personal data we hold about you.
                  </li>
                  <li>
                    <strong>Right to erasure:</strong> You may request deletion of your personal data, 
                    subject to any legal obligations we may have to retain it.
                  </li>
                  <li>
                    <strong>Right to withdraw consent:</strong> Where processing is based on consent, 
                    you may withdraw that consent at any time.
                  </li>
                  <li>
                    <strong>Right to lodge a complaint:</strong> You have the right to file a complaint 
                    with the Nigeria Data Protection Commission.
                  </li>
                </ul>
                <p className="mt-4">
                  To exercise any of these rights, contact us using the information in Section 9. We will 
                  respond to all legitimate requests within thirty days.
                </p>
              </Section>

              <Section title="7. Data Retention">
                <p>
                  We retain information only as long as necessary:
                </p>
                <ul>
                  <li>
                    <strong>Waitlist emails:</strong> Retained until you request removal or until the 
                    waitlist program concludes, whichever comes first.
                  </li>
                  <li>
                    <strong>Anonymous analytics:</strong> Aggregated data retained indefinitely for 
                    trend analysis, as it cannot be linked to any individual.
                  </li>
                  <li>
                    <strong>Compliance assessment responses:</strong> Not retained beyond your active 
                    browser session.
                  </li>
                </ul>
              </Section>

              <Section title="8. Children's Privacy">
                <p>
                  RegTrack is not directed at individuals under 18 years of age. We do not knowingly 
                  collect personal information from children. If you believe a child has provided us 
                  with personal data, please contact us immediately, and we will take steps to delete 
                  such information.
                </p>
                <p className="mt-2">
                  Under the NDP Act 2023, processing a child's personal data requires verifiable parental 
                  consent. Since we do not knowingly collect data from children, we do not seek such consent.
                </p>
              </Section>

              <Section title="9. Changes to This Privacy Policy">
                <p>
                  We may update this Privacy Policy periodically to reflect changes in our practices, 
                  technology, or regulatory requirements. The "Last Updated" date at the top of this page 
                  indicates when revisions were made.
                </p>
                <p className="mt-2">
                  For material changes, we will make reasonable efforts to notify users through the platform. 
                  Your continued use of RegTrack after such modifications constitutes acceptance of the 
                  updated policy.
                </p>
              </Section>

              <Section title="10. Contact Us" icon={Mail}>
                <div className="p-6 bg-muted/30 rounded-xl border border-border">
                  <div className="flex items-start gap-4">
                    <Mail className="w-5 h-5 text-primary mt-1" />
                    <div>
                      <p className="font-semibold mb-2">Questions about this Privacy Policy?</p>
                      <p className="text-muted-foreground">
                        Email us at <a href="mailto:yusufzeenah12@gmail.com" className="text-primary hover:underline">yusufzeenah12@gmail.com</a>
                      </p>
                      <p className="text-muted-foreground mt-2">
                        We aim to respond to all privacy inquiries within three business days.
                      </p>
                      <p className="text-sm text-muted-foreground mt-4">
                        Nexus SafeSphere<br />
                        Abuja, Federal Capital Territory<br />
                        Nigeria
                      </p>
                    </div>
                  </div>
                </div>
              </Section>

              <Section title="11. NDPC Contact Information">
                <div className="p-6 bg-muted/30 rounded-xl border border-border">
                  <p className="mb-2">
                    If you believe we have not adequately addressed your privacy concerns, you have the 
                    right to lodge a complaint with the Nigeria Data Protection Commission:
                  </p>
                  <ul className="mt-2">
                    <li>
                      <strong>Website:</strong> <a href="https://ndpc.gov.ng" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">ndpc.gov.ng</a>
                    </li>
                    <li>
                      <strong>Email:</strong> info@ndpc.gov.ng
                    </li>
                    <li>
                      <strong>Address:</strong> No. 14, Ibrahim Taiwo Street, Central Business District, Abuja, Nigeria
                    </li>
                  </ul>
                </div>
              </Section>

            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}

function Section({ 
  title, 
  children, 
  icon: Icon 
}: { 
  title: string; 
  children: React.ReactNode; 
  icon?: React.ElementType;
}) {
  return (
    <div className="border-b border-border pb-6 last:border-0">
      <h2 className="text-xl font-heading font-semibold text-foreground mb-4 flex items-center gap-2">
        {Icon && <Icon className="w-5 h-5 text-primary" />}
        {title}
      </h2>
      <div className="text-muted-foreground leading-relaxed space-y-3">
        {children}
      </div>
    </div>
  );
}