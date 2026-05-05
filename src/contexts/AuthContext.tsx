import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "@/lib/SupabaseClient";
import { User, Session } from "@supabase/supabase-js";

interface UserProfile {
  id: string;
  company_name?: string;
  company_size?: string;
  website_url?: string;
  phone_number?: string;
  role: string;
  registration_number?: string;
  license_url?: string;
  is_verified: boolean;
}

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, role: string, metadata?: any) => Promise<{ error?: string; success?: string }>;
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signInWithGoogle: () => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) fetchUserProfile(session.user.id);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchUserProfile(session.user.id);
      } else {
        setProfile(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  async function fetchUserProfile(userId: string) {
    const { data } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (data) {
      setProfile(data);
    } else {
      // Create profile if it doesn't exist
      const { data: newProfile } = await supabase
        .from('user_profiles')
        .upsert({
          id: userId,
          role: 'organization',
          company_name: 'User',
          is_verified: false,
        })
        .select('*')
        .single();

      if (newProfile) setProfile(newProfile);
    }
  }

  async function signUp(email: string, password: string, role: string, metadata?: any): Promise<{ error?: string; success?: string }> {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { role, ...metadata },
          emailRedirectTo: 'https://regtrack-nigeria.vercel.app/login',
        },
      });

      if (error) {
        if (error.message.includes('already registered')) {
          return { error: 'An account with this email already exists. Please sign in instead.' };
        }
        return { error: error.message };
      }

      if (!data.user) return { error: 'Failed to create account' };

      // Save user profile
      const { error: profileError } = await supabase.from('user_profiles').upsert({
        id: data.user.id,
        role,
        company_name: metadata?.company_name || null,
        company_size: metadata?.company_size || null,
        website_url: metadata?.website_url || null,
        phone_number: metadata?.phone_number || null,
        registration_number: metadata?.registration_number || null,
        license_url: metadata?.license_url || null,
        is_verified: false,
      });

      if (profileError) {
        console.error('Failed to save user profile:', profileError.message);
      }

      // Save user sector
      if (metadata?.sector_id) {
        const { data: sectorData } = await supabase
          .from('sectors')
          .select('id')
          .eq('slug', metadata.sector_id)
          .maybeSingle();

        if (sectorData) {
          await supabase.from('user_sectors').upsert({
            user_id: data.user.id,
            sector_id: sectorData.id,
          });
        }
      }

      // Check if email confirmation is required
      if (data.user?.identities?.length === 0) {
        return { success: 'Account created! You can now sign in.' };
      }

      return { success: 'Account created! Please check your email to confirm your registration.' };
    } catch (err: any) {
      return { error: err.message };
    }
  }

  async function signIn(email: string, password: string): Promise<{ error?: string }> {
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          return { error: 'Invalid email or password. Please try again.' };
        }
        if (error.message.includes('Email not confirmed')) {
          return { error: 'Please check your email and confirm your account before signing in.' };
        }
        return { error: error.message };
      }
      return {};
    } catch (err: any) {
      return { error: err.message };
    }
  }

  async function signInWithGoogle(): Promise<{ error?: string }> {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: 'https://regtrack-nigeria.vercel.app/',
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });
      if (error) return { error: error.message };
      return {};
    } catch (err: any) {
      return { error: err.message };
    }
  }

  async function signOut() {
    await supabase.auth.signOut();
    setProfile(null);
  }

  return (
    <AuthContext.Provider value={{ user, profile, session, loading, signUp, signIn, signInWithGoogle, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}