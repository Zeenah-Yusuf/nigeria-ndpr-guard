import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/SupabaseClient";

const DASHBOARD_ROUTES: Record<string, string> = {
  admin: "/admin-dashboard",
  dpco: "/dpco-dashboard",
  organization: "/org-dashboard",
};

export default function AuthCallback() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function handleCallback() {
      const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(
        window.location.href
      );

      if (exchangeError) {
        if (!cancelled) setError(exchangeError.message);
        return;
      }

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        if (!cancelled) navigate("/login", { replace: true });
        return;
      }

      const { data: profile } = await supabase
        .from("user_profiles")
        .select("role")
        .eq("id", user.id)
        .maybeSingle();

      const role = profile?.role || user.user_metadata?.role || "organization";
      const destination = DASHBOARD_ROUTES[role] || "/org-dashboard";

      if (!cancelled) navigate(destination, { replace: true });
    }

    handleCallback();

    return () => {
      cancelled = true;
    };
  }, [navigate]);

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center space-y-4 max-w-sm">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-destructive/10 text-destructive text-xl font-bold">
            !
          </div>
          <h2 className="text-lg font-semibold text-foreground">Authentication Failed</h2>
          <p className="text-sm text-muted-foreground">{error}</p>
          <button
            onClick={() => navigate("/login", { replace: true })}
            className="inline-block px-4 py-2 text-sm rounded-xl bg-primary text-primary-foreground font-medium hover:opacity-90 transition-all"
          >
            Back to sign in
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto" />
        <p className="text-sm text-muted-foreground">Completing authentication...</p>
      </div>
    </div>
  );
}