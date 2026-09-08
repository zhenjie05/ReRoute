import { useState } from 'react';
import { CommunityPost } from '@/models/discover';
import { mockTripRooms } from '@/features/trip-room/data/mock-trip-room';

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

export interface StarredTrip {
  id: string;
  user_id: string;
  discover_post_id: string;
  linked_room_id: string | null;
  post: CommunityPost;
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

const mockStarredTrips: StarredTrip[] = [
  {
    id: 'st_1',
    user_id: 'user_1',
    discover_post_id: 'p1',
    linked_room_id: null,
    post: {
      id: 'p1',
      user_id: 'u2',
      author_name: 'Sarah J.',
      type: 'cloneable_itinerary',
      title: 'Amalfi Coast Getaway',
      destination: 'Positano',
      cover_image: '',
      duration_days: 7,
      travel_style: 'Relaxing',
      travel_pace: 'Slow',
      content: 'Beautiful coast...',
      stars_count: 140,
      is_starred: true,
      created_at: '2023-10-01T00:00:00Z',
    },
  },
  {
    id: 'st_2',
    user_id: 'user_1',
    discover_post_id: 'p2',
    linked_room_id: null,
    post: {
      id: 'p2',
      user_id: 'u3',
      author_name: 'Yuki Tanaka',
      type: 'cloneable_itinerary',
      title: 'Kyoto Sakura Trail',
      destination: 'Temples & Tea',
      cover_image: '',
      duration_days: 5,
      travel_style: 'Cultural',
      travel_pace: 'Moderate',
      content: 'Cherry blossoms...',
      stars_count: 320,
      is_starred: true,
      created_at: '2024-03-01T00:00:00Z',
    },
  },
  {
    id: 'st_3',
    user_id: 'user_1',
    discover_post_id: 'p3',
    linked_room_id: null,
    post: {
      id: 'p3',
      user_id: 'u4',
      author_name: 'Liam Neeson',
      type: 'cloneable_itinerary',
      title: 'Paris Weekend',
      destination: 'Paris, France',
      cover_image: '',
      duration_days: 3,
      travel_style: 'City',
      travel_pace: 'Fast',
      content: 'Eiffel tower...',
      stars_count: 99,
      is_starred: true,
      created_at: '2024-05-01T00:00:00Z',
    },
  }
];


export const useProfileMockData = () => {
  const [user, setUser] = useState<UserProfile>(mockUser);
  const [badges, setBadges] = useState<Badge[]>(mockBadges);
  const [userBadges, setUserBadges] = useState<UserBadge[]>(mockUserBadges);
  const [starredTrips, setStarredTrips] = useState<StarredTrip[]>(mockStarredTrips);
  const [languageProgress, setLanguageProgress] = useState<LanguageProgress>(mockLanguageProgress);
  
  // Dynamically filter actual mockTripRooms for archived stage
  const mappedArchivedTrips: TripRoomSummary[] = mockTripRooms
    .filter(room => room.stage === 'archived')
    .map(room => ({
      id: room.id,
      name: room.name,
      destination: room.destination,
      dates: new Date(room.start_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      stage: 'archived',
    }));

  const [archivedTrips, setArchivedTrips] = useState<TripRoomSummary[]>(mappedArchivedTrips);

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
