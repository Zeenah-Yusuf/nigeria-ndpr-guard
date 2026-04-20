import Navbar  from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Scale, AlertCircle, Shield, BookOpen, FileText, Mail } from "lucide-react";

export default function TermsOfService() {
  const lastUpdated = "April 20, 2026";

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 pt-32 pb-16">
        <div className="max-w-3xl mx-auto">
          
          {/* Header */}
          <div className="mb-12 text-center">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary rounded-full px-4 py-1.5 mb-6">
              <Scale className="w-4 h-4" />
              <span className="text-xs font-semibold uppercase tracking-wider">Legal Agreement</span>
            </div>
            <h1 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-4">
              Terms of Service
            </h1>
            <p className="text-muted-foreground">
              Last Updated: {lastUpdated}
            </p>
          </div>

          {/* Critical Notice */}
          <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-2xl p-6 mb-8">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-semibold text-amber-800 dark:text-amber-400 mb-2">
                  Important: Educational Purpose Only
                </p>
                <p className="text-sm text-amber-700 dark:text-amber-300 leading-relaxed">
                  RegTrack provides educational guidance and compliance awareness tools. We are not a law firm, 
                  and nothing on this platform constitutes legal advice. Always consult with a qualified legal 
                  professional for specific compliance matters affecting your business.
                </p>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="prose prose-gray dark:prose-invert max-w-none">
            <div className="space-y-8">
              
              <Section title="1. Acceptance of Terms" icon={FileText}>
                <p>
                  By accessing or using RegTrack ("the Service"), you acknowledge that you have read, understood, 
                  and agree to be bound by these Terms of Service. If you are using the Service on behalf of an 
                  organization, you represent that you have the authority to bind that organization to these terms.
                </p>
                <p>
                  If you do not agree with any part of these terms, you must discontinue use of the Service immediately.
                </p>
              </Section>

              <Section title="2. Description of the Service" icon={BookOpen}>
                <p>
                  RegTrack is a compliance awareness platform designed to help Nigerian businesses understand their 
                  obligations under the Nigeria Data Protection Act 2023 and the General Application and Implementation 
                  Directive 2025.
                </p>
                <p>The Service provides:</p>
                <ul>
                  <li>AI-powered compliance risk assessments based on user-provided information</li>
                  <li>Searchable access to NDP Act and GAID 2025 regulatory text</li>
                  <li>Personalized remediation checklists and educational resources</li>
                  <li>Downloadable summary reports for internal reference</li>
                </ul>
                <p>
                  The Service is provided on an "as is" and "as available" basis. We continuously work to improve 
                  accuracy and usefulness, but we cannot guarantee that all information is complete or error-free 
                  at all times.
                </p>
              </Section>

              <Section title="3. No Legal Advice or Attorney-Client Relationship" icon={Scale}>
                <p>
                  The information provided by RegTrack is for general informational and educational purposes only. 
                  Nothing on this platform should be construed as legal advice on any subject matter.
                </p>
                <p>
                  No attorney-client relationship is created by your use of RegTrack. You should not act or refrain 
                  from acting based on any content included in the Service without seeking appropriate legal or 
                  professional advice from a licensed attorney in your jurisdiction.
                </p>
                <p>
                  Compliance requirements vary based on your specific business model, data processing activities, 
                  and other factors. Only a qualified professional can provide guidance tailored to your unique situation.
                </p>
              </Section>

              <Section title="4. Accuracy of Regulatory Information" icon={Shield}>
                <p>
                  We strive to maintain accurate and current regulatory information sourced from official NDPC 
                  publications. However, the NDP Act, GAID, and related NDPC guidance are subject to change. 
                  We cannot guarantee that all information provided through the Service is complete, accurate, 
                  or current at all times.
                </p>
                <p>
                  Official regulatory guidance should always be verified directly with the Nigeria Data Protection 
                  Commission at <a href="https://ndpc.gov.ng" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">ndpc.gov.ng</a>.
                </p>
              </Section>

              <Section title="5. User Responsibilities">
                <p>As a user of RegTrack, you are responsible for:</p>
                <ul>
                  <li>Providing accurate and truthful information when using the compliance scanner</li>
                  <li>Maintaining the confidentiality of any downloaded reports containing your assessment data</li>
                  <li>Using the Service in compliance with all applicable laws and regulations</li>
                  <li>Seeking professional verification before making compliance-related decisions</li>
                  <li>Understanding that compliance is an ongoing obligation, not a one-time assessment</li>
                </ul>
              </Section>

              <Section title="6. Limitation of Liability">
                <p>
                  To the fullest extent permitted by Nigerian law, RegTrack, Nexus SafeSphere, and their respective 
                  officers, directors, employees, and agents shall not be liable for any indirect, incidental, special, 
                  consequential, or punitive damages arising from your use of or inability to use the Service.
                </p>
                <p>
                  This includes, without limitation:
                </p>
                <ul>
                  <li>Damages for lost profits or business interruption</li>
                  <li>Fines, penalties, or enforcement actions issued by regulatory authorities</li>
                  <li>Loss of data or goodwill</li>
                  <li>Any other commercial damages or losses</li>
                </ul>
                <p>
                  Our total liability to you for any claim arising from your use of the Service shall not exceed 
                  the amount you have paid us (if any) for access to the Service during the twelve months preceding 
                  the claim.
                </p>
              </Section>

              <Section title="7. Intellectual Property">
                <p>
                  The RegTrack platform, including its original content, features, functionality, and design elements, 
                  is owned by Nexus SafeSphere and protected by applicable intellectual property laws.
                </p>
                <p>
                  The NDP Act 2023 and GAID 2025 text referenced within the Service remains the property of the 
                  Federal Republic of Nigeria and is used for educational purposes in accordance with public 
                  information access.
                </p>
                <p>
                  You may not reproduce, distribute, modify, create derivative works of, publicly display, or 
                  commercially exploit any part of the Service without our express written permission.
                </p>
              </Section>

              <Section title="8. Third-Party Links and Resources">
                <p>
                  The Service contains links to third-party websites, including official NDPC resources and 
                  compliance tools. We provide these links for your convenience only. We do not control, endorse, 
                  or assume responsibility for the content, privacy policies, or practices of any third-party sites.
                </p>
                <p>
                  You acknowledge and agree that RegTrack shall not be responsible or liable for any damage or loss 
                  caused by or in connection with your use of any third-party content, goods, or services.
                </p>
              </Section>

              <Section title="9. User Conduct">
                <p>You agree not to:</p>
                <ul>
                  <li>Use the Service for any unlawful purpose or in violation of any applicable laws</li>
                  <li>Attempt to gain unauthorized access to any portion of the Service</li>
                  <li>Interfere with or disrupt the Service or servers connected to the Service</li>
                  <li>Use any automated system (bots, scrapers) to access the Service without permission</li>
                  <li>Impersonate any person or entity or misrepresent your affiliation</li>
                </ul>
              </Section>

              <Section title="10. Termination">
                <p>
                  We reserve the right to suspend or terminate your access to the Service at our sole discretion, 
                  without notice, for conduct that we believe violates these Terms or is otherwise harmful to other 
                  users, us, or third parties.
                </p>
                <p>
                  Upon termination, your right to use the Service will immediately cease. Provisions of these Terms 
                  that by their nature should survive termination shall survive, including ownership provisions, 
                  warranty disclaimers, indemnity, and limitations of liability.
                </p>
              </Section>

              <Section title="11. Governing Law and Jurisdiction">
                <p>
                  These Terms shall be governed by and construed in accordance with the laws of the Federal Republic 
                  of Nigeria, without regard to its conflict of law provisions.
                </p>
                <p>
                  Any dispute arising from or relating to these Terms or the Service shall be subject to the exclusive 
                  jurisdiction of the courts located in Abuja, Federal Capital Territory, Nigeria.
                </p>
              </Section>

              <Section title="12. Changes to These Terms">
                <p>
                  We may modify these Terms at any time by posting the revised version on this page. The "Last Updated" 
                  date at the top of this page will reflect the most recent changes.
                </p>
                <p>
                  Your continued use of the Service after such modifications constitutes acceptance of the updated 
                  Terms. If you disagree with any changes, you must discontinue use of the Service.
                </p>
                <p>
                  For material changes, we will make reasonable efforts to notify users through the platform or via 
                  email if you have provided one.
                </p>
              </Section>

              <Section title="13. Contact Information">
                <div className="p-6 bg-muted/30 rounded-xl border border-border">
                  <div className="flex items-start gap-4">
                    <Mail className="w-5 h-5 text-primary mt-1" />
                    <div>
                      <p className="font-semibold mb-2">Questions about these Terms?</p>
                      <p className="text-muted-foreground">
                        Email us at <a href="mailto:yusufzeenah12@gmail.com" className="text-primary hover:underline">yusufzeenah12@gmail.com</a>
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