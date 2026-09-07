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
    title: 'Kyoto Zen & Bamboo Trails',
    destination: 'Kyoto, Japan',
    match_score: 96,
    match_tags: ['Cultural', 'Moderate', 'Couples'],
    duration_days: 4,
    cover_image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&fit=crop',
    clone_post_id: 'post-kyoto-1',
  },
  {
    id: 'rec-2',
    title: 'Seoul Street Food & Bukchon Alleys',
    destination: 'Seoul, South Korea',
    match_score: 91,
    match_tags: ['Cityscape', 'Food & Dining', 'Ambitious'],
    duration_days: 5,
    cover_image: 'https://images.unsplash.com/photo-1538485399081-7191377e8241?w=800&fit=crop',
    clone_post_id: 'post-seoul-1',
  },
];
