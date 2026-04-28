import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { ComplianceGapSection } from "@/components/ComplianceGapSection";
import Footer from "@/components/Footer";
import { ChevronLeft, ChevronRight, Home } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const ComplianceGap = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 pt-20">
        <ComplianceGapSection />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between max-w-4xl mx-auto">
            <button onClick={() => navigate("/")} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border bg-card hover:bg-muted/60 transition-all group">
              <Home className="w-4 h-4" /><span className="hidden sm:inline">{t('nav.home')}</span>
            </button>
            <div className="flex items-center gap-3">
              <button onClick={() => navigate("/")} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border bg-card hover:bg-muted/60 transition-all group">
                <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /><span className="hidden sm:inline">{t('common.back')}</span>
              </button>
              <button onClick={() => navigate("/solution")} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground hover:opacity-90 transition-all group">
                <span>{t('nav.solution')}</span><ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ComplianceGap;