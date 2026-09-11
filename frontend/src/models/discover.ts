export type CommunityPostType = 'recap' | 'cloneable_itinerary';

export interface ItineraryStopDetail {
  time?: string;
  name: string;
  description?: string;
  tag?: string;
  category?: 'attraction' | 'transit' | 'stay' | 'meal';
  transit_note?: string;
}

export interface DayBreakdownDetail {
  day_number: number;
  title: string;
  subtitle?: string;
  stops: ItineraryStopDetail[];
  transit_note?: string;
}

export interface BudgetSegmentDetail {
  category: string;
  percent: number;
  color?: string;
  amount?: number;
}

export interface CommunityPost {
  id: string;
  user_id: string;
  author_name: string;
  author_avatar?: string | null;
  author_level?: string;
  author_trips_count?: number;
  type: CommunityPostType;
  title: string;
  subtitle?: string;
  destination: string;
  cover_image: string;
  duration_days: number;
  nights_count?: number;
  travel_style: string;
  travel_pace: string;
  budget_tier?: string;
  estimated_cost_per_person?: number;
  content: string;
  linked_room_id?: string | null;
  stars_count: number;
  clones_count?: number;
  rating?: number;
  reviews_count?: number;
  is_starred?: boolean;
  tags?: string[];
  field_notes?: {
    quote: string;
    prime_window?: string;
    highlight?: string;
  };
  route_chain?: string[];
  key_stops?: string[];
  daily_breakdown?: DayBreakdownDetail[];
  budget_breakdown?: BudgetSegmentDetail[];
  splitting_tip?: string;
  created_at: string;
}

export interface StarredTrip {
  id?: string;
  user_id: string;
  post_id: string;
  discover_post_id?: string;
  linked_room_id?: string | null;
  starred_at: string;
  post?: CommunityPost;
}


