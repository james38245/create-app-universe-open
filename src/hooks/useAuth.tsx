import React, { useState, useEffect, createContext, useContext } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signUp: (email: string, password: string, userData?: any) => Promise<any>;
  signIn: (email: string, password: string) => Promise<any>;
  signOut: () => Promise<void>;
  resendConfirmation: (email: string) => Promise<any>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth event:', event, session?.user?.email_confirmed_at);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, userData?: any) => {
    const redirectUrl = `${window.location.origin}/auth?type=signup`;
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: userData, emailRedirectTo: redirectUrl }
    });

    // Add detailed logging:
    if (error) {
      console.error("Sign up error:", error);
    } else {
      console.log("Sign up initiated for", email);
    }

    return { data, error };
  };

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    // Defensive debug logging and explicit error for unverified accounts
    if (error) {
      console.error("Sign in error:", error);
      return { data, error };
    }

    if (data.user && !data.user.email_confirmed_at) {
      // Sign out the session immediately for safety
      await supabase.auth.signOut();
      console.warn("Attempt to sign in before email verified");
      return {
        data: null,
        error: {
          message: 'Please verify your email before signing in. Check your inbox for a verification link. If not received, click "Resend Email".',
          code: 'email_not_confirmed'
        }
      };
    }

    return { data, error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const resendConfirmation = async (email: string) => {
    const redirectUrl = `${window.location.origin}/auth?type=signup`;
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email,
      options: { emailRedirectTo: redirectUrl },
    });
    if (error) {
      console.error("Error resending confirmation:", error);
    } else {
      console.log("Resent confirmation email to:", email);
    }
    return { error };
  };

  const value = {
    user,
    loading,
    signUp,
    signIn,
    signOut,
    resendConfirmation
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
