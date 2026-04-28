import { useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/lib/SupabaseClient";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Shield, Mail } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { t } = useLanguage();

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + '/reset-password',
    });

    if (error) {
      setError(error.message);
    } else {
      setSuccess(true);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 flex items-center justify-center py-20 px-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
              <Shield className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-2xl font-bold text-foreground">{t('auth.resetPassword')}</h2>
            <p className="text-sm text-muted-foreground mt-2">
              {t('auth.enterNewPassword')}
            </p>
          </div>

          {success ? (
            <div className="p-6 rounded-xl bg-secondary/10 border border-secondary/20 text-center">
              <p className="text-secondary font-semibold mb-2">{t('auth.checkEmail')}</p>
              <p className="text-sm text-muted-foreground">
                {t('auth.resetEmailSent')} <strong>{email}</strong>
              </p>
              <Link to="/login" className="inline-block mt-4 text-primary hover:underline text-sm">{t('auth.backToSignIn')}</Link>
            </div>
          ) : (
            <form onSubmit={handleReset} className="space-y-4">
              {error && (
                <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm" role="alert">
                  {error}
                </div>
              )}
              <div>
                <label htmlFor="reset-email" className="block text-sm font-medium text-foreground mb-1.5">{t('auth.email')}</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    id="reset-email" name="email" type="email"
                    value={email} onChange={e => setEmail(e.target.value)}
                    required placeholder="you@example.com"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-card text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
                  />
                </div>
              </div>

              <button type="submit" disabled={loading}
                className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50">
                {loading ? t('auth.sending') : t('auth.sendResetLink')}
              </button>

              <p className="text-center text-sm text-muted-foreground">
                <Link to="/login" className="text-primary hover:underline">{t('auth.backToSignIn')}</Link>
              </p>
            </form>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}