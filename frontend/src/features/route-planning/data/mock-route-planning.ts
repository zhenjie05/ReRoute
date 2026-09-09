import { TripPreferences } from '@/models/trip-room';
import { Landmark } from '@/models/landmark';
import { SafetyAlert } from '@/models/safety';
import {
  mockStandardLandmarks,
  mockStandardSafetyAlerts,
  mockStandardTripPreferences,
  mockStandardModularSuggestions,
} from '@/shared/data/standard-mock-data';

export const defaultTripPreferences: TripPreferences = mockStandardTripPreferences[0];
export const mockModularSuggestions = mockStandardModularSuggestions;
export const mockLandmarks: Landmark[] = mockStandardLandmarks;
export const mockSafetyAlerts: SafetyAlert[] = mockStandardSafetyAlerts;
