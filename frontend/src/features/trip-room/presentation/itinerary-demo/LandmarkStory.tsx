import React from 'react';
import { Image, Linking, Pressable, StyleSheet, Text, View } from 'react-native';
import { landmarkDetails, landmarkCopy } from './landmark-details';

export default function LandmarkStory({ placeId }: { placeId: string }) {
  const details = landmarkDetails[placeId];
  if (!details) return null;
  return <View style={s.sections}>
    <View style={s.section}><Text style={s.heading}>{landmarkCopy.history}</Text><Text style={s.body}>{details.history}</Text></View>
    <View style={s.section}>
      <Text style={s.heading}>{landmarkCopy.highlights}</Text>
      {details.engagingHighlights.map(highlight => <View key={highlight.title} style={s.highlight}>
        <Image source={{ uri: highlight.imageUrl }} accessibilityLabel={highlight.title} resizeMode="cover" style={s.image} />
        <View style={s.copy}>
          <Text style={s.title}>{highlight.title}</Text><Text style={s.short}>{highlight.shortDescription}</Text>
          <Pressable accessibilityRole="link" accessibilityLabel={highlight.credit} onPress={() => Linking.openURL(highlight.sourceUrl)}>
            <Text numberOfLines={2} style={s.credit}>{highlight.credit}</Text>
          </Pressable>
        </View>
      </View>)}
    </View>
    <View style={s.section}><Text style={s.heading}>{landmarkCopy.visit}</Text><Text style={s.body}>{details.visit}</Text><Text style={s.short}>{details.nearby}</Text></View>
    {details.source && <Pressable accessibilityRole="link" onPress={() => Linking.openURL(details.source!)}><Text style={s.link}>{landmarkCopy.source}</Text></Pressable>}
  </View>;
}
const s = StyleSheet.create({
  sections: { gap: 22, marginTop: 20 },
  section: { gap: 12 },
  heading: { fontSize: 16, fontWeight: '700', color: '#8B4B00' },
  body: { fontSize: 13, lineHeight: 22, color: '#2A2F32' },
  highlight: { backgroundColor: '#FFFFFF', borderRadius: 18, borderWidth: 1, borderColor: '#E3E9ED', overflow: 'hidden' },
  image: { width: '100%', aspectRatio: 1.9, backgroundColor: '#E3E9ED' },
  copy: { padding: 16, gap: 6 },
  title: { fontSize: 16, fontWeight: '700', color: '#2A2F32' },
  short: { fontSize: 13, lineHeight: 20, color: '#575C5F' },
  credit: { fontSize: 9, lineHeight: 14, color: '#7D7067', marginTop: 6 },
  link: { fontSize: 11, color: '#8B4B00', textDecorationLine: 'underline' },
});
