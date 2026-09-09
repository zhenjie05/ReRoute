import React from 'react';
import { Image, Linking, Pressable, StyleSheet, Text, View } from 'react-native';
import { getPlace, project } from './demo-data';
import projection from '../../../../../assets/maps/overview-projection.json';

type MapCity = { id: string; name: string; x: number; y: number };

const mapImages = {
  France: { asset: require('../../../../../assets/maps/france-overview.png'), ...projection.France },
  Japan: { asset: require('../../../../../assets/maps/japan-overview.png'), ...projection.Japan },
};

export default function CountryMap({ onSelect, country, cities }: { onSelect: (id: string) => void; country: string; cities: MapCity[] }) {
  const map = country === 'France' ? mapImages.France : mapImages.Japan;
  const hotspots = cities.map(city => {
    const point = project(getPlace(city.id), 0);
    return { ...city, x: (point.x / 256 * map.scale + map.offsetX) / 9, y: (point.y / 256 * map.scale + map.offsetY) / 6.5 };
  });
  return <View style={s.card}>
    <View style={s.map}>
      <Image accessibilityLabel={`${country} overview map`} source={map.asset} resizeMode="contain" style={{ width: '100%', height: '100%' }} />
      <Text style={s.badge}>● {country}</Text>
      {hotspots.map(city => (
        <Pressable key={city.id} accessibilityRole="button" accessibilityLabel={`Explore ${city.name}`} onPress={() => onSelect(city.id)} style={[s.pin, { left: `${city.x}%`, top: `${city.y}%` }]}>
          <Text style={s.dot}>⊙</Text>
          <Text style={[s.label, city.id === 'kyoto' && { left: -57, top: -4 }, city.id === 'osaka' && { top: 20, left: -25 }, city.id === 'shizuoka' && { top: 24, left: 0 }]}>{city.name}</Text>
        </Pressable>
      ))}
    </View>
    <Text style={s.caption}>Choose a city to explore its 3D model</Text>
    <Pressable accessibilityRole="link" accessibilityLabel="Map data source: Natural Earth" onPress={() => Linking.openURL('https://www.naturalearthdata.com/about/terms-of-use/')}><Text style={[s.caption, { marginTop: 4, fontSize: 8 }]}>Map data: Natural Earth · ReRoute illustration</Text></Pressable>
  </View>;
}

const s = StyleSheet.create({
  card: { padding: 12, backgroundColor: '#ffffff', borderRadius: 24, borderWidth: 1, borderColor: '#dde3e7' },
  map: { width: '100%', aspectRatio: 900 / 650, backgroundColor: '#edf1f5', borderRadius: 20, overflow: 'hidden' },
  tint: { ...StyleSheet.absoluteFillObject, backgroundColor: '#fff4e61c' },
  badge: { position: 'absolute', top: 12, left: 12, backgroundColor: '#fff', borderRadius: 12, paddingHorizontal: 12, paddingVertical: 5, fontSize: 10, color: '#8b4b00' },
  pin: { position: 'absolute', width: 24, height: 24, marginLeft: -12, marginTop: -12 },
  dot: { fontSize: 24, color: '#dc6100', backgroundColor: '#fff', borderRadius: 12, lineHeight: 24 },
  label: { position: 'absolute', left: 24, top: 0, backgroundColor: '#ffffffee', borderRadius: 8, paddingHorizontal: 4, paddingVertical: 3, fontSize: 10, color: '#65453b', width: 58 },
  attribution: { position: 'absolute', right: 5, bottom: 4, backgroundColor: '#ffffffdc', color: '#6f6f6f', fontSize: 8, paddingHorizontal: 4, paddingVertical: 2 },
  caption: { textAlign: 'center', fontSize: 11, color: '#977e71', marginTop: 10 },
});
