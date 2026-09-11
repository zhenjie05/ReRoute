import type { TripRoom } from '@/models/trip-room';
import type { ItineraryDay, ItineraryItem } from '@/models/itinerary';
import type { AlbumPhoto } from '@/models/album';
import type { Message } from '@/models/chat';
import { mockStandardUsers } from '@/shared/data/standard-mock-data';
import { locationPhoto } from './location-photos';

type ArchiveFixture = { hotel: [string, string]; arrival: [string, string]; travel: string; spots: [string, string, string][] };
const fixtures: Record<string, ArchiveFixture> = {
  "room-china-2025": {
    "hotel": [
      "Beijing Hotel",
      "BEIJING HOTEL.JPG"
    ],
    "arrival": [
      "Beijing Capital Airport · Terminal 3 station",
      "Beijing capital airport 1.jpg"
    ],
    "travel": "Private group transfer",
    "spots": [
      [
        "Forbidden City",
        "Forbidden city, Beijing (5531772131).jpg",
        "Palace courtyards, carved doorways and the central axis."
      ],
      [
        "Mutianyu Great Wall",
        "Great Wall of China at Mutianyu.JPG",
        "Walked the restored ramparts and paused at the mountain viewpoints."
      ],
      [
        "Temple of Heaven",
        "Temple-of-heaven.jpg",
        "Explored the Hall of Prayer grounds and the surrounding park."
      ],
      [
        "Summer Palace",
        "Longevity Hill of the Summer Palace.jpg",
        "A slower lakeside afternoon below Longevity Hill."
      ]
    ]
  },
  "room-australia-2025": {
    "hotel": [
      "Park Hyatt Sydney",
      "Sydney The Rocks Park Hyatt Sydney seen from the northeast.jpg"
    ],
    "arrival": [
      "Sydney Airport · Terminal 3",
      "Sydney Airport Terminal 3, May 2021.jpg"
    ],
    "travel": "Train and coastal bus",
    "spots": [
      [
        "Sydney Opera House",
        "Sydney Opera House - Dec 2008.jpg",
        "Walked the harbour promenade and photographed the famous sails."
      ],
      [
        "Bondi Beach",
        "Sydney (AU), Bondi Beach -- 2019 -- 2354.jpg",
        "A beach morning, ocean views and a relaxed group lunch."
      ],
      [
        "Three Sisters · Blue Mountains",
        "Blue Mountains National Park (AU), Three Sisters -- 2019 -- 1987-9.jpg",
        "Looked across the sandstone peaks from the national park viewpoints."
      ]
    ]
  },
  "room-canada-2024": {
    "hotel": [
      "Fairmont Chateau Lake Louise",
      "Lake Louise and Chateau, as seen from Fairmont Lookout 20240822 1.jpg"
    ],
    "arrival": [
      "Calgary International Airport",
      "Calgary AB Airport Calgary-International-Airport 2022-09-29 (57).jpg"
    ],
    "travel": "Shared rental car",
    "spots": [
      [
        "Lake Louise",
        "1 lake louise pano 2019.jpg",
        "Mountain reflections and a lakeshore walk with the crew."
      ],
      [
        "Moraine Lake",
        "Moraine Lake 17092005.jpg",
        "A shuttle outing to the turquoise lake beneath the Ten Peaks."
      ],
      [
        "Banff",
        "Town of Banff viewed from Sulphur Mountain.jpg",
        "A town stroll, mountain views and a cosy meal together."
      ]
    ]
  },
  "room-swiss-2025": {
    "hotel": [
      "Mont Cervin Palace · Zermatt",
      "Mont Cervin Palace at night in Zermatt.jpg"
    ],
    "arrival": [
      "Zurich Airport",
      "At the Zurich Airport. Switzerland.jpg"
    ],
    "travel": "Rail connection and village walk",
    "spots": [
      [
        "Matterhorn · Zermatt",
        "CH.VS.Zermatt 2021-10-17 Matterhorn 8726.jpg",
        "Paused for mountain views from Zermatt and the surrounding paths."
      ],
      [
        "Gornergrat Railway",
        "Gornergrat Railway with Matterhorn view.jpg",
        "Rode the mountain railway and enjoyed the panorama at the top."
      ],
      [
        "Zermatt village",
        "Mont Cervin Palace at night in Zermatt.jpg",
        "A gentle village day with warm cafés and an evening hotel return."
      ]
    ]
  }
};
export interface ArchivedStop extends ItineraryItem { description: string; photo: AlbumPhoto }
export function createArchivedHistory(room: TripRoom) {
  const fixture = fixtures[room.id];
  if (room.stage !== 'archived' || !fixture) return { days: [] as ItineraryDay[], items: [] as ArchivedStop[], messages: [] as Message[], photos: [] as AlbumPhoto[] };
  const dayCount = Math.round((Date.parse(room.end_date) - Date.parse(room.start_date)) / 86400000) + 1;
  const crew = mockStandardUsers.slice(0, room.id.includes('australia') || room.id.includes('swiss') ? 4 : 5);
  const days: ItineraryDay[] = [];
  const items: ArchivedStop[] = [];
  const messages: Message[] = [];
  for (let index = 0; index < dayCount; index++) {
    const date = new Date(Date.parse(room.start_date) + index * 86400000).toISOString().slice(0, 10);
    const dayId = `${room.id}-history-day-${index + 1}`;
    const spot = fixture.spots[index % fixture.spots.length];
    const last = index === dayCount - 1;
    days.push({ id: dayId, room_id: room.id, day_number: index + 1, trip_date: date,
      title: last ? 'One last walk & homeward bound' : index === 0 ? 'Arrival & first impressions' : spot[0],
      notes: last ? 'A farewell stop, luggage collection and the journey home.' : spot[2] });
    const stops: { name: string; description: string; category: ItineraryItem['category']; time: string; file: string }[] = [
      { name: index === 0 ? `Arrival · ${fixture.arrival[0]}` : `${fixture.travel} → ${spot[0]}`,
        description: index === 0 ? `Collected luggage and travelled together to ${fixture.hotel[0]}.` : `Morning departure from ${fixture.hotel[0]}. Everyone arrived together for the day's visit.`,
        category: 'transportation', time: '08:30', file: index === 0 ? fixture.arrival[1] : spot[1] },
      { name: spot[0], description: spot[2], category: 'attraction', time: '11:00', file: spot[1] },
      { name: last ? `Departure · ${fixture.arrival[0]}` : `${fixture.hotel[0]} · ${index === 0 ? 'Check-in' : 'Overnight stay'}`,
        description: last ? 'Picked up luggage, checked in for the flight home and shared the final trip photographs.' : 'Room keys collected, bags unpacked and an evening catch-up with the group.',
        category: last ? 'transportation' : 'stay', time: last ? '16:30' : '18:00', file: last ? fixture.arrival[1] : fixture.hotel[1] },
    ];
    stops.forEach((stop, order) => {
      const media = locationPhoto(stop.file);
      const id = `${dayId}-stop-${order}`;
      const photo: AlbumPhoto = { id: `${id}-photo`, room_id: room.id, uploaded_by: mockStandardUsers[order].id,
        uploader_name: mockStandardUsers[order].name, url: media.imageUrl, taken_at: `${date}T${stop.time}:00Z`,
        itinerary_day_id: dayId, location_name: stop.name, caption: `${stop.name} · Location photograph · ${media.credit}`, source_url: media.sourceUrl };
      items.push({ id, room_id: room.id, day_id: dayId, name: stop.name, description: stop.description,
        category: stop.category, scheduled_time: stop.time, sort_order: order, lat: 0, lng: 0, tags: ['Completed'], photo });
    });
    const lines = [
      { sender_type: 'system' as const, text: `Day ${index + 1} · ${date} · ${days[index].title}` },
      { sender_type: 'user' as const, text: index === 0 ? `We've arrived! Meet by baggage claim, then head to ${fixture.hotel[0]}.` : `Ready for ${spot[0]} today. Meet in the lobby at 08:15?` },
      { sender_type: 'mascot' as const, text: `Today's visit: ${spot[0]}. Keep a little time for photographs and a break together.` },
      { sender_type: 'user' as const, text: last ? 'Such a lovely trip. The final photos are saved and my share is paid!' : `${spot[0]} was a highlight! Our photos are in the album. See everyone back at the hotel.` },
    ];
    lines.forEach((line, lineIndex) => {
      const user = crew[(index + lineIndex) % crew.length];
      messages.push({ id: `${dayId}-message-${lineIndex}`, room_id: room.id, ...line,
        sender_id: line.sender_type === 'user' ? user.id : null, sender_name: line.sender_type === 'mascot' ? 'Roti' : line.sender_type === 'system' ? 'System' : user.name,
        sender_avatar: line.sender_type === 'user' ? user.avatar : null,
        type: line.sender_type === 'system' ? 'system_event' : 'text', created_at: new Date(`${date}T${['07:30', '08:00', '08:10', '19:30'][lineIndex]}:00+08:00`).toISOString() });
    });
  }
  messages.push({ id: `${room.id}-archive-complete`, room_id: room.id, sender_type: 'system', sender_id: null,
    sender_name: 'System', type: 'system_event', text: 'All expenses settled. Trip archived — memories are saved and this room is read-only.', created_at: `${room.end_date}T22:00:00Z` });
  return { days, items, messages, photos: items.map(item => item.photo) };
}
