import React, { useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { mockItineraryDays, mockArchivedStops } from '../../data/mock-trip-room';
import { AlbumLightbox } from '../components/album/AlbumLightbox';
import { ArchivedBanner } from '../components';
import { s } from './map-ui';

export default function ArchivedItinerary({ roomId }: { roomId: string }) {
  const [photoId, setPhotoId] = useState<string | null>(null);
  const days = mockItineraryDays.filter(day => day.room_id === roomId).sort((a, b) => a.day_number - b.day_number);
  const stops = mockArchivedStops.filter(stop => stop.room_id === roomId);
  const photos = stops.map(stop => stop.photo);
  return <View style={s.screen}>
    <ScrollView contentContainerStyle={s.page}>
      <ArchivedBanner /><Text style={s.title}>Trip memories</Text><Text style={s.body}>{days.length} days · {stops.length} completed stops</Text>
      {days.map(day => <View key={day.id} style={{ gap: 12 }}>
        <Text style={s.heading}>Day {day.day_number} · {day.title}</Text>
        <Text style={s.caption}>{day.trip_date}</Text><Text style={s.body}>{day.notes}</Text>
        <View>{stops.filter(stop => stop.day_id === day.id).sort((a, b) => a.sort_order - b.sort_order).map((stop, index, dayStops) =>
          <View key={stop.id} style={a.row}>
            <View style={a.rail}><View style={a.dot} />{index < dayStops.length - 1 && <View style={a.line} />}</View>
            <Pressable accessibilityRole="button" accessibilityLabel={`View visit photo: ${stop.name}`} onPress={() => setPhotoId(stop.photo.id)} style={a.card}>
              <View style={s.between}><Text style={s.time}>{stop.scheduled_time}</Text><Text style={s.caption}>✓ Completed</Text></View>
              <View style={[s.row, { marginVertical: 8 }]}><Feather name={stop.category === 'stay' ? 'home' : stop.category === 'transportation' ? 'navigation' : 'map-pin'} size={16} color="#8B4B00" /><Text style={[s.label, { flex: 1 }]}>{stop.name}</Text></View>
              <Text style={[s.body, { marginBottom: 12 }]}>{stop.description}</Text>
              <Image source={{ uri: stop.photo.url }} accessibilityLabel={stop.photo.location_name || stop.name} style={s.stopPhoto} />
              <Text style={[s.caption, { marginTop: 8 }]}>View location photo ↗</Text>
            </Pressable>
          </View>)}</View>
      </View>)}
    </ScrollView>
    <AlbumLightbox visible={!!photoId} photos={photos} initialPhotoId={photoId} isArchived onClose={() => setPhotoId(null)} onShare={() => {}} />
  </View>;
}
const a = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'stretch' },
  rail: { width: 24, alignItems: 'center' },
  dot: { position: 'absolute', top: 20, width: 10, height: 10, borderRadius: 5, backgroundColor: '#FF8F06', zIndex: 1 },
  line: { position: 'absolute', top: 25, bottom: -25, width: 2, backgroundColor: '#FDD9B1' },
  card: { flex: 1, padding: 16, marginBottom: 16, gap: 3, borderWidth: 1, borderColor: '#E8DED6', backgroundColor: '#FFFFFF', borderRadius: 20 },
});
