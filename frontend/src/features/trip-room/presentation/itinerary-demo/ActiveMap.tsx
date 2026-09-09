import React, { useCallback, useMemo, useRef, useState } from 'react';
import { Image, Pressable, ScrollView, Text, View } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { ModalSheet } from '@/shared/components';
import { CityMap, MapFocus, MemberPin } from './CityMap';
import { demoCities, demoPlaces, DemoPlace, TransportMode, PlaceMedia, arrivalPhotos, getCity } from './demo-data';
import { PlacePhoto, s } from './map-ui';

export default function ActiveMap({ roomId }: { roomId: string }) {
  const cityId = getCity(roomId), city = demoCities[cityId];
  const places = useMemo(() => demoPlaces.filter(place => place.city === cityId && place.transport.length), [cityId]);
  const [selectedId, setSelectedId] = useState(places[0].id);
  const [options, setOptions] = useState<Record<string, TransportMode>>(() => Object.fromEntries(places.map(place => [place.id, place.transport.find(option => option.recommended)!.mode])));
  const [photo, setPhoto] = useState<PlaceMedia | null>(null);
  const [focus, setFocus] = useState<MapFocus | null>(null);
  const [followedId, setFollowedId] = useState<string | null>(null);
  const [tick, setTick] = useState(0);
  const [playing, setPlaying] = useState(true);
  const scroll = useRef<ScrollView>(null);
  const selected = places.find(place => place.id === selectedId)!;
  useFocusEffect(useCallback(() => { if (!playing) return; const interval = setInterval(() => setTick(value => value + 1), 2000); return () => clearInterval(interval); }, [playing]));
  const members: MemberPin[] = useMemo(() => ['Alex', 'Taylor', 'Sam'].map((name, index) => {
    const phase = (Math.sin(tick * 0.08 + index) + 1) / 2;
    return { id: name, name, initials: ['AC', 'TW', 'SL'][index], color: ['#85495c', '#4a623f', '#477b99'][index], lat: city.lat - 0.002 + index * 0.001 + phase * 0.003, lng: city.lng + index * 0.002 + phase * 0.002 };
  }), [tick, city.lat, city.lng]);
  const choose = (place: DemoPlace, mode: TransportMode, zoom = 14) => {
    const option = place.transport.find(item => item.mode === mode)!;
    setSelectedId(place.id); setOptions(previous => ({ ...previous, [place.id]: mode })); setFollowedId(null); setFocus({ ...option, key: `${place.id}-${mode}-${Date.now()}`, zoom });
  };
  return <View style={s.screen}><ScrollView ref={scroll} contentContainerStyle={s.page} showsVerticalScrollIndicator={false}>
    <View style={s.liveIntro}><Text style={s.sectionLabel}>● Exploring {city.name}</Text><Text style={s.body}>Your next stops, travel crew and arrival points.</Text></View>
    <CityMap cityId={cityId} searchable places={places} route={places} selectedId={selectedId} onPlacePress={place => { setSelectedId(place.id); setPhoto(place); }} members={members} followedId={followedId} onFollow={id => { setFollowedId(id || null); if (id) setFocus({ ...members.find(member => member.id === id)!, key: id, zoom: 15 }); }} dropoffs={selected.transport} selectedTransport={options[selectedId]} onTransportPress={option => { choose(selected, option.mode, 15); setPhoto(arrivalPhotos[`${selected.id}-${option.mode}`] || null); }} focus={focus} />
    <View style={s.between}><View style={s.row}>{members.map(member => <Pressable key={member.id} accessibilityRole="button" accessibilityLabel={`Track ${member.name}`} onPress={() => { setFollowedId(member.id); setFocus({ ...member, key: `track-${member.id}`, zoom: 15 }); }} style={s.member}><View style={[s.avatar, { backgroundColor: member.color }, followedId === member.id && { borderColor: '#ff9100' }]}><Text style={s.initials}>{member.initials}</Text></View><Text style={s.caption}>{member.name}</Text></Pressable>)}</View><Pressable accessibilityRole="button" onPress={() => setPlaying(value => !value)}><Text style={s.time}>{playing ? 'Pause' : 'Resume'} GPS</Text></Pressable></View>
    <Text style={s.caption}>{followedId ? `Following ${followedId} · ` : ''}Simulated live locations · {playing ? 'updates every 2 seconds' : 'paused'}</Text>
    <View style={s.between}><Text style={s.heading}>Suggested Routes</Text><Text style={s.tag}>✦ AI suggestions</Text></View>
    <View>{places.map((place, index) => {
      const option = place.transport.find(item => item.mode === options[place.id])!;
      const arrival = arrivalPhotos[`${place.id}-${option.mode}`];
      const fallbackPhoto = 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?q=80&w=600&auto=format&fit=crop';
      return <View key={place.id} style={s.routeStep}><View style={s.routeRail}>{index < places.length - 1 && <View style={s.routeLine} />}<View style={[s.routeDot, index > 0 && { backgroundColor: '#ffcb90' }]} /></View><View style={[s.routeCard, { flex: 1, minWidth: 0, marginBottom: index < places.length - 1 ? 18 : 0 }]}><View style={s.row}><Text style={s.routeTime}>◷ {index === 0 ? '08:10' : '11:30'}</Text><Text style={[s.caption, { flex: 1 }]}>{index ? places[index - 1].name : city.hotel} → {place.name}</Text></View>
        <View style={[s.row, { marginTop: 22 }]}>{place.transport.map(item => <Pressable key={item.mode} accessibilityRole="radio" accessibilityState={{ checked: option.mode === item.mode }} accessibilityLabel={`${place.name} ${item.mode === 'train' ? 'Train' : item.label}`} onPress={() => choose(place, item.mode)} style={[s.transport, item.mode === option.mode && s.selectedChip]}>{item.recommended && <Text style={s.aiPick}>AI PICK</Text>}<Text style={s.transportLabel}>{item.mode === 'train' ? '▣ Train' : item.mode === 'bus' ? '▤ Bus' : '◆ Taxi'} · {item.minutes}m</Text><Text style={s.caption}>{item.fare}</Text></Pressable>)}</View>
        <View style={s.dropoff}><Pressable accessibilityRole="button" accessibilityLabel={`View ${place.name} arrival photo`} onPress={() => setPhoto(arrival || null)}><Image source={{ uri: arrival?.photo || fallbackPhoto }} accessibilityLabel={`${arrival?.name || option.dropoff} photograph`} style={s.thumbnail} /></Pressable><View style={{ flex: 1, gap: 4 }}><Text style={[s.label, { color: '#b65300', fontSize: 12 }]}>Exact Drop-off Point</Text><Text style={s.label}>{arrival?.name || option.dropoff}</Text><Text style={s.body}>{option.walk}</Text><Text style={s.verified}>✓ Street View Verified <Text style={s.caption}>· Demo</Text></Text></View></View>
        <Text style={[s.caption, { marginTop: 10 }]}>{option.line}{option.recommended ? ` · ${option.reason}` : ''}</Text><Pressable accessibilityRole="button" accessibilityLabel={`Show ${place.name} drop-off on map`} onPress={() => { choose(place, option.mode, 16); scroll.current?.scrollTo({ y: 0, animated: true }); }} style={{ paddingTop: 12 }}><Text style={s.time}>⌖ Show arrival point on map ↑</Text></Pressable>
      </View></View>;
    })}</View>
    <Text style={s.caption}>Mock routes, fares and verification. Train is a fictional concept option.</Text>
  </ScrollView>{photo && <ModalSheet visible onClose={() => setPhoto(null)} title={photo.name} style={s.sheet}><PlacePhoto key={photo.id} place={photo} /><Text style={[s.body, { marginTop: 18 }]}>{photo.description}</Text></ModalSheet>}</View>;
}
