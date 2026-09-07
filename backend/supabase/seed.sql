-- seed.sql for local development testing
-- Note: Insert demo auth.users and matching public.users if using local supabase

-- Demo users for testing
INSERT INTO public.users (id, email, auth_provider, name, avatar, home_country, created_at)
VALUES
  ('00000000-0000-0000-0000-000000000001', 'alex@example.com', 'email', 'Alex Chen', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop', 'Singapore', NOW()),
  ('00000000-0000-0000-0000-000000000002', 'taylor@example.com', 'google', 'Taylor Swift', 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&h=200&fit=crop', 'United States', NOW()),
  ('00000000-0000-0000-0000-000000000003', 'sam@example.com', 'email', 'Sam Lee', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop', 'Malaysia', NOW())
ON CONFLICT (id) DO NOTHING;
