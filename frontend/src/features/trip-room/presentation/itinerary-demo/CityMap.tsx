import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Image, Linking, PanResponder, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import Svg, { Path, Polyline } from 'react-native-svg';
import { Coordinate, DemoPlace, TransportOption, demoCities, project, unproject, CityId } from './demo-data';

export interface MemberPin extends Coordinate { id: string; name: string; initials: string; color: string }
export interface MapFocus extends Coordinate { key: string; zoom?: number }
export function CityMap({ cityId, places, route, selectedId, onPlacePress, onCityPress, members = [], followedId, onFollow, dropoffs = [], selectedTransport, onTransportPress, focus, searchable = false }: {
  cityId: CityId; places: DemoPlace[]; route: DemoPlace[]; selectedId: string;
  onPlacePress: (place: DemoPlace) => void; onCityPress?: () => void;
  members?: MemberPin[]; followedId?: string | null; onFollow?: (id: string) => void;
  dropoffs?: TransportOption[]; selectedTransport?: string; onTransportPress?: (option: TransportOption) => void; focus?: MapFocus | null;
  searchable?: boolean;
}) {
  const city = demoCities[cityId];
  const [query, setQuery] = useState('');
  const results = places.filter(place => `${place.name} ${place.district}`.toLowerCase().includes(query.trim().toLowerCase()));
  const [width, setWidth] = useState(360);
  const height = 310;
  const [camera, setCamera] = useState({ lat: city.lat, lng: city.lng, zoom: city.zoom });
  const [tileError, setTileError] = useState(false);
  const latest = useRef(camera);
  const start = useRef(camera);
  const onFollowRef = useRef(onFollow);
  const followed = members.find((member) => member.id === followedId);
  // A following camera uses the current simulated coordinate without resetting manual zoom.
  const center = useMemo(() => followed ? { ...followed, zoom: camera.zoom } : camera, [followed, camera]);
  useEffect(() => { latest.current = center; onFollowRef.current = onFollow; }, [center, onFollow]);
  const [previousFocus, setPreviousFocus] = useState(focus);
  if (previousFocus !== focus) {
    setPreviousFocus(focus);
    if (focus) setCamera({ lat: focus.lat, lng: focus.lng, zoom: focus.zoom ?? 15 });
  }
  // PanResponder registers callbacks; refs are read only when a gesture runs.
  /* eslint-disable react-hooks/refs */
  const [drag] = useState(() => PanResponder.create({
    onMoveShouldSetPanResponder: (_, gesture) => Math.abs(gesture.dx) + Math.abs(gesture.dy) > 7,
    onPanResponderGrant: () => { start.current = latest.current; onFollowRef.current?.(''); },
    onPanResponderMove: (_, gesture) => {
      const pixel = project(start.current, start.current.zoom);
      const location = unproject(pixel.x - gesture.dx, pixel.y - gesture.dy, start.current.zoom);
      setCamera({ lat: Math.max(-85, Math.min(85, location.lat)), lng: ((location.lng + 540) % 360) - 180, zoom: start.current.zoom });
    },
  }));
  /* eslint-enable react-hooks/refs */
  const pixelCenter = project(center, camera.zoom);
  const screenPoint = (position: Coordinate) => {
    const point = project(position, camera.zoom);
    return { x: point.x - pixelCenter.x + width / 2, y: point.y - pixelCenter.y + height / 2 };
  };
  const tiles: { x: number; y: number; left: number; top: number }[] = [];
  const minX = Math.floor((pixelCenter.x - width / 2) / 256), minY = Math.floor((pixelCenter.y - height / 2) / 256);
  for (let x = minX; x <= Math.floor((pixelCenter.x + width / 2) / 256); x++) for (let y = minY; y <= Math.floor((pixelCenter.y + height / 2) / 256); y++) {
    tiles.push({ x, y, left: x * 256 - pixelCenter.x + width / 2, top: y * 256 - pixelCenter.y + height / 2 });
  }
  const visible = (p: { x: number; y: number }) => p.x > 15 && p.x < width - 15 && p.y > 40 && p.y < height - 24;
  return <View style={styles.card}>
    <View style={styles.map} onLayout={(event) => setWidth(event.nativeEvent.layout.width)}>
      <View style={StyleSheet.absoluteFill} {...drag.panHandlers}>
        <Svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`}>
          <Path d={`M${width * 0.8} 0 Q${width * 0.3} 100 ${width * 0.6} 160 T${width * 0.45} 310`} stroke="#bddce4" strokeWidth={24} fill="none" />
        </Svg>
        {tiles.map((tile) => <Image key={`${camera.zoom}-${tile.x}-${tile.y}`} source={{ uri: `https://tile.openstreetmap.org/${camera.zoom}/${((tile.x % 2 ** camera.zoom) + 2 ** camera.zoom) % 2 ** camera.zoom}/${tile.y}.png` }} onError={() => setTileError(true)} style={{ position: 'absolute', width: 256, height: 256, left: tile.left, top: tile.top }} />)}
        <Svg pointerEvents="none" width={width} height={height} style={StyleSheet.absoluteFill}>
          {route.length > 1 && <Polyline points={route.map(screenPoint).map((p) => `${p.x},${p.y}`).join(' ')} stroke="#b76680" strokeWidth={4} strokeDasharray="6 5" fill="none" />}
        </Svg>
        {places.map((place) => {
          const point = screenPoint(place);
          if (!visible(point)) return null;
          const selected = selectedId === place.id;
          return <Pressable key={place.id} accessibilityRole="button" accessibilityLabel={`Explore ${place.name}`} onPress={() => onPlacePress(place)} style={[styles.pin, { left: point.x - 17, top: point.y - 17, backgroundColor: selected ? '#8b4b00' : '#ffffff', zIndex: selected ? 3 : 2 }]}>
            <Text style={{ color: selected ? '#fff' : '#8b4b00', fontSize: 13, fontWeight: '800' }}>{places.indexOf(place) + 1}</Text>
            <Text style={[styles.pinLabel, { color: '#2a2f32' }]}>{place.name}</Text>
          </Pressable>;
        })}
        {dropoffs.map((option) => {
          const point = screenPoint(option);
          if (!visible(point)) return null;
          return <Pressable key={option.mode} accessibilityRole="button" accessibilityLabel={`${option.label} drop-off: ${option.dropoff}`} onPress={() => onTransportPress?.(option)} style={[styles.dropPin, { left: point.x - 14, top: point.y - 14, backgroundColor: selectedTransport === option.mode ? '#ff8f06' : '#ffffff' }]}><Text style={{ fontSize: 13 }}>{option.mode === 'train' ? '▣' : option.mode === 'bus' ? '▤' : '◆'}</Text></Pressable>;
        })}
        {members.map((member) => {
          const point = screenPoint(member);
          if (!visible(point)) return null;
          return <Pressable key={member.id} accessibilityRole="button" accessibilityLabel={`Follow ${member.name}`} onPress={() => onFollow?.(member.id)} style={[styles.member, { left: point.x - 17, top: point.y - 17, backgroundColor: member.color, borderColor: followedId === member.id ? '#ff8f06' : '#fff' }]}><Text style={styles.initials}>{member.initials}</Text></Pressable>;
        })}
      </View>
      {onCityPress ? <Pressable accessibilityRole="button" accessibilityLabel={`Explore ${city.name} in 3D`} onPress={onCityPress} style={styles.cityButton}><Text style={styles.cityText}>◇ {city.name} · Explore in 3D ↗</Text></Pressable> : null}
      {searchable && <View style={styles.floatingSearch}>
        <View style={styles.searchInputRow}><Text style={{ color: '#8b4b00', fontSize: 23 }}>⌕</Text><TextInput accessibilityLabel="Search places" placeholder="Search places..." value={query} onChangeText={setQuery} style={{ flex: 1, minWidth: 0, fontSize: 13, color: '#503a31' }} />{!!query && <Pressable accessibilityRole="button" accessibilityLabel="Clear map search" onPress={() => setQuery('')}><Text>×</Text></Pressable>}</View>
        {!!query.trim() && <View style={styles.searchResults}>{results.length ? results.map(place => <Pressable key={place.id} accessibilityRole="button" accessibilityLabel={`Search result ${place.name}`} onPress={() => { setCamera({ lat: place.lat, lng: place.lng, zoom: 15 }); onFollow?.(''); setQuery(''); onPlacePress(place); }} style={{ paddingVertical: 11 }}><Text style={{ color: '#503a31', fontSize: 13 }}>{place.name}</Text></Pressable>) : <Text style={{ padding: 10, fontSize: 12 }}>No matching places.</Text>}</View>}
      </View>}
      <View style={[styles.controls, searchable && { top: 80 }]}>
        <Pressable accessibilityRole="button" accessibilityLabel="Zoom in map" onPress={() => setCamera((c) => ({ ...c, zoom: Math.min(17, c.zoom + 1) }))} style={styles.control}><Text style={styles.symbol}>＋</Text></Pressable>
        <Pressable accessibilityRole="button" accessibilityLabel="Zoom out map" onPress={() => setCamera((c) => ({ ...c, zoom: Math.max(11, c.zoom - 1) }))} style={styles.control}><Text style={styles.symbol}>−</Text></Pressable>
        <Pressable accessibilityRole="button" accessibilityLabel="Show whole city" onPress={() => { onFollow?.(''); setCamera({ lat: city.lat, lng: city.lng, zoom: city.zoom }); setTileError(false); }} style={styles.control}><Text style={styles.symbol}>⌖</Text></Pressable>
      </View>
      <Pressable accessibilityRole="link" accessibilityLabel="OpenStreetMap attribution" onPress={() => Linking.openURL('https://www.openstreetmap.org/copyright')} style={styles.attribution}><Text style={{ fontSize: 9, color: '#575c5f' }}>© OpenStreetMap contributors</Text></Pressable>
      {tileError && <View style={styles.tileError}><Text style={{ fontSize: 10, color: '#575c5f' }}>Map tiles unavailable · Check connection</Text></View>}
    </View>
    <View style={styles.footer}><Text style={styles.footerText}>{members.length ? `● ${members.length} travelers sharing` : '2D city map · Tap a pin to explore'}</Text><Text style={{ fontSize: 10, color: '#73777a' }}>Dashed line: sample route</Text></View>
  </View>;
}
const styles = StyleSheet.create({
  floatingSearch: { position: 'absolute', top: 16, left: 14, right: 14, zIndex: 20, elevation: 8 },
  searchInputRow: { backgroundColor: '#fff', borderRadius: 24, borderWidth: 1, borderColor: '#e6ddd2', height: 44, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, gap: 9 },
  searchResults: { backgroundColor: '#fff', borderRadius: 14, paddingHorizontal: 14, marginTop: 6, borderWidth: 1, borderColor: '#e6ddd2' },
  card: { borderRadius: 23, overflow: 'hidden', borderWidth: 1, borderColor: '#dde3e7', backgroundColor: '#fff' },
  map: { height: 310, backgroundColor: '#e7ede5', overflow: 'hidden' },
  pin: { position: 'absolute', width: 34, height: 34, borderRadius: 17, borderWidth: 2, borderColor: '#8b4b00', justifyContent: 'center', alignItems: 'center' },
  pinLabel: { position: 'absolute', top: 35, width: 110, textAlign: 'center', fontSize: 10, fontWeight: '700', backgroundColor: '#fffffff0', borderRadius: 5, padding: 2 },
  dropPin: { position: 'absolute', width: 28, height: 28, borderRadius: 8, borderWidth: 2, borderColor: '#8b4b00', alignItems: 'center', justifyContent: 'center', zIndex: 5 },
  member: { position: 'absolute', width: 34, height: 34, borderRadius: 17, borderWidth: 3, alignItems: 'center', justifyContent: 'center', zIndex: 6 },
  initials: { fontSize: 10, fontWeight: '800', color: '#fff' },
  cityButton: { position: 'absolute', top: 12, left: 12, backgroundColor: '#ffffffed', borderRadius: 18, paddingHorizontal: 12, paddingVertical: 9 },
  cityText: { fontSize: 11, color: '#8b4b00', fontWeight: '700' },
  controls: { position: 'absolute', top: 12, right: 10, gap: 5 },
  control: { width: 34, height: 34, borderRadius: 17, alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff' },
  symbol: { fontSize: 20, color: '#8b4b00' },
  attribution: { position: 'absolute', right: 0, bottom: 0, backgroundColor: '#ffffffeb', padding: 3 },
  footer: { padding: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 4, flexWrap: 'wrap' },
  footerText: { fontSize: 11, fontWeight: '600', color: '#405836' },
  tileError: { position: 'absolute', left: 4, bottom: 19, padding: 5, backgroundColor: '#ffffffeb', borderRadius: 5 },
});
