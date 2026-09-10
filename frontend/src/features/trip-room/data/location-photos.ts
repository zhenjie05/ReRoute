import catalogue from './location-photos.json';

export type LocationPhoto = { imageUrl: string; sourceUrl: string; credit: string; description: string };
export const locationPhotos: Record<string, LocationPhoto> = catalogue;
export function locationPhoto(file: string): LocationPhoto {
  const photo = locationPhotos[file];
  if (!photo) throw new Error(`Missing location photo: ${file}`);
  return photo;
}
