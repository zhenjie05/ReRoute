export type RiskLevel = 'low' | 'moderate' | 'high';

export interface WeatherSnapshot {
  temperature_c: number;
  condition: string;
  wind_kmh: number;
  precipitation_chance: number;
  season: 'spring' | 'summer' | 'autumn' | 'winter';
}

export interface SafetyAlert {
  id: string;
  destination: string;
  risk_level: RiskLevel;
  title: string;
  summary: string;
  source_url: string;
  source_name: string;
  fetched_at: string;
  weather_snapshot: WeatherSnapshot;
  emergency_number: string;
}
