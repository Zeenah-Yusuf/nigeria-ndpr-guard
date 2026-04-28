import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { AuthForm } from "@/components/AuthForm";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Login() {
  const { signIn, signInWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { t } = useLanguage();

  const handleLogin = async (data: { email: string; password: string }) => {
    setLoading(true);
    setError(null);
    const result = await signIn(data.email, data.password);
    if (result.error) {
      setError(result.error);
    } else {
      navigate("/");
    }
    setLoading(false);
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError(null);
    const result = await signInWithGoogle();
    if (result?.error) {
      setError(result.error);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 flex items-center justify-center py-20 px-4">
        <div>
          <AuthForm
            mode="login"
            onSubmit={handleLogin}
            onGoogleSignIn={handleGoogleSignIn}
            loading={loading}
            error={error}
          />
          <p className="text-center text-sm text-muted-foreground mt-6">
            {t('auth.noAccount')}{" "}
            <Link to="/register" className="text-primary hover:underline font-medium">
              {t('auth.createOne')}
            </Link>
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}