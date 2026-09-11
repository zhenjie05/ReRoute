// fallow-ignore-file unused-file
import { Badge } from '@/models/badge';
import { TripRoom } from '@/models/trip-room';
import { CommunityPost } from '@/models/discover';
import {
  mockStandardBadges,
  mockStandardTripRooms,
  mockStandardCommunityPosts,
} from '@/shared/data/standard-mock-data';

export const mockBadges: Badge[] = mockStandardBadges;

export interface UnifiedProfileData {
  pastTrips: TripRoom[];
  badges: Badge[];
  starredTrips: CommunityPost[];
}

export const getUnifiedProfileData = (): UnifiedProfileData => {
  return {
    pastTrips: mockStandardTripRooms,
    badges: mockStandardBadges,
    starredTrips: mockStandardCommunityPosts.filter((p) => p.is_starred),
  };
};
