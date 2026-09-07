import { Badge } from '@/models/badge';
import { TripRoom } from '@/models/trip-room';
import { CommunityPost } from '@/models/discover';
import { mockTripRooms } from '@/features/trip-room/data/mock-trip-room';
import { mockDiscoverPosts } from '@/features/discover/data/mock-discover';

export const mockBadges: Badge[] = [
  {
    id: 'b-1',
    user_id: 'demo-user-1',
    badge_type: 'first_escape',
    title: 'First Escape',
    description: 'Created your first trip room on ReRoute.',
    icon_name: '🚀',
    earned_at: '2026-08-01T00:00:00Z',
  },
  {
    id: 'b-2',
    user_id: 'demo-user-1',
    badge_type: 'globe_trotter',
    title: '3 Countries Visited',
    description: 'Planned trips across Japan, Switzerland, and Indonesia.',
    icon_name: '🌍',
    earned_at: '2026-09-01T00:00:00Z',
  },
  {
    id: 'b-3',
    user_id: 'demo-user-1',
    badge_type: 'language_scholar',
    title: 'Language Scholar',
    description: 'Completed Japanese Dining & Food Quiz with 100% score.',
    icon_name: '🎓',
    earned_at: '2026-09-04T00:00:00Z',
  },
];

export interface UnifiedProfileData {
  pastTrips: TripRoom[];
  badges: Badge[];
  starredTrips: CommunityPost[];
}

export const getUnifiedProfileData = (): UnifiedProfileData => {
  return {
    pastTrips: mockTripRooms,
    badges: mockBadges,
    starredTrips: mockDiscoverPosts.filter((p) => p.is_starred),
  };
};
