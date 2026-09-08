import { User } from '@/models/user';
import { TripRoom, TripRoomMember, TripPreferences } from '@/models/trip-room';
import { ItineraryDay, ItineraryItem } from '@/models/itinerary';
import { Message } from '@/models/chat';
import { DecisionCard, Vote } from '@/models/decision';
import { BudgetCategory, Expense, ExpenseSplit, ReceiptScan, Settlement } from '@/models/budget';
import { AlbumPhoto } from '@/models/album';
import { Landmark } from '@/models/landmark';
import { SafetyAlert } from '@/models/safety';
import { CommunityPost, StarredTrip } from '@/models/discover';
import { LanguageLesson } from '@/models/language';
import { Badge } from '@/models/badge';
import { AppNotification } from '@/models/notification';

// ==========================================
// 1. USERS (Canonical 5 Demo Users)
// ==========================================
export const mockStandardUsers: User[] = [
  {
    id: '00000000-0000-0000-0000-000000000001',
    email: 'alex@example.com',
    auth_provider: 'email',
    name: 'Alex Chen',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop',
    home_country: 'Singapore',
    created_at: '2026-08-01T00:00:00Z',
  },
  {
    id: '00000000-0000-0000-0000-000000000002',
    email: 'taylor@example.com',
    auth_provider: 'google',
    name: 'Taylor Swift',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&h=200&fit=crop',
    home_country: 'United States',
    created_at: '2026-08-15T00:00:00Z',
  },
  {
    id: '00000000-0000-0000-0000-000000000003',
    email: 'sam@example.com',
    auth_provider: 'email',
    name: 'Sam Lee',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop',
    home_country: 'Malaysia',
    created_at: '2026-08-20T00:00:00Z',
  },
  {
    id: '00000000-0000-0000-0000-000000000004',
    email: 'elena@example.com',
    auth_provider: 'email',
    name: 'Elena Rostova',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop',
    home_country: 'Canada',
    created_at: '2026-08-25T00:00:00Z',
  },
  {
    id: '00000000-0000-0000-0000-000000000005',
    email: 'kenji@example.com',
    auth_provider: 'email',
    name: 'Kenji Sato',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop',
    home_country: 'Japan',
    created_at: '2026-08-30T00:00:00Z',
  },
];

export const currentDemoUser = mockStandardUsers[0];

// ==========================================
// 2. TRIP ROOMS
// ==========================================
export const mockStandardTripRooms: TripRoom[] = [
  {
    id: 'room-tokyo-2026',
    name: 'Tokyo Autumn Escape 🍁',
    destination: 'Tokyo, Japan',
    stage: 'active',
    created_by: '00000000-0000-0000-0000-000000000001',
    start_date: '2026-10-10',
    end_date: '2026-10-16',
    theme_color: '#FB8C00', // Autumn
    is_public: true,
    invite_code: 'TOK26A',
    cover_image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=800&fit=crop',
  },
  {
    id: 'room-swiss-2027',
    name: 'Swiss Alps Winter Retreat ❄️',
    destination: 'Zermatt, Switzerland',
    stage: 'planning',
    created_by: '00000000-0000-0000-0000-000000000001',
    start_date: '2027-01-14',
    end_date: '2027-01-22',
    theme_color: '#C9DEEF', // Winter
    is_public: false,
    invite_code: 'SWISS7',
    cover_image: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?w=800&fit=crop',
  },
  {
    id: 'room-bali-2025',
    name: 'Bali Coastal Getaway 🌴',
    destination: 'Bali, Indonesia',
    stage: 'archived',
    created_by: '00000000-0000-0000-0000-000000000001',
    start_date: '2025-08-01',
    end_date: '2025-08-08',
    theme_color: '#697E50', // Summer
    is_public: true,
    invite_code: 'BALI25',
    cover_image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&fit=crop',
  },
  {
    id: 'room-kyoto-clone',
    name: 'Kyoto Spring Discovery 🌸',
    destination: 'Kyoto, Japan',
    stage: 'planning',
    created_by: '00000000-0000-0000-0000-000000000001',
    start_date: '2026-04-02',
    end_date: '2026-04-08',
    theme_color: '#FEB1C6', // Spring
    is_public: true,
    invite_code: 'KYO26P',
    cover_image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&fit=crop',
  },
];

// ==========================================
// 3. TRIP ROOM MEMBERS
// ==========================================
export const mockStandardTripMembers: TripRoomMember[] = [
  // room-tokyo-2026 members
  {
    room_id: 'room-tokyo-2026',
    user_id: '00000000-0000-0000-0000-000000000001',
    role: 'owner',
    location_sharing_opt_in: true,
    joined_at: '2026-09-01T00:00:00Z',
    is_live_for_user: true, // Only one live trip per user per FR-2-4
    user: {
      name: 'Alex Chen',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop',
    },
  },
  {
    room_id: 'room-tokyo-2026',
    user_id: '00000000-0000-0000-0000-000000000002',
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
    user_id: '00000000-0000-0000-0000-000000000003',
    role: 'member',
    location_sharing_opt_in: false,
    joined_at: '2026-09-03T12:00:00Z',
    is_live_for_user: false,
    user: {
      name: 'Sam Lee',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop',
    },
  },
  {
    room_id: 'room-tokyo-2026',
    user_id: '00000000-0000-0000-0000-000000000004',
    role: 'member',
    location_sharing_opt_in: true,
    joined_at: '2026-09-04T15:00:00Z',
    is_live_for_user: false,
    user: {
      name: 'Elena Rostova',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop',
    },
  },
  {
    room_id: 'room-tokyo-2026',
    user_id: '00000000-0000-0000-0000-000000000005',
    role: 'member',
    location_sharing_opt_in: true,
    joined_at: '2026-09-05T09:00:00Z',
    is_live_for_user: false,
    user: {
      name: 'Kenji Sato',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop',
    },
  },

  // room-swiss-2027 members
  {
    room_id: 'room-swiss-2027',
    user_id: '00000000-0000-0000-0000-000000000001',
    role: 'owner',
    location_sharing_opt_in: false,
    joined_at: '2026-09-01T00:00:00Z',
    is_live_for_user: false,
    user: {
      name: 'Alex Chen',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop',
    },
  },

  // room-bali-2025 members
  {
    room_id: 'room-bali-2025',
    user_id: '00000000-0000-0000-0000-000000000001',
    role: 'owner',
    location_sharing_opt_in: false,
    joined_at: '2025-07-20T00:00:00Z',
    is_live_for_user: false,
    user: {
      name: 'Alex Chen',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop',
    },
  },
];

// ==========================================
// 4. TRIP PREFERENCES
// ==========================================
export const mockStandardPreferences: Record<string, TripPreferences> = {
  'room-tokyo-2026': {
    room_id: 'room-tokyo-2026',
    companions: 'couple',
    travel_style: 'cultural',
    travel_pace: 'moderate',
    updated_at: '2026-09-01T00:00:00Z',
  },
  'room-swiss-2027': {
    room_id: 'room-swiss-2027',
    companions: 'friends',
    travel_style: 'nature',
    travel_pace: 'moderate',
    updated_at: '2026-09-01T00:00:00Z',
  },
  'room-bali-2025': {
    room_id: 'room-bali-2025',
    companions: 'family',
    travel_style: 'classic',
    travel_pace: 'relaxed',
    updated_at: '2025-07-20T00:00:00Z',
  },
};

// ==========================================
// 5. ITINERARY DAYS
// ==========================================
export const mockStandardItineraryDays: ItineraryDay[] = [
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
  {
    id: 'day-tokyo-4',
    room_id: 'room-tokyo-2026',
    day_number: 4,
    trip_date: '2026-10-13',
    title: 'Tsukiji Market & Ginza Art Walk',
    notes: 'Dawn departure for freshest sushi breakfast.',
  },
  {
    id: 'day-tokyo-5',
    room_id: 'room-tokyo-2026',
    day_number: 5,
    trip_date: '2026-10-14',
    title: 'Shinjuku Gyoen Autumn Leaves & Farewell',
    notes: 'Pack luggage and take airport limousine bus.',
  },
];

// ==========================================
// 6. ITINERARY ITEMS (Transportation / Attraction / Stay)
// ==========================================
export const mockStandardItineraryItems: ItineraryItem[] = [
  // Day 1
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
  // Day 2
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
  {
    id: 'item-6',
    room_id: 'room-tokyo-2026',
    day_id: 'day-tokyo-2',
    name: 'Akihabara Electric Town Walk',
    category: 'attraction',
    scheduled_time: '03:30 PM',
    sort_order: 3,
    lat: 35.6983,
    lng: 139.7731,
    tags: ['Anime', 'Tech', 'Arcade'],
  },
];

// ==========================================
// 7. DECISION CARDS & VOTES
// ==========================================
export const mockStandardDecisionCards: DecisionCard[] = [
  {
    id: 'card-dinner-1',
    room_id: 'room-tokyo-2026',
    trigger_type: 'conflict',
    title: 'Dinner Choice for Shibuya Evening',
    description: 'Decide where the group should dine after Shibuya Sky observation deck.',
    options: [
      { id: 'opt-1', label: 'Ichiran Ramen Shibuya (Casual)', votes_count: 2 },
      { id: 'opt-2', label: 'Sushi Midori Shibuya Prime (Seafood)', votes_count: 1 },
      { id: 'opt-3', label: 'Torikizoku Yakitori (Izakaya)', votes_count: 0 },
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
      { id: 'opt-rain-1', label: 'Shift to Tokyo National Museum (Indoor)', votes_count: 3 },
      { id: 'opt-rain-2', label: 'Keep Outdoor Walking Route with Umbrellas', votes_count: 0 },
    ],
    status: 'resolved',
    anonymous: false,
    created_at: '2026-09-06T08:00:00Z',
    resolved_at: '2026-09-06T09:30:00Z',
    winning_option_id: 'opt-rain-1',
  },
  {
    id: 'card-train-time',
    room_id: 'room-tokyo-2026',
    trigger_type: 'disruption',
    title: 'Departure Time: Kyoto Shinkansen Leg',
    description: 'Co-travelers picking between early express train or leisurely morning departure.',
    options: [
      { id: 'opt-train-early', label: 'Early Express (07:45 AM)', votes_count: 2 },
      { id: 'opt-train-late', label: 'Leisurely Bullet (09:15 AM)', votes_count: 2 },
    ],
    status: 'active',
    anonymous: true,
    created_at: '2026-09-07T11:00:00Z',
  },
];

export const mockStandardVotes: Vote[] = [
  { id: 'v-1', decision_card_id: 'card-dinner-1', user_id: '00000000-0000-0000-0000-000000000001', chosen_option: 'opt-1', created_at: '2026-09-05T10:21:00Z' },
  { id: 'v-2', decision_card_id: 'card-dinner-1', user_id: '00000000-0000-0000-0000-000000000002', chosen_option: 'opt-1', created_at: '2026-09-05T10:22:00Z' },
  { id: 'v-3', decision_card_id: 'card-dinner-1', user_id: '00000000-0000-0000-0000-000000000003', chosen_option: 'opt-2', created_at: '2026-09-05T10:23:00Z' },
];

// ==========================================
// 8. MESSAGES (User, System, Mascot)
// ==========================================
export const mockStandardMessages: Message[] = [
  {
    id: 'msg-1',
    room_id: 'room-tokyo-2026',
    sender_id: '00000000-0000-0000-0000-000000000001',
    sender_type: 'user',
    sender_name: 'Alex Chen',
    sender_avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop',
    text: 'Hey team! Added Shibuya Sky tickets for sunset at 5:30 PM.',
    type: 'text',
    created_at: '2026-09-05T10:15:00Z',
  },
  {
    id: 'msg-2',
    room_id: 'room-tokyo-2026',
    sender_id: '00000000-0000-0000-0000-000000000002',
    sender_type: 'user',
    sender_name: 'Taylor Swift',
    sender_avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&h=200&fit=crop',
    text: 'Awesome! Should we do ramen or sushi afterward?',
    type: 'text',
    created_at: '2026-09-05T10:17:00Z',
  },
  {
    id: 'msg-3',
    room_id: 'room-tokyo-2026',
    sender_id: null,
    sender_type: 'mascot',
    sender_name: 'Roti Corgi 🐕',
    text: '💡 Roti Tip: Evening rain forecast for Oct 12. I recommend moving the outdoor rooftop visit to Oct 11 afternoon for optimal visibility!',
    type: 'text',
    created_at: '2026-09-05T10:18:00Z',
  },
  {
    id: 'msg-4',
    room_id: 'room-tokyo-2026',
    sender_id: '00000000-0000-0000-0000-000000000001',
    sender_type: 'user',
    sender_name: 'Alex Chen',
    text: 'Let us vote on dinner choice!',
    type: 'decision_card',
    payload: {
      card_id: 'card-dinner-1',
    },
    created_at: '2026-09-05T10:20:00Z',
  },
  {
    id: 'msg-5',
    room_id: 'room-tokyo-2026',
    sender_id: null,
    sender_type: 'system',
    text: 'ReRoute Notice: Itinerary Day 1 updated by Alex Chen',
    type: 'system_event',
    created_at: '2026-09-05T11:00:00Z',
  },
];

// ==========================================
// 9. BUDGET, EXPENSES, OCR & SETTLEMENTS
// ==========================================
export const mockStandardBudgetCategories: BudgetCategory[] = [
  { id: 'cat-stay', room_id: 'room-tokyo-2026', category_name: 'Accommodation', planned_amount: 800, spent_amount: 560 },
  { id: 'cat-transit', room_id: 'room-tokyo-2026', category_name: 'Transit & Trains', planned_amount: 350, spent_amount: 215 },
  { id: 'cat-food', room_id: 'room-tokyo-2026', category_name: 'Food & Dining', planned_amount: 600, spent_amount: 420 },
  { id: 'cat-activities', room_id: 'room-tokyo-2026', category_name: 'Attractions & Tickets', planned_amount: 250, spent_amount: 110 },
];

export const mockStandardExpenses: Expense[] = [
  {
    id: 'exp-1',
    room_id: 'room-tokyo-2026',
    category_id: 'cat-stay',
    category_name: 'Accommodation',
    description: 'Hotel Gracery 4-Night Deposit',
    total_amount: 560,
    currency: 'USD',
    paid_by: ['00000000-0000-0000-0000-000000000001'],
    payer_names: ['Alex Chen'],
    created_by: '00000000-0000-0000-0000-000000000001',
    created_at: '2026-09-01T10:00:00Z',
    splits: [
      { id: 'sp-1', expense_id: 'exp-1', user_id: '00000000-0000-0000-0000-000000000001', user_name: 'Alex Chen', split_type: 'equal', share_value: 1, amount_owed: 186.67 },
      { id: 'sp-2', expense_id: 'exp-1', user_id: '00000000-0000-0000-0000-000000000002', user_name: 'Taylor Swift', split_type: 'equal', share_value: 1, amount_owed: 186.67 },
      { id: 'sp-3', expense_id: 'exp-1', user_id: '00000000-0000-0000-0000-000000000003', user_name: 'Sam Lee', split_type: 'equal', share_value: 1, amount_owed: 186.66 },
    ],
  },
  {
    id: 'exp-2',
    room_id: 'room-tokyo-2026',
    category_id: 'cat-food',
    category_name: 'Food & Dining',
    description: 'Tsukiji Outer Market Seafood Lunch',
    total_amount: 14500,
    currency: 'JPY', // Mixed currency example flagged per FR-2-9a
    paid_by: ['00000000-0000-0000-0000-000000000002'],
    payer_names: ['Taylor Swift'],
    created_by: '00000000-0000-0000-0000-000000000002',
    created_at: '2026-09-02T12:30:00Z',
    splits: [
      { id: 'sp-4', expense_id: 'exp-2', user_id: '00000000-0000-0000-0000-000000000001', user_name: 'Alex Chen', split_type: 'equal', share_value: 1, amount_owed: 4833.33 },
      { id: 'sp-5', expense_id: 'exp-2', user_id: '00000000-0000-0000-0000-000000000002', user_name: 'Taylor Swift', split_type: 'equal', share_value: 1, amount_owed: 4833.33 },
      { id: 'sp-6', expense_id: 'exp-2', user_id: '00000000-0000-0000-0000-000000000003', user_name: 'Sam Lee', split_type: 'equal', share_value: 1, amount_owed: 4833.34 },
    ],
  },
  {
    id: 'exp-3',
    room_id: 'room-tokyo-2026',
    category_id: 'cat-transit',
    category_name: 'Transit & Trains',
    description: 'Shinkansen Bullet Train Tokyo → Kyoto',
    total_amount: 380,
    currency: 'USD',
    paid_by: ['00000000-0000-0000-0000-000000000005'],
    payer_names: ['Kenji Sato'],
    created_by: '00000000-0000-0000-0000-000000000005',
    created_at: '2026-09-03T09:00:00Z',
    splits: [
      { id: 'sp-7', expense_id: 'exp-3', user_id: '00000000-0000-0000-0000-000000000001', user_name: 'Alex Chen', split_type: 'equal', share_value: 1, amount_owed: 95.0 },
      { id: 'sp-8', expense_id: 'exp-3', user_id: '00000000-0000-0000-0000-000000000002', user_name: 'Taylor Swift', split_type: 'equal', share_value: 1, amount_owed: 95.0 },
      { id: 'sp-9', expense_id: 'exp-3', user_id: '00000000-0000-0000-0000-000000000003', user_name: 'Sam Lee', split_type: 'equal', share_value: 1, amount_owed: 95.0 },
      { id: 'sp-10', expense_id: 'exp-3', user_id: '00000000-0000-0000-0000-000000000005', user_name: 'Kenji Sato', split_type: 'equal', share_value: 1, amount_owed: 95.0 },
    ],
  },
];

export const mockStandardReceiptScan: ReceiptScan = {
  id: 'ocr-scan-1',
  expense_id: 'exp-2',
  image_url: 'https://images.unsplash.com/photo-1554415707-9e49016a442e?w=800&fit=crop',
  ocr_status: 'completed',
  extracted_data: {
    merchant_name: 'Sakura Izakaya (居酒屋 錦小路 さくら)',
    date: '2026-10-11',
    total_amount: 5544,
    currency: 'JPY',
    line_items: [
      { name: '生ビール (Draft Beer) x1', price: 680 },
      { name: '枝豆 (Edamame) x2', price: 450 },
      { name: '鶏唐揚げ (Fried Chicken) x1', price: 780 },
      { name: '焼き鳥盛合 (Yakitori Platter) x1', price: 1200 },
      { name: 'ラーメン (Ramen) x1', price: 980 },
      { name: '冷酒 (Chilled Sake) x1', price: 950 },
    ],
  },
};

export const mockStandardSettlements: Settlement[] = [
  {
    id: 'set-1',
    room_id: 'room-tokyo-2026',
    from_user_id: '00000000-0000-0000-0000-000000000002',
    from_user_name: 'Taylor Swift',
    to_user_id: '00000000-0000-0000-0000-000000000001',
    to_user_name: 'Alex Chen',
    amount: 85.5,
    currency: 'USD',
    method: 'Venmo',
    settled_at: '2026-09-03T18:00:00Z',
  },
];

// ==========================================
// 10. ALBUM PHOTOS
// ==========================================
export const mockStandardAlbumPhotos: AlbumPhoto[] = [
  {
    id: 'photo-1',
    room_id: 'room-tokyo-2026',
    uploaded_by: '00000000-0000-0000-0000-000000000001',
    uploader_name: 'Alex Chen',
    url: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=800&fit=crop',
    taken_at: '2026-10-10T17:45:00Z',
    location_name: 'Shibuya Crossing',
    itinerary_day_id: 'day-tokyo-1',
    caption: 'Sunset across Tokyo skyline!',
  },
  {
    id: 'photo-2',
    room_id: 'room-tokyo-2026',
    uploaded_by: '00000000-0000-0000-0000-000000000002',
    uploader_name: 'Taylor Swift',
    url: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?w=800&fit=crop',
    taken_at: '2026-10-11T10:15:00Z',
    location_name: 'Senso-ji Temple',
    itinerary_day_id: 'day-tokyo-2',
    caption: 'Giant red lantern of Kaminarimon Gate.',
  },
  {
    id: 'photo-3',
    room_id: 'room-tokyo-2026',
    uploaded_by: '00000000-0000-0000-0000-000000000003',
    uploader_name: 'Sam Lee',
    url: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&fit=crop',
    taken_at: '2026-10-12T14:30:00Z',
    location_name: 'Meiji Jingu Forest',
    itinerary_day_id: 'day-tokyo-3',
    caption: 'Peaceful cedar pathway in Harajuku.',
  },
];

// ==========================================
// 11. LANDMARKS
// ==========================================
export const mockStandardLandmarks: Landmark[] = [
  {
    id: 'landmark-sensoji',
    name: 'Senso-ji Temple',
    destination: 'Tokyo, Japan',
    lat: 35.7148,
    lng: 139.7967,
    model_asset_url: 'https://assets.reroute.app/3d/sensoji_optimized.glb', // Pre-generated 3D landmark per FR-1-7
    photo_urls: [
      'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=800&fit=crop',
      'https://images.unsplash.com/photo-1542051841857-5f90071e7989?w=800&fit=crop',
    ],
    dropoff_point: {
      lat: 35.7135,
      lng: 139.7955,
      name: 'Asakusa Kaminarimon Gate Taxi Stand',
      notes: 'Best drop-off point right outside the red lantern gate. Walking street begins here.',
    },
    info_text: 'Senso-ji is Tokyo’s oldest Buddhist temple founded in 645 AD, dedicated to the Bodhisattva Kannon.',
    fun_facts: [
      'The giant red lantern weighs roughly 700 kilograms.',
      'Drawing bad fortunes (omikuji) is traditional here — tie them to wire stands to leave the bad luck behind!',
    ],
  },
  {
    id: 'landmark-shibuya-sky',
    name: 'Shibuya Sky Observation Deck',
    destination: 'Tokyo, Japan',
    lat: 35.6585,
    lng: 139.7013,
    model_asset_url: null, // No 3D model -> 3D tab hidden entirely per FR-1-7
    photo_urls: [
      'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=800&fit=crop',
    ],
    dropoff_point: {
      lat: 35.659,
      lng: 139.7005,
      name: 'Shibuya Scramble Square B1 Drop-off',
      notes: 'Take the direct elevator from 1F/B1 to the 14F Sky ticket entry gate.',
    },
    info_text: 'Perched 229 meters above Shibuya Crossing, offering a panoramic 360-degree glass rooftop vista of Mount Fuji and Tokyo Tower.',
    fun_facts: [
      'Look straight down through the glass corner to see thousands crossing Shibuya intersection below.',
    ],
  },
  {
    id: 'landmark-kinkakuji',
    name: 'Kinkaku-ji (Golden Pavilion)',
    destination: 'Kyoto, Japan',
    lat: 35.0394,
    lng: 135.7292,
    model_asset_url: 'https://assets.reroute.app/3d/kinkakuji_optimized.glb',
    photo_urls: [
      'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&fit=crop',
    ],
    dropoff_point: {
      lat: 35.0385,
      lng: 135.7285,
      name: 'Kinkaku-ji Michi Bus Stop',
      notes: 'Direct 2-min walk to main gate entrance.',
    },
    info_text: 'Zen Buddhist temple whose top two floors are completely covered in pure gold leaf, overlooking Mirror Pond (Kyoko-chi).',
    fun_facts: [
      'The gold leaf was restored in 1987 with a coating five times thicker than the original.',
      'The phoenix on the rooftop symbolizes rebirth and longevity.',
    ],
  },
];

// ==========================================
// 12. SAFETY ALERTS & PERSONALIZED NEWS
// ==========================================
export const mockStandardSafetyAlerts: SafetyAlert[] = [
  {
    id: 'alert-tokyo-typhoon',
    destination: 'Tokyo, Japan',
    risk_level: 'moderate',
    title: 'Autumn Rainstorm Advisory for Kanto Region',
    summary: 'Gusty winds and heavy evening precipitation expected between Oct 12–13. Metro lines operating on normal schedule with minor delay buffers.',
    source_url: 'https://www.jma.go.jp/bosai/warning/',
    source_name: 'Japan Meteorological Agency (JMA)',
    fetched_at: '2026-09-06T08:00:00Z',
    emergency_number: '110 / 119',
    weather_snapshot: {
      temperature_c: 18,
      condition: 'Rain & Gusts',
      wind_kmh: 38,
      precipitation_chance: 85,
      season: 'autumn',
    },
  },
  {
    id: 'alert-kyoto-bloom',
    destination: 'Kyoto, Japan',
    risk_level: 'low',
    title: 'Cherry Blossom Peak Bloom Update',
    summary: 'Spring bloom forecasted for early April across Arashiyama and Maruyama Park. Ideal conditions for outdoor illumination walks.',
    source_url: 'https://www.jma.go.jp/bosai/sakura/',
    source_name: 'JMA Forecast',
    fetched_at: '2026-09-07T06:00:00Z',
    emergency_number: '110 / 119',
    weather_snapshot: {
      temperature_c: 21,
      condition: 'Sunny & Clear',
      wind_kmh: 12,
      precipitation_chance: 10,
      season: 'spring',
    },
  },
  {
    id: 'alert-swiss-snow',
    destination: 'Zermatt, Switzerland',
    risk_level: 'moderate',
    title: 'Glacier Trail Wind Chill Warning',
    summary: 'Temperatures down to -12°C with high alpine winds above 3,000m. Gornergrat railway operating with winter chains.',
    source_url: 'https://www.meteoswiss.admin.ch/',
    source_name: 'MeteoSwiss Alert',
    fetched_at: '2026-09-07T12:00:00Z',
    emergency_number: '112 / 144',
    weather_snapshot: {
      temperature_c: -8,
      condition: 'Blizzard',
      wind_kmh: 45,
      precipitation_chance: 90,
      season: 'winter',
    },
  },
];

// ==========================================
// 13. COMMUNITY POSTS & DISCOVER FEED (Public-Only per v2.2)
// ==========================================
export const mockStandardCommunityPosts: CommunityPost[] = [
  {
    id: 'post-kyoto-1',
    user_id: '00000000-0000-0000-0000-000000000002',
    author_name: 'Taylor Swift',
    author_avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&h=200&fit=crop',
    type: 'cloneable_itinerary',
    title: '4 Days in Kyoto: Temples, Bamboo & Matcha Cafes',
    destination: 'Kyoto, Japan',
    cover_image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&fit=crop',
    duration_days: 4,
    travel_style: 'Cultural',
    travel_pace: 'Moderate',
    content: 'An unforgettable escape through Arashiyama bamboo forest, Fushimi Inari torii gates at sunrise, and Gion tea houses.',
    linked_room_id: 'room-kyoto-clone',
    stars_count: 142,
    is_starred: true,
    created_at: '2026-08-20T11:00:00Z',
  },
  {
    id: 'post-seoul-1',
    user_id: '00000000-0000-0000-0000-000000000003',
    author_name: 'Sam Lee',
    author_avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop',
    type: 'recap',
    title: 'Autumn in Seoul: Street Markets & Hanok Villages',
    destination: 'Seoul, South Korea',
    cover_image: 'https://images.unsplash.com/photo-1538485399081-7191377e8241?w=800&fit=crop',
    duration_days: 5,
    travel_style: 'Cityscape',
    travel_pace: 'Ambitious',
    content: 'Highlights from Gwangjang Market spicy tteokbokki, N Seoul Tower night vista, and Bukchon Hanok heritage walks.',
    stars_count: 89,
    is_starred: false,
    created_at: '2026-08-28T09:30:00Z',
  },
  {
    id: 'post-swiss-1',
    user_id: '00000000-0000-0000-0000-000000000001',
    author_name: 'Alex Chen',
    author_avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop',
    type: 'cloneable_itinerary',
    title: 'Zermatt & Matterhorn Glacier Trail Expedition',
    destination: 'Zermatt, Switzerland',
    cover_image: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?w=800&fit=crop',
    duration_days: 6,
    travel_style: 'Nature',
    travel_pace: 'Moderate',
    content: 'Riding the Gornergrat cogwheel train, hiking the 5-lakes trail, and Swiss fondue evenings.',
    linked_room_id: 'room-swiss-2027',
    stars_count: 215,
    is_starred: false,
    created_at: '2026-09-01T15:00:00Z',
  },
  {
    id: 'post-tokyo-tech',
    user_id: '00000000-0000-0000-0000-000000000005',
    author_name: 'Kenji Sato',
    author_avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop',
    type: 'cloneable_itinerary',
    title: 'Tokyo Tech, Ramen & Neon Lights',
    destination: 'Tokyo, Japan',
    cover_image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=800&fit=crop',
    duration_days: 5,
    travel_style: 'Cityscape',
    travel_pace: 'Ambitious',
    content: 'Akihabara electronic treasure hunt, Shibuya rooftop bar, teamLab digital art museum, and Shinjuku ramen alleys.',
    linked_room_id: 'room-tokyo-2026',
    stars_count: 310,
    is_starred: true,
    created_at: '2026-09-02T10:00:00Z',
  },
];

export const mockStandardStarredTrips: StarredTrip[] = [
  {
    user_id: '00000000-0000-0000-0000-000000000001',
    post_id: 'post-kyoto-1',
    starred_at: '2026-08-25T12:00:00Z',
    post: mockStandardCommunityPosts[0],
  },
  {
    user_id: '00000000-0000-0000-0000-000000000001',
    post_id: 'post-tokyo-tech',
    starred_at: '2026-09-03T18:00:00Z',
    post: mockStandardCommunityPosts[3],
  },
];

// ==========================================
// 14. LANGUAGE LESSONS & QUIZZES
// ==========================================
export const mockStandardLanguageLessons: LanguageLesson[] = [
  {
    id: 'lesson-jp-food',
    destination: 'Tokyo, Japan',
    language_name: 'Japanese',
    category: 'food',
    title: 'Ordering Delicious Ramen & Food',
    description: 'Learn essential phrases to order dishes and ask for the bill with confidence.',
    xp_reward: 50,
    is_completed: true,
    lesson_content: [
      { phrase: 'Kore o kudasai', translation: 'Please give me this one.', romanization: 'ko-reh oh koo-dah-sai' },
      { phrase: 'Okaikei o onegaishimasu', translation: 'The bill, please.', romanization: 'oh-kai-kay oh oh-neh-guy-she-mass' },
      { phrase: 'Oishii desu', translation: 'This is delicious!', romanization: 'oy-shee dess' },
    ],
    quiz_questions: [
      {
        id: 'q1',
        prompt: 'How do you politely ask for the bill in Japanese?',
        options: [
          { id: 'o1', text: 'Okaikei o onegaishimasu', is_correct: true },
          { id: 'o2', text: 'Arigato gozaimasu', is_correct: false },
          { id: 'o3', text: 'Sumimasen', is_correct: false },
        ],
      },
      {
        id: 'q2',
        prompt: 'What does "Kore o kudasai" mean?',
        options: [
          { id: 'o4', text: 'Where is the station?', is_correct: false },
          { id: 'o5', text: 'Please give me this one', is_correct: true },
          { id: 'o6', text: 'Excuse me', is_correct: false },
        ],
      },
    ],
  },
  {
    id: 'lesson-jp-transit',
    destination: 'Tokyo, Japan',
    language_name: 'Japanese',
    category: 'transit',
    title: 'Subway & Station Navigation',
    description: 'Master asking for directions, train platforms, and transfer gates.',
    xp_reward: 50,
    is_completed: false,
    lesson_content: [
      { phrase: 'Eki wa doko desu ka?', translation: 'Where is the train station?', romanization: 'eh-kee wah doh-koh dess kah' },
      { phrase: 'Kono densha wa Shibuya ni ikimasu ka?', translation: 'Does this train go to Shibuya?', romanization: 'koh-noh den-shah wah she-boo-yah nee ee-kee-mass kah' },
    ],
    quiz_questions: [
      {
        id: 'q3',
        prompt: 'How do you ask "Where is the station?"',
        options: [
          { id: 'o7', text: 'Eki wa doko desu ka?', is_correct: true },
          { id: 'o8', text: 'Koko wa doko desu ka?', is_correct: false },
        ],
      },
    ],
  },
  {
    id: 'lesson-jp-greetings',
    destination: 'Tokyo, Japan',
    language_name: 'Japanese',
    category: 'stay',
    title: 'Greetings & Daily Etiquette',
    description: 'Polite bows, morning greetings, and saying thank you.',
    xp_reward: 30,
    is_completed: true,
    lesson_content: [
      { phrase: 'Arigatou gozaimasu', translation: 'Thank you very much', romanization: 'ah-ree-gah-toh goh-zai-mass' },
      { phrase: 'Konnichiwa', translation: 'Hello / Good afternoon', romanization: 'kohn-nee-chee-wah' },
    ],
    quiz_questions: [
      {
        id: 'q4',
        prompt: 'What is the polite phrase for "Thank you very much"?',
        options: [
          { id: 'o9', text: 'Arigatou gozaimasu', is_correct: true },
          { id: 'o10', text: 'Sayonara', is_correct: false },
        ],
      },
    ],
  },
];

// ==========================================
// 15. BADGES & ACHIEVEMENTS
// ==========================================
export const mockStandardBadges: Badge[] = [
  {
    id: 'b-1',
    user_id: '00000000-0000-0000-0000-000000000001',
    badge_type: 'first_escape',
    title: 'First Escape',
    description: 'Created your first collaborative trip room on ReRoute.',
    icon_name: '🚀',
    earned_at: '2026-08-01T00:00:00Z',
  },
  {
    id: 'b-2',
    user_id: '00000000-0000-0000-0000-000000000001',
    badge_type: 'globe_trotter',
    title: '3 Countries Visited',
    description: 'Planned trips across Japan, Switzerland, and Indonesia.',
    icon_name: '🌍',
    earned_at: '2026-09-01T00:00:00Z',
  },
  {
    id: 'b-3',
    user_id: '00000000-0000-0000-0000-000000000001',
    badge_type: 'language_scholar',
    title: 'Language Scholar',
    description: 'Completed Japanese Dining & Food Quiz with 100% score.',
    icon_name: '🎓',
    earned_at: '2026-09-04T00:00:00Z',
  },
  {
    id: 'b-4',
    user_id: '00000000-0000-0000-0000-000000000001',
    badge_type: 'route_master',
    title: 'Master Planner',
    description: 'Organized 5 distinct daily itinerary modules.',
    icon_name: '🧭',
    earned_at: '2026-09-05T00:00:00Z',
  },
  {
    id: 'b-5',
    user_id: '00000000-0000-0000-0000-000000000001',
    badge_type: 'budget_guru',
    title: 'Budget Guru',
    description: 'Logged and split expenses cleanly across 4 categories.',
    icon_name: '💳',
    earned_at: '2026-09-06T00:00:00Z',
  },
];

// ==========================================
// 16. MODULAR SUGGESTIONS (AI Itinerary Builder)
// ==========================================
export const mockStandardModularSuggestions = {
  transportation: [
    {
      id: 'sug-trans-1',
      name: 'Shinkansen Bullet Train (Tokyo → Kyoto)',
      category: 'transportation' as const,
      scheduled_time: '08:30 AM',
      sort_order: 1,
      lat: 35.6812,
      lng: 139.7671,
      cost_estimate: 95,
      duration_minutes: 135,
      booking_url: 'https://smart-ex.jp/en/reservation/',
      tags: ['Fast', 'Scenic', 'High-Speed Rail'],
    },
    {
      id: 'sug-trans-2',
      name: 'Tokyo Metro 72-Hour Unlimited Tourist Pass',
      category: 'transportation' as const,
      scheduled_time: '11:00 AM',
      sort_order: 2,
      lat: 35.6895,
      lng: 139.6917,
      cost_estimate: 12,
      booking_url: 'https://www.tokyometro.jp/en/ticket/travel/',
      tags: ['Cost Saver', 'Subway'],
    },
  ],
  accommodation: [
    {
      id: 'sug-acc-1',
      name: 'Hotel Gracery Shinjuku (Godzilla Head)',
      category: 'stay' as const,
      scheduled_time: 'Check-in: 3:00 PM',
      sort_order: 1,
      lat: 35.6953,
      lng: 139.7022,
      cost_estimate: 140,
      address: '1-19-1 Kabukicho, Shinjuku, Tokyo',
      booking_url: 'https://shinjuku.gracery.com/en/',
      tags: ['City View', 'Central Location', '4 Stars'],
    },
    {
      id: 'sug-acc-2',
      name: 'Onyado Nono Asakusa Hot Springs Ryokan',
      category: 'stay' as const,
      scheduled_time: 'Check-in: 3:00 PM',
      sort_order: 2,
      lat: 35.7148,
      lng: 139.7967,
      cost_estimate: 165,
      address: '2-7-20 Asakusa, Taito, Tokyo',
      booking_url: 'https://www.hotespa.net/hotels/nono_asakusa/',
      tags: ['Onsen', 'Traditional', 'Tatami'],
    },
  ],
  attractions: [
    {
      id: 'sug-att-1',
      name: 'Senso-ji Ancient Temple & Nakamise Dori',
      category: 'attraction' as const,
      scheduled_time: '09:30 AM',
      sort_order: 1,
      lat: 35.7148,
      lng: 139.7967,
      duration_minutes: 90,
      tags: ['Historic', 'Photo Spot', 'Free Entry'],
    },
    {
      id: 'sug-att-2',
      name: 'Meiji Jingu Shrine & Forest Walk',
      category: 'attraction' as const,
      scheduled_time: '02:00 PM',
      sort_order: 2,
      lat: 35.6764,
      lng: 139.6993,
      duration_minutes: 75,
      tags: ['Nature', 'Spiritual', 'Peaceful'],
    },
    {
      id: 'sug-att-3',
      name: 'Shibuya Sky 360° Open-Air Rooftop',
      category: 'attraction' as const,
      scheduled_time: '05:30 PM',
      sort_order: 3,
      lat: 35.6585,
      lng: 139.7013,
      cost_estimate: 18,
      duration_minutes: 60,
      booking_url: 'https://www.shibuya-scramble-square.com/sky/',
      tags: ['Sunset', 'Cityscape', 'Panorama'],
    },
  ],
};

// ==========================================
// 17. NOTIFICATIONS
// ==========================================
export const mockStandardNotifications: AppNotification[] = [
  {
    id: 'notif-1',
    type: 'safety_risk',
    title: 'Rain & Wind Advisory: Shinjuku Area',
    message: 'Sudden rainstorm expected between 16:00 - 18:00. 2 outdoor route steps have indoor covered alternatives.',
    timestamp: '10m ago',
    isRead: false,
    urgency: 'high',
    routeTarget: '/(tabs)/trip',
    metadata: {
      risk_level: 'moderate',
      weather_condition: 'Heavy Rain & Wind',
      location_name: 'Shinjuku Station, East Exit',
    },
  },
  {
    id: 'notif-2',
    type: 'decision_card',
    title: 'Vote Needed: Dinner in Shibuya',
    message: 'Alex proposed 3 dinner spots. 3 of 5 members have recorded their vote.',
    timestamp: '25m ago',
    isRead: false,
    urgency: 'medium',
    routeTarget: '/(tabs)/trip',
    metadata: {
      vote_id: 'card-dinner-1',
      decision_options: ['Ichiran Ramen', 'Sushi Midori', 'Torikizoku'],
      decision_status: 'open',
    },
  },
  {
    id: 'notif-3',
    type: 'mascot_advisory',
    title: 'Roti Corgi Tip: Suica / Pasmo IC Cards',
    message: 'Tap your digital Suica card at ticket gates without opening Apple/Google Wallet! Keep your phone unlocked for faster tap.',
    timestamp: '1h ago',
    isRead: false,
    urgency: 'low',
    routeTarget: '/(tabs)/home',
    metadata: {
      mascot_mood: 'happy',
      tip_category: 'transit',
    },
  },
  {
    id: 'notif-4',
    type: 'budget_alert',
    title: 'New Expense Added: Shinkansen Tickets',
    message: 'Kenji paid $380 USD for 4 members. Your share is $95.00.',
    timestamp: '2h ago',
    isRead: true,
    urgency: 'low',
    routeTarget: '/(tabs)/trip',
    metadata: {
      expense_amount: '$380.00 USD',
      payer_name: 'Kenji Sato',
    },
  },
  {
    id: 'notif-5',
    type: 'safety_risk',
    title: 'Train Line Delay: Yamanote Line',
    message: '15-min delay on Yamanote Line due to track inspection. Consider taking Tokyo Metro Fukutoshin Line.',
    timestamp: '3h ago',
    isRead: true,
    urgency: 'medium',
    routeTarget: '/(tabs)/trip',
    metadata: {
      risk_level: 'low',
      location_name: 'Yamanote Outer Loop',
    },
  },
  {
    id: 'notif-6',
    type: 'community_star',
    title: 'Your Kyoto Itinerary is Trending!',
    message: '52 travelers starred your "4 Days in Kyoto: Temples & Tea" guide this week.',
    timestamp: '5h ago',
    isRead: true,
    urgency: 'low',
    routeTarget: '/(tabs)/profile',
    metadata: {
      landmark_name: 'Kyoto Highlights',
    },
  },
  {
    id: 'notif-7',
    type: 'sos_alert',
    title: 'Safety Test: GPS Signal Verified',
    message: 'Emergency SOS protocol test completed. Real-time location precision is ±4 meters.',
    timestamp: '1d ago',
    isRead: true,
    urgency: 'low',
    routeTarget: '/(tabs)/trip',
    metadata: {
      sos_sender_name: 'System Safety Monitor',
      sos_coordinates: { lat: 35.6762, lng: 139.6503 },
    },
  },
];

// ==========================================
// Standard Aliases & Convenience Exports
// ==========================================
export const mockStandardRoomMembers = mockStandardTripMembers;
export const mockStandardTripPreferences = Object.values(mockStandardPreferences);
export const mockStandardExpenseSplits: ExpenseSplit[] = mockStandardExpenses.flatMap((e) => e.splits || []);
export const mockStandardReceiptScans: ReceiptScan[] = [mockStandardReceiptScan];

