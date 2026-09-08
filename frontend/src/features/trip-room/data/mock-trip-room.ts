import {
  mockStandardTripPreferences,
  mockStandardLandmarks,
  mockStandardSafetyAlerts,
} from '@/shared/data/standard-mock-data';

export const mockTripPreferences = mockStandardTripPreferences[0];

export const mockTripRooms = [
  {
    id: 'room-tokyo-2026',
    name: 'Tokyo Autumn Escape 🍁',
    destination: 'Tokyo, Japan',
    stage: 'active',
    created_by: 'demo-user-1',
    start_date: '2026-10-10',
    end_date: '2026-10-16',
    theme_color: '#FB8C00',
    is_public: true,
    invite_code: 'TOK26A',
    cover_image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=800&fit=crop',
  },
  {
    id: 'room-swiss-2027',
    name: 'Swiss Alps Winter Retreat ❄️',
    destination: 'Zermatt, Switzerland',
    stage: 'planning',
    created_by: 'demo-user-1',
    start_date: '2027-01-14',
    end_date: '2027-01-22',
    theme_color: '#C9DEEF',
    is_public: false,
    invite_code: 'SWISS7',
    cover_image: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?w=800&fit=crop',
  },
  {
    id: 'room-bali-2025',
    name: 'Bali Coastal Getaway 🌴',
    destination: 'Bali, Indonesia',
    stage: 'archived',
    created_by: 'demo-user-1',
    start_date: '2025-08-01',
    end_date: '2025-08-08',
    theme_color: '#697E50',
    is_public: true,
    invite_code: 'BALI25',
    cover_image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&fit=crop',
  },
];

export const mockTripMembers = [
  {
    room_id: 'room-tokyo-2026',
    user_id: 'demo-user-1',
    role: 'owner',
    location_sharing_opt_in: true,
    joined_at: '2026-09-01T00:00:00Z',
    is_live_for_user: true,
    user: {
      name: 'Alex Chen',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop',
    },
  },
  {
    room_id: 'room-tokyo-2026',
    user_id: 'demo-user-2',
    role: 'member',
    location_sharing_opt_in: true,
    joined_at: '2026-09-02T10:00:00Z',
    is_live_for_user: false,
    user: {
      name: 'Taylor Swift',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&h=200&fit=crop',
    },
  },
  {
    room_id: 'room-tokyo-2026',
    user_id: 'demo-user-3',
    role: 'member',
    location_sharing_opt_in: false,
    joined_at: '2026-09-03T12:00:00Z',
    is_live_for_user: false,
    user: {
      name: 'Sam Lee',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop',
    },
  },
];

export const mockItineraryDays = [
  {
    id: 'day-tokyo-1',
    room_id: 'room-tokyo-2026',
    day_number: 1,
    trip_date: '2026-10-10',
    title: 'Arrival & Shibuya Sunset Lights',
    notes: 'Pick up pocket WiFi at Haneda Airport, check in hotel by 3 PM.',
  },
  {
    id: 'day-tokyo-2',
    room_id: 'room-tokyo-2026',
    day_number: 2,
    trip_date: '2026-10-11',
    title: 'Historic Asakusa & Akihabara Tech',
    notes: 'Wear comfortable shoes for walking around temple grounds.',
  },
  {
    id: 'day-tokyo-3',
    room_id: 'room-tokyo-2026',
    day_number: 3,
    trip_date: '2026-10-12',
    title: 'Meiji Shrine, Harajuku & Omotesando',
    notes: 'Afternoon tea reservation at 4:30 PM.',
  },
];

export const mockItineraryItems = [
  {
    id: 'item-1',
    room_id: 'room-tokyo-2026',
    day_id: 'day-tokyo-1',
    name: 'Tokyo Monorail (Haneda → Hamamatsucho)',
    category: 'transportation',
    scheduled_time: '11:30 AM',
    sort_order: 1,
    lat: 35.5494,
    lng: 139.7798,
    booking_url: 'https://www.tokyo-monorail.co.jp/english/',
    tags: ['Express', 'Transit'],
  },
  {
    id: 'item-2',
    room_id: 'room-tokyo-2026',
    day_id: 'day-tokyo-1',
    name: 'Hotel Gracery Shinjuku Check-in',
    category: 'stay',
    scheduled_time: '03:00 PM',
    sort_order: 2,
    lat: 35.6953,
    lng: 139.7022,
    address: '1-19-1 Kabukicho, Shinjuku, Tokyo',
    booking_url: 'https://shinjuku.gracery.com/en/',
    tags: ['Hotel', 'Central'],
  },
  {
    id: 'item-3',
    room_id: 'room-tokyo-2026',
    day_id: 'day-tokyo-1',
    name: 'Shibuya Sky Rooftop Sunset',
    category: 'attraction',
    scheduled_time: '05:30 PM',
    sort_order: 3,
    lat: 35.6585,
    lng: 139.7013,
    booking_url: 'https://www.shibuya-scramble-square.com/sky/',
    tags: ['Panorama', 'Must See'],
  },
  {
    id: 'item-4',
    room_id: 'room-tokyo-2026',
    day_id: 'day-tokyo-2',
    name: 'Senso-ji Ancient Temple',
    category: 'attraction',
    scheduled_time: '09:30 AM',
    sort_order: 1,
    lat: 35.7148,
    lng: 139.7967,
    tags: ['Historic', 'Cultural'],
  },
  {
    id: 'item-5',
    room_id: 'room-tokyo-2026',
    day_id: 'day-tokyo-2',
    name: 'Asakusa Imahan Sukiyaki Lunch',
    category: 'attraction',
    scheduled_time: '12:30 PM',
    sort_order: 2,
    lat: 35.7125,
    lng: 139.7932,
    tags: ['Wagyu', 'Lunch'],
  },
];

export const mockMessages = [
  {
    id: 'msg-1',
    room_id: 'room-tokyo-2026',
    sender_id: null,
    sender_type: 'system',
    sender_name: 'System',
    text: 'Alex Chen created the trip room.',
    type: 'system_event',
    created_at: '2026-09-01T00:00:00Z',
  },
  {
    id: 'msg-1b',
    room_id: 'room-tokyo-2026',
    sender_id: null,
    sender_type: 'system',
    sender_name: 'System',
    text: 'Taylor Swift joined the room.',
    type: 'system_event',
    created_at: '2026-09-02T10:00:00Z',
  },
  {
    id: 'msg-2',
    room_id: 'room-tokyo-2026',
    sender_id: 'demo-user-1',
    sender_type: 'user',
    sender_name: 'Alex Chen',
    sender_avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop',
    text: 'Hey team! Added Shibuya Sky tickets for sunset at 5:30 PM.',
    type: 'text',
    created_at: '2026-09-05T10:15:00Z',
  },
  {
    id: 'msg-3',
    room_id: 'room-tokyo-2026',
    sender_id: 'demo-user-2',
    sender_type: 'user',
    sender_name: 'Taylor Swift',
    sender_avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&h=200&fit=crop',
    text: 'Awesome! Should we do ramen or sushi afterward?',
    type: 'text',
    created_at: '2026-09-05T10:17:00Z',
  },
  {
    id: 'msg-4',
    room_id: 'room-tokyo-2026',
    sender_id: null,
    sender_type: 'mascot',
    sender_name: 'ReRoute Corgi 🐕',
    text: '💡 Paku Tip: Evening rain forecast for Oct 12. I recommend moving the outdoor rooftop visit to Oct 11 afternoon for optimal visibility!',
    type: 'text',
    created_at: '2026-09-05T10:18:00Z',
  },
  {
    id: 'msg-5',
    room_id: 'room-tokyo-2026',
    sender_id: null,
    sender_type: 'system',
    sender_name: 'System',
    text: 'ReRoute Notice: Itinerary updated by Sarah',
    type: 'system_event',
    created_at: '2026-09-05T10:19:00Z',
  },
  {
    id: 'msg-6',
    room_id: 'room-tokyo-2026',
    sender_id: 'demo-user-1',
    sender_type: 'user',
    sender_name: 'Alex Chen',
    sender_avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop',
    text: 'Let us vote on dinner choice!',
    type: 'decision_card',
    payload: {
      card_id: 'card-dinner-1',
    },
    created_at: '2026-09-05T10:20:00Z',
  },
  {
    id: 'msg-7',
    room_id: 'room-tokyo-2026',
    sender_id: 'demo-user-2',
    sender_type: 'user',
    sender_name: 'Taylor Swift',
    sender_avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&h=200&fit=crop',
    text: 'Has anyone checked if the JR Pass covers our trip to Kyoto?',
    type: 'text',
    created_at: '2026-09-05T10:22:00Z',
  },
  {
    id: 'msg-8',
    room_id: 'room-tokyo-2026',
    sender_id: 'demo-user-1',
    sender_type: 'user',
    sender_name: 'Alex Chen',
    sender_avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop',
    text: 'Yes, I added it to the budget tab. We should book it today. Also, regarding tomorrow\'s sunrise plan...',
    type: 'text',
    created_at: '2026-09-05T10:25:00Z',
    payload: {
      thread_ref: {
        label: 'Thread · Day 4 – Fushimi Inari sunrise',
        reply_count: 2,
        itinerary_day_id: 'day-tokyo-3',
      },
    },
  },
  {
    id: 'msg-9',
    room_id: 'room-tokyo-2026',
    sender_id: null,
    sender_type: 'mascot',
    sender_name: 'ReRoute Corgi 🐕',
    text: '',
    type: 'text',
    created_at: '2026-09-05T10:30:00Z',
    payload: {
      generating: true,
    },
  },
  {
    id: 'msg-10',
    room_id: 'room-tokyo-2026',
    sender_id: null,
    sender_type: 'system',
    sender_name: 'System',
    text: 'ReRoute Safety: A weather alert has triggered a reroute proposal.',
    type: 'decision_card',
    payload: {
      card_id: 'card-rain-safety',
    },
    created_at: '2026-09-06T08:00:00Z',
  },
  {
    id: 'msg-bali-1',
    room_id: 'room-bali-2025',
    sender_id: null,
    sender_type: 'system',
    sender_name: 'System',
    text: 'Alex Chen created the trip room.',
    type: 'system_event',
    created_at: '2025-07-01T00:00:00Z',
  },
  {
    id: 'msg-bali-2',
    room_id: 'room-bali-2025',
    sender_id: 'demo-user-1',
    sender_type: 'user',
    sender_name: 'Alex Chen',
    sender_avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop',
    text: 'Can\'t wait for the Bali trip! Who\'s ready for surfing?',
    type: 'text',
    created_at: '2025-07-15T09:00:00Z',
  },
  {
    id: 'msg-bali-3',
    room_id: 'room-bali-2025',
    sender_id: 'demo-user-2',
    sender_type: 'user',
    sender_name: 'Taylor Swift',
    sender_avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&h=200&fit=crop',
    text: 'Absolutely! I found an amazing villa near Seminyak.',
    type: 'text',
    created_at: '2025-07-15T09:05:00Z',
  },
  {
    id: 'msg-bali-4',
    room_id: 'room-bali-2025',
    sender_id: null,
    sender_type: 'mascot',
    sender_name: 'ReRoute Corgi 🐕',
    text: '🌊 Surf conditions look great for Aug 3–5! Uluwatu Beach has the best breaks this season.',
    type: 'text',
    created_at: '2025-07-15T09:10:00Z',
  },
  {
    id: 'msg-bali-5',
    room_id: 'room-bali-2025',
    sender_id: 'demo-user-1',
    sender_type: 'user',
    sender_name: 'Alex Chen',
    sender_avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop',
    text: 'Where should we eat on Day 2?',
    type: 'decision_card',
    payload: {
      card_id: 'card-bali-dinner',
    },
    created_at: '2025-07-16T12:00:00Z',
  },
];

export const mockDecisionCards = [
  {
    id: 'card-dinner-1',
    room_id: 'room-tokyo-2026',
    trigger_type: 'conflict',
    title: 'Where for dinner on Day 3?',
    description: 'Decide where the group should dine after Shibuya Sky observation deck.',
    options: [
      { id: 'opt-1', label: 'Ichiran Ramen', votes_count: 2 },
      { id: 'opt-2', label: 'Local Izakaya', votes_count: 3 },
      { id: 'opt-3', label: 'Torikizoku Yakitori', votes_count: 0 },
    ],
    status: 'active',
    anonymous: true,
    created_at: '2026-09-05T10:20:00Z',
  },
  {
    id: 'card-rain-safety',
    room_id: 'room-tokyo-2026',
    trigger_type: 'safety_risk',
    safety_alert_id: 'alert-tokyo-typhoon',
    title: '⚠️ Heavy Rain Reroute Proposal',
    description: 'Heavy evening downpour detected for Day 3. Mascot suggests shifting to Tokyo Indoor National Museum or Sunshine City Aquarium.',
    options: [
      { id: 'opt-rain-1', label: 'Shift to Tokyo National Museum (Indoor)', votes_count: 2 },
      { id: 'opt-rain-2', label: 'Keep Outdoor Walking Route with Umbrellas', votes_count: 0 },
    ],
    status: 'resolved',
    anonymous: false,
    created_at: '2026-09-06T08:00:00Z',
    resolved_at: '2026-09-06T09:30:00Z',
    winning_option_id: 'opt-rain-1',
  },
  {
    id: 'card-bali-dinner',
    room_id: 'room-bali-2025',
    trigger_type: 'disruption',
    title: 'Day 2 Dinner Spot',
    description: 'Choose between beachside BBQ or traditional Balinese feast.',
    options: [
      { id: 'opt-bali-1', label: 'Beachside BBQ at Jimbaran', votes_count: 2 },
      { id: 'opt-bali-2', label: 'Traditional Balinese Feast in Ubud', votes_count: 1 },
    ],
    status: 'resolved',
    anonymous: false,
    created_at: '2025-07-16T12:00:00Z',
    resolved_at: '2025-07-16T14:00:00Z',
    winning_option_id: 'opt-bali-1',
  },
];

export const mockVotes = [
  { id: 'vote-1', decision_card_id: 'card-dinner-1', user_id: 'demo-user-2', chosen_option: 'opt-1' },
  { id: 'vote-2', decision_card_id: 'card-dinner-1', user_id: 'demo-user-3', chosen_option: 'opt-2' },
  { id: 'vote-3', decision_card_id: 'card-rain-safety', user_id: 'demo-user-1', chosen_option: 'opt-rain-1' },
  { id: 'vote-4', decision_card_id: 'card-rain-safety', user_id: 'demo-user-2', chosen_option: 'opt-rain-1' },
  { id: 'vote-5', decision_card_id: 'card-bali-dinner', user_id: 'demo-user-1', chosen_option: 'opt-bali-1' },
  { id: 'vote-6', decision_card_id: 'card-bali-dinner', user_id: 'demo-user-2', chosen_option: 'opt-bali-1' },
  { id: 'vote-7', decision_card_id: 'card-bali-dinner', user_id: 'demo-user-3', chosen_option: 'opt-bali-2' },
];

export const mockBudgetCategories = [
  { id: 'cat-stay', room_id: 'room-tokyo-2026', category_name: 'Accommodation', planned_amount: 800, spent_amount: 560 },
  { id: 'cat-transit', room_id: 'room-tokyo-2026', category_name: 'Transit & Trains', planned_amount: 350, spent_amount: 215 },
  { id: 'cat-food', room_id: 'room-tokyo-2026', category_name: 'Food & Dining', planned_amount: 600, spent_amount: 420 },
  { id: 'cat-activities', room_id: 'room-tokyo-2026', category_name: 'Attractions & Tickets', planned_amount: 250, spent_amount: 110 },
];

export const mockExpenses = [
  {
    id: 'exp-1',
    room_id: 'room-tokyo-2026',
    category_id: 'cat-stay',
    category_name: 'Accommodation',
    description: 'Hotel Gracery 4-Night Deposit',
    total_amount: 560,
    currency: 'USD',
    paid_by: ['demo-user-1'],
    payer_names: ['Alex Chen'],
    created_by: 'demo-user-1',
    created_at: '2026-09-01T10:00:00Z',
    splits: [
      { id: 'sp-1', expense_id: 'exp-1', user_id: 'demo-user-1', user_name: 'Alex Chen', split_type: 'equal', share_value: 1, amount_owed: 186.67 },
      { id: 'sp-2', expense_id: 'exp-1', user_id: 'demo-user-2', user_name: 'Taylor Swift', split_type: 'equal', share_value: 1, amount_owed: 186.67 },
      { id: 'sp-3', expense_id: 'exp-1', user_id: 'demo-user-3', user_name: 'Sam Lee', split_type: 'equal', share_value: 1, amount_owed: 186.66 },
    ],
  },
  {
    id: 'exp-2',
    room_id: 'room-tokyo-2026',
    category_id: 'cat-food',
    category_name: 'Food & Dining',
    description: 'Tsukiji Outer Market Seafood Lunch',
    total_amount: 14500,
    currency: 'JPY',
    paid_by: ['demo-user-2'],
    payer_names: ['Taylor Swift'],
    created_by: 'demo-user-2',
    created_at: '2026-09-02T12:30:00Z',
    splits: [
      { id: 'sp-4', expense_id: 'exp-2', user_id: 'demo-user-1', user_name: 'Alex Chen', split_type: 'equal', share_value: 1, amount_owed: 4833.33 },
      { id: 'sp-5', expense_id: 'exp-2', user_id: 'demo-user-2', user_name: 'Taylor Swift', split_type: 'equal', share_value: 1, amount_owed: 4833.33 },
      { id: 'sp-6', expense_id: 'exp-2', user_id: 'demo-user-3', user_name: 'Sam Lee', split_type: 'equal', share_value: 1, amount_owed: 4833.34 },
    ],
  },
];

export const mockSettlements = [
  {
    id: 'set-1',
    room_id: 'room-tokyo-2026',
    from_user_id: 'demo-user-2',
    from_user_name: 'Taylor Swift',
    to_user_id: 'demo-user-1',
    to_user_name: 'Alex Chen',
    amount: 85.5,
    currency: 'USD',
    method: 'Venmo',
    settled_at: '2026-09-03T18:00:00Z',
  },
];

export const mockAlbumPhotos = [
  {
    id: 'photo-1',
    room_id: 'room-tokyo-2026',
    uploaded_by: 'demo-user-1',
    uploader_name: 'Alex Chen',
    url: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=800&fit=crop',
    taken_at: '2026-10-10T17:45:00Z',
    location_name: 'Shibuya Crossing',
    itinerary_day_id: 'day-tokyo-1',
    caption: 'Sunset across Tokyo skyline!',
  },
  {
    id: 'photo-1b',
    room_id: 'room-tokyo-2026',
    uploaded_by: 'demo-user-2',
    uploader_name: 'Taylor Swift',
    url: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?w=800&fit=crop',
    taken_at: '2026-10-10T18:00:00Z',
    location_name: 'Shibuya Sky',
    itinerary_day_id: 'day-tokyo-1',
    caption: 'Great view!',
  },
  {
    id: 'photo-1c',
    room_id: 'room-tokyo-2026',
    uploaded_by: 'demo-user-3',
    uploader_name: 'Sam Lee',
    url: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&fit=crop',
    taken_at: '2026-10-10T19:30:00Z',
    location_name: 'Shibuya',
    itinerary_day_id: 'day-tokyo-1',
    caption: 'Dinner time',
  },
  {
    id: 'photo-1d',
    room_id: 'room-tokyo-2026',
    uploaded_by: 'demo-user-1',
    uploader_name: 'Alex Chen',
    url: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&fit=crop',
    taken_at: '2026-10-10T20:15:00Z',
    location_name: 'Shibuya',
    itinerary_day_id: 'day-tokyo-1',
    caption: 'Night walk',
  },
  {
    id: 'photo-1e',
    room_id: 'room-tokyo-2026',
    uploaded_by: 'demo-user-2',
    uploader_name: 'Taylor Swift',
    url: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?w=800&fit=crop',
    taken_at: '2026-10-10T20:45:00Z',
    location_name: 'Shinjuku',
    itinerary_day_id: 'day-tokyo-1',
    caption: 'Neon lights',
  },
  {
    id: 'photo-1f',
    room_id: 'room-tokyo-2026',
    uploaded_by: 'demo-user-3',
    uploader_name: 'Sam Lee',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&fit=crop',
    taken_at: '2026-10-10T21:00:00Z',
    location_name: 'Shinjuku',
    itinerary_day_id: 'day-tokyo-1',
    caption: 'Dessert!',
  },
  {
    id: 'photo-2',
    room_id: 'room-tokyo-2026',
    uploaded_by: 'demo-user-2',
    uploader_name: 'Taylor Swift',
    url: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?w=800&fit=crop',
    taken_at: '2026-10-11T10:15:00Z',
    location_name: 'Senso-ji Temple',
    itinerary_day_id: 'day-tokyo-2',
    caption: 'Giant red lantern of Kaminarimon Gate.',
  },
];

// ==========================================
// ITINERARY TAB — Additional Mock Data
// ==========================================

/** Re-export landmarks & safety alerts for Itinerary tab convenience */
export const mockLandmarks = mockStandardLandmarks;
export const mockSafetyAlerts = mockStandardSafetyAlerts;

/**
 * Itinerary item → decision card linkage.
 * Used to derive vote status per Assumption 4:
 * - If linked card exists and status='resolved' → Voted
 * - If linked card exists and status='active' → Pending
 * - If no linked card → no vote status (item is just a confirmed stop)
 */
export const mockItineraryVoteStatus: Record<
  string,
  { decision_card_id: string; votes_for: number; votes_total: number }
> = {
  'item-1': {
    decision_card_id: 'card-itinerary-monorail',
    votes_for: 4,
    votes_total: 5,
  },
  'item-3': {
    decision_card_id: 'card-itinerary-shibuya',
    votes_for: 3,
    votes_total: 5,
  },
};

/** Additional decision cards linked to itinerary items (resolved = voted/locked) */
export const mockItineraryDecisionCards = [
  {
    id: 'card-itinerary-monorail',
    room_id: 'room-tokyo-2026',
    trigger_type: 'conflict' as const,
    title: 'Include Tokyo Monorail in Day 1?',
    description: 'Vote on whether to take the monorail from Haneda.',
    options: [
      { id: 'opt-im-1', label: 'Yes, take monorail', votes_count: 4 },
      { id: 'opt-im-2', label: 'Take limousine bus instead', votes_count: 1 },
    ],
    status: 'resolved' as const,
    anonymous: false,
    created_at: '2026-09-04T10:00:00Z',
    resolved_at: '2026-09-04T12:00:00Z',
    winning_option_id: 'opt-im-1',
  },
  {
    id: 'card-itinerary-shibuya',
    room_id: 'room-tokyo-2026',
    trigger_type: 'conflict' as const,
    title: 'Add Shibuya Sky to Day 1?',
    description: 'Vote on including the observation deck visit.',
    options: [
      { id: 'opt-is-1', label: 'Yes, sunset timing is perfect', votes_count: 3 },
      { id: 'opt-is-2', label: 'Skip, too expensive', votes_count: 2 },
    ],
    status: 'resolved' as const,
    anonymous: false,
    created_at: '2026-09-04T14:00:00Z',
    resolved_at: '2026-09-04T16:00:00Z',
    winning_option_id: 'opt-is-1',
  },
];

/**
 * Candidate stops — not yet in itinerary_items, shown as dashed nodes.
 * These represent user-proposed stops that haven't been voted on or confirmed.
 */
export const mockCandidateStops = [
  {
    id: 'candidate-1',
    day_id: 'day-tokyo-1',
    name: 'Meiji Jingu Shrine Evening Walk',
    scheduled_time: '07:00 PM',
    note: 'Candidate stop proposal',
    sort_order: 99,
  },
  {
    id: 'candidate-2',
    day_id: 'day-tokyo-2',
    name: 'Akihabara Electric Town',
    scheduled_time: '03:00 PM',
    note: 'Candidate stop proposal',
    sort_order: 99,
  },
];

/**
 * Suggested routes for Active/Live stage.
 * Each leg has 2-3 transport options with one AI-picked.
 */
export const mockSuggestedRoutes = [
  {
    id: 'leg-1',
    room_id: 'room-tokyo-2026',
    day_id: 'day-tokyo-1',
    departure_time: '08:10',
    from: 'Hotel Gracery',
    to: 'Senso-ji Temple',
    landmark_id: 'landmark-sensoji',
    options: [
      { id: 'opt-l1-1', mode: 'Train', icon: '🚆', duration: '45m', price: '$4', ai_picked: false },
      { id: 'opt-l1-2', mode: 'Bus', icon: '🚌', duration: '1h', price: '$2', ai_picked: true },
      { id: 'opt-l1-3', mode: 'Taxi', icon: '🚕', duration: '30m', price: '$15', ai_picked: false },
    ],
  },
  {
    id: 'leg-2',
    room_id: 'room-tokyo-2026',
    day_id: 'day-tokyo-1',
    departure_time: '11:30',
    from: 'Senso-ji Temple',
    to: 'Shibuya Sky',
    landmark_id: 'landmark-shibuya-sky',
    options: [
      { id: 'opt-l2-1', mode: 'Train', icon: '🚆', duration: '35m', price: '$3', ai_picked: true },
      { id: 'opt-l2-2', mode: 'Bus', icon: '🚌', duration: '55m', price: '$2', ai_picked: false },
    ],
  },
  {
    id: 'leg-3',
    room_id: 'room-tokyo-2026',
    day_id: 'day-tokyo-2',
    departure_time: '09:00',
    from: 'Hotel Gracery',
    to: 'Kinkaku-ji',
    landmark_id: 'landmark-kinkakuji',
    options: [
      { id: 'opt-l3-1', mode: 'Train', icon: '🚆', duration: '2h 15m', price: '$95', ai_picked: true },
      { id: 'opt-l3-2', mode: 'Bus', icon: '🚌', duration: '5h', price: '$30', ai_picked: false },
    ],
  },
];

/** Safety banner data for Active/Live stage (Assumption 3) */
export const mockSafetyBanner = {
  id: 'safety-banner-1',
  alert_id: 'alert-tokyo-typhoon',
  title: 'AI Safety Check',
  message: 'Heavy rain expected in Kyoto area this afternoon. Consider indoor alternatives.',
  dismissible: true,
};