import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@/models/user';
import { supabase } from '@/lib/supabase/client';
import { authService } from '@/features/auth/data/auth-service';
import { currentDemoUser } from '@/shared/data/standard-mock-data';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signIn: (email: string, password?: string) => Promise<{ error?: string }>;
  signUp: (email: string, password?: string, name?: string) => Promise<{ error?: string }>;
  signInWithGoogle: () => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<{ error?: string }>;
  updateLocalProfile: (updates: Partial<User>) => void;
  demoSignIn?: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

const mapSupabaseUser = (authUser: any): User => ({
  id: authUser.id,
  email: authUser.email || '',
  name: authUser.user_metadata?.name || authUser.email?.split('@')[0] || 'Traveler',
  auth_provider: (authUser.app_metadata?.provider as any) || 'email',
  avatar: authUser.user_metadata?.avatar_url || null,
  home_country: authUser.user_metadata?.home_country || 'Singapore',
  created_at: authUser.created_at || new Date().toISOString(),
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    // 1. Initial session verification
    const checkInitialSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) {
          console.warn('[useAuth] getSession error:', error.message);
        }
        if (isMounted) {
          if (data.session?.user) {
            setUser(mapSupabaseUser(data.session.user));
          } else {
            setUser(null);
          }
        }
      } catch (err) {
        console.warn('[useAuth] Exception checking session:', err);
        if (isMounted) setUser(null);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    checkInitialSession();

    // 2. Real-time auth state listener
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!isMounted) return;
      if (session?.user) {
        setUser(mapSupabaseUser(session.user));
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });

    return () => {
      isMounted = false;
      authListener.subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password?: string): Promise<{ error?: string }> => {
    if (!password) {
      return { error: 'Please enter your password.' };
    }

    setIsLoading(true);
    try {
      const { data, error } = await authService.loginWithEmail(email, password);
      if (error) {
        return { error };
      }
      if (data?.user) {
        setUser(mapSupabaseUser(data.user));
      }
      return {};
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (
    email: string,
    password?: string,
    name?: string
  ): Promise<{ error?: string }> => {
    if (!password) {
      return { error: 'Please enter a password.' };
    }

    setIsLoading(true);
    try {
      const { data, error } = await authService.registerWithEmail(email, password, name);
      if (error) {
        return { error };
      }
      if (data?.user) {
        setUser(mapSupabaseUser(data.user));
      }
      return {};
    } finally {
      setIsLoading(false);
    }
  };

  const signInWithGoogle = async (): Promise<{ error?: string }> => {
    setIsLoading(true);
    try {
      const { error } = await authService.loginWithGoogle();
      if (error) {
        return { error };
      }
      return {};
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    setIsLoading(true);
    try {
      await authService.logout();
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<User>): Promise<{ error?: string }> => {
    if (!user) return { error: 'Not authenticated' };

    try {
      // For demo users, bypass supabase and just update local state
      if (user.id === currentDemoUser.id) {
        setUser((prev) => (prev ? { ...prev, ...updates } : null));
        return {};
      }

      const { error } = await supabase.auth.updateUser({
        data: {
          name: updates.name,
          avatar_url: updates.avatar,
          home_country: updates.home_country,
        },
      });

      if (error) {
        return { error: error.message };
      }

      setUser((prev) => (prev ? { ...prev, ...updates } : null));
      return {};
    } catch (err: any) {
      return { error: err.message || 'Profile update failed' };
    }
  };

  const demoSignIn = () => {
    setUser({ ...currentDemoUser });
  };

  const updateLocalProfile = (updates: Partial<User>) => {
    setUser((prev) => (prev ? { ...prev, ...updates } : null));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        signIn,
        signUp,
        signInWithGoogle,
        signOut,
        updateProfile,
        updateLocalProfile,
        demoSignIn,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
