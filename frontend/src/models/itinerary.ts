export type ItineraryCategory = 'transportation' | 'attraction' | 'stay';

export interface ItineraryDay {
  id: string;
  room_id: string;
  day_number: number;
  trip_date: string;
  title: string;
  notes?: string | null;
}

export interface ItineraryItem {
  id: string;
  room_id: string;
  day_id: string;
  name: string;
  lat: number;
  lng: number;
  scheduled_time?: string | null;
  category: ItineraryCategory;
  sort_order: number;
  tags?: string[];
  compromise_reason?: string | null;
  booking_url?: string | null;
  cost_estimate?: number;
  duration_minutes?: number;
  address?: string;
}
