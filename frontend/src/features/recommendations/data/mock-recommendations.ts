export interface RecommendedTrip {
  id: string;
  title: string;
  destination: string;
  match_score: number;
  match_tags: string[];
  duration_days: number;
  cover_image: string;
  clone_post_id: string;
}

export const mockRecommendations: RecommendedTrip[] = [
  {
    id: 'rec-1',
    title: 'Kyoto & Osaka Spring Discovery',
    destination: 'Kyoto & Osaka, Japan',
    match_score: 96,
    match_tags: ['Cultural', 'Moderate', 'Couples'],
    duration_days: 7,
    cover_image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&fit=crop',
    clone_post_id: 'post-kyoto-spring',
  },
  {
    id: 'rec-2',
    title: 'Tokyo Tech & Temples',
    destination: 'Tokyo, Japan',
    match_score: 91,
    match_tags: ['Cityscape', 'Gaming & Tech', 'Fast'],
    duration_days: 5,
    cover_image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=800&fit=crop',
    clone_post_id: 'post-tokyo-tech',
  },
];
