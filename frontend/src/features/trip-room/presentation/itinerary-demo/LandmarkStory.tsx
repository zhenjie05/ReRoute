import React from 'react';
import { Linking, Pressable, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { landmarkDetails } from './landmark-details';
import { s } from './map-ui';

export default function LandmarkStory({ placeId }: { placeId: string }) {
  const details = landmarkDetails[placeId];
  if (!details) return null;
  return <View style={{ gap: 16, marginTop: 20 }}>
    <View style={{ gap: 8 }}>
      <Text style={{ fontSize: 15, fontWeight: '700', color: '#8b4b00' }}>History</Text>
      <Text style={{ fontSize: 13, lineHeight: 21, color: '#2a2f32' }}>{details.history}</Text>
    </View>
    <Text style={{ fontSize: 15, fontWeight: '700', color: '#8b4b00' }}>Notable Facts</Text>
    {details.facts.map((fact, index) => <View key={fact.title} style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 12, padding: 16, borderRadius: 16, backgroundColor: '#edf1f5' }}>
      <View style={{ width: 34, height: 34, borderRadius: 17, alignItems: 'center', justifyContent: 'center', backgroundColor: index === 0 ? '#ff8f06' : '#cfebbe' }}>
        <Feather name={fact.icon === 'gem' ? 'hexagon' : 'wind'} size={17} color={index === 0 ? '#462300' : '#405836'} />
      </View>
      <View style={{ flex: 1, gap: 5 }}>
        <Text style={{ fontSize: 11, lineHeight: 15, fontWeight: '700', color: '#2a2f32' }}>{fact.title}</Text>
        <Text style={{ fontSize: 12, lineHeight: 18, color: '#575c5f' }}>{fact.text}</Text>
      </View>
    </View>)}
    <View style={{ gap: 8 }}>
      <Text style={{ fontSize: 15, fontWeight: '700', color: '#8b4b00' }}>Make the most of your visit</Text>
      <Text style={{ fontSize: 13, lineHeight: 21, color: '#2a2f32' }}>{details.visit}</Text>
      <Text style={[s.caption, { fontSize: 12, lineHeight: 19, color: '#575c5f' }]}>{details.nearby}</Text>
    </View>
    {details.source && <Pressable accessibilityRole="link" onPress={() => Linking.openURL(details.source!)}><Text style={{ fontSize: 11, color: '#8b4b00', textDecorationLine: 'underline' }}>Read more from the official visitor guide ↗</Text></Pressable>}
  </View>;
}
