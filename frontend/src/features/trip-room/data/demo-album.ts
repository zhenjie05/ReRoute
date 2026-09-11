import { Asset } from 'expo-asset';
import type { AlbumPhoto } from '@/models/album';
import type { TripRoom } from '@/models/trip-room';
import type { ItineraryDay } from '@/models/itinerary';

// Shared local photographs intentionally reused across demo rooms.
export const demoAlbumImages = [
  { url: Asset.fromModule(require('../../../../assets/photos/demo-1.jpg')).uri, name: 'Paris skyline', source: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34' },
  { url: Asset.fromModule(require('../../../../assets/photos/demo-2.jpg')).uri, name: 'Bali temple', source: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4' },
  { url: Asset.fromModule(require('../../../../assets/photos/demo-3.jpg')).uri, name: 'Kyoto streets', source: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e' },
];

export function createDemoAlbum(room: TripRoom, days: ItineraryDay[]): AlbumPhoto[] {
  const roomDays = days.filter(day => day.room_id === room.id).sort((a, b) => a.day_number - b.day_number);
  return Array.from({ length: 6 }, (_, index) => {
    const photo = demoAlbumImages[index % demoAlbumImages.length];
    const day = roomDays[Math.floor(index / 2) % (roomDays.length || 1)];
    return {
      id: `${room.id}-gallery-${index}`, room_id: room.id, uploaded_by: `demo-user-${index % 3 + 1}`,
      uploader_name: ['Alex Chen', 'Taylor', 'Sam Lee'][index % 3], url: photo.url,
      taken_at: `${day?.trip_date || room.start_date}T${String(9 + index).padStart(2, '0')}:00:00Z`,
      itinerary_day_id: day?.id || null, location_name: photo.name,
      caption: `${photo.name} · Shared demo gallery · Unsplash`, source_url: photo.source,
    };
  });
}
