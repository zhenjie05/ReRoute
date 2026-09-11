import React, { useState } from 'react';
import { Image, Linking, Pressable, StyleSheet, Text, View } from 'react-native';
import { getPlace, project } from './demo-data';
import projection from '../../../../../assets/maps/overview-projection.json';

type MapCity = { id: string; name: string; x: number; y: number };
const mapImages = {
  France: { asset: require('../../../../../assets/maps/france-overview.png'), ...projection.France },
  Japan: { asset: require('../../../../../assets/maps/japan-overview.png'), ...projection.Japan },
};
export default function CountryMap({ onSelect, country, cities }: { onSelect: (id: string) => void; country: string; cities: MapCity[] }) {
  const [width, setWidth] = useState(320);
  const map = country === 'France' ? mapImages.France : mapImages.Japan;
  const height = width * 650 / 900;
  const hotspots = cities.map(city => {
    const point = project(getPlace(city.id), 0);
    return { ...city, anchorX: (point.x / 256 * map.scale + map.offsetX) / 9, anchorY: (point.y / 256 * map.scale + map.offsetY) / 6.5 };
  });
  return <View style={s.card}>
    <View style={s.map} onLayout={event => setWidth(event.nativeEvent.layout.width)}>
      <Image accessibilityLabel={`${country} overview map`} source={map.asset} resizeMode="contain" style={{ width: '100%', height: '100%' }} />
      <Text style={s.badge}>● {country}</Text>
      {hotspots.map(city => {
        const x1 = city.anchorX * width / 100, y1 = city.anchorY * height / 100;
        const x2 = city.x * width / 100, y2 = city.y * height / 100;
        const length = Math.hypot(x2 - x1, y2 - y1);
        return <React.Fragment key={city.id}>
          <View pointerEvents="none" style={[s.leader, { left: (x1 + x2 - length) / 2, top: (y1 + y2) / 2, width: length, transform: [{ rotate: `${Math.atan2(y2-y1, x2-x1)}rad` }] }]} />
          <View pointerEvents="none" style={[s.anchor, { left: x1 - 2, top: y1 - 2 }]} />
          <Pressable accessibilityRole="button" accessibilityLabel={`Explore ${city.name}`} onPress={() => onSelect(city.id)} style={[s.pin, { left: `${city.x}%`, top: `${city.y}%` }]}>
            <View style={s.pinBody}><View style={s.dot} /><Text style={s.label}>{city.name}</Text></View>
          </Pressable>
        </React.Fragment>;
      })}
    </View>
    <Text style={s.caption}>Choose a city to explore its 3D model</Text>
    <Pressable accessibilityRole="link" accessibilityLabel="Map data source: Natural Earth" onPress={() => Linking.openURL('https://www.naturalearthdata.com/about/terms-of-use/')}><Text style={[s.caption, { marginTop: 4, fontSize: 8 }]}>Map data: Natural Earth · ReRoute illustration</Text></Pressable>
  </View>;
}
const s = StyleSheet.create({
  card: { padding: 12, backgroundColor: '#FFFFFF', borderRadius: 24, borderWidth: 1, borderColor: '#DDE3E7' },
  map: { width: '100%', aspectRatio: 900 / 650, backgroundColor: '#EDF1F5', borderRadius: 20, overflow: 'hidden' },
  badge: { position: 'absolute', top: 12, left: 12, backgroundColor: '#FFF', borderRadius: 12, paddingHorizontal: 12, paddingVertical: 5, fontSize: 10, color: '#8B4B00' },
  leader: { position: 'absolute', height: 1, backgroundColor: '#C48950' },
  anchor: { position: 'absolute', width: 4, height: 4, borderRadius: 2, backgroundColor: '#9C4E08' },
  pin: { position: 'absolute', width: 76, height: 44, marginLeft: -38, marginTop: -22, alignItems: 'center', justifyContent: 'center' },
  pinBody: { flexDirection: 'row', gap: 5, alignItems: 'center', backgroundColor: '#FFFFFFF5', paddingHorizontal: 7, paddingVertical: 7, borderRadius: 12, borderWidth: 1, borderColor: '#EDD4BB' },
  dot: { width: 7, height: 7, borderRadius: 4, backgroundColor: '#FF8F06' },
  label: { fontSize: 11, fontWeight: '600', color: '#65453B' },
  caption: { textAlign: 'center', fontSize: 11, color: '#977E71', marginTop: 10 },
});
