export interface AlbumPhoto {
  id: string;
  room_id: string;
  uploaded_by: string;
  uploader_name?: string;
  uploader_avatar?: string | null;
  url: string;
  taken_at: string;
  lat?: number | null;
  lng?: number | null;
  location_name?: string | null;
  itinerary_day_id?: string | null;
  caption?: string | null;
  source_url?: string;
  created_at?: string;
}
