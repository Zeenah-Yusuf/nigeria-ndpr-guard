import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { supabase } from "@/lib/SupabaseClient";
import { User, Session } from "@supabase/supabase-js";

export type UserRole = "admin" | "dpco" | "organization";

export interface UserProfile {
  id: string;
  company_name: string | null;
  company_size: string | null;
  website_url: string | null;
  phone_number: string | null;
  role: UserRole;
  registration_number: string | null;
  license_url: string | null;
  is_verified: boolean;
}

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, role: UserRole, metadata?: Record<string, unknown>) => Promise<{ error?: string; success?: string }>;
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signInWithGoogle: () => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const VALID_ROLES: UserRole[] = ["admin", "dpco", "organization"];

function isValidRole(value: unknown): value is UserRole {
  return typeof value === "string" && VALID_ROLES.includes(value as UserRole);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = useCallback(async (userId: string): Promise<UserProfile | null> => {
    const { data, error } = await supabase
      .from("user_profiles")
      .select("*")
      .eq("id", userId)
      .maybeSingle();

    if (error) return null;
    if (!data) return null;
    if (!isValidRole(data.role)) return null;

    return data as UserProfile;
  }, []);

  const ensureProfile = useCallback(async (authUser: User): Promise<UserProfile | null> => {
    const existing = await fetchProfile(authUser.id);
    if (existing) return existing;

    const role = isValidRole(authUser.user_metadata?.role)
      ? (authUser.user_metadata.role as UserRole)
      : "organization";

    const companyName =
      authUser.user_metadata?.full_name ||
      authUser.user_metadata?.company_name ||
      authUser.email?.split("@")[0] ||
      "User";

    const isOAuth = authUser.app_metadata?.provider === "google";

    const { data, error } = await supabase
      .from("user_profiles")
      .upsert(
        {
          id: authUser.id,
          role,
          company_name: companyName,
          is_verified: isOAuth,
        },
        { onConflict: "id" }
      )
      .select("*")
      .single();

    if (error) return null;
    return data as UserProfile;
  }, [fetchProfile]);

  const loadProfile = useCallback(async (authUser: User): Promise<void> => {
    const userProfile = await ensureProfile(authUser);
    if (userProfile) {
      setProfile(userProfile);
    }
  }, [ensureProfile]);

  const refreshProfile = useCallback(async (): Promise<void> => {
    if (!user) return;
    const userProfile = await fetchProfile(user.id);
    if (userProfile) {
      setProfile(userProfile);
    }
  }, [user, fetchProfile]);

  useEffect(() => {
    let mounted = true;

    const initAuth = async () => {
      const { data: sessionData } = await supabase.auth.getSession();
      if (!mounted) return;

      const currentSession = sessionData.session;
      setSession(currentSession);
      setUser(currentSession?.user ?? null);

      if (currentSession?.user) {
        await loadProfile(currentSession.user);
      }

      if (mounted) {
        setLoading(false);
      }
    };

    initAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, newSession) => {
      if (!mounted) return;

      setSession(newSession);
      setUser(newSession?.user ?? null);

      if (newSession?.user) {
        await loadProfile(newSession.user);
      } else {
        setProfile(null);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [loadProfile]);

  async function signUp(
    email: string,
    password: string,
    role: UserRole,
    metadata?: Record<string, unknown>
  ): Promise<{ error?: string; success?: string }> {
    if (!email || !password) {
      return { error: "Email and password are required." };
    }

    if (!isValidRole(role)) {
      return { error: "Invalid role selected." };
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { role, ...metadata },
      },
    });

    if (error) {
      if (error.message.includes("already registered") || error.message.includes("already exists")) {
        return { error: "An account with this email already exists. Please sign in instead." };
      }
      if (error.message.includes("rate limit") || error.message.includes("too many")) {
        return { error: "Too many attempts. Please wait a moment before trying again." };
      }
      return { error: error.message };
    }

    if (!data.user) {
      return { error: "Failed to create account. Please try again." };
    }

    const companyName = metadata?.company_name
      ? String(metadata.company_name)
      : email.split("@")[0];

    const { error: profileError } = await supabase
      .from("user_profiles")
      .upsert(
        {
          id: data.user.id,
          role,
          company_name: companyName,
          company_size: metadata?.company_size ? String(metadata.company_size) : null,
          website_url: metadata?.website ? String(metadata.website) : null,
          phone_number: metadata?.phone_number ? String(metadata.phone_number) : null,
          registration_number: metadata?.registration_number ? String(metadata.registration_number) : null,
          is_verified: data.session !== null,
        },
        { onConflict: "id" }
      );

    if (profileError) {
      return { error: "Account created but profile setup failed. Please contact support." };
    }

    if (metadata?.sector_id) {
      try {
        const { data: sectorData } = await supabase
          .from("sectors")
          .select("id")
          .eq("slug", String(metadata.sector_id))
          .maybeSingle();

        if (sectorData) {
          await supabase.from("user_sectors").upsert(
            {
              user_id: data.user.id,
              sector_id: sectorData.id,
            },
            { onConflict: "user_id" }
          );
        }
      } catch {
        // Sector is optional, account creation succeeds regardless
      }
    }

    return { success: "Account created successfully." };
  }

  async function signIn(email: string, password: string): Promise<{ error?: string }> {
    if (!email || !password) {
      return { error: "Email and password are required." };
    }

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      if (error.message.includes("Invalid login credentials")) {
        return { error: "Invalid email or password." };
      }
      if (error.message.includes("Email not confirmed")) {
        return { error: "Please confirm your email before signing in." };
      }
      return { error: error.message };
    }

    if (data.user) {
      await loadProfile(data.user);
    }

    return {};
  }

  async function signInWithGoogle(): Promise<{ error?: string }> {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        queryParams: {
          access_type: "offline",
          prompt: "consent",
        },
      },
    });

    if (error) {
      return { error: error.message };
    }

    return {};
  }

  async function signOut(): Promise<void> {
    try {
      await supabase.auth.signOut();
    } catch {
      // State cleanup proceeds regardless
    }
    setProfile(null);
    setUser(null);
    setSession(null);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        session,
        loading,
        signUp,
        signIn,
        signInWithGoogle,
        signOut,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}