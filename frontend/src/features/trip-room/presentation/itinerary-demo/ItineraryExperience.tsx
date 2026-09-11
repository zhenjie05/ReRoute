import ArchivedItinerary from './ArchivedItinerary';
import React from 'react';
import { Text, View } from 'react-native';
import { mockTripRooms } from '@/features/trip-room/data/mock-trip-room';
import PlanningMap from './PlanningMap';
import ActiveMap from './ActiveMap';

export default function ItineraryExperience({ roomId }: { roomId: string }) {
  const room = mockTripRooms.find(item => item.id === roomId);
  if (room?.stage === 'active') return <ActiveMap roomId={roomId} />;
  if (room?.stage === 'planning') return <PlanningMap roomId={roomId} />;
  if (room?.stage === 'archived') return <ArchivedItinerary roomId={roomId} />;
  return <View style={{ flex: 1, backgroundColor: '#fbf9f6', padding: 24 }}><View style={{ backgroundColor: '#fff', padding: 24, borderRadius: 20, gap: 12 }}><Text style={{ color: '#947d70', fontSize: 12 }}>ARCHIVED TRIP</Text><Text style={{ color: '#51392f', fontSize: 22, fontWeight: '700' }}>{room?.name || 'Trip unavailable'}</Text><Text style={{ color: '#655950' }}>{room?.destination} · {room?.start_date} – {room?.end_date}</Text><Text style={{ color: '#947d70', lineHeight: 21 }}>This trip is archived. Live tracking and planning controls are no longer active.</Text></View></View>;
}
