// fallow-ignore-file unused-file
import { User } from '@/models/user';

export const mockUsers: User[] = [
  {
    id: 'demo-user-1',
    email: 'alex@example.com',
    name: 'Alex Chen',
    auth_provider: 'email',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop',
    home_country: 'Singapore',
    created_at: '2026-01-15T08:00:00Z',
  },
  {
    id: 'demo-user-2',
    email: 'taylor@example.com',
    name: 'Taylor Swift',
    auth_provider: 'google',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&h=200&fit=crop',
    home_country: 'United States',
    created_at: '2026-02-01T10:30:00Z',
  },
  {
    id: 'demo-user-3',
    email: 'sam@example.com',
    name: 'Sam Lee',
    auth_provider: 'email',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop',
    home_country: 'Malaysia',
    created_at: '2026-02-14T14:00:00Z',
  },
];
