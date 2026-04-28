import { useState } from "react";
import { Link } from "react-router-dom";
import { Shield, Mail, Lock, Building2, Globe, Phone, FileText } from "lucide-react";

interface AuthFormProps {
  mode: "login" | "register";
  onSubmit: (data: any) => Promise<void>;
  onGoogleSignIn?: () => Promise<void>;
  loading: boolean;
  error?: string | null;
  success?: string | null;
}

const ROLES = [
  { value: "organization", label: "Organization / Startup", icon: Building2, desc: "I need to assess my compliance" },
  { value: "dpco", label: "Compliance Officer (DPCO)", icon: Shield, desc: "I provide compliance services" },
];

const SECTORS = [
  { value: "", label: "Select sector" },
  { value: "fintech", label: "Fintech" },
  { value: "healthtech", label: "HealthTech" },
  { value: "ecommerce", label: "E-Commerce" },
  { value: "edtech", label: "EdTech" },
  { value: "agritech", label: "AgriTech" },
  { value: "enterprise", label: "Enterprise SaaS" },
  { value: "social_media", label: "Social Media" },
];

const COMPANY_SIZES = [
  { value: "solo", label: "Solo Founder" },
  { value: "micro", label: "Micro (2-10)" },
  { value: "small", label: "Small (11-50)" },
  { value: "medium", label: "Medium (51-200)" },
  { value: "large", label: "Large (200+)" },
];

export function AuthForm({ mode, onSubmit, onGoogleSignIn, loading, error, success }: AuthFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("organization");
  const [companyName, setCompanyName] = useState("");
  const [companySize, setCompanySize] = useState("micro");
  const [sector, setSector] = useState("");
  const [website, setWebsite] = useState("");
  const [phone, setPhone] = useState("");
  const [registrationNumber, setRegistrationNumber] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === "login") {
      await onSubmit({ email, password });
    } else {
      await onSubmit({
        email, password, role,
        company_name: companyName,
        company_size: companySize,
        sector_id: sector || null,
        website_url: website,
        phone_number: phone,
        registration_number: registrationNumber || null,
      });
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
          <Shield className="w-8 h-8 text-primary" />
        </div>
        <h2 className="text-2xl font-bold text-foreground">
          {mode === "login" ? "Welcome Back" : "Create Account"}
        </h2>
        <p className="text-sm text-muted-foreground mt-2">
          {mode === "login" ? "Sign in to your RegTrack account" : "Join RegTrack to manage your compliance"}
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm" role="alert">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 p-3 rounded-lg bg-secondary/10 border border-secondary/20 text-secondary text-sm" role="status">
          {success}
        </div>
      )}

      {/* Google Sign In Button */}
      {onGoogleSignIn && (
        <>
          <button
            type="button"
            onClick={onGoogleSignIn}
            className="w-full py-3 rounded-xl border border-border bg-card text-foreground font-medium hover:bg-muted/50 active:scale-[0.98] transition-all flex items-center justify-center gap-2 mb-4"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Continue with Google
          </button>
          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-muted-foreground">or</span>
            <div className="flex-1 h-px bg-border" />
          </div>
        </>
      )}

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <div>
          <label htmlFor="auth-email" className="block text-sm font-medium text-foreground mb-1.5">Email</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              id="auth-email" name="email" type="email"
              value={email} onChange={e => setEmail(e.target.value)}
              required placeholder="you@example.com" autoComplete="email"
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-card text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
            />
          </div>
        </div>

        <div>
          <label htmlFor="auth-password" className="block text-sm font-medium text-foreground mb-1.5">Password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              id="auth-password" name="password" type="password"
              value={password} onChange={e => setPassword(e.target.value)}
              required minLength={6} placeholder="Min 6 characters" autoComplete="current-password"
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-card text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
            />
          </div>
        </div>

        {/* Forgot Password Link - Login only */}
        {mode === "login" && (
          <div className="text-right">
            <Link to="/forgot-password" className="text-xs text-primary hover:underline">
              Forgot password?
            </Link>
          </div>
        )}

        {mode === "register" && (
          <>
            <fieldset>
              <legend className="block text-sm font-medium text-foreground mb-1.5">I am a</legend>
              <div className="grid grid-cols-2 gap-2">
                {ROLES.map(r => (
                  <button
                    key={r.value} type="button"
                    onClick={() => setRole(r.value)}
                    role="radio"
                    aria-checked={role === r.value}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      role === r.value ? "border-primary bg-primary/10 text-primary" : "border-border hover:border-primary/30 text-muted-foreground"
                    }`}
                  >
                    <r.icon className="w-4 h-4 mb-1" />
                    <p className="text-xs font-semibold">{r.label}</p>
                    <p className="text-[10px] opacity-70">{r.desc}</p>
                  </button>
                ))}
              </div>
            </fieldset>

            <div>
              <label htmlFor="auth-company" className="block text-sm font-medium text-foreground mb-1.5">
                {role === "dpco" ? "Full Name / Firm Name" : "Company Name"}
              </label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  id="auth-company" name="company" type="text"
                  value={companyName} onChange={e => setCompanyName(e.target.value)}
                  required placeholder={role === "dpco" ? "Your name or firm name" : "Your company name"}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-card text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
                />
              </div>
            </div>

            {role === "organization" && (
              <>
                <div>
                  <label htmlFor="auth-size" className="block text-sm font-medium text-foreground mb-1.5">Company Size</label>
                  <select id="auth-size" name="company-size" value={companySize} onChange={e => setCompanySize(e.target.value)}
                    aria-label="Select company size" title="Company size"
                    className="w-full px-4 py-3 rounded-xl border border-border bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40">
                    {COMPANY_SIZES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                  </select>
                </div>

                <div>
                  <label htmlFor="auth-sector" className="block text-sm font-medium text-foreground mb-1.5">Sector</label>
                  <select id="auth-sector" name="sector" value={sector} onChange={e => setSector(e.target.value)}
                    aria-label="Select your sector" title="Business sector"
                    className="w-full px-4 py-3 rounded-xl border border-border bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40">
                    {SECTORS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                  </select>
                </div>

                <div>
                  <label htmlFor="auth-website" className="block text-sm font-medium text-foreground mb-1.5">Website (optional)</label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input id="auth-website" name="website" type="url" value={website} onChange={e => setWebsite(e.target.value)}
                      placeholder="https://yourcompany.com"
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-card text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all" />
                  </div>
                </div>
              </>
            )}

            {role === "dpco" && (
              <>
                <div>
                  <label htmlFor="auth-phone" className="block text-sm font-medium text-foreground mb-1.5">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input id="auth-phone" name="phone" type="tel" value={phone} onChange={e => setPhone(e.target.value)}
                      required placeholder="+234..."
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-card text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all" />
                  </div>
                </div>

                <div>
                  <label htmlFor="auth-license" className="block text-sm font-medium text-foreground mb-1.5">Registration / License Number</label>
                  <div className="relative">
                    <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input id="auth-license" name="license" type="text" value={registrationNumber} onChange={e => setRegistrationNumber(e.target.value)}
                      placeholder="DPCO registration number"
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-card text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all" />
                  </div>
                </div>

                <div>
                  <label htmlFor="auth-specialization" className="block text-sm font-medium text-foreground mb-1.5">Sector Specialization</label>
                  <select id="auth-specialization" name="specialization" value={sector} onChange={e => setSector(e.target.value)}
                    aria-label="Select specialization sector" title="Specialization sector"
                    className="w-full px-4 py-3 rounded-xl border border-border bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40">
                    {SECTORS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                  </select>
                </div>
              </>
            )}
          </>
        )}

        <button type="submit" disabled={loading}
          className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2">
          {loading ? (
            <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
          ) : (
            <Shield className="w-4 h-4" />
          )}
          {mode === "login" ? "Sign In" : "Create Account"}
        </button>
      </form>
    </div>
  );
}