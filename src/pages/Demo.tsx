import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import DemoSection from "@/components/DemoSection";
import Footer from "@/components/Footer";
import { ChevronLeft, Home, Shield, ExternalLink } from "lucide-react";

const Demo = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 pt-20">
        <DemoSection />
        
        {/* Navigation Bar */}
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between max-w-4xl mx-auto">
            <button
              onClick={() => navigate("/")}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border bg-card hover:bg-muted/60 transition-all group"
            >
              <Home className="w-4 h-4" />
              <span className="hidden sm:inline">Home</span>
            </button>
            
            <div className="flex items-center gap-3">
              {/* Regulator Dashboard Link - NEW */}
              <button
                onClick={() => navigate("/regulator")}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-primary/30 bg-primary/5 hover:bg-primary/10 transition-all group"
              >
                <Shield className="w-4 h-4 text-primary" />
                <span className="hidden sm:inline text-primary">Regulator View</span>
                <ExternalLink className="w-3 h-3 text-primary opacity-70" />
              </button>
              
              <button
                onClick={() => navigate("/solution")}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border bg-card hover:bg-muted/60 transition-all group"
              >
                <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                <span className="hidden sm:inline">Back to Solution</span>
                <span className="sm:hidden">Back</span>
              </button>
            </div>
          </div>
          
          {/* Page Indicator */}
          <div className="flex items-center justify-center gap-2 mt-6">
            <span className="w-2 h-2 rounded-full bg-muted"></span>
            <span className="w-2 h-2 rounded-full bg-muted"></span>
            <span className="w-2 h-2 rounded-full bg-primary"></span>
          </div>
          
          {/* Framework Selector Hint - NEW */}
          <div className="text-center mt-4">
            <p className="text-[10px] text-muted-foreground">
              Try the framework toggle above — switch between NDP Act 2023 and CBN AML 2024 instantly.
              <br />
              <span className="text-primary/70">Policy-as-code: One JSON file per framework. Zero code changes.</span>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Demo;