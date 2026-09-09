import React from 'react';
import { useLocalSearchParams } from 'expo-router';
import ItineraryExperience from '@/features/trip-room/presentation/itinerary-demo/ItineraryExperience';
import LegacyMapsScreen from '@/features/trip-room/presentation/itinerary-demo/LegacyMapsScreen';

export default function TripMapsScreen() {
  const { roomId } = useLocalSearchParams<{ roomId: string }>();
  if (roomId === 'room-tokyo-2026' || roomId === 'room-paris-2026' || roomId === 'room-bali-2026' || roomId === 'room-china-2025') {
    return <ItineraryExperience key={roomId} roomId={roomId} />;
  }
  return <LegacyMapsScreen />;
}
