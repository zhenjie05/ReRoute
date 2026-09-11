import { mockStandardUsers } from '@/shared/data/standard-mock-data';
import type { Message } from '@/models/chat';

const conversations: Record<string, string[]> = {
  'room-bali-2026': ['Bali coastal trip is now live.', 'Morning! Shall we meet in the hotel lobby at 08:00?', 'Yes, I have sunscreen and water ready.', 'ReRoute tip: choose a meeting point before splitting up at Kuta Beach.', 'The shuttle looks good for our group.', 'I’ll wait by reception with Sam.', 'Kuta Beach was lovely. I added a photo.', 'Shall we head to Legian after lunch?', 'A relaxed beach stop gives everyone time for a break.', 'Perfect. Meet at the entrance at 11:30.', 'Group itinerary updated: Legian Beach is next.', 'I’m on my way!'],
  'room-paris-2026': ['France planning room created. Welcome aboard!', 'I’d love to start in Paris, then spend a day in Lyon.', 'Can we include the Eiffel Tower and a riverside walk?', 'Try the city markers in Itinerary to preview each destination.', 'Nice would be a great final stop.', 'I prefer two nights in each city so we don’t rush.', 'Let’s vote on Lyon versus Bordeaux next.', 'Bordeaux’s riverfront looks beautiful.', 'Leave a free afternoon between travel days.', 'I’ll check our arrival times.', 'The shared draft is ready for review.', 'I’ll add my suggestions tonight.'],
  'room-tokyo-2026': ['Japan planning room created. Your draft is ready.', 'Tokyo first, then Kyoto?', 'Can we leave time for Osaka too?', 'Explore the city map to preview models and photographs.', 'I added Kinkaku-ji as a suggested stop.', 'Let’s vote before confirming Kyoto day.', 'I’d like a relaxed morning around Tokyo Tower.', 'I’ll look at food options nearby.', 'Remember to allow travel time between cities.', 'We can save Sapporo for another trip.', 'Everyone can now review the planning board.', 'I’ll check the transport phrases before we go.'],
  'room-china-2025': ['China spring trip started: Beijing, 1 April 2025.', 'We have arrived! Meet in the lobby at 09:00.', 'I have the entry reservations ready.', 'Today’s itinerary begins at the Forbidden City.', 'The courtyard architecture was incredible.', 'I uploaded our Day 1 photographs.', 'Tomorrow’s Great Wall departure is confirmed.', 'Bring water and comfortable shoes.', 'I’ll bring snacks for the group.', 'What a view from Mutianyu.', 'The Great Wall photographs are in the album.', 'Day 3: Temple of Heaven and an evening meal.', 'Meet at the park entrance at 09:15.', 'Thanks for organising this.', 'Final expenses have been reviewed.', 'Everyone is back safely!', 'China trip archived on 8 April 2025. All records are read-only.'],
};

export const roomMessages: Message[] = Object.entries(conversations).flatMap(([roomId, lines]) => lines.map((text, index) => {
  const archived = roomId === 'room-china-2025';
  const senderType = index === 0 || (archived && index === lines.length - 1) || index === 10 ? 'system' : (archived ? [3, 7, 11].includes(index) : [3, 8].includes(index)) ? 'mascot' : 'user';
  const date = archived ? `2025-04-${String(index === lines.length - 1 ? 8 : 1 + Math.floor(index / 3)).padStart(2, '0')}` : roomId.includes('bali') ? '2026-09-09' : '2026-09-08';
  const savedChinaTimes = ['01T07:00', '01T08:00', '01T08:15', '01T09:00', '01T15:00', '01T19:00', '01T20:00', '02T07:00', '02T07:30', '02T14:00', '02T19:00', '03T07:30', '03T08:00', '08T18:00', '08T18:30', '08T21:00', '08T22:00'];
  const createdAt = archived ? new Date(`2025-04-${savedChinaTimes[index]}:00+08:00`).toISOString() : new Date(Date.parse(`${date}T01:00:00Z`) + index * 15 * 60000).toISOString();
  const sender = mockStandardUsers[index % 3];
  return {
    id: `${roomId}-message-${index}`, room_id: roomId, sender_type: senderType,
    sender_id: senderType === 'user' ? sender.id : null,
    sender_avatar: senderType === 'user' ? sender.avatar : null,
    sender_name: senderType === 'mascot' ? 'ReRoute' : senderType === 'system' ? 'System' : sender.name,
    text, type: senderType === 'system' ? 'system_event' : 'text', created_at: createdAt,
  };
}));
