export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          auth_provider: string;
          name: string;
          avatar: string | null;
          home_country: string;
          created_at: string;
        };
        Insert: {
          id: string;
          email: string;
          auth_provider?: string;
          name: string;
          avatar?: string | null;
          home_country?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          auth_provider?: string;
          name?: string;
          avatar?: string | null;
          home_country?: string;
          created_at?: string;
        };
      };
    };
    Views: {};
    Functions: {};
  };
}
