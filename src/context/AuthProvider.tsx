import { useEffect, useMemo, useState, type ReactNode } from 'react';
import type { User } from '@supabase/supabase-js';
import { supabase } from '../services/supabase';
import { AuthContext, type AuthResult } from './auth-context';

const passwordRedirectUrl = `${window.location.origin}${import.meta.env.BASE_URL}`;

interface AuthProviderProps {
  children: ReactNode;
}

const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isRecovery, setIsRecovery] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
      setLoading(false);
    });

    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY') {
        setIsRecovery(true);
      }
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => {
      data.subscription.unsubscribe();
    };
  }, []);

  const value = useMemo(() => {
    const signIn = async (email: string, password: string): Promise<AuthResult> => {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      return { error: error?.message ?? null };
    };

    const signOut = async () => {
      await supabase.auth.signOut();
    };

    const sendPasswordReset = async (email: string): Promise<AuthResult> => {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: passwordRedirectUrl,
      });
      return { error: error?.message ?? null };
    };

    const updatePassword = async (password: string): Promise<AuthResult> => {
      const { error } = await supabase.auth.updateUser({ password });
      if (!error) {
        setIsRecovery(false);
      }
      return { error: error?.message ?? null };
    };

    return { user, loading, isRecovery, signIn, signOut, sendPasswordReset, updatePassword };
  }, [user, loading, isRecovery]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
