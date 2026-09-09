import React, { useState } from 'react';
import { Image, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { useRouter } from 'expo-router';
import { ModalSheet } from '@/shared/components';
import JapanMap from './JapanMap';
import GLBViewer from './GLBViewer';
import LandmarkStory from './LandmarkStory';
import { landmarkDetails } from './landmark-details';
import { japanModels } from './japan-models';
import { DemoPlace, getPlace, getCity, getPlanningCities, demoCities } from './demo-data';
import { addStop, editStop, finalizePlan, proposeStopVote, useDemoPlan } from './demo-store';
import { Action, PlacePhoto, s } from './map-ui';

export default function PlanningMap({ roomId }: { roomId: string }) {
  const router = useRouter();
  const plan = useDemoPlan(roomId);
  const cityId = getCity(roomId), country = demoCities[cityId].country;
  const cities = getPlanningCities(roomId);
  const [query, setQuery] = useState('');
  const [day, setDay] = useState(0);
  const [selected, setSelected] = useState<DemoPlace | null>(null);
  const [media, setMedia] = useState<'model' | 'photo'>('model');
  const [notice, setNotice] = useState('');
  const stops = plan.days[day], allStops = plan.days.flat();
  const confirmed = allStops.filter(stop => stop.confirmed).length;
  const results = cities.filter(city => `${city.name} ${getPlace(city.id).name}`.toLowerCase().includes(query.trim().toLowerCase()));
  const open = (id: string) => { setSelected(getPlace(id)); setMedia('model'); setQuery(''); };
  const discussion = () => router.push(`/(tabs)/trip/room/${roomId}/chat` as any);
  const add = (id: string) => { addStop(roomId, day, id); setNotice(`${getPlace(id).name} added to Day ${day + 1}.`); setSelected(null); };
  return <View style={s.screen}><ScrollView contentContainerStyle={s.page} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
    <View style={s.search}><Text style={s.searchIcon}>⌕</Text><TextInput accessibilityLabel={`Search ${country} cities`} placeholder={`Search ${country} cities…`} placeholderTextColor="#af9689" value={query} onChangeText={setQuery} style={s.input} /><Text style={s.body}>☷</Text></View>
    {!!query.trim() && <View style={s.card}>{results.length ? results.map(city => <Pressable accessibilityRole="button" accessibilityLabel={`Search result ${city.name}`} key={city.id} onPress={() => open(city.id)} style={s.result}><Text style={s.label}>{city.name}</Text><Text style={s.caption}>{getPlace(city.id).name} ↗</Text></Pressable>) : <Text style={s.body}>No matching city. Try another city name.</Text>}</View>}
    <JapanMap country={country} cities={cities} onSelect={open} />
    <View style={s.between}><View style={s.row}><Text style={s.heading}>Day {day + 1} Planning</Text><Text style={s.tag}>{plan.finalized ? 'Ready' : 'Draft'}</Text></View><Text style={s.caption}>{country} · Day {day + 1}</Text></View>
    <View style={s.row}>{plan.days.map((_, index) => <Pressable key={index} accessibilityRole="tab" accessibilityState={{ selected: index === day }} onPress={() => setDay(index)} style={[s.day, index === day && s.selectedChip]}><Text style={s.label}>Day {index + 1}</Text></Pressable>)}</View>
    <View><View accessibilityRole="progressbar" accessibilityValue={{ min: 0, max: allStops.length || 1, now: confirmed, text: `${confirmed} of ${allStops.length} stops confirmed` }} style={s.progress}><View style={{ height: '100%', width: `${allStops.length ? confirmed / allStops.length * 100 : 0}%`, backgroundColor: '#ff9100', borderRadius: 4 }} /></View><Text style={[s.caption, { marginTop: 7 }]}>{confirmed} / {allStops.length} stops confirmed · {plan.polls.length} group votes</Text></View>
    {!!notice && <Text accessibilityLiveRegion="polite" style={s.notice}>{notice}</Text>}
    {!stops.length && <View style={s.card}><Text style={s.label}>A day full of possibilities</Text><Text style={s.body}>Choose a city on the map to add your first stop.</Text></View>}
    <View>{stops.map((stop, index) => {
      const place = getPlace(stop.placeId), poll = plan.polls.find(item => item.stopId === stop.id);
      return <View style={s.timelineRow} key={stop.id}><View style={s.rail}><View style={[s.dot, stop.confirmed && { backgroundColor: '#ff9100' }]} />{index < stops.length - 1 && <View style={s.line} />}</View><View style={[s.stopCard, !stop.confirmed && { borderColor: '#ffc88e' }]}>
        <View style={s.between}><Text style={s.time}>{stop.time}</Text><Text style={[s.tag, stop.confirmed && { backgroundColor: '#e8f3e3', color: '#49713b' }]}>{stop.confirmed ? 'Confirmed' : 'Pending'}</Text></View>
        <Pressable accessibilityRole="button" accessibilityLabel={`Open ${place.name} details`} onPress={() => open(place.id)}><Text style={[s.label, { marginTop: 8 }]}>{place.name}</Text><Text style={[s.caption, { marginVertical: 6 }]}>{place.district} · {place.category}</Text><Image accessibilityLabel={place.name} source={{ uri: place.photo }} style={s.stopPhoto} /></Pressable>
        <View style={[s.row, { marginTop: 14, flexWrap: 'wrap' }]}><Action small title={poll ? 'View Vote ↗' : 'Suggest Vote'} onPress={() => { if (!poll) proposeStopVote(roomId, stop, `Add ${place.name} to our route?`, false); discussion(); }} />{!plan.finalized && <Action small title={stop.confirmed ? 'Unconfirm' : '✓ Confirm'} onPress={() => editStop(roomId, day, stop.id, 'confirm')} />}</View>
        {!plan.finalized && <View style={[s.between, { marginTop: 10 }]}><View style={s.row}><Pressable accessibilityRole="button" accessibilityLabel={`Move ${place.name} up`} disabled={index === 0} onPress={() => editStop(roomId, day, stop.id, 'up')} style={s.edit}><Text style={{ opacity: index === 0 ? 0.3 : 1 }}>↑</Text></Pressable><Pressable accessibilityRole="button" accessibilityLabel={`Move ${place.name} down`} disabled={index === stops.length - 1} onPress={() => editStop(roomId, day, stop.id, 'down')} style={s.edit}><Text style={{ opacity: index === stops.length - 1 ? 0.3 : 1 }}>↓</Text></Pressable></View><Pressable accessibilityRole="button" accessibilityLabel={`Remove ${place.name}`} onPress={() => editStop(roomId, day, stop.id, 'remove')} style={s.edit}><Text style={s.caption}>Remove</Text></Pressable></View>}
      </View></View>;
    })}</View>
    {!plan.finalized && cities.filter(city => !stops.some(stop => stop.placeId === city.id)).slice(0, 2).map(city => <Pressable key={city.id} accessibilityRole="button" onPress={() => open(city.id)} style={s.candidate}><Text style={[s.body, { flex: 1 }]}>{city.name} · {getPlace(city.id).name}</Text><Text style={s.time}>+ Add Details</Text></Pressable>)}
    <Action title={plan.finalized ? 'Edit Planning' : '✓ Complete Planning'} disabled={!allStops.length || (!plan.finalized && confirmed !== allStops.length)} onPress={() => { finalizePlan(roomId, !plan.finalized); setNotice(plan.finalized ? 'Your planning board is open for edits.' : 'Planning complete. Your itinerary is ready.'); }} />
    {!plan.finalized && confirmed !== allStops.length && <Text style={s.caption}>Confirm each stop to complete your plan.</Text>}
    <Pressable accessibilityRole="button" onPress={discussion}><Text style={s.discussion}>Open Discussion Room ↗</Text></Pressable>
  </ScrollView>
  {selected && <ModalSheet visible onClose={() => setSelected(null)} title={`${cities.find(city => city.id === selected.id)?.name || selected.district} · Explore`} style={s.sheet}>
    <View style={{ position: 'relative' }}>
    {media === 'model' && japanModels[selected.id] ? <GLBViewer key={selected.id} asset={japanModels[selected.id]} name={selected.name} /> : <PlacePhoto key={selected.id} place={selected} />}
    <View style={{ position: 'absolute', top: 16, right: 16, zIndex: 10, elevation: 10, width: 208, maxWidth: '90%', flexDirection: 'row', padding: 4, borderRadius: 12, backgroundColor: '#e3e9ed' }}>
      {(['model', 'photo'] as const).map(tab => <Pressable key={tab} accessibilityRole="tab" accessibilityLabel={tab === 'model' ? '3D Model' : 'Exact Image'} accessibilityState={{ selected: media === tab }} onPress={() => setMedia(tab)} style={{ flexGrow: 1, flexBasis: 0, minWidth: 0, minHeight: 38, justifyContent: 'center', alignItems: 'center', borderRadius: 9, backgroundColor: media === tab ? '#ffffff' : 'transparent' }}>
        <Text numberOfLines={1} style={{ fontSize: 12, lineHeight: 16, fontWeight: '600', color: media === tab ? '#8b4b00' : '#575c5f' }}>{tab === 'model' ? '3D Model' : 'Exact Image'}</Text>
      </Pressable>)}
    </View>
    </View>
    <Text style={[s.title, { marginTop: 18 }]}>{selected.name}</Text><Text style={[s.caption, { marginTop: 4 }]}>{landmarkDetails[selected.id]?.subtitle || `${selected.district}, ${country}`}</Text><View style={s.divider} /><Text style={s.sectionLabel}>About this destination</Text><Text style={[s.body, { marginTop: 8, color: '#2a2f32', fontSize: 13, lineHeight: 21 }]}>{selected.description}</Text>
    <LandmarkStory placeId={selected.id} />
    <Text style={[s.sectionLabel, { marginTop: 20 }]}>Plan your visit</Text><View style={[s.info, { marginVertical: 12 }]}><Text style={s.label}>◷ {selected.duration}</Text><Text style={s.body}>Leave room for a walk, photographs and a break with your travel crew.</Text></View>
    <Action title={stops.some(stop => stop.placeId === selected.id) ? '✓ Added to Itinerary' : '⌖ Add to Itinerary'} disabled={plan.finalized || stops.some(stop => stop.placeId === selected.id)} onPress={() => add(selected.id)} />
  </ModalSheet>}
  </View>;
}
