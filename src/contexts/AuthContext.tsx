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
  checkEmailExists: (email: string) => Promise<boolean>;
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
    }
  }

  // Check if email already exists in Supabase auth
  async function checkEmailExists(email: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('id')
        .eq('id', email) // This won't work directly - we need auth admin
        .maybeSingle();
      
      // Alternative: Try to sign in with invalid password to check if user exists
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password: 'this-is-a-test-to-check-if-email-exists-12345',
      });

      // If error is about invalid credentials (not "user not found"), email exists
      if (signInError?.message?.includes('Invalid login credentials')) {
        return true;
      }
      
      return false;
    } catch {
      return false;
    }
  }

  async function signUp(email: string, password: string, role: string, metadata?: any): Promise<{ error?: string; success?: string }> {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { 
            role, 
            full_name: metadata?.full_name || metadata?.company_name || '',
            company_name: metadata?.company_name || '',
            phone_number: metadata?.phone_number || '',
          },
          emailRedirectTo: 'https://regtrack-nigeria.vercel.app/login',
        },
      });

      if (error) {
        if (error.message.includes('already registered') || error.message.includes('already exists')) {
          return { error: 'An account with this email already exists. Please sign in instead.' };
        }
        if (error.message.includes('User already registered')) {
          return { error: 'An account with this email already exists. Please sign in instead.' };
        }
        return { error: error.message };
      }

      if (!data.user) {
        return { error: 'Failed to create account. Please try again.' };
      }

      // Save user profile to user_profiles table
      const { error: profileError } = await supabase.from('user_profiles').upsert({
        id: data.user.id,
        role,
        company_name: metadata?.company_name || email?.split('@')[0] || 'User',
        company_size: metadata?.company_size || null,
        website_url: metadata?.website || null,
        phone_number: metadata?.phone_number || null,
        registration_number: metadata?.registration_number || null,
        license_url: metadata?.license_url || null,
        is_verified: false,
      });

      if (profileError) {
        console.error('Failed to save profile:', profileError.message);
      }

      // Save user sector if provided
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
      if (data.session === null) {
        return { 
          success: 'Confirmation email sent! Please check your inbox and click the confirmation link before signing in.' 
        };
      }

      return { success: 'Account created! You can now sign in.' };
    } catch (err: any) {
      return { error: err.message || 'Registration failed. Please try again.' };
    }
  }

  async function signIn(email: string, password: string): Promise<{ error?: string }> {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) {
        if (error.message.includes('Invalid login credentials') || error.message.includes('Invalid email or password')) {
          return { error: 'Invalid email or password. Please try again.' };
        }
        if (error.message.includes('Email not confirmed')) {
          return { error: 'Please check your email and confirm your account before signing in.' };
        }
        if (error.message.includes('User not found')) {
          return { error: 'No account found with this email. Please register first.' };
        }
        return { error: error.message };
      }

      // Check and update profile after successful login
      if (data?.user) {
        const { data: existingProfile } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('id', data.user.id)
          .maybeSingle();

        if (!existingProfile) {
          // Create profile if it doesn't exist
          await supabase.from('user_profiles').upsert({
            id: data.user.id,
            role: data.user.user_metadata?.role || 'organization',
            company_name: data.user.user_metadata?.company_name || data.user.email?.split('@')[0] || 'User',
            is_verified: true,
          });
        } else if (!existingProfile.is_verified) {
          // Mark as verified on first successful sign in after email confirmation
          await supabase.from('user_profiles').update({ is_verified: true }).eq('id', data.user.id);
        }
      }

      return {};
    } catch (err: any) {
      return { error: err.message || 'Sign in failed. Please try again.' };
    }
  }

  async function signInWithGoogle(): Promise<{ error?: string }> {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
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
    <AuthContext.Provider value={{ 
      user, profile, session, loading, 
      signUp, signIn, signInWithGoogle, signOut, 
      checkEmailExists 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}