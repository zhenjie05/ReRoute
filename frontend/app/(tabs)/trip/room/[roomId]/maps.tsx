import React from 'react';
import { useLocalSearchParams } from 'expo-router';
import ItineraryExperience from '@/features/trip-room/presentation/itinerary-demo/ItineraryExperience';

export default function TripMapsScreen() {
  const { roomId } = useLocalSearchParams<{ roomId: string }>();
  return <ItineraryExperience key={roomId} roomId={roomId} />;
}
