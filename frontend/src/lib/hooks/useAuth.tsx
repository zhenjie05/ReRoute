import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@/models/user';
import { supabase } from '@/lib/supabase/client';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signIn: (email: string, password?: string) => Promise<{ error?: string }>;
  signUp: (email: string, password?: string, name?: string) => Promise<{ error?: string }>;
  signInWithGoogle: () => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<{ error?: string }>;
}

const mockUser: User = {
  id: 'demo-user-1',
  email: 'alex@example.com',
  name: 'Alex Chen',
  auth_provider: 'email',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop',
  home_country: 'Singapore',
  created_at: new Date().toISOString(),
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(mockUser);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        if (data.session?.user) {
          const authUser = data.session.user;
          setUser({
            id: authUser.id,
            email: authUser.email || '',
            name: authUser.user_metadata?.name || 'Alex Chen',
            auth_provider: (authUser.app_metadata?.provider as any) || 'email',
            avatar: authUser.user_metadata?.avatar_url || mockUser.avatar,
            home_country: authUser.user_metadata?.home_country || 'Singapore',
            created_at: authUser.created_at,
          });
        }
      } catch (err) {
        // Fallback to mock user
      }
    };
    checkSession();
  }, []);

  const signIn = async (email: string, password?: string) => {
    setIsLoading(true);
    try {
      if (password) {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
          setUser({ ...mockUser, email });
          return {};
        }
        if (data.user) {
          setUser({
            id: data.user.id,
            email: data.user.email || email,
            name: data.user.user_metadata?.name || 'Alex Chen',
            auth_provider: 'email',
            avatar: data.user.user_metadata?.avatar_url || mockUser.avatar,
            home_country: 'Singapore',
            created_at: data.user.created_at,
          });
        }
      } else {
        setUser({ ...mockUser, email });
      }
      return {};
    } catch (err: any) {
      return { error: err.message || 'Login failed' };
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, password?: string, name?: string) => {
    setIsLoading(true);
    try {
      if (password) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { name: name || 'Traveler' } },
        });
        if (error) {
          setUser({ ...mockUser, email, name: name || 'Alex Chen' });
          return {};
        }
        if (data.user) {
          setUser({
            id: data.user.id,
            email: data.user.email || email,
            name: name || 'Traveler',
            auth_provider: 'email',
            avatar: null,
            home_country: 'Singapore',
            created_at: data.user.created_at,
          });
        }
      } else {
        setUser({ ...mockUser, email, name: name || 'Alex Chen' });
      }
      return {};
    } catch (err: any) {
      return { error: err.message || 'Registration failed' };
    } finally {
      setIsLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    setIsLoading(true);
    try {
      setUser(mockUser);
      return {};
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch (e) {
      // Ignore
    }
    setUser(null);
  };

  const updateProfile = async (updates: Partial<User>) => {
    if (!user) return { error: 'Not authenticated' };
    setUser({ ...user, ...updates });
    return {};
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
