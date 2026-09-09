import type { Message } from '@/models/chat';
import type { ItineraryDay, ItineraryItem } from '@/models/itinerary';
import type { AlbumPhoto } from '@/models/album';

const conversations: Record<string, string[]> = {
  'room-bali-2026': ['Bali coastal trip is now live.', 'Morning! Shall we meet in the hotel lobby at 08:00?', 'Yes, I have sunscreen and water ready.', 'ReRoute tip: choose a meeting point before splitting up at Kuta Beach.', 'The shuttle looks good for our group.', 'I’ll wait by reception with Sam.', 'Kuta Beach was lovely. I added a photo.', 'Shall we head to Legian after lunch?', 'A relaxed beach stop gives everyone time for a break.', 'Perfect. Meet at the entrance at 11:30.', 'Group itinerary updated: Legian Beach is next.', 'I’m on my way!'],
  'room-paris-2026': ['France planning room created. Welcome aboard!', 'I’d love to start in Paris, then spend a day in Lyon.', 'Can we include the Eiffel Tower and a riverside walk?', 'Try the city markers in Itinerary to preview each destination.', 'Nice would be a great final stop.', 'I prefer two nights in each city so we don’t rush.', 'Let’s vote on Lyon versus Bordeaux next.', 'Bordeaux’s riverfront looks beautiful.', 'Leave a free afternoon between travel days.', 'I’ll check our arrival times.', 'The shared draft is ready for review.', 'I’ll add my suggestions tonight.'],
  'room-tokyo-2026': ['Japan planning room created. Your draft is ready.', 'Tokyo first, then Kyoto?', 'Can we leave time for Osaka too?', 'Explore the city map to preview models and photographs.', 'I added Kinkaku-ji as a suggested stop.', 'Let’s vote before confirming Kyoto day.', 'I’d like a relaxed morning around Tokyo Tower.', 'I’ll look at food options nearby.', 'Remember to allow travel time between cities.', 'We can save Sapporo for another trip.', 'Everyone can now review the planning board.', 'I’ll check the transport phrases before we go.'],
  'room-china-2025': ['China spring trip started: Beijing, 1 April 2025.', 'We have arrived! Meet in the lobby at 09:00.', 'I have the entry reservations ready.', 'Today’s itinerary begins at the Forbidden City.', 'The courtyard architecture was incredible.', 'I uploaded our Day 1 photographs.', 'Tomorrow’s Great Wall departure is confirmed.', 'Bring water and comfortable shoes.', 'I’ll bring snacks for the group.', 'What a view from Mutianyu.', 'The Great Wall photographs are in the album.', 'Day 3: Temple of Heaven and our farewell meal.', 'Meet at the park entrance at 09:15.', 'Thanks for organising this.', 'Final expenses have been reviewed.', 'Everyone is back safely!', 'China trip archived on 8 April 2025. All records are read-only.'],
};

export const roomMessages: Message[] = Object.entries(conversations).flatMap(([roomId, lines]) => lines.map((text, index) => {
  const archived = roomId === 'room-china-2025';
  const senderType = index === 0 || (archived && index === lines.length - 1) || index === 10 ? 'system' : (archived ? [3, 7, 11].includes(index) : [3, 8].includes(index)) ? 'mascot' : 'user';
  const date = archived ? `2025-04-${String(index === lines.length - 1 ? 8 : 1 + Math.floor(index / 3)).padStart(2, '0')}` : roomId.includes('bali') ? '2026-09-09' : '2026-09-08';
  const createdAt = new Date(Date.parse(`${date}T01:00:00Z`) + (archived ? index % 3 * 45 : index * 15) * 60000).toISOString();
  return {
    id: `${roomId}-message-${index}`, room_id: roomId, sender_type: senderType,
    sender_id: senderType === 'user' ? `demo-user-${index % 3 + 1}` : null,
    sender_name: senderType === 'mascot' ? 'ReRoute' : senderType === 'system' ? 'System' : ['Alex Chen', 'Taylor', 'Sam Lee'][index % 3],
    text, type: senderType === 'system' ? 'system_event' : 'text', created_at: createdAt,
  };
}));

export const chinaDays: ItineraryDay[] = ['Imperial Beijing', 'Mutianyu Great Wall', 'Temple of Heaven & Farewell'].map((title, index) => ({
  id: `day-china-${index + 1}`, room_id: 'room-china-2025', day_number: index + 1, trip_date: `2025-04-0${index + 1}`, title,
  notes: ['Hotel check-in, palace courtyards and an evening walk.', 'A full day in the mountains with the group.', 'A park visit and final meal together.'][index],
}));

export const chinaItems: ItineraryItem[] = chinaDays.flatMap((day, index) => [
  { name: ['Beijing hotel check-in', 'Transfer to Mutianyu', 'Hotel breakfast'][index], time: '08:00', category: index === 1 ? 'transportation' as const : 'stay' as const },
  { name: ['Forbidden City', 'Mutianyu Great Wall', 'Temple of Heaven'][index], time: '10:00', category: 'attraction' as const },
  { name: ['Jingshan Park walk', 'Return to Beijing', 'Farewell dinner'][index], time: '16:30', category: index === 1 ? 'transportation' as const : 'attraction' as const },
].map((stop, order) => ({ id: `${day.id}-stop-${order}`, room_id: day.room_id, day_id: day.id, name: stop.name, scheduled_time: stop.time, category: stop.category, sort_order: order, lat: 39.9, lng: 116.4, tags: ['Completed'] })));

const gallery = [
  ['Forbidden city, Beijing (5531772131).jpg', 'Forbidden City'], ['Forbidden City Beijing (3019193921).jpg', 'Palace courtyards'],
  ['Great Wall of China at Mutianyu.JPG', 'Mutianyu Great Wall'], ['The Great Wall at Mutianyu.jpg', 'Great Wall mountain walk'],
  ['Temple-of-heaven.jpg', 'Temple of Heaven'], ['Temple Of Heaven.jpg', 'Temple of Heaven park'],
];
export const chinaPhotos: AlbumPhoto[] = gallery.map(([file, location], index) => ({
  id: `china-photo-${index}`, room_id: 'room-china-2025', uploaded_by: `demo-user-${index % 3 + 1}`,
  uploader_name: ['Alex Chen', 'Taylor', 'Sam Lee'][index % 3], url: `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(file)}?width=960`,
  taken_at: `2025-04-0${Math.floor(index / 2) + 1}T${10 + index}:00:00Z`, itinerary_day_id: `day-china-${Math.floor(index / 2) + 1}`,
  location_name: location, caption: `${location} · Wikimedia Commons`, source_url: `https://commons.wikimedia.org/wiki/File:${encodeURIComponent(file)}`,
}));
