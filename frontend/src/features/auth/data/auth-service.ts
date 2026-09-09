import { supabase } from '@/lib/supabase/client';

/**
 * Maps raw Supabase Auth or network errors into clear, friendly, non-technical messages.
 */
function mapAuthError(error: any): string {
  if (!error) return 'An unexpected error occurred. Please try again.';

  const message = (error.message || error.error_description || String(error)).toLowerCase();

  if (
    message.includes('invalid login credentials') ||
    message.includes('invalid_credentials') ||
    message.includes('invalid_grant') ||
    message.includes('user not found') ||
    message.includes('wrong password')
  ) {
    return 'Invalid email or password.';
  }

  if (
    message.includes('user already registered') ||
    message.includes('email already in use') ||
    message.includes('already exists')
  ) {
    return 'An account with this email already exists.';
  }

  if (message.includes('password') && (message.includes('least') || message.includes('short'))) {
    return 'Password must be at least 8 characters.';
  }

  if (message.includes('valid email') || message.includes('invalid email')) {
    return 'Please enter a valid email address.';
  }

  if (
    message.includes('network') ||
    message.includes('failed to fetch') ||
    message.includes('timeout')
  ) {
    return 'Unable to connect to server. Please check your network connection.';
  }

  if (message.includes('rate limit') || message.includes('too many requests')) {
    return 'Too many attempts. Please wait a moment before trying again.';
  }

  return error.message || 'Authentication failed. Please check your details and try again.';
}

export const authService = {
  /**
   * Authenticate with email & password via Supabase Auth
   */
  async loginWithEmail(email: string, password: string) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        return { data: null, error: mapAuthError(error) };
      }

      return { data, error: null };
    } catch (err: any) {
      return { data: null, error: mapAuthError(err) };
    }
  },

  /**
   * Register a new user with email, password, and optional display name via Supabase Auth
   */
  async registerWithEmail(email: string, password: string, name?: string) {
    try {
      const trimmedEmail = email.trim();
      const displayName = name?.trim() || trimmedEmail.split('@')[0] || 'Traveler';

      const { data, error } = await supabase.auth.signUp({
        email: trimmedEmail,
        password,
        options: {
          data: {
            name: displayName,
            home_country: 'Singapore',
          },
        },
      });

      if (error) {
        return { data: null, error: mapAuthError(error) };
      }

      return { data, error: null };
    } catch (err: any) {
      return { data: null, error: mapAuthError(err) };
    }
  },

  /**
   * Sign in with Google OAuth
   */
  async loginWithGoogle() {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: 'reroute://auth/callback',
        },
      });

      if (error) {
        return { data: null, error: mapAuthError(error) };
      }

      return { data, error: null };
    } catch (err: any) {
      return { data: null, error: mapAuthError(err) };
    }
  },

  /**
   * Log out current authenticated session
   */
  async logout() {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        return { error: mapAuthError(error) };
      }
      return { error: null };
    } catch (err: any) {
      return { error: mapAuthError(err) };
    }
  },

  /**
   * Retrieve current Supabase session
   */
  async getSession() {
    const { data } = await supabase.auth.getSession();
    return data.session;
  },
};
