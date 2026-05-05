import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Shield, Mail, Lock, User, Building2, Phone, Globe, Users, Loader2, Eye, EyeOff } from "lucide-react";

interface AuthFormProps {
  mode: "login" | "register";
  onSubmit: (data: any) => void;
  onGoogleSignIn?: () => void;
  loading: boolean;
  error?: string | null;
  success?: string | null;
}

export function AuthForm({ mode, onSubmit, onGoogleSignIn, loading, error, success }: AuthFormProps) {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "organization",
    company_name: "",
    company_size: "",
    sector_id: "",
    website: "",
    phone_number: "",
    registration_number: "",
  });
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);

  const isRegister = mode === "register";

  const validate = (): boolean => {
    const errors: Record<string, string> = {};

    // Email validation
    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Please enter a valid email address";
    }

    // Password validation
    if (!formData.password) {
      errors.password = "Password is required";
    } else if (formData.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }

    // Registration-specific validations
    if (isRegister) {
      if (!formData.company_name?.trim()) {
        errors.company_name = "Company name is required";
      }
      if (!formData.phone_number?.trim()) {
        errors.phone_number = "Phone number is required";
      }
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit(formData);
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear field error when user starts typing
    if (fieldErrors[field]) {
      setFieldErrors(prev => {
        const updated = { ...prev };
        delete updated[field];
        return updated;
      });
    }
  };

  const sectors = [
    { value: "fintech", label: "Fintech" },
    { value: "healthtech", label: "HealthTech" },
    { value: "ecommerce", label: "E-Commerce" },
    { value: "edtech", label: "EdTech" },
    { value: "agritech", label: "AgriTech" },
    { value: "enterprise", label: "Enterprise SaaS" },
    { value: "social_media", label: "Social Media" },
  ];

  return (
    <div className="w-full max-w-md">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
          <Shield className="w-8 h-8 text-primary" />
        </div>
        <h2 className="text-2xl font-bold text-foreground">
          {isRegister ? t('auth.createAccount') : t('auth.welcomeBack')}
        </h2>
        <p className="text-sm text-muted-foreground mt-2">
          {isRegister ? t('auth.joinMessage') : t('auth.signInMessage')}
        </p>
      </div>

      {error && (
        <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm mb-4" role="alert">
          {error}
        </div>
      )}

      {success && (
        <div className="p-3 rounded-lg bg-secondary/10 border border-secondary/20 text-secondary text-sm mb-4" role="status">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1.5">
            {t('auth.email')} <span className="text-destructive">*</span>
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              id="email"
              type="email"
              value={formData.email}
              onChange={e => handleChange("email", e.target.value)}
              required
              placeholder="you@example.com"
              className={`w-full pl-10 pr-4 py-3 rounded-xl border bg-card text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all ${
                fieldErrors.email ? "border-destructive" : "border-border"
              }`}
            />
          </div>
          {fieldErrors.email && (
            <p className="text-xs text-destructive mt-1">{fieldErrors.email}</p>
          )}
        </div>

        {/* Password */}
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-foreground mb-1.5">
            {t('auth.password')} <span className="text-destructive">*</span>
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={e => handleChange("password", e.target.value)}
              required
              minLength={6}
              placeholder={isRegister ? "Min 6 characters" : "Enter your password"}
              className={`w-full pl-10 pr-12 py-3 rounded-xl border bg-card text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all ${
                fieldErrors.password ? "border-destructive" : "border-border"
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {fieldErrors.password && (
            <p className="text-xs text-destructive mt-1">{fieldErrors.password}</p>
          )}
        </div>

        {/* Registration Fields */}
        {isRegister && (
          <>
            {/* Role Selection */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">
                {t('auth.iAmA')} <span className="text-destructive">*</span>
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => handleChange("role", "organization")}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    formData.role === "organization"
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border hover:bg-muted/50"
                  }`}
                >
                  <Building2 className="w-5 h-5 mb-1" />
                  <p className="text-sm font-medium">{t('auth.organization')}</p>
                  <p className="text-[10px] opacity-70">{t('auth.organizationDesc')}</p>
                </button>
                <button
                  type="button"
                  onClick={() => handleChange("role", "dpco")}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    formData.role === "dpco"
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border hover:bg-muted/50"
                  }`}
                >
                  <Users className="w-5 h-5 mb-1" />
                  <p className="text-sm font-medium">{t('auth.dpco')}</p>
                  <p className="text-[10px] opacity-70">{t('auth.dpcoDesc')}</p>
                </button>
              </div>
            </div>

            {/* Company Name */}
            <div>
              <label htmlFor="company_name" className="block text-sm font-medium text-foreground mb-1.5">
                {t('auth.companyName')} <span className="text-destructive">*</span>
              </label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  id="company_name"
                  type="text"
                  value={formData.company_name}
                  onChange={e => handleChange("company_name", e.target.value)}
                  required
                  placeholder="Your company name"
                  className={`w-full pl-10 pr-4 py-3 rounded-xl border bg-card text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all ${
                    fieldErrors.company_name ? "border-destructive" : "border-border"
                  }`}
                />
              </div>
              {fieldErrors.company_name && (
                <p className="text-xs text-destructive mt-1">{fieldErrors.company_name}</p>
              )}
            </div>

            {/* Phone Number */}
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-foreground mb-1.5">
                {t('auth.phoneNumber')} <span className="text-destructive">*</span>
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  id="phone"
                  type="tel"
                  value={formData.phone_number}
                  onChange={e => handleChange("phone_number", e.target.value)}
                  required
                  placeholder="+234 800 000 0000"
                  className={`w-full pl-10 pr-4 py-3 rounded-xl border bg-card text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all ${
                    fieldErrors.phone_number ? "border-destructive" : "border-border"
                  }`}
                />
              </div>
              {fieldErrors.phone_number && (
                <p className="text-xs text-destructive mt-1">{fieldErrors.phone_number}</p>
              )}
            </div>

            {/* Sector */}
            <div>
              <label htmlFor="sector" className="block text-sm font-medium text-foreground mb-1.5">
                {t('auth.sector')}
              </label>
              <select
                id="sector"
                value={formData.sector_id}
                onChange={e => handleChange("sector_id", e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-border bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
              >
                <option value="">{t('auth.selectSector')}</option>
                {sectors.map(s => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
            </div>

            {/* Website */}
            <div>
              <label htmlFor="website" className="block text-sm font-medium text-foreground mb-1.5">
                {t('auth.website')}
              </label>
              <div className="relative">
                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  id="website"
                  type="url"
                  value={formData.website}
                  onChange={e => handleChange("website", e.target.value)}
                  placeholder="https://yourcompany.com"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-card text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
                />
              </div>
            </div>
          </>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
          {isRegister ? t('auth.register') : t('auth.signIn')}
        </button>

        {/* Forgot Password (Login only) */}
        {!isRegister && (
          <p className="text-center">
            <a href="/forgot-password" className="text-sm text-primary hover:underline">
              {t('auth.forgotPassword')}
            </a>
          </p>
        )}

        {/* Google Sign In */}
        {onGoogleSignIn && (
          <>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">{t('auth.or')}</span>
              </div>
            </div>
            <button
              type="button"
              onClick={onGoogleSignIn}
              disabled={loading}
              className="w-full py-3 rounded-xl border border-border bg-card text-foreground font-semibold hover:bg-muted/50 active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              {t('auth.continueWithGoogle')}
            </button>
          </>
        )}
      </form>
    </div>
  );
}