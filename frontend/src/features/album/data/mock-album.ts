// fallow-ignore-file unused-file
import { AlbumPhoto } from '@/models/album';
import { mockAlbumPhotos } from '@/features/trip-room/data/mock-trip-room';

export const getAlbumPhotosForRoom = (roomId: string): AlbumPhoto[] => {
  return mockAlbumPhotos.filter((p) => p.room_id === roomId);
};
