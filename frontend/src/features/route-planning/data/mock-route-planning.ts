import { TripPreferences } from '@/models/trip-room';
import { ItineraryItem } from '@/models/itinerary';
import { Landmark } from '@/models/landmark';
import { SafetyAlert } from '@/models/safety';

export const defaultTripPreferences: TripPreferences = {
  room_id: 'default',
  companions: 'couple',
  travel_style: 'cultural',
  travel_pace: 'moderate',
  updated_at: new Date().toISOString(),
};

export const mockModularSuggestions = {
  transportation: [
    {
      id: 'sug-trans-1',
      name: 'Shinkansen Bullet Train (Tokyo → Kyoto)',
      category: 'transportation' as const,
      scheduled_time: '08:30 AM',
      sort_order: 1,
      lat: 35.6812,
      lng: 139.7671,
      cost_estimate: 95,
      duration_minutes: 135,
      booking_url: 'https://smart-ex.jp/en/reservation/',
      tags: ['Fast', 'Scenic', 'High-Speed Rail'],
    },
    {
      id: 'sug-trans-2',
      name: 'Tokyo Metro 72-Hour Unlimited Tourist Pass',
      category: 'transportation' as const,
      scheduled_time: '11:00 AM',
      sort_order: 2,
      lat: 35.6895,
      lng: 139.6917,
      cost_estimate: 12,
      booking_url: 'https://www.tokyometro.jp/en/ticket/travel/',
      tags: ['Cost Saver', 'Subway'],
    },
  ],
  accommodation: [
    {
      id: 'sug-acc-1',
      name: 'Hotel Gracery Shinjuku (Godzilla Head)',
      category: 'stay' as const,
      scheduled_time: 'Check-in: 3:00 PM',
      sort_order: 1,
      lat: 35.6953,
      lng: 139.7022,
      cost_estimate: 140,
      address: '1-19-1 Kabukicho, Shinjuku, Tokyo',
      booking_url: 'https://shinjuku.gracery.com/en/',
      tags: ['City View', 'Central Location', '4 Stars'],
    },
    {
      id: 'sug-acc-2',
      name: 'Onyado Nono Asakusa Hot Springs Ryokan',
      category: 'stay' as const,
      scheduled_time: 'Check-in: 3:00 PM',
      sort_order: 2,
      lat: 35.7148,
      lng: 139.7967,
      cost_estimate: 165,
      address: '2-7-20 Asakusa, Taito, Tokyo',
      booking_url: 'https://www.hotespa.net/hotels/nono_asakusa/',
      tags: ['Onsen', 'Traditional', 'Tatami'],
    },
  ],
  attractions: [
    {
      id: 'sug-att-1',
      name: 'Senso-ji Ancient Temple & Nakamise Dori',
      category: 'attraction' as const,
      scheduled_time: '09:30 AM',
      sort_order: 1,
      lat: 35.7148,
      lng: 139.7967,
      duration_minutes: 90,
      tags: ['Historic', 'Photo Spot', 'Free Entry'],
    },
    {
      id: 'sug-att-2',
      name: 'Meiji Jingu Shrine & Forest Walk',
      category: 'attraction' as const,
      scheduled_time: '02:00 PM',
      sort_order: 2,
      lat: 35.6764,
      lng: 139.6993,
      duration_minutes: 75,
      tags: ['Nature', 'Spiritual', 'Peaceful'],
    },
    {
      id: 'sug-att-3',
      name: 'Shibuya Sky 360° Open-Air Rooftop',
      category: 'attraction' as const,
      scheduled_time: '05:30 PM',
      sort_order: 3,
      lat: 35.6585,
      lng: 139.7013,
      cost_estimate: 18,
      duration_minutes: 60,
      booking_url: 'https://www.shibuya-scramble-square.com/sky/',
      tags: ['Sunset', 'Cityscape', 'Panorama'],
    },
  ],
};

export const mockLandmarks: Landmark[] = [
  {
    id: 'landmark-sensoji',
    name: 'Senso-ji Temple',
    destination: 'Tokyo, Japan',
    lat: 35.7148,
    lng: 139.7967,
    model_asset_url: 'https://assets.reroute.app/3d/sensoji_optimized.glb', // Pre-generated 3D landmark
    photo_urls: [
      'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=800&fit=crop',
      'https://images.unsplash.com/photo-1542051841857-5f90071e7989?w=800&fit=crop',
    ],
    dropoff_point: {
      lat: 35.7135,
      lng: 139.7955,
      name: 'Asakusa Kaminarimon Gate Taxi Stand',
      notes: 'Best drop-off point right outside the red lantern gate. Walking street begins here.',
    },
    info_text: 'Senso-ji is Tokyo’s oldest Buddhist temple founded in 645 AD, dedicated to the Bodhisattva Kannon.',
    fun_facts: [
      'The giant red lantern weighs roughly 700 kilograms.',
      'Drawing bad fortunes (omikuji) is traditional here — tie them to wire stands to leave the bad luck behind!',
    ],
  },
  {
    id: 'landmark-shibuya-sky',
    name: 'Shibuya Sky Observation Deck',
    destination: 'Tokyo, Japan',
    lat: 35.6585,
    lng: 139.7013,
    model_asset_url: null, // No 3D model -> 3D tab hidden entirely per FR-1-7
    photo_urls: [
      'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=800&fit=crop',
    ],
    dropoff_point: {
      lat: 35.659,
      lng: 139.7005,
      name: 'Shibuya Scramble Square B1 Drop-off',
      notes: 'Take the direct elevator from 1F/B1 to the 14F Sky ticket entry gate.',
    },
    info_text: 'Perched 229 meters above Shibuya Crossing, offering a panoramic 360-degree glass rooftop vista of Mount Fuji and Tokyo Tower.',
    fun_facts: [
      'Look straight down through the glass corner to see thousands crossing Shibuya intersection below.',
    ],
  },
];

export const mockSafetyAlerts: SafetyAlert[] = [
  {
    id: 'alert-tokyo-typhoon',
    destination: 'Tokyo, Japan',
    risk_level: 'moderate',
    title: 'Autumn Rainstorm Advisory for Kanto Region',
    summary: 'Gusty winds and heavy evening precipitation expected between Oct 12–13. Metro lines operating on normal schedule with minor delay buffers.',
    source_url: 'https://www.jma.go.jp/bosai/warning/',
    source_name: 'Japan Meteorological Agency (JMA)',
    fetched_at: new Date().toISOString(),
    emergency_number: '110 / 119',
    weather_snapshot: {
      temperature_c: 18,
      condition: 'Rain & Gusts',
      wind_kmh: 38,
      precipitation_chance: 85,
      season: 'autumn',
    },
  },
];
