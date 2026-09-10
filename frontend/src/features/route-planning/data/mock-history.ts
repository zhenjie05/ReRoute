export type TimelineItemType = 'transport' | 'attraction' | 'accommodation';

export interface TimelineItem {
  id: string;
  type: TimelineItemType;
  title?: string;
  description?: string;
  meta1?: string;
  meta2?: string;
  imageUrl?: string;
  rating?: number;
  tags?: string[];
}

export interface TripHistoryItem {
  id: string;
  destination: string;
  dates: string;
  duration: string;
  matchPercentage: number;
  tags: string[];
  itineraryPreview: TimelineItem[];
}

export const mockAiHistory: TripHistoryItem[] = [
  {
    id: 'trip_1',
    destination: 'Tokyo, Japan',
    dates: 'Oct 1 - Oct 5',
    duration: '5D',
    matchPercentage: 98,
    tags: ['Couple', 'Cultural', 'Moderate'],
    itineraryPreview: [
      {
        id: 'jp_t1',
        type: 'transport',
        title: 'Kuala Lumpur (KUL) ✈️ Haneda (HND)',
        meta1: '09:10 - 17:10 • Direct (7h 00m)',
        meta2: '✓ Japan Airlines JL724 • $340 / person',
      },
      {
        id: 'jp_a1',
        type: 'attraction',
        title: 'Senso-ji Temple & Nakamise Street',
        description: 'Historic Buddhist temple & Nakamise shopping street in Asakusa.',
        imageUrl: 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=400&q=80',
        rating: 4.8,
        tags: ['🕒 2 - 3 hours', '☀️ Best at 14:00'],
      },
      {
        id: 'jp_acc1',
        type: 'accommodation',
        description: 'No hotel locked in for Day 1 yet. Choose nearby Asakusa or Shinjuku Ryokan.',
      },
    ],
  },
  {
    id: 'trip_2',
    destination: 'Paris, France',
    dates: 'Nov 10 - Nov 16',
    duration: '7D',
    matchPercentage: 95,
    tags: ['Friends', 'Classic', 'Relaxed'],
    itineraryPreview: [
      {
        id: 'fr_t1',
        type: 'transport',
        title: 'Kuala Lumpur (KUL) ✈️ Charles de Gaulle (CDG)',
        meta1: '23:50 - 06:40 (+1) • Direct (13h 50m)',
        meta2: '✓ Malaysia Airlines MH20 • $650 / person',
      },
      {
        id: 'fr_a1',
        type: 'attraction',
        title: 'Eiffel Tower & Champ de Mars',
        description: 'Iconic wrought-iron spire with sweeping city views & park.',
        imageUrl: 'https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?w=400&q=80',
        rating: 4.9,
        tags: ['🕒 3 - 4 hours', '🌆 Best at Sunset'],
      },
      {
        id: 'fr_acc1',
        type: 'accommodation',
        description: 'No hotel locked in for Day 1 yet. Check Marais district for boutique stays.',
      },
    ],
  },
  {
    id: 'trip_3',
    destination: 'Bali, Indonesia',
    dates: 'Dec 20 - Dec 24',
    duration: '5D',
    matchPercentage: 92,
    tags: ['Family', 'Nature', 'Relaxed'],
    itineraryPreview: [
      {
        id: 'ba_t1',
        type: 'transport',
        title: 'Kuala Lumpur (KUL) ✈️ Ngurah Rai (DPS)',
        meta1: '10:00 - 13:05 • Direct (3h 05m)',
        meta2: '✓ AirAsia AK304 • $120 / person',
      },
      {
        id: 'ba_a1',
        type: 'attraction',
        title: 'Ubud Monkey Forest',
        description: 'Lush nature reserve with free-roaming macaques and ancient temples.',
        imageUrl: 'https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?w=400&q=80',
        rating: 4.7,
        tags: ['🕒 1 - 2 hours', '🐒 Family Friendly'],
      },
      {
        id: 'ba_acc1',
        type: 'accommodation',
        description: 'No hotel locked in for Day 1 yet. Villas in Ubud center recommended.',
      },
    ],
  },
];
