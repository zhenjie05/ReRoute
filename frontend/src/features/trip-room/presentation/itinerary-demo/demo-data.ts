import { locationPhotos } from '../../data/location-photos';
export type CityId = 'tokyo' | 'paris' | 'bali';
export type Coordinate = { lat: number; lng: number };
export type TransportMode = 'train' | 'bus' | 'taxi';
export type ModelKind = 'tokyo-tower' | 'temple' | 'eiffel' | 'pyramid';
export interface TransportOption extends Coordinate {
  mode: TransportMode; label: string; minutes: number; fare: string;
  line: string; dropoff: string; walk: string; recommended?: boolean; reason?: string;
}
export interface DemoPlace extends Coordinate {
  id: string; city: CityId; name: string; district: string; category: string;
  duration: string; description: string; model: ModelKind; photo: string;
  source: string; credit: string; transport: TransportOption[];
}
const commons = (file: string) => locationPhotos[file]?.imageUrl || `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(file)}?width=960`;
const source = (file: string) => `https://commons.wikimedia.org/wiki/File:${encodeURIComponent(file)}`;

// All route timings, fares, entrances and moving member coordinates are demo fixtures.
// Photographs depict the named landmark; their source/license is exposed in the photo tab.
export const demoPlaces: DemoPlace[] = [
  {
    id: 'tokyo-tower', city: 'tokyo', name: 'Tokyo Tower', district: 'Minato', category: 'City views',
    lat: 35.65858, lng: 139.74543, duration: '1.5 hours', model: 'tokyo-tower',
    photo: commons('Tokyo Tower, Minato City.jpg'), source: source('Tokyo Tower, Minato City.jpg'),
    credit: 'Davekern · Wikimedia Commons · See source for license',
    description: 'An orange-and-white landmark above Minato’s streets. Explore the tower district, walk through nearby Shiba Park, and leave time for a city-view stop. This demo pairs the observation-tower visit with a relaxed afternoon walk.',
    transport: [
      { mode: 'train', label: 'Train', minutes: 24, fare: '¥220', line: 'Toei Oedo Line → Akabanebashi', dropoff: 'Akabanebashi Station · Akabanebashi Exit', lat: 35.65505, lng: 139.74365, walk: '7-min walk north to the tower entrance', recommended: true, reason: 'Predictable arrival and a short walk; avoids road traffic.' },
      { mode: 'bus', label: 'Bus', minutes: 32, fare: '¥210', line: 'Toei bus · Tokyo Tower stop', dropoff: 'Tokyo Tower bus stop · tower approach', lat: 35.65813, lng: 139.74608, walk: '3-min walk to FootTown entrance' },
      { mode: 'taxi', label: 'Taxi', minutes: 18, fare: '¥2,400', line: 'Direct ride · Minato', dropoff: 'FootTown access road · passenger drop-off', lat: 35.65820, lng: 139.74557, walk: '1-min walk to the ground-floor entrance' },
    ],
  },
  {
    id: 'sensoji', city: 'tokyo', name: 'Sensō-ji Temple', district: 'Asakusa', category: 'Culture',
    lat: 35.71477, lng: 139.79666, duration: '2 hours', model: 'temple',
    photo: commons('Sensoji.jpg'), source: source('Sensoji.jpg'), credit: 'Natsumi Sumiya · Public domain · Wikimedia Commons',
    description: 'A temple visit in the heart of Asakusa. Approach through the lantern gates and explore the shopping street before reaching the main hall. Slow the pace here for street details, snacks and photographs.',
    transport: [
      { mode: 'train', label: 'Train', minutes: 36, fare: '¥280', line: 'Asakusa Line → Asakusa', dropoff: 'Asakusa Station · Exit A4', lat: 35.71056, lng: 139.79709, walk: '7-min walk via Kaminarimon and Nakamise', recommended: true, reason: 'Rail is the most reliable cross-city option for this demo route.' },
      { mode: 'bus', label: 'Bus', minutes: 48, fare: '¥210', line: 'Toei bus · Asakusa Kaminarimon', dropoff: 'Kaminarimon bus stop · Kaminarimon-dori', lat: 35.71030, lng: 139.79653, walk: '8-min walk through the temple approach' },
      { mode: 'taxi', label: 'Taxi', minutes: 28, fare: '¥4,200', line: 'Direct ride · Asakusa', dropoff: 'Nitenmon gate approach · east side', lat: 35.71483, lng: 139.79802, walk: '2-min walk west to the main hall' },
    ],
  },
  {
    id: 'eiffel', city: 'paris', name: 'Eiffel Tower', district: 'Champ de Mars', category: 'City views',
    lat: 48.85837, lng: 2.29448, duration: '2 hours', model: 'eiffel',
    photo: commons('Eiffel Tower 20051010.jpg'), source: source('Eiffel Tower 20051010.jpg'), credit: 'Tognopop · Public domain · Wikimedia Commons',
    description: 'The iron tower anchors a walk between the Seine and Champ de Mars. Plan time for photographs from the gardens and the riverbank, then continue along the water.',
    transport: [
      { mode: 'train', label: 'Metro', minutes: 22, fare: '€2.50', line: 'Metro 6 → Bir-Hakeim', dropoff: 'Bir-Hakeim station · Boulevard de Grenelle exit', lat: 48.85392, lng: 2.28943, walk: '10-min walk along the Seine to the tower', recommended: true, reason: 'A direct, predictable connection with a scenic final walk.' },
      { mode: 'bus', label: 'Bus', minutes: 31, fare: '€2.00', line: 'Bus 69 · Champ de Mars – La Bourdonnais', dropoff: 'Champ de Mars – La Bourdonnais bus stop', lat: 48.856903, lng: 2.301503, walk: '8-min walk along the gardens toward the tower' },
      { mode: 'taxi', label: 'Taxi', minutes: 17, fare: '€19', line: 'Direct ride · 7th arrondissement', dropoff: 'Quai Jacques Chirac · passenger drop-off', lat: 48.857556, lng: 2.291322, walk: '4-min walk to the tower approach' },
    ],
  },
  {
    id: 'louvre', city: 'paris', name: 'Louvre Pyramid', district: 'Palais Royal', category: 'Art & culture',
    lat: 48.86061, lng: 2.33545, duration: '3 hours', model: 'pyramid',
    photo: commons('Louvre Pyramid from an arch 8.jpg'), source: source('Louvre Pyramid from an arch 8.jpg'), credit: 'CrisNYCa · CC BY-SA 4.0 · Wikimedia Commons',
    description: 'A glass pyramid set within the Louvre’s palace courtyard. Use this stop for architecture, a museum visit or a walk through the surrounding gardens. Leave a generous block in the itinerary if your group plans to explore the galleries.',
    transport: [
      { mode: 'train', label: 'Metro', minutes: 25, fare: '€2.50', line: 'Metro 1 → Palais Royal – Musée du Louvre', dropoff: 'Palais Royal station · Place du Palais Royal exit', lat: 48.862611, lng: 2.336250, walk: '5-min walk to the Cour Napoléon', recommended: true, reason: 'Short final walk and frequent service in this sample itinerary.' },
      { mode: 'bus', label: 'Bus', minutes: 34, fare: '€2.00', line: 'Bus 72 · Pont du Carrousel', dropoff: 'Pont du Carrousel · quayside', lat: 48.859181, lng: 2.333778, walk: '5-min walk through the palace passage' },
      { mode: 'taxi', label: 'Taxi', minutes: 19, fare: '€17', line: 'Direct ride · Louvre district', dropoff: 'Place du Carrousel · passenger drop-off', lat: 48.86100, lng: 2.33355, walk: '3-min walk east to the pyramid courtyard' },
    ],
  },
];

export const japanCities = [
  { id: 'tokyo-tower', name: 'Tokyo', x: 80, y: 44 },
  { id: 'kyoto', name: 'Kyoto', x: 29, y: 42 },
  { id: 'osaka', name: 'Osaka', x: 29, y: 68 },
  { id: 'sapporo', name: 'Sapporo', x: 78, y: 20 },
  { id: 'shizuoka', name: 'Shizuoka', x: 78, y: 69 },
];
[
  { id: 'kyoto', name: 'Kinkaku-ji', district: 'Kyoto', lat: 35.0394, lng: 135.7292, file: 'Kinkaku-ji, Kyoto.jpg', credit: '27curlyta · CC0 · Wikimedia Commons', description: 'Kyoto’s Golden Pavilion overlooks a mirror pond and landscaped gardens. The gold-covered upper floors and carefully framed views make this a memorable cultural stop.' },
  { id: 'osaka', name: 'Osaka Castle', district: 'Osaka', lat: 34.6873, lng: 135.5262, file: 'Osaka Castle (13382634615).jpg', credit: 'Guilhem Vellut · CC BY 2.0 · Wikimedia Commons', description: 'Explore Osaka’s castle grounds, stone walls and surrounding park. Pair the landmark with an afternoon discovering the city’s food and shopping districts.' },
  { id: 'sapporo', name: 'Sapporo', district: 'Hokkaido', lat: 43.0618, lng: 141.3545, file: 'Sapporo Clock Tower.JPG', credit: 'Masgatotkaca · CC BY-SA 3.0 · Wikimedia Commons', description: 'Hokkaido’s largest city combines spacious parks with a lively urban center. Build a relaxed day around central Sapporo and its historic landmarks.' },
  { id: 'shizuoka', name: 'Mount Fuji', district: 'Shizuoka', lat: 35.3606, lng: 138.7274, file: 'Mount Fuji from Miho no Matsubara.JPG', credit: 'Alpsdake · CC BY-SA 4.0 · Wikimedia Commons', description: 'Discover Shizuoka’s mountain scenery and views toward Mount Fuji. Keep time flexible for clear skies and scenic stops.' },
].forEach((place) => demoPlaces.push({ ...place, city: 'tokyo', category: 'Culture & scenery', duration: '2 hours', model: 'temple', photo: commons(place.file), source: source(place.file), transport: [] }));

export const franceCities = [
  { id: 'eiffel', name: 'Paris', x: 53, y: 30 },
  { id: 'lyon', name: 'Lyon', x: 65, y: 59 },
  { id: 'bordeaux', name: 'Bordeaux', x: 29, y: 67 },
  { id: 'marseille', name: 'Marseille', x: 62, y: 83 },
  { id: 'nice', name: 'Nice', x: 80, y: 74 },
];
export const getPlanningCities = (roomId: string) => getCity(roomId) === 'paris' ? franceCities : japanCities;
[
  { id: 'lyon', name: 'Lyon', district: 'Place Bellecour', lat: 45.7578, lng: 4.8320, file: 'Place Bellecour, Lyon - statue of Louis XIV.jpg', credit: 'Wikimedia Commons · See source for license', description: 'Explore Lyon’s squares, riverside walks and historic streets. The photograph shows Place Bellecour and its equestrian statue.' },
  { id: 'bordeaux', name: 'Bordeaux', district: 'Place de la Bourse', lat: 44.8415, lng: -0.5700, file: 'Bordeaux place de la bourse with tram.JPG', credit: 'Wikimedia Commons · See source for license', description: 'Plan a day around Bordeaux’s riverfront and Place de la Bourse. The photograph shows the square beside the tram route.' },
  { id: 'marseille', name: 'Marseille', district: 'Vieux-Port', lat: 43.2951, lng: 5.3744, file: 'Vieux port Marseile.jpg', credit: 'Arnaud 25 · Public domain · Wikimedia Commons', description: 'Discover Marseille’s Old Port, waterfront cafés and hillside views. The photograph looks across the harbour from Notre-Dame de la Garde.' },
  { id: 'nice', name: 'Nice', district: 'Promenade des Anglais', lat: 43.6940, lng: 7.2654, file: 'Promenade des Anglais.jpg', credit: 'Timo Newton-Syms · Wikimedia Commons · See source for license', description: 'Explore Nice’s seafront promenade and colourful old town. The photograph shows the Promenade des Anglais beside the Mediterranean.' },
].forEach(place => demoPlaces.push({ ...place, city: 'paris', category: 'City discovery', duration: '2 hours', model: 'eiffel', photo: commons(place.file), source: source(place.file), transport: [] }));

[
  { id: 'kuta', name: 'Kuta Beach', district: 'Kuta', lat: -8.71655, lng: 115.16881, file: 'Kuta Beach, Bali - Factbook Photos.jpg', credit: 'CIA World Factbook · Public domain', description: 'Start your Bali day with a walk beside Kuta’s sandy shoreline. Leave time for a beach break and photographs before heading north.' },
  { id: 'legian', name: 'Legian Beach', district: 'Legian', lat: -8.7045, lng: 115.1641, file: 'Legian beach.jpg', credit: 'Max Grabert · CC BY-SA 2.0', description: 'Continue along the coast to Legian Beach. Enjoy a relaxed seaside stop with your group and choose a meeting point before exploring.' },
].forEach((place, index) => demoPlaces.push({ ...place, city: 'bali', category: 'Beach', duration: '2 hours', model: 'temple', photo: commons(place.file), source: source(place.file),
  transport: [
    { mode: 'train', label: 'Train', minutes: 24 + index * 4, fare: 'Rp 20,000', line: 'Concept rail connection · fictional demo', dropoff: `${place.name} · concept rail arrival`, lat: place.lat + 0.0018, lng: place.lng + 0.002, walk: '6-min walk west to the beach access (mock route)' },
    { mode: 'bus', label: 'Bus', minutes: 20 + index * 3, fare: 'Rp 10,000', line: 'Coastal shuttle · sample route', dropoff: `${place.name} · shuttle arrival`, lat: place.lat + 0.0008, lng: place.lng + 0.0015, walk: '4-min walk along the beach approach', recommended: true, reason: 'Budget-friendly group ride with a short final walk in this demo.' },
    { mode: 'taxi', label: 'Taxi', minutes: 12 + index * 3, fare: 'Rp 65,000', line: 'Direct ride · sample fare', dropoff: `${place.name} · road access`, lat: place.lat + 0.0002, lng: place.lng + 0.0008, walk: '2-min walk from the road to the shoreline' },
  ],
}));

export type PlaceMedia = Pick<DemoPlace, 'id' | 'name' | 'photo' | 'source' | 'credit' | 'description'>;
export const arrivalPhotos: Record<string, PlaceMedia> = Object.fromEntries([
  ['eiffel-train', 'Bir-Hakeim station · main entrance', 'Bir-Hakeim metro station entrance Paris.jpg', 'Venustus01 · CC0'],
  ['eiffel-bus', 'Champ de Mars – La Bourdonnais bus stop', 'Arrêt Bus Champ Mars Bourdonnais Avenue Bourdonnais - Paris VII (FR75) - 2025-04-21 - 1.jpg', 'Chabe01 · CC BY-SA 4.0'],
  ['eiffel-taxi', 'Quai Jacques-Chirac · street approach', 'Quai Jacques Chirac - Paris VII (FR75) - 2021-08-07 - 1.jpg', 'Chabe01 · CC BY-SA 4.0'],
  ['louvre-train', 'Palais Royal – Musée du Louvre · entrance', 'Louvre Metro entrance.jpg', 'KTo288 · CC BY-SA 3.0'],
  ['louvre-bus', 'Pont du Carrousel · quayside', 'Paris le Pont du Carrousel.JPG', 'Pierre André Leclercq · CC BY-SA 4.0'],
  ['louvre-taxi', 'Place du Carrousel · square approach', 'Place du Carrousel.JPG', 'Nischay Mohan · CC BY-SA 3.0'],
].map(([id, name, file, credit]) => [id, { id, name, photo: commons(file), source: source(file), credit: `${credit} · Wikimedia Commons`, description: 'Photograph of the named arrival area. Drop-off routing and verification status are sample data.' }]));

for (const place of demoPlaces.filter(item => item.city === 'bali')) {
  const file = place.id === 'kuta' ? 'The View of Kuta Beach, Bali.jpg' : 'Legian Bali.jpg';
  for (const option of place.transport) arrivalPhotos[`${place.id}-${option.mode}`] = {
    id: `${place.id}-${option.mode}`, name: option.dropoff, photo: commons(file), source: source(file),
    credit: `${place.id === 'kuta' ? 'Herryz · CC BY-SA 4.0' : 'Ikeforwiki · See source for license'} · Wikimedia Commons`,
    description: `Beach view near ${place.name}. Transport stops, timings and verification are mock data; the train option is a fictional concept.`,
  };
}

export const demoCities = {
  bali: { id: 'bali' as const, name: 'Bali', country: 'Bali', flag: '🇮🇩', roomId: 'room-bali-2026', lat: -8.708, lng: 115.166, zoom: 14, hotel: 'Kuta hotel', date: 'Sep 9', accent: '#995400', soft: '#fff0de' },
  tokyo: { id: 'tokyo' as const, name: 'Tokyo', country: 'Japan', flag: '🇯🇵', roomId: 'room-tokyo-2026', lat: 35.687, lng: 139.767, zoom: 12, hotel: 'Shimbashi hotel', date: 'Oct 10', accent: '#85495c', soft: '#FFECEE' },
  paris: { id: 'paris' as const, name: 'Paris', country: 'France', flag: '🇫🇷', roomId: 'room-paris-2026', lat: 48.8595, lng: 2.315, zoom: 13, hotel: 'Saint-Germain hotel', date: 'Oct 18', accent: '#405836', soft: '#e8f2e1' },
};
export const getCity = (roomId: string): CityId => roomId.includes('bali') ? 'bali' : roomId.includes('paris') ? 'paris' : 'tokyo';
export const getPlace = (id: string) => demoPlaces.find((place) => place.id === id)!;

export function project(coordinate: Coordinate, zoom: number) {
  const size = 256 * 2 ** zoom;
  const sin = Math.sin(coordinate.lat * Math.PI / 180);
  return { x: (coordinate.lng + 180) / 360 * size, y: (0.5 - Math.log((1 + sin) / (1 - sin)) / (4 * Math.PI)) * size };
}
export function unproject(x: number, y: number, zoom: number): Coordinate {
  const size = 256 * 2 ** zoom;
  return { lng: x / size * 360 - 180, lat: Math.atan(Math.sinh(Math.PI * (1 - 2 * y / size))) * 180 / Math.PI };
}
