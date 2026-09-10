export type TripStage = 'planning' | 'active' | 'archived';
export type TripSeason = 'spring' | 'summer' | 'autumn' | 'winter';

export interface TripSeasonTheme {
  background: string;
  border: string;
  badge: string;
  text: string;
}
export type MemberRole = 'owner' | 'member';

export type TravelCompanions = 'solo' | 'family' | 'couple' | 'friends' | 'elderly';
export type TravelStyle = 'cultural' | 'classic' | 'nature' | 'cityscape' | 'historical';
export type TravelPace = 'ambitious' | 'moderate' | 'relaxed';

export interface TripRoom {
  id: string;
  name: string;
export type MemberRole = 'owner' | 'member';

export type TravelCompanions = 'solo' | 'family' | 'couple' | 'friends' | 'elderly';
export type TravelStyle = 'cultural' | 'classic' | 'nature' | 'cityscape' | 'historical';
export type TravelPace = 'ambitious' | 'moderate' | 'relaxed';

export interface TripRoom {
  id: string;
  name: string;
  destination: string;
  stage: TripStage;
  created_by: string;
  start_date: string;
  end_date: string;
  theme_color?: string;
  is_public: boolean;
  cover_image?: string;
  groupProfileImage?: string;
  invite_code?: string;
  season?: TripSeason;
  season_theme?: TripSeasonTheme;
}
  room_id: string;
  user_id: string;
  role: MemberRole;
  location_sharing_opt_in: boolean;
  joined_at: string;
  is_live_for_user: boolean;
  user?: {
    name: string;
    avatar?: string | null;
  };
}

export interface TripPreferences {
  room_id: string;
  companions: TravelCompanions;
  travel_style: TravelStyle;
  travel_pace: TravelPace;
  updated_at: string;
}
