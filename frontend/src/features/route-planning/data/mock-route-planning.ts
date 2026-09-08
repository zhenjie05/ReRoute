import { TripPreferences } from '@/models/trip-room';
import { Landmark } from '@/models/landmark';
import { SafetyAlert } from '@/models/safety';
import {
  mockStandardLandmarks,
  mockStandardSafetyAlerts,
  mockStandardTripPreferences,
} from '@/shared/data/standard-mock-data';

export const defaultTripPreferences: TripPreferences = mockStandardTripPreferences[0];

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

export const mockLandmarks: Landmark[] = mockStandardLandmarks;

export const mockSafetyAlerts: SafetyAlert[] = mockStandardSafetyAlerts;
