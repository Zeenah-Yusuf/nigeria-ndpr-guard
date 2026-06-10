import { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import type { UserRole } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { AuthForm } from "@/components/AuthForm";
import { useLanguage } from "@/contexts/LanguageContext";

const DASHBOARD_ROUTES: Record<UserRole, string> = {
  admin: "/admin-dashboard",
  dpco: "/dpco-dashboard",
  organization: "/org-dashboard",
};

export default function Register() {
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { t } = useLanguage();
  const redirecting = useRef(false);

  const handleRegister = async (data: Record<string, unknown>) => {
    if (redirecting.current) return;

    setLoading(true);
    setError(null);

    const email = typeof data.email === "string" ? data.email : "";
    const password = typeof data.password === "string" ? data.password : "";
    const role: UserRole =
      typeof data.role === "string" && ["admin", "dpco", "organization"].includes(data.role)
        ? (data.role as UserRole)
        : "organization";

    const result = await signUp(email, password, role, data);

    if (result.error) {
      setError(result.error);
      setLoading(false);
      return;
    }

    redirecting.current = true;
    const destination = DASHBOARD_ROUTES[role];
    window.location.href = destination;
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 flex items-center justify-center py-20 px-4">
        <div className="w-full max-w-md">
          <AuthForm mode="register" onSubmit={handleRegister} loading={loading} error={error} />
          <p className="text-center text-sm text-muted-foreground mt-6">
            {t("auth.haveAccount")}{" "}
            <Link to="/login" className="text-primary hover:underline font-medium">
              {t("auth.signInInstead")}
            </Link>
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}