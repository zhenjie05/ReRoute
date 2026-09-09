import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Svg, { Path, Line } from 'react-native-svg';


export default function JapanMap({ onSelect, country, cities }: { onSelect: (id: string) => void; country: string; cities: { id: string; name: string; x: number; y: number }[] }) {
  return <View style={s.card}><View style={s.map}>
    <Svg width="100%" height="100%" viewBox="0 0 360 260" preserveAspectRatio="none">
      {[60, 120, 180, 240, 300].map(x => <Line key={x} x1={x} x2={x} y1={0} y2={260} stroke="#e9e3db" strokeDasharray="3 6" />)}
      {[60, 120, 180, 240].map(y => <Line key={y} x1={0} x2={360} y1={y} y2={y} stroke="#e9e3db" strokeDasharray="3 6" />)}
      <Path d={country === 'France' ? "M152 26 L187 12 206 36 246 49 258 75 287 91 269 114 279 133 259 160 285 179 277 199 229 213 206 225 181 214 144 226 113 212 107 186 89 178 107 137 97 116 65 109 58 88 31 79 40 63 89 65 109 48 142 52Z M301 213 L308 230 298 249 290 233Z" : "M285 35 Q303 26 309 47 L320 59 303 68 289 65 276 78 263 65 272 52Z M263 81 Q277 90 263 111 L249 134 248 157 232 174 218 177 203 192 177 192 163 204 146 211 133 201 151 184 176 182 196 163 215 145 233 126 245 102Z M134 210 Q143 218 126 226 L111 223 117 214Z M100 218 Q114 230 99 245 L86 250 78 239 83 226Z"} fill="#e9e3db" stroke="#d8ccbc" strokeWidth="1.5" />
    </Svg>
    <Text style={s.badge}>● {country}</Text>
    {cities.map(city => <Pressable key={city.id} accessibilityRole="button" accessibilityLabel={`Explore ${city.name}`} onPress={() => onSelect(city.id)} style={[s.pin, { left: `${city.x}%`, top: `${city.y}%` }]}><Text style={s.dot}>⊙</Text><Text style={[s.label, city.id === 'kyoto' && { left: -57, top: -4 }, city.id === 'osaka' && { top: 20, left: -25 }, city.id === 'shizuoka' && { top: 24, left: 0 }]}>{city.name}</Text></Pressable>)}
  </View><Text style={s.caption}>Choose a city to explore its 3D model</Text></View>;
}
const s = StyleSheet.create({ card: { padding: 12, backgroundColor: '#fff', borderRadius: 24, borderWidth: 1, borderColor: '#eee1d5' }, map: { height: 260, backgroundColor: '#faf8f5', borderRadius: 20, overflow: 'hidden' }, badge: { position: 'absolute', top: 12, left: 12, backgroundColor: '#fff', borderRadius: 12, paddingHorizontal: 12, paddingVertical: 5, fontSize: 10, color: '#8b4b00' }, pin: { position: 'absolute', width: 24, height: 24, marginLeft: -12, marginTop: -12 }, dot: { fontSize: 24, color: '#dc6100', backgroundColor: '#fff', borderRadius: 12, lineHeight: 24 }, label: { position: 'absolute', left: 24, top: 0, backgroundColor: '#ffffffee', borderRadius: 8, paddingHorizontal: 4, paddingVertical: 3, fontSize: 10, color: '#65453b', width: 53 }, caption: { textAlign: 'center', fontSize: 11, color: '#977e71', marginTop: 10 } });
