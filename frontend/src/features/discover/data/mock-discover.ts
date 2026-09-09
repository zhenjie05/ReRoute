import { useState, useEffect } from 'react';
import { CommunityPost, StarredTrip } from '@/models/discover';
import { cloneCommunityItineraryToTripRoom } from '@/features/trip-room/data/mock-trip-room';
import { TripRoom } from '@/models/trip-room';

// Current demo user ID matching auth and profile
const CURRENT_USER_ID = '00000000-0000-0000-0000-000000000001';

/**
 * Canonical mock community posts modeled to match Requirements v2.2 §2 and SCREEN_SPEC.md §5.7-§5.9.
 */
export const initialMockCommunityPosts: CommunityPost[] = [
  {
    id: 'post-kyoto-spring',
    user_id: '00000000-0000-0000-0000-000000000004',
    author_name: 'Elena Rostova',
    author_avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop',
    author_level: 'LVL 4',
    author_trips_count: 14,
    type: 'cloneable_itinerary',
    title: 'Kyoto & Osaka Spring Discovery',
    subtitle: 'Ancient alleyways, dawn shrines & Osaka street eats',
    destination: 'Kyoto & Osaka, Japan',
    cover_image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&h=500&fit=crop',
    duration_days: 7,
    nights_count: 6,
    travel_style: 'Cultural',
    travel_pace: 'Moderate',
    budget_tier: '$$',
    estimated_cost_per_person: 1250,
    content: 'Built specifically for 3-5 friends seeking iconic dawn temples without the tour bus chaos. Covers blooming cherry blossom paths in Maruyama Park, peaceful Gion teahouses, and lively late-night Dotonbori food crawls.',
    linked_room_id: 'room-tokyo-2026',
    stars_count: 320,
    clones_count: 1420,
    rating: 4.9,
    reviews_count: 84,
    is_starred: true,
    tags: ['🏛️ Cultural', '🍜 Gastronomy', '🚶 Walkable', '🚆 JR Pass Friendly'],
    field_notes: {
      quote: 'Built this specifically for 3-5 friends seeking iconic dawn temples without the tour bus chaos. Early mornings at Fushimi Inari allow you to experience the vermilion torii gates in absolute stillness.',
      prime_window: 'Late March - Mid April',
      highlight: 'Peak sakura bloom matches perfectly with magical evening illuminations in Maruyama Park.',
    },
    route_chain: ['Tokyo', 'Hakone', 'Kyoto (4N)', 'Osaka'],
    key_stops: [
      'Senso-ji Temple - Morning walk before crowds',
      'Shirakawa Canal - Willow-lined golden hour',
      'Fushimi Inari Gates - Dawn mountain summit',
      'Dotonbori Street - Communal gyoza feast',
    ],
    daily_breakdown: [
      {
        day_number: 1,
        title: 'Arrive & Gion Lantern Twilight',
        subtitle: '3 stops • 4.2 km walk • 1 group dinner',
        stops: [
          {
            time: '14:30',
            name: 'CHECK-IN Gion Machiya Stay',
            description: 'Settle bags at traditional cedar townhouse rental in historic Gion district.',
            category: 'stay',
          },
          {
            time: '17:45',
            name: 'GOLDEN HOUR Shirakawa Canal Walk',
            description: 'Willow-lined paved streets with cherry blossom trees reflecting off stone bridges.',
            tag: '#PhotoSpot',
            category: 'attraction',
          },
          {
            time: '20:00',
            name: 'DINNER Chao Chao Gyoza Feast',
            description: 'Lively communal craft beer & pan-fried gyoza tables with the crew.',
            tag: '#GroupDinner',
            category: 'meal',
          },
        ],
        transit_note: '🚆 Transit: Keihan Main Line (Shijo Sta.) • ¥230',
      },
      {
        day_number: 2,
        title: 'Arashiyama Bamboo & Golden Pavilion',
        subtitle: '4 stops • Dawn launch • Sagano scenic train',
        stops: [
          {
            time: '07:00',
            name: 'Arashiyama Bamboo Grove Walk',
            description: 'Beat the tour buses through the towering green bamboo grove.',
            tag: '#DawnLaunch',
            category: 'attraction',
          },
          {
            time: '10:30',
            name: 'Tenryu-ji Temple & Zen Garden',
            description: 'UNESCO World Heritage dry landscape garden with pond reflections.',
            category: 'attraction',
          },
          {
            time: '14:00',
            name: 'Kinkaku-ji (Golden Pavilion)',
            description: 'Gold-leaf covered Zen temple shimmering over Kyoko-chi mirror pond.',
            category: 'attraction',
          },
        ],
        transit_note: '🚆 Transit: Randen Tram & JR San-in Line',
      },
      {
        day_number: 3,
        title: 'Fushimi Inari Gates & Uji Green Tea',
        subtitle: 'Mountain summit hike • Traditional matcha tea ceremony',
        stops: [
          {
            time: '06:30',
            name: 'Fushimi Inari Summit Hike',
            description: 'Ascend through 10,000 torii gates to the Yotsutsuji intersection viewpoint.',
            tag: '#SummitHike',
            category: 'attraction',
          },
          {
            time: '12:00',
            name: 'Tsuen Tea Uji (Established 1160)',
            description: 'Oldest tea shop in Japan for stone-ground matcha and soba noodles.',
            category: 'meal',
          },
        ],
        transit_note: '🚆 Transit: JR Nara Line • ¥240',
      },
      {
        day_number: 4,
        title: 'Nara Deer Park & Osaka Food District',
        subtitle: 'Great Buddha of Todai-ji • Dotonbori evening market crawl',
        stops: [
          {
            time: '09:30',
            name: 'Todai-ji & Nara Deer Park',
            description: 'Meet friendly free-roaming sika deer and gaze upon the Daibutsu bronze statue.',
            category: 'attraction',
          },
          {
            time: '18:00',
            name: 'Dotonbori Street Food Odyssey',
            description: 'Kushikatsu skewers, takoyaki balls, and giant neon Glico running man photo spot.',
            tag: '#StreetFood',
            category: 'meal',
          },
        ],
        transit_note: '🚆 Transit: Kintetsu-Nara Express to Osaka-Namba',
      },
    ],
    budget_breakdown: [
      { category: 'Stay & Ryokan', percent: 42, color: '#8b4b00', amount: 525 },
      { category: 'Food & Drinks', percent: 28, color: '#ff8f06', amount: 350 },
      { category: 'Transit & JR', percent: 18, color: '#4a623f', amount: 225 },
      { category: 'Entries / Tours', percent: 12, color: '#85495c', amount: 150 },
    ],
    splitting_tip: 'Splitting Machiya ryokan rentals in Kyoto between 4 travelers saves an average of 35% per person compared to separate hotel rooms.',
    created_at: '2026-08-28T09:00:00Z',
  },
  {
    id: 'post-tokyo-tech',
    user_id: '00000000-0000-0000-0000-000000000005',
    author_name: 'Kenji Sato',
    author_avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop',
    author_level: 'LVL 5',
    author_trips_count: 22,
    type: 'cloneable_itinerary',
    title: 'Tokyo Tech & Temples',
    subtitle: 'Futuristic arcades, retro gaming & ancient Asakusa shrines',
    destination: 'Tokyo, Japan',
    cover_image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=800&h=500&fit=crop',
    duration_days: 5,
    nights_count: 4,
    travel_style: 'City',
    travel_pace: 'Fast',
    budget_tier: '$',
    estimated_cost_per_person: 950,
    content: 'A high-energy mix of neon arcade districts, underground vinyl cafes, retro game hunting in Akihabara, and peaceful sunrise walks around Senso-ji.',
    linked_room_id: null,
    stars_count: 285,
    clones_count: 860,
    rating: 4.8,
    reviews_count: 52,
    is_starred: false,
    tags: ['🏙️ City', '🎮 Gaming & Tech', '🍜 Ramen Stroll', '⛩️ Shrines'],
    field_notes: {
      quote: 'Tokyo rewards the curious. Combining ancient sunrise shrine tranquility with late-night neon energy makes every day feel like traveling through two different eras.',
      prime_window: 'Year-Round (Best Oct - Nov)',
      highlight: 'Akihabara retro game hunts & late night Shibuya Sky panoramic deck.',
    },
    route_chain: ['Shinjuku', 'Akihabara', 'Asakusa', 'Shibuya', 'Odaiba'],
    key_stops: [
      'Senso-ji Temple - Sunrise walk before crowds',
      'Akihabara Electric Town - Gadget & anime crawl',
      'Shibuya Sky 360° - Sunset cityscape panorama',
      'Meiji Jingu Shrine - Ancient forest in the city',
    ],
    daily_breakdown: [
      {
        day_number: 1,
        title: 'Asakusa Roots & Tokyo Skytree',
        stops: [
          { time: '08:00', name: 'Senso-ji Temple & Nakamise', category: 'attraction' },
          { time: '11:30', name: 'Asakusa Imahan Sukiyaki Lunch', category: 'meal' },
          { time: '16:00', name: 'Tokyo Skytree Observation Floor', category: 'attraction' },
        ],
      },
      {
        day_number: 2,
        title: 'Akihabara Tech Quest & Maid Cafe',
        stops: [
          { time: '11:00', name: 'Radio Kaikan & Super Potato Retro Games', category: 'attraction' },
          { time: '15:00', name: 'Kanda Myojin Shrine Tech Blessings', category: 'attraction' },
        ],
      },
    ],
    budget_breakdown: [
      { category: 'Stay & Capsule', percent: 35, color: '#8b4b00', amount: 332 },
      { category: 'Ramen & Dining', percent: 30, color: '#ff8f06', amount: 285 },
      { category: 'Metro & Train', percent: 15, color: '#4a623f', amount: 143 },
      { category: 'Shopping & Arcades', percent: 20, color: '#85495c', amount: 190 },
    ],
    created_at: '2026-08-30T14:30:00Z',
  },
  {
    id: 'post-amalfi-coast',
    user_id: '00000000-0000-0000-0000-000000000002',
    author_name: 'Sarah J.',
    author_avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&h=200&fit=crop',
    author_level: 'LVL 3',
    author_trips_count: 8,
    type: 'cloneable_itinerary',
    title: 'Amalfi Coast & Capri Sun',
    subtitle: 'Cliffside coastal villas, lemon granitas & private boat charter',
    destination: 'Positano, Italy',
    cover_image: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?w=800&h=500&fit=crop',
    duration_days: 6,
    nights_count: 5,
    travel_style: 'Relaxing',
    travel_pace: 'Relaxed',
    budget_tier: '$$$',
    estimated_cost_per_person: 1800,
    content: 'Cliffside coastal drives, fragrant lemon granita stands, Path of the Gods scenic hikes, and private sunset boat charters around the Faraglioni rocks.',
    linked_room_id: null,
    stars_count: 195,
    clones_count: 430,
    rating: 4.9,
    reviews_count: 39,
    is_starred: true,
    tags: ['🏖️ Coastal', '🍷 Wine & Dine', '⛵ Boat Cruise', '🍋 Lemon Groves'],
    field_notes: {
      quote: 'Take the local ferries instead of crowded buses. The perspective from the water approaching Positano at golden hour is unmatched.',
      prime_window: 'May - June or September',
      highlight: 'Private Capri sunset sail and cliffside dinner in Praiano.',
    },
    route_chain: ['Naples', 'Sorrento', 'Positano (3N)', 'Capri'],
    key_stops: [
      'Positano Spiaggia Grande Beach',
      'Path of the Gods Mountain Hike',
      'Capri Faraglioni & Blue Grotto',
      'Ravello Villa Rufolo Cliffside Gardens',
    ],
    daily_breakdown: [
      {
        day_number: 1,
        title: 'Naples to Sorrento Sunset Arrival',
        stops: [
          { time: '13:00', name: 'Naples Sorbillo Pizza', category: 'meal' },
          { time: '17:00', name: 'Sorrento Piazza Tasso Wine Stroll', category: 'attraction' },
        ],
      },
      {
        day_number: 2,
        title: 'Positano Cliffs & Beach Club',
        stops: [
          { time: '10:00', name: 'Arienzo Beach Club Ferry', category: 'attraction' },
          { time: '19:00', name: 'La Tagliata Family Style Feast', category: 'meal' },
        ],
      },
    ],
    budget_breakdown: [
      { category: 'Cliffside Villa', percent: 50, color: '#8b4b00', amount: 900 },
      { category: 'Seafood & Pasta', percent: 25, color: '#ff8f06', amount: 450 },
      { category: 'Ferries & Boats', percent: 15, color: '#4a623f', amount: 270 },
      { category: 'Activities', percent: 10, color: '#85495c', amount: 180 },
    ],
    created_at: '2026-09-01T11:00:00Z',
  },
  {
    id: 'post-patagonia-trek',
    user_id: '00000000-0000-0000-0000-000000000001',
    author_name: 'Alex Chen',
    author_avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop',
    author_level: 'LVL 6',
    author_trips_count: 31,
    type: 'recap',
    title: 'Patagonia Wilderness & Glaciers',
    subtitle: '10 days conquering the untamed Torres del Paine W-Trek',
    destination: 'Torres del Paine, Chile',
    cover_image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800&h=500&fit=crop',
    duration_days: 10,
    nights_count: 9,
    travel_style: 'Nature',
    travel_pace: 'Ambitious',
    budget_tier: '$$$',
    estimated_cost_per_person: 2200,
    content: '10 days trekking through the untamed valleys of Torres del Paine. The W-trek was demanding with variable Patagonian winds, but waking up to dawn alpenglow on the granite Horns was transcendent. Best adventure with our crew.',
    linked_room_id: null,
    stars_count: 410,
    clones_count: 0,
    rating: 5.0,
    reviews_count: 98,
    is_starred: false,
    tags: ['⛰️ Trekking', '🧊 Glaciers', '🏕️ Camping', '🌲 Wilderness'],
    field_notes: {
      quote: 'Pack four seasons in one backpack. Windproof layers and sturdy trekking poles are completely non-negotiable on the French Valley trail.',
      prime_window: 'December to February (Patagonian Summer)',
      highlight: 'Grey Glacier boat navigation and Mirador Las Torres sunrise climb.',
    },
    key_stops: [
      'Mirador Las Torres Sunrise',
      'French Valley Hanging Glacier',
      'Grey Glacier Ice Hike',
      'Lake Pehoe Catamaran Crossing',
    ],
    created_at: '2026-09-02T16:20:00Z',
  },
  {
    id: 'post-paris-weekend',
    user_id: '00000000-0000-0000-0000-000000000003',
    author_name: 'Sam Lee',
    author_avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop',
    author_level: 'LVL 2',
    author_trips_count: 5,
    type: 'recap',
    title: 'Parisian Art & Patisseries',
    subtitle: 'Secret courtyards, Louvre night slots & warm croissants',
    destination: 'Paris, France',
    cover_image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&h=500&fit=crop',
    duration_days: 4,
    nights_count: 3,
    travel_style: 'Cultural',
    travel_pace: 'Relaxed',
    budget_tier: '$$',
    estimated_cost_per_person: 1100,
    content: 'Hidden courtyard gardens in Le Marais, evening visits to the Louvre without the bus crowds, and fresh warm pain au chocolat every morning by the Seine riverbank.',
    linked_room_id: null,
    stars_count: 165,
    clones_count: 0,
    rating: 4.7,
    reviews_count: 29,
    is_starred: true,
    tags: ['🎨 Art & Museums', '🥐 Pastries', '🏛️ Historic', '🚶 Walkable'],
    field_notes: {
      quote: 'Book the 7:00 PM Friday Louvre entrance slot. You get the Winged Victory and Mona Lisa almost to yourself as the golden sunlight streams through the glass pyramid.',
      prime_window: 'April - May or September - October',
      highlight: 'Montmartre sunset steps and Seine vintage book stalls.',
    },
    key_stops: [
      'The Louvre Evening Slot',
      'Le Marais Specialty Bakeries',
      'Musée d Orsay Impressionist Hall',
      'Sainte-Chapelle Stained Glass',
    ],
    created_at: '2026-09-03T18:00:00Z',
  },
  {
    id: 'post-bali-zen',
    user_id: '00000000-0000-0000-0000-000000000002',
    author_name: 'Taylor Swift',
    author_avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&h=200&fit=crop',
    author_level: 'LVL 4',
    author_trips_count: 17,
    type: 'cloneable_itinerary',
    title: 'Bali Waterfalls & Zen Retreat',
    subtitle: 'Emerald rice terraces, hidden jungle waterfalls & yoga sanctuaries',
    destination: 'Ubud, Bali, Indonesia',
    cover_image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&h=500&fit=crop',
    duration_days: 6,
    nights_count: 5,
    travel_style: 'Nature',
    travel_pace: 'Relaxed',
    budget_tier: '$',
    estimated_cost_per_person: 750,
    content: 'Wake up to misty emerald rice terrace sunrises in Ubud, swim in pristine jungle waterfalls at Sekumpul, and nourish your soul with farm-to-table Balinese feasts.',
    linked_room_id: null,
    stars_count: 230,
    clones_count: 510,
    rating: 4.8,
    reviews_count: 64,
    is_starred: false,
    tags: ['🌴 Tropical', '🧘 Yoga & Wellness', '🥥 Vegan Food', '💦 Waterfalls'],
    field_notes: {
      quote: 'Rent a private scooter or hire a local driver for north Bali day trips. The sunrise over Tegalalang rice terraces is pure magic.',
      prime_window: 'April to October (Dry Season)',
      highlight: 'Sekumpul multi-tier waterfall trek and Campuhan Ridge walk.',
    },
    route_chain: ['Seminyak', 'Ubud (4N)', 'Munduk', 'Canggu'],
    key_stops: [
      'Tegalalang Rice Terraces',
      'Tukad Cepung Cave Waterfall',
      'Campuhan Ridge Sunrise Stroll',
      'Tirta Empul Holy Water Temple',
    ],
    daily_breakdown: [
      {
        day_number: 1,
        title: 'Ubud Jungle Arrival & Ridge Walk',
        stops: [
          { time: '14:00', name: 'Check-in Ubud Eco Resort', category: 'stay' },
          { time: '17:00', name: 'Campuhan Ridge Walk Sunset', category: 'attraction' },
        ],
      },
      {
        day_number: 2,
        title: 'Sacred Waterfalls & Temple Purification',
        stops: [
          { time: '08:00', name: 'Tirta Empul Holy Water Blessing', category: 'attraction' },
          { time: '13:00', name: 'Tukad Cepung Waterfall Sunbeam Chasm', category: 'attraction' },
        ],
      },
    ],
    budget_breakdown: [
      { category: 'Bamboo Eco-Villa', percent: 45, color: '#8b4b00', amount: 337 },
      { category: 'Organic Food & Cafes', percent: 30, color: '#ff8f06', amount: 225 },
      { category: 'Private Driver', percent: 15, color: '#4a623f', amount: 113 },
      { category: 'Spa & Wellness', percent: 10, color: '#85495c', amount: 75 },
    ],
    created_at: '2026-09-04T08:00:00Z',
  },
];

// ==========================================
// Centralized In-Memory Store
// ==========================================
let communityPostsStore: CommunityPost[] = [...initialMockCommunityPosts];

type StoreListener = () => void;
const listeners: Set<StoreListener> = new Set();

const notifyListeners = () => {
  listeners.forEach((listener) => listener());
};

export const subscribeToDiscoverStore = (listener: StoreListener): (() => void) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};

export interface DiscoverFilterOptions {
  searchQuery?: string;
  destination?: string;
  travelStyle?: string;
  travelPace?: string;
  budgetTier?: string;
  type?: 'all' | 'cloneable' | 'recap';
}

/**
 * Hook for consuming and subscribing to the centralized discover store.
 */
export const useDiscoverStore = (filters?: DiscoverFilterOptions) => {
  const [posts, setPosts] = useState<CommunityPost[]>([...communityPostsStore]);

  useEffect(() => {
    const update = () => {
      setPosts([...communityPostsStore]);
    };
    return subscribeToDiscoverStore(update);
  }, []);

  const filteredPosts = posts.filter((p) => {
    // 1. Search Query (destination or title or content or tags)
    if (filters?.searchQuery && filters.searchQuery.trim().length > 0) {
      const q = filters.searchQuery.trim().toLowerCase();
      const matchTitle = p.title.toLowerCase().includes(q);
      const matchDest = p.destination.toLowerCase().includes(q);
      const matchAuthor = p.author_name.toLowerCase().includes(q);
      const matchTag = p.tags?.some((t) => t.toLowerCase().includes(q));
      if (!matchTitle && !matchDest && !matchAuthor && !matchTag) return false;
    }

    // 2. Destination filter
    if (filters?.destination && filters.destination !== 'All') {
      const destQuery = filters.destination.toLowerCase();
      if (!p.destination.toLowerCase().includes(destQuery)) return false;
    }

    // 3. Travel Style filter
    if (filters?.travelStyle && filters.travelStyle !== 'All') {
      if (p.travel_style.toLowerCase() !== filters.travelStyle.toLowerCase()) return false;
    }

    // 4. Pace filter
    if (filters?.travelPace && filters.travelPace !== 'All') {
      if (p.travel_pace.toLowerCase() !== filters.travelPace.toLowerCase()) return false;
    }

    // 5. Budget filter
    if (filters?.budgetTier && filters.budgetTier !== 'All') {
      if (p.budget_tier !== filters.budgetTier) return false;
    }

    // 6. Type filter
    if (filters?.type === 'cloneable') {
      if (p.type !== 'cloneable_itinerary') return false;
    } else if (filters?.type === 'recap') {
      if (p.type !== 'recap') return false;
    }

    return true;
  });

  return {
    posts: filteredPosts,
    allPosts: posts,
    toggleStar: toggleStarPost,
    clonePost: cloneDiscoverItinerary,
  };
};

/**
 * Star / unstar a community post in the centralized store.
 * Starred posts are automatically reflected in Profile's Starred Trips.
 */
export const toggleStarPost = (postId: string, _userId: string = CURRENT_USER_ID): { is_starred: boolean; stars_count: number } => {
  const postIndex = communityPostsStore.findIndex((p) => p.id === postId);
  if (postIndex === -1) {
    return { is_starred: false, stars_count: 0 };
  }

  const current = communityPostsStore[postIndex];
  const nextIsStarred = !current.is_starred;
  const nextStarsCount = nextIsStarred ? current.stars_count + 1 : Math.max(0, current.stars_count - 1);

  communityPostsStore[postIndex] = {
    ...current,
    is_starred: nextIsStarred,
    stars_count: nextStarsCount,
  };

  notifyListeners();
  return { is_starred: nextIsStarred, stars_count: nextStarsCount };
};

/**
 * Returns all starred posts formatted as StarredTrip items for Profile Screen (Section 8.2).
 */
export const getStarredTrips = (_userId: string = CURRENT_USER_ID): StarredTrip[] => {
  return communityPostsStore
    .filter((p) => p.is_starred)
    .map((post) => ({
      id: `st_${post.id}`,
      user_id: CURRENT_USER_ID,
      post_id: post.id,
      discover_post_id: post.id,
      linked_room_id: post.linked_room_id || null,
      starred_at: new Date().toISOString(),
      post: { ...post },
    }));
};

/**
 * Publishes a completed/archived trip room to Discover as a community post (Screen 07/09).
 */
export const publishTripToDiscover = (params: {
  title: string;
  destination: string;
  coverImage: string;
  durationDays: number;
  travelStyle: string;
  travelPace?: string;
  budgetTier?: string;
  notes?: string;
  tags?: string[];
  type?: 'cloneable_itinerary' | 'recap';
  linkedRoomId?: string;
}): CommunityPost => {
  const newPost: CommunityPost = {
    id: `post-pub-${Date.now()}`,
    user_id: CURRENT_USER_ID,
    author_name: 'Elena Rostova',
    author_avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop',
    author_level: 'LVL 4',
    author_trips_count: 15,
    type: params.type || 'cloneable_itinerary',
    title: params.title,
    subtitle: params.notes ? params.notes.slice(0, 60) + '...' : `Exploring ${params.destination}`,
    destination: params.destination,
    cover_image: params.coverImage || 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&h=500&fit=crop',
    duration_days: params.durationDays || 5,
    nights_count: Math.max(1, (params.durationDays || 5) - 1),
    travel_style: params.travelStyle || 'Cultural',
    travel_pace: params.travelPace || 'Moderate',
    budget_tier: params.budgetTier || '$$',
    estimated_cost_per_person: 1100,
    content: params.notes || `Shared community trip to ${params.destination}.`,
    linked_room_id: params.linkedRoomId || null,
    stars_count: 0,
    clones_count: 0,
    rating: 5.0,
    reviews_count: 1,
    is_starred: false,
    tags: params.tags || ['🏛️ Cultural', '🚶 Walkable'],
    created_at: new Date().toISOString(),
  };

  communityPostsStore.unshift(newPost);
  notifyListeners();
  return newPost;
};

/**
 * Clones a community post into a new Planning Trip Room (FR-8-5) via trip-room service.
 */
export const cloneDiscoverItinerary = (postId: string): TripRoom => {
  const post = communityPostsStore.find((p) => p.id === postId);
  if (!post) {
    throw new Error(`Community post ${postId} not found`);
  }

  // Increment clones count
  const postIndex = communityPostsStore.findIndex((p) => p.id === postId);
  if (postIndex !== -1) {
    communityPostsStore[postIndex] = {
      ...communityPostsStore[postIndex],
      clones_count: (communityPostsStore[postIndex].clones_count || 0) + 1,
    };
    notifyListeners();
  }

  // Call the official trip room creation logic from trip-room feature
  return cloneCommunityItineraryToTripRoom(post);
};

export const getCommunityPostById = (postId: string): CommunityPost | null => {
  const post = communityPostsStore.find((p) => p.id === postId);
  return post ? { ...post } : null;
};

// Export convenience alias
export const mockDiscoverPosts = communityPostsStore;
