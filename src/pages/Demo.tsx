import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import DemoSection from "@/components/DemoSection";
import Footer from "@/components/Footer";
import { ChevronLeft, Home, Shield } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const Demo = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 pt-20">
        <DemoSection />
        
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between max-w-4xl mx-auto">
            <button onClick={() => navigate("/")} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border bg-card hover:bg-muted/60 transition-all group">
              <Home className="w-4 h-4" /><span className="hidden sm:inline">{t('nav.home')}</span>
            </button>
            <div className="flex items-center gap-3">
              <button onClick={() => navigate("/regulator")} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-primary/30 bg-primary/5 hover:bg-primary/10 transition-all group">
                <Shield className="w-4 h-4 text-primary" /><span className="hidden sm:inline text-primary">{t('nav.regulator')}</span>
              </button>
              <button onClick={() => navigate("/solution")} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border bg-card hover:bg-muted/60 transition-all group">
                <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /><span className="hidden sm:inline">{t('nav.solution')}</span>
              </button>
            </div>
          </div>
          <div className="text-center mt-4">
            <p className="text-[10px] text-muted-foreground">
              {t('demo.title.part1')} {t('demo.title.part2')}
              <br /><span className="text-primary/70">Policy-as-code: One configuration per framework. Zero code changes.</span>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Demo;