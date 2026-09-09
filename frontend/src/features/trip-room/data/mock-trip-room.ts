import { roomMessages, chinaDays, chinaItems, chinaPhotos } from './room-history';
import type { ItineraryDay, ItineraryItem } from '@/models/itinerary';
import type { AlbumPhoto } from '@/models/album';
import type { DecisionCard } from '@/models/decision';
import {
  mockStandardTripRooms,
  mockStandardRoomMembers,
  mockStandardItineraryDays,
  mockStandardItineraryItems,
  mockStandardMessages,
  mockStandardDecisionCards,
  mockStandardVotes,
  mockStandardAlbumPhotos,
  mockStandardLandmarks,
  mockStandardSafetyAlerts,
  currentDemoUser,
} from '@/shared/data/standard-mock-data';
import { TripRoom, TripRoomMember } from '@/models/trip-room';
import { CommunityPost } from '@/models/discover';

export const mockTripRooms = mockStandardTripRooms;
export const mockTripMembers = mockStandardRoomMembers;
export const mockItineraryDays = mockStandardItineraryDays;
export const mockItineraryItems = mockStandardItineraryItems;
export const mockMessages = mockStandardMessages;
export const mockDecisionCards = mockStandardDecisionCards;
export const mockVotes = mockStandardVotes;
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

/**
 * Creates a new Planning stage Trip Room cloned from a community discover itinerary post (FR-8-5).
 */
export const cloneCommunityItineraryToTripRoom = (post: CommunityPost): TripRoom => {
  const newRoomId = `room-cloned-${Date.now()}`;
  const startDate = new Date();
  startDate.setDate(startDate.getDate() + 14);
  const duration = post.duration_days || 5;
  const endDate = new Date(startDate);
  endDate.setDate(startDate.getDate() + duration);

  const newRoom: TripRoom = {
    id: newRoomId,
    name: post.title,
    destination: post.destination,
    stage: 'planning',
    created_by: currentDemoUser.id,
    start_date: startDate.toISOString().split('T')[0],
    end_date: endDate.toISOString().split('T')[0],
    theme_color: '#ff8f06',
    is_public: false,
    cover_image: post.cover_image,
    invite_code: `RR-${Math.floor(1000 + Math.random() * 9000)}`,
  };

  mockTripRooms.unshift(newRoom);

  const ownerMember: TripRoomMember = {
    room_id: newRoomId,
    user_id: currentDemoUser.id,
    role: 'owner',
    location_sharing_opt_in: true,
    joined_at: new Date().toISOString(),
    is_live_for_user: false,
    user: {
      name: currentDemoUser.name,
      avatar: currentDemoUser.avatar,
    },
  };

  mockTripMembers.push(ownerMember);

  // Auto-populate itinerary days and items
  if (post.daily_breakdown && post.daily_breakdown.length > 0) {
    post.daily_breakdown.forEach((day, index) => {
      const dayId = `day-${newRoomId}-${day.day_number || index + 1}`;
      const dayDate = new Date(startDate);
      dayDate.setDate(startDate.getDate() + index);

      mockItineraryDays.push({
        id: dayId,
        room_id: newRoomId,
        day_number: day.day_number || index + 1,
        title: day.title || `Day ${index + 1}`,
        trip_date: dayDate.toISOString().split('T')[0],
      });

      if (day.stops && day.stops.length > 0) {
        day.stops.forEach((stop, sIdx) => {
          const cat = stop.category === 'stay' ? 'stay' : stop.category === 'transit' ? 'transportation' : 'attraction';
          mockItineraryItems.push({
            id: `item-${dayId}-${sIdx + 1}`,
            room_id: newRoomId,
            day_id: dayId,
            name: stop.name,
            lat: 35.0116 + index * 0.01,
            lng: 135.7681 + sIdx * 0.01,
            category: cat,
            scheduled_time: stop.time || (sIdx === 0 ? '09:00 AM' : sIdx === 1 ? '01:30 PM' : '06:00 PM'),
            sort_order: sIdx + 1,
            tags: stop.tag ? [stop.tag] : undefined,
          });
        });
      }
    });
  } else {
    // Generate structured fallback days and stops from key_stops or duration
    const stopsList = post.key_stops || [`Explore ${post.destination}`, `Historic Center Stroll`, `Local Gastronomy Tasting`];
    for (let i = 0; i < duration; i++) {
      const dayId = `day-${newRoomId}-${i + 1}`;
      const dayDate = new Date(startDate);
      dayDate.setDate(startDate.getDate() + i);

      mockItineraryDays.push({
        id: dayId,
        room_id: newRoomId,
        day_number: i + 1,
        title: i === 0 ? `Arrival & ${post.destination.split(',')[0]} Sights` : i === duration - 1 ? `Final Highlights & Departure` : `Exploring ${post.destination.split(',')[0]} (Part ${i + 1})`,
        trip_date: dayDate.toISOString().split('T')[0],
      });

      const dayStopName = stopsList[i % stopsList.length] || `Spot ${i + 1}`;
      mockItineraryItems.push({
        id: `item-${dayId}-1`,
        room_id: newRoomId,
        day_id: dayId,
        name: i === 0 ? `Check-in & Basecamp Arrival` : dayStopName,
        lat: 35.0116,
        lng: 135.7681,
        category: i === 0 ? 'stay' : 'attraction',
        scheduled_time: '10:00 AM',
        sort_order: 1,
      });

      mockItineraryItems.push({
        id: `item-${dayId}-2`,
        room_id: newRoomId,
        day_id: dayId,
        name: `Local Cuisine & Discovery Walk`,
        lat: 35.0120,
        lng: 135.7690,
        category: 'attraction',
        scheduled_time: '02:00 PM',
        sort_order: 2,
      });
    }
  }

  // Add a welcoming Mascot chat message
  mockMessages.push({
    id: `msg-cloned-${newRoomId}`,
    room_id: newRoomId,
    sender_id: 'system-mascot',
    sender_type: 'mascot',
    sender_name: 'Roti 🐶',
    text: `Welcome to your newly cloned trip: "${post.title}"! 🎉 I've imported ${duration} days of planned stops in ${post.destination}. You can invite friends, customize the itinerary, or ask me for advice anytime!`,
    type: 'text',
    created_at: new Date().toISOString(),
  });

  return newRoom;
};
