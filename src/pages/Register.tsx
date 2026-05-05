import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { AuthForm } from "@/components/AuthForm";
import { useLanguage } from "@/contexts/LanguageContext";
import { Mail } from "lucide-react";

export default function Register() {
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [registeredEmail, setRegisteredEmail] = useState<string>("");
  const { t } = useLanguage();
  const successRef = useRef<HTMLDivElement>(null);

  const handleRegister = async (data: any) => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    const result = await signUp(data.email, data.password, data.role, data);
    if (result.error) {
      setError(result.error);
    } else {
      setRegisteredEmail(data.email);
      setSuccess(result.success || t('auth.success.accountCreated'));
    }
    setLoading(false);
  };

  // Scroll to top and focus success message when shown
  useEffect(() => {
    if (success) {
      // Multiple scroll methods for cross-browser compatibility
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
      
      // Also scroll the main content area
      const mainElement = document.querySelector('main');
      if (mainElement) {
        mainElement.scrollTop = 0;
      }
      
      // Focus the success message for accessibility
      setTimeout(() => {
        successRef.current?.focus();
      }, 100);
    }
  }, [success]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 flex items-center justify-center py-20 px-4">
        <div>
          {success ? (
            <div 
              ref={successRef}
              tabIndex={-1}
              className="w-full max-w-md animate-fade-in-up"
              aria-live="polite"
              aria-label="Registration successful"
            >
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-secondary/10 mb-4">
                  <Mail className="w-10 h-10 text-secondary" />
                </div>
                <h2 className="text-2xl font-bold text-foreground mb-2">
                  {t('auth.checkEmail')}
                </h2>
                <p className="text-muted-foreground">
                  We've sent a confirmation email to{" "}
                  <strong className="text-foreground">{registeredEmail}</strong>
                </p>
                <div className="mt-6 p-4 rounded-xl bg-muted/30 border border-border text-left">
                  <p className="text-sm text-foreground font-medium mb-2">Next steps:</p>
                  <ol className="text-sm text-muted-foreground space-y-2 list-decimal list-inside">
                    <li>Check your email inbox for a message from RegTrack</li>
                    <li>Click the confirmation link in the email</li>
                    <li>You'll be redirected to the login page</li>
                    <li>Sign in with your email and password</li>
                  </ol>
                </div>
                <p className="text-sm text-muted-foreground mt-4">
                  Didn't receive the email? Check your spam folder or{" "}
                  <button 
                    onClick={() => {
                      setSuccess(null);
                      setError(null);
                    }}
                    className="text-primary hover:underline font-medium"
                  >
                    try again
                  </button>
                </p>
              </div>
              <button 
                onClick={() => navigate("/login")}
                className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-all active:scale-[0.98]"
              >
                {t('auth.backToSignIn')}
              </button>
            </div>
          ) : (
            <>
              <AuthForm 
                mode="register" 
                onSubmit={handleRegister} 
                loading={loading} 
                error={error} 
              />
              <p className="text-center text-sm text-muted-foreground mt-6">
                {t('auth.haveAccount')}{" "}
                <Link to="/login" className="text-primary hover:underline font-medium">
                  {t('auth.signInInstead')}
                </Link>
              </p>
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}