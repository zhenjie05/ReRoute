import { roomMessages } from './room-history';
import { createArchivedHistory } from './archived-history';
import { createDemoAlbum } from './demo-album';
import { seasonalThemes } from './season-presentation';
import { locationPhoto } from './location-photos';
import type { ItineraryDay, ItineraryItem } from '@/models/itinerary';
import type { AlbumPhoto } from '@/models/album';
import type { DecisionCard } from '@/models/decision';
import {
  mockStandardUsers,
  mockStandardItineraryDays,
  mockStandardItineraryItems,
  mockStandardMessages,
  mockStandardDecisionCards,
  mockStandardVotes,
  currentDemoUser,
} from '@/shared/data/standard-mock-data';
import { TripRoom, TripRoomMember } from '@/models/trip-room';
import { CommunityPost } from '@/models/discover';

export const mockTripRooms: TripRoom[] = [
  {
    id: 'room-bali-2026', name: 'Bali Coastal Escape', destination: 'Bali, Indonesia', stage: 'active',
    season: 'summer', season_theme: seasonalThemes.summer,
    created_by: currentDemoUser.id, start_date: '2026-09-09', end_date: '2026-09-15', theme_color: '#697E50',
    is_public: false, invite_code: 'BALI26', cover_image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=900&fit=crop', groupProfileImage: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=400&h=400&fit=crop',
  },
  {
    id: 'room-paris-2026', name: 'France City Discovery', destination: 'France', stage: 'planning',
    season: 'autumn', season_theme: seasonalThemes.autumn,
    created_by: currentDemoUser.id, start_date: '2026-10-18', end_date: '2026-10-27', theme_color: '#697E50',
    is_public: false, invite_code: 'FRANCE', cover_image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=900&fit=crop', groupProfileImage: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=400&h=400&fit=crop',
  },
  {
    id: 'room-tokyo-2026', name: 'Japan Autumn Journey', destination: 'Japan', stage: 'planning',
    season: 'autumn', season_theme: seasonalThemes.autumn,
    created_by: currentDemoUser.id, start_date: '2026-10-10', end_date: '2026-10-18', theme_color: '#FFC9D6',
    is_public: false, invite_code: 'JAPAN6', cover_image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=900&fit=crop', groupProfileImage: 'https://images.unsplash.com/photo-1542051812871-7575081404cb?w=400&h=400&fit=crop',
  },
  {
    id: 'room-china-2025', name: 'China Spring Heritage', destination: 'China', stage: 'archived', season: 'spring',
    season_theme: seasonalThemes.spring,
    created_by: currentDemoUser.id, start_date: '2025-04-01', end_date: '2025-04-08', theme_color: '#FFC9D6',
    is_public: false, invite_code: 'CN-SPR', cover_image: locationPhoto('Forbidden city, Beijing (5531772131).jpg').imageUrl, groupProfileImage: 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=400&h=400&fit=crop',
  },
  {
    id: 'room-australia-2025', name: 'Australia Summer Coast', destination: 'Australia', stage: 'archived', season: 'summer',
    season_theme: seasonalThemes.summer,
    created_by: currentDemoUser.id, start_date: '2025-01-12', end_date: '2025-01-21', theme_color: '#697E50',
    is_public: false, invite_code: 'AU-SUM', cover_image: locationPhoto('Sydney Opera House - Dec 2008.jpg').imageUrl, groupProfileImage: 'https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?w=400&h=400&fit=crop',
  },
  {
    id: 'room-canada-2024', name: 'Canada Maple Road Trip', destination: 'Canada', stage: 'archived', season: 'autumn',
    season_theme: seasonalThemes.autumn,
    created_by: currentDemoUser.id, start_date: '2024-10-03', end_date: '2024-10-12', theme_color: '#FB8C00',
    is_public: false, invite_code: 'CA-AUT', cover_image: locationPhoto('Moraine Lake 17092005.jpg').imageUrl, groupProfileImage: 'https://images.unsplash.com/photo-1503614472-8c93d56e92ce?w=400&h=400&fit=crop',
  },
  {
    id: 'room-swiss-2025', name: 'Swiss Alps Winter Retreat', destination: 'Switzerland', stage: 'archived', season: 'winter',
    season_theme: seasonalThemes.winter,
    created_by: currentDemoUser.id, start_date: '2025-01-14', end_date: '2025-01-22', theme_color: '#C9DEEF',
    is_public: false, invite_code: 'CH-WIN', cover_image: locationPhoto('CH.VS.Zermatt 2021-10-17 Matterhorn 8726.jpg').imageUrl, groupProfileImage: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?w=400&h=400&fit=crop',
  },
];
const extendedMockUsers = [
  ...mockStandardUsers,
  { id: 'ext-user-1', email: 'chris@example.com', auth_provider: 'email' as const, name: 'Chris Evans', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop', home_country: 'USA', created_at: '2026-08-01T00:00:00Z' },
  { id: 'ext-user-2', email: 'emma@example.com', auth_provider: 'email' as const, name: 'Emma Watson', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop', home_country: 'UK', created_at: '2026-08-01T00:00:00Z' },
  { id: 'ext-user-3', email: 'michael@example.com', auth_provider: 'email' as const, name: 'Michael B.', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop', home_country: 'USA', created_at: '2026-08-01T00:00:00Z' },
  { id: 'ext-user-4', email: 'sarah@example.com', auth_provider: 'email' as const, name: 'Sarah Connor', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&h=200&fit=crop', home_country: 'USA', created_at: '2026-08-01T00:00:00Z' },
  { id: 'ext-user-5', email: 'david@example.com', auth_provider: 'email' as const, name: 'David Lee', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop', home_country: 'Canada', created_at: '2026-08-01T00:00:00Z' },
];

export const mockTripMembers: TripRoomMember[] = mockTripRooms.flatMap(room => {
  const users = room.stage === 'archived' ? extendedMockUsers : mockStandardUsers.slice(0, room.id.includes('swiss') || room.id.includes('australia') ? 4 : 5);
  return users.map((user, index) => ({
    room_id: room.id, user_id: user.id, role: index === 0 ? 'owner' : 'member',
    location_sharing_opt_in: room.stage === 'active', is_live_for_user: room.stage === 'active',
    joined_at: `${room.start_date}T00:00:00Z`, user: { name: user.name, avatar: user.avatar },
  }));
});
const archivedHistory = mockTripRooms.filter(room => room.stage === 'archived').map(createArchivedHistory);
export const mockArchivedStops = archivedHistory.flatMap(history => history.items);
export const mockItineraryDays: ItineraryDay[] = [...archivedHistory.flatMap(history => history.days), ...mockStandardItineraryDays];
export const mockItineraryItems: ItineraryItem[] = [...mockArchivedStops, ...mockStandardItineraryItems];
export const mockMessages = [...roomMessages, ...archivedHistory.flatMap(history => history.messages), ...mockStandardMessages.filter(message => !roomMessages.some(item => item.id === message.id))].sort((a, b) => a.created_at.localeCompare(b.created_at));
export const mockDecisionCards: DecisionCard[] = mockStandardDecisionCards;
export const mockVotes = mockStandardVotes;
export const mockAlbumPhotos: AlbumPhoto[] = mockTripRooms.flatMap(room => room.stage === 'archived' ? createArchivedHistory(room).photos : createDemoAlbum(room, mockItineraryDays));
export { mockLandmarks, mockSafetyAlerts } from '@/features/route-planning/data/mock-route-planning';


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
    groupProfileImage: post.cover_image,
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
