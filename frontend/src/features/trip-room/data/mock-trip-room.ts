import {
  mockStandardTripRooms,
  mockStandardRoomMembers,
  mockStandardTripPreferences,
  mockStandardItineraryDays,
  mockStandardItineraryItems,
  mockStandardMessages,
  mockStandardDecisionCards,
  mockStandardVotes,
  mockStandardBudgetCategories,
  mockStandardExpenses,
  mockStandardSettlements,
  mockStandardAlbumPhotos,
  mockStandardLandmarks,
  mockStandardSafetyAlerts,
} from '@/shared/data/standard-mock-data';

export const mockTripRooms = mockStandardTripRooms;
export const mockTripMembers = mockStandardRoomMembers;
export const mockTripPreferences = mockStandardTripPreferences[0];
export const mockItineraryDays = mockStandardItineraryDays;
export const mockItineraryItems = mockStandardItineraryItems;
export const mockMessages = mockStandardMessages;
export const mockDecisionCards = mockStandardDecisionCards;
export const mockVotes = mockStandardVotes;
export const mockBudgetCategories = mockStandardBudgetCategories;
export const mockExpenses = mockStandardExpenses;
export const mockSettlements = mockStandardSettlements;
export const mockAlbumPhotos = mockStandardAlbumPhotos;
export const mockLandmarks = mockStandardLandmarks;
export const mockSafetyAlerts = mockStandardSafetyAlerts;

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

export const mockSafetyBanner = {
  id: 'safety-banner-1',
  alert_id: 'alert-tokyo-typhoon',
  title: 'AI Safety Check',
  message: 'Heavy rain expected in Kyoto area this afternoon. Consider indoor alternatives.',
  dismissible: true,
};