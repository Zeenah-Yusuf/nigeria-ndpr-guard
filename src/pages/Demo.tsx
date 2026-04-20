import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import DemoSection from "@/components/DemoSection";
import Footer from "@/components/Footer";
import { ChevronLeft, Home } from "lucide-react";

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
            
            <button
              onClick={() => navigate("/solution")}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border bg-card hover:bg-muted/60 transition-all group"
            >
              <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span className="hidden sm:inline">Back to Solution</span>
              <span className="sm:hidden">Back</span>
            </button>
          </div>
          
          {/* Page Indicator */}
          <div className="flex items-center justify-center gap-2 mt-6">
            <span className="w-2 h-2 rounded-full bg-muted"></span>
            <span className="w-2 h-2 rounded-full bg-muted"></span>
            <span className="w-2 h-2 rounded-full bg-primary"></span>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Demo;