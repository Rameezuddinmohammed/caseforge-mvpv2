'use client';

import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from './supabase';
import { checkAndSetupUser } from './onboarding';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  signOut: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  error: null,
  signOut: async () => {},
  clearError: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  useEffect(() => {
    // Try to get cached session synchronously (for older SDKs)
    let initialUser: User | null = null;
    // For Supabase JS v2+, there is no synchronous session getter, so we always need to call getSession()
    // We'll skip the localStorage optimization to avoid linter errors and always use the async getSession() call
    setLoading(true);
    supabase.auth.getSession().then(({ data, error: sessionError }) => {
      if (sessionError) {
        setError(sessionError.message);
        setLoading(false);
        return;
      }
      if (data?.session?.user) {
        setUser(data.session.user);
        checkAndSetupUser(data.session.user).catch((setupError) => {
          console.error('Error setting up user:', setupError);
        });
      }
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        try {
          if (session?.user) {
            setUser(session.user);
            try {
              await checkAndSetupUser(session.user);
            } catch (setupError) {
              console.error('Error setting up user:', setupError);
            }
            setError(null);
          } else {
            setUser(null);
          }
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Authentication state change failed');
        } finally {
          setLoading(false);
        }
      }
    );
    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    try {
      setLoading(true);
      const { error: signOutError } = await supabase.auth.signOut();
      if (signOutError) {
        setError(signOutError.message);
      }
    } catch (err) {
      setError('Failed to sign out. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, signOut, clearError }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 