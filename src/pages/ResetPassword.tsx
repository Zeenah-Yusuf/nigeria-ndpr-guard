import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/SupabaseClient";
import { Shield, Lock } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function ResetPassword() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const hash = window.location.hash;
    if (!hash || !hash.includes('type=recovery')) {
      navigate('/login');
    }
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      setError(error.message);
    } else {
      setSuccess(true);
      setTimeout(() => navigate('/login'), 3000);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            <Shield className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-2xl font-bold text-foreground">{t('auth.setNewPassword')}</h2>
          <p className="text-sm text-muted-foreground mt-2">{t('auth.enterNewPassword')}</p>
        </div>

        {success ? (
          <div className="p-6 rounded-xl bg-secondary/10 border border-secondary/20 text-center">
            <p className="text-secondary font-semibold mb-2">{t('auth.passwordUpdated')}</p>
            <p className="text-sm text-muted-foreground">{t('auth.redirecting')}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm" role="alert">
                {error}
              </div>
            )}
            <div>
              <label htmlFor="new-password" className="block text-sm font-medium text-foreground mb-1.5">{t('auth.password')}</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  id="new-password" name="password" type="password"
                  value={password} onChange={e => setPassword(e.target.value)}
                  required minLength={6} placeholder="Min 6 characters"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-card text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
                />
              </div>
            </div>
            <button type="submit" disabled={loading}
              className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50">
              {loading ? t('auth.updating') : t('auth.setPassword')}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}