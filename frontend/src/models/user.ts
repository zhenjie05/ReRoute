export interface User {
  id: string;
  email: string;
  auth_provider: 'email' | 'google';
  name: string;
  avatar?: string | null;
  home_country: string;
  created_at: string;
}
