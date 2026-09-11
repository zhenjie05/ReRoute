export type TimelineItemType = 'transport' | 'attraction' | 'accommodation';

export interface TimelineItem {
  id: string;
  day?: number;
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
        id: 'jp_t1_d1',
        day: 1,
        type: 'transport',
        title: 'Kuala Lumpur (KUL) ✈️ Haneda (HND)',
        meta1: '09:10 - 17:10 • Direct (7h 00m)',
        meta2: '✓ Japan Airlines JL724 • $340 / person',
      },
      {
        id: 'jp_a1_d1',
        day: 1,
        type: 'attraction',
        title: 'Senso-ji Temple & Nakamise Street',
        description: 'Historic Buddhist temple & Nakamise shopping street in Asakusa.',
        imageUrl: 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=400&q=80',
        rating: 4.8,
        tags: ['🕒 2 - 3 hours', '☀️ Best at 14:00'],
      },
      {
        id: 'jp_acc1_d1',
        day: 1,
        type: 'accommodation',
        description: 'No hotel locked in for Day 1 yet. Choose nearby Asakusa or Shinjuku Ryokan.',
      },
      {
        id: 'jp_t1_d2',
        day: 2,
        type: 'transport',
        title: 'Shinjuku Station 🚇 Shibuya Station',
        meta1: '10:00 - 10:15 • JR Yamanote Line (15m)',
        meta2: '✓ JR Pass included',
      },
      {
        id: 'jp_a1_d2',
        day: 2,
        type: 'attraction',
        title: 'Shibuya Crossing & Meiji Shrine',
        description: 'Experience the busiest intersection in the world, then relax in the tranquil Meiji forest.',
        imageUrl: 'https://images.unsplash.com/photo-1542051812871-75f10b77e8df?w=400&q=80',
        rating: 4.9,
        tags: ['🕒 4 - 5 hours', '🌆 Best at Sunset'],
      },
      {
        id: 'jp_acc1_d2',
        day: 2,
        type: 'accommodation',
        description: 'No hotel locked in for Day 2 yet. Choose nearby Shibuya or Harajuku.',
      },
      {
        id: 'jp_t1_d3',
        day: 3,
        type: 'transport',
        title: 'Tokyo Station 🚄 Kyoto Station',
        meta1: '09:00 - 11:15 • Shinkansen Nozomi (2h 15m)',
        meta2: '✓ JR Pass included',
      },
      {
        id: 'jp_a1_d3',
        day: 3,
        type: 'attraction',
        title: 'Fushimi Inari Taisha',
        description: 'Iconic shrine with thousands of vermilion torii gates.',
        imageUrl: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=400&q=80',
        rating: 4.9,
        tags: ['🕒 2 - 3 hours', '🌅 Best at Sunrise'],
      },
      {
        id: 'jp_acc1_d3',
        day: 3,
        type: 'accommodation',
        description: 'No hotel locked in for Day 3 yet. Consider a traditional Machiya in Gion.',
      },
      {
        id: 'jp_t1_d4',
        day: 4,
        type: 'transport',
        title: 'Kyoto Station 🚇 Arashiyama',
        meta1: '08:30 - 09:00 • JR Sagano Line (30m)',
        meta2: '✓ JR Pass included',
      },
      {
        id: 'jp_a1_d4',
        day: 4,
        type: 'attraction',
        title: 'Arashiyama Bamboo Grove',
        description: 'Walking path through a soaring bamboo forest.',
        imageUrl: 'https://images.unsplash.com/photo-1578637387939-43c525550085?w=400&q=80',
        rating: 4.8,
        tags: ['🕒 2 hours', '🌅 Best Early Morning'],
      },
      {
        id: 'jp_acc1_d4',
        day: 4,
        type: 'accommodation',
        description: 'No hotel locked in for Day 4 yet. Consider Arashiyama onsen ryokan.',
      },
      {
        id: 'jp_t1_d5',
        day: 5,
        type: 'transport',
        title: 'Kyoto Station 🚄 Tokyo Station ✈️ Haneda',
        meta1: '10:00 - 14:00 • Shinkansen + Monorail (4h)',
        meta2: '✓ JR Pass included',
      },
      {
        id: 'jp_a1_d5',
        day: 5,
        type: 'attraction',
        title: 'Last Minute Souvenir Shopping',
        description: 'Pick up some Tokyo Banana and Matcha KitKats before heading to the airport.',
        imageUrl: 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=400&q=80',
        rating: 4.6,
        tags: ['🕒 2 hours', '🛍️ Shopping'],
      },
      {
        id: 'jp_acc1_d5',
        day: 5,
        type: 'accommodation',
        description: 'No hotel locked in for Day 5 yet. Flying back home tonight.',
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
