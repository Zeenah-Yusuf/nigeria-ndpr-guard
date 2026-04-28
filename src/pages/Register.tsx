import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { AuthForm } from "@/components/AuthForm";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Register() {
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const { t } = useLanguage();

  const handleRegister = async (data: any) => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    const result = await signUp(data.email, data.password, data.role, data);
    if (result.error) {
      setError(result.error);
    } else {
      setSuccess(result.success || t('auth.success.accountCreated'));
      setTimeout(() => navigate("/login"), 3000);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 flex items-center justify-center py-20 px-4">
        <div>
          <AuthForm mode="register" onSubmit={handleRegister} loading={loading} error={error} success={success} />
          <p className="text-center text-sm text-muted-foreground mt-6">
            {t('auth.haveAccount')}{" "}
            <Link to="/login" className="text-primary hover:underline font-medium">
              {t('auth.signInInstead')}
            </Link>
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}