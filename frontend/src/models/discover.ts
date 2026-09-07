export type CommunityPostType = 'recap' | 'cloneable_itinerary';

export interface CommunityPost {
  id: string;
  user_id: string;
  author_name: string;
  author_avatar?: string | null;
  type: CommunityPostType;
  title: string;
  destination: string;
  cover_image: string;
  duration_days: number;
  travel_style: string;
  travel_pace: string;
  content: string;
  linked_room_id?: string | null;
  stars_count: number;
  is_starred?: boolean;
  created_at: string;
}

export interface StarredTrip {
  user_id: string;
  post_id: string;
  starred_at: string;
  post?: CommunityPost;
}
