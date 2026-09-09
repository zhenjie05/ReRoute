import React from 'react';
import { Image, ScrollView, Text, View } from 'react-native';
import { mockItineraryDays, mockItineraryItems, mockAlbumPhotos } from '../../data/mock-trip-room';
import { ArchivedBanner } from '../components';
import { s } from './map-ui';

export default function ArchivedItinerary({ roomId }: { roomId: string }) {
  const days = mockItineraryDays.filter(day => day.room_id === roomId).sort((a, b) => a.day_number - b.day_number);
  return <ScrollView style={s.screen} contentContainerStyle={s.page}><ArchivedBanner /><Text style={s.title}>Trip memories</Text><Text style={s.body}>{days.length} saved itinerary days · Read-only</Text>
    {days.map(day => <View key={day.id} style={s.card}><Text style={s.heading}>Day {day.day_number} · {day.title}</Text><Text style={s.caption}>{day.trip_date}</Text><Text style={s.body}>{day.notes}</Text>
      {mockItineraryItems.filter(stop => stop.day_id === day.id && stop.room_id === roomId).sort((a, b) => a.sort_order - b.sort_order).map(stop => <View key={stop.id} style={{ borderLeftWidth: 2, borderLeftColor: '#ffd5a9', padding: 12, gap: 5 }}><Text style={s.time}>{stop.scheduled_time} · Completed</Text><Text style={s.label}>{stop.name}</Text></View>)}
      {mockAlbumPhotos.filter(photo => photo.itinerary_day_id === day.id).slice(0, 1).map(photo => <Image key={photo.id} accessibilityLabel={photo.location_name || 'Trip photograph'} source={{ uri: photo.url }} style={s.stopPhoto} />)}
    </View>)}
  </ScrollView>;
}
