import { useState, useEffect } from 'react';
import { StarredTrip } from '@/models/discover';
import { mockTripRooms } from '@/features/trip-room/data/mock-trip-room';
import { getStarredTrips, subscribeToDiscoverStore } from '@/features/discover/data/mock-discover';

export interface UserProfile {
  id: string;
  display_name: string;
  avatar_url: string | null;
  trip_count: number;
  country_count: number;
}

export interface Badge {
  id: string;
  key: string;
  label: string;
  icon: string;
}

export interface UserBadge {
  user_id: string;
  badge_id: string;
  unlocked_at: string | null;
}


export interface LanguageProgress {
  user_id: string;
  language: string;
  streak_days: number;
  mastery_percent: number;
}

export interface TripRoomSummary {
  id: string;
  name: string;
  destination: string;
  dates: string;
  stage: 'planning' | 'active' | 'archived';
}

const mockUser: UserProfile = {
  id: 'user_1',
  display_name: 'Elena R.',
  avatar_url: null,
  trip_count: 14,
  country_count: 6,
};

const mockLanguageProgress: LanguageProgress = {
  user_id: 'user_1',
  language: 'Japanese',
  streak_days: 23,
  mastery_percent: 64,
};

const mockBadges: Badge[] = [
  { id: 'b1', key: 'globetrotter', label: 'Globetrotter', icon: '🌎' },
  { id: 'b2', key: 'foodie', label: 'Foodie', icon: '🍴' },
  { id: 'b3', key: 'early_bird', label: 'Early Bird', icon: '⏰' },
  { id: 'b4', key: 'mountain_goat', label: 'Mountain Goat', icon: '⛰️' },
  { id: 'b5', key: 'language_pro', label: 'Language Pro', icon: 'A文' },
  { id: 'b6', key: 'budget_king', label: 'Budget King', icon: '💰' },
  { id: 'b7', key: 'beach_bum', label: 'Beach Bum', icon: '🏖️' },
  { id: 'b8', key: 'city_explorer', label: 'City Explorer', icon: '🏙️' },
];

const mockUserBadges: UserBadge[] = [
  { user_id: 'user_1', badge_id: 'b1', unlocked_at: '2023-01-01' },
  { user_id: 'user_1', badge_id: 'b2', unlocked_at: '2023-02-15' },
  { user_id: 'user_1', badge_id: 'b3', unlocked_at: '2023-04-10' },
  { user_id: 'user_1', badge_id: 'b4', unlocked_at: null },
  { user_id: 'user_1', badge_id: 'b5', unlocked_at: null },
  { user_id: 'user_1', badge_id: 'b6', unlocked_at: null },
  { user_id: 'user_1', badge_id: 'b7', unlocked_at: '2023-06-20' },
  { user_id: 'user_1', badge_id: 'b8', unlocked_at: '2023-08-05' },
];

export const useProfileMockData = () => {
  const [user, setUser] = useState<UserProfile>(mockUser);
  const badges = mockBadges;
  const userBadges = mockUserBadges;
  const [starredTrips, setStarredTrips] = useState<StarredTrip[]>(() => getStarredTrips());
  const languageProgress = mockLanguageProgress;

  useEffect(() => {
    const update = () => {
      setStarredTrips(getStarredTrips());
    };
    return subscribeToDiscoverStore(update);
  }, []);
  
  // Dynamically filter actual mockTripRooms for archived stage
  const archivedTrips: TripRoomSummary[] = mockTripRooms
    .filter(room => room.stage === 'archived')
    .map(room => ({
      id: room.id,
      name: room.name,
      destination: room.destination,
      dates: new Date(room.start_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      stage: 'archived',
    }));

  // Per NFR-7-1, we return all data in a single payload
  return {
    user,
    badges,
    userBadges,
    starredTrips,
    languageProgress,
    archivedTrips,
    updateUser: (updates: Partial<UserProfile>) => setUser({ ...user, ...updates }),
  };
};

