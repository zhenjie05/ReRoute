export interface DropoffPoint {
  lat: number;
  lng: number;
  name: string;
  notes?: string;
}

export interface Landmark {
  id: string;
  name: string;
  destination: string;
  lat: number;
  lng: number;
  model_asset_url?: string | null; // 3D model asset if available
  photo_urls: string[];
  dropoff_point: DropoffPoint;
  info_text: string;
  fun_facts: string[];
}
