import { locationPhoto } from '../../data/location-photos';

export interface EngagingHighlight {
  title: string;
  shortDescription: string;
  imageUrl: string;
  sourceUrl: string;
  credit: string;
}

export const landmarkCopy = {
  history: 'The story behind the place', highlights: 'Highlights', visit: 'Make the most of your visit',
  source: 'Official visitor guide ↗', photoSource: 'Photo credit ↗', about: 'About this destination',
  plan: 'Plan your visit', planningTip: 'Leave time for a walk, photographs and a break together.',
  model: '3D Model', photo: 'Exact Image', added: '✓ Added to Itinerary', add: '⌖ Add to Itinerary', explore: 'Explore',
};

const highlights = (rows: [string, string, string][]): EngagingHighlight[] => rows.map(([title, shortDescription, file]) => ({ title, shortDescription, ...locationPhoto(file) }));

export interface LandmarkDetails {
  subtitle: string;
  history: string;
  engagingHighlights: EngagingHighlight[];
  visit: string;
  nearby: string;
  source?: string;
}

export const landmarkDetails: Record<string, LandmarkDetails> = {
  kyoto: {
    subtitle: 'The Golden Pavilion · Kyoto',
    history: 'Kinkaku-ji is the familiar name of Rokuon-ji, a Zen Buddhist temple in northern Kyoto. Its celebrated pavilion stands beside a landscaped pond and is associated with the former estate of shogun Ashikaga Yoshimitsu. The building brings together different architectural traditions, making the changing details on each floor part of the experience.',
    engagingHighlights: highlights([
      [
        "Golden Pavilion reflections",
        "Catch Kinkaku-ji mirrored in its pond—the classic Kyoto photograph.",
        "Kinkaku-ji, Kyoto.jpg"
      ],
      [
        "Walk the bamboo lanes",
        "Add Arashiyama’s soaring bamboo grove to another Kyoto half-day.",
        "Bamboo Forest, Arashiyama, Kyoto, Japan.jpg"
      ]
    ]),
    visit: 'Allow time for the garden path as well as the main viewpoint. Start with the pond-side view, then keep walking to see the pavilion from different angles. Plan a quiet pause instead of rushing straight to the next stop.',
    nearby: 'Pair this visit with another garden or a relaxed tea break in northern Kyoto. Keep travel time between neighbourhoods in your day plan.',
    source: 'https://www.shokoku-ji.jp/en/kinkakuji/about/',
  },
  'tokyo-tower': {
    subtitle: 'Tokyo Tower · Minato skyline',
    history: 'Tokyo Tower is one of the city’s best-known symbols of its post-war growth. Its orange-and-white steel structure rises above the Minato district, where temple grounds, park paths and modern streets sit close together. A visit combines the tower itself with a slower look at the neighbourhood below.',
    engagingHighlights: highlights([
      [
        "Tokyo’s orange icon",
        "Temple streets below, a sweeping skyline above: meet Tokyo Tower.",
        "Tokyo Tower, Minato City.jpg"
      ],
      [
        "Another skyline, another mood",
        "Pair the classic tower with Tokyo Skytree’s futuristic silhouette.",
        "Tokyo Skytree 2014 Ⅲ.jpg"
      ]
    ]),
    visit: 'Choose whether your group wants an observation-deck visit or an outdoor photography stop. Leave extra time if you plan to go inside, and agree on a meeting point before exploring separately.',
    nearby: 'Add a walk through Shiba Park, then take a café break before continuing to another Tokyo neighbourhood.',
  },
  osaka: {
    subtitle: 'Osaka Castle · Castle park',
    history: 'Osaka Castle is linked to the ambitions of Toyotomi Hideyoshi and the history of Japan’s unification. Its grounds have changed through conflict, rebuilding and the growth of modern Osaka. Today the prominent keep, deep moats and massive stone walls give visitors a way to explore that layered past.',
    engagingHighlights: highlights([
      [
        "Castle in the city",
        "Moats, stone walls and a dramatic keep make this a camera-ready walk.",
        "Osaka Castle (13382634615).jpg"
      ],
      [
        "Takoyaki time",
        "Crisp outside, soft inside—share Osaka’s iconic octopus snack.",
        "Takoyaki.jpg"
      ]
    ]),
    visit: 'Plan enough time to walk from the park entrance to the keep. A visit inside and a relaxed outdoor circuit need different amounts of time, so decide which experience the group wants before confirming the stop.',
    nearby: 'Continue with a food-focused evening in central Osaka, keeping the transfer separate from the castle walking time.',
    source: 'https://www.japan.travel/en/destinations/kansai/osaka/osaka-castle-and-around/',
  },
  sapporo: {
    subtitle: 'Sapporo Clock Tower · Hokkaido',
    history: 'Sapporo’s Clock Tower was built in 1878 for Sapporo Agricultural College, the predecessor of Hokkaido University. The modest wooden building is closely tied to the development of the city. Its exhibitions introduce that educational history and the people connected with the college.',
    engagingHighlights: highlights([
      [
        "A tiny time capsule",
        "Pause at the red-roofed Clock Tower among Sapporo’s modern streets.",
        "Sapporo Clock Tower.JPG"
      ],
      [
        "Warm up with miso ramen",
        "A rich, comforting bowl is a delicious Sapporo ritual.",
        "Miso ramen of Sapporo 02.jpg"
      ]
    ]),
    visit: 'Use this as a short heritage stop or leave more time for the indoor exhibits. Take a moment to view the building from across the street so the whole clock tower fits into the scene.',
    nearby: 'Combine it with Odori Park and a relaxed meal in the city centre. Keep an indoor option in your plan for a change in weather.',
    source: 'https://www.sapporo.travel/en/spot/facility/clock_tower/',
  },
  shizuoka: {
    subtitle: 'Mount Fuji views · Shizuoka',
    history: 'Mount Fuji has a lasting place in Japanese art, pilgrimage and landscape traditions. Shizuoka offers an approach from the mountain’s southern side, where coastal scenery, towns and tea-growing landscapes create different settings for the same distinctive peak. The mountain can be the focus of a scenic day without planning a climb.',
    engagingHighlights: highlights([
      [
        "Fuji meets the sea",
        "Miho’s pine-fringed coast frames Mount Fuji on a clear day.",
        "Mount Fuji from Miho no Matsubara.JPG"
      ],
      [
        "Chase the perfect silhouette",
        "Let clouds clear, slow down and make the mountain your main event.",
        "Mount Fuji from Miho no Matsubara.JPG"
      ]
    ]),
    visit: 'Choose a specific viewpoint before adding transport to your route. Keep this scenic stop flexible, with time for a walk and a break rather than scheduling several distant viewpoints back-to-back.',
    nearby: 'Consider a coastal walk, a tea stop or a local town visit as a companion to your Fuji viewpoint.',
    source: 'https://www.japan.travel/en/destinations/tokai/shizuoka/mt-fuji-area/',
  },
  eiffel: {
    subtitle: 'Eiffel Tower · Paris',
    history: 'Built for the 1889 World’s Fair, the Eiffel Tower became a defining symbol of Paris. Its exposed iron structure was a bold engineering statement for its time. The surrounding riverbanks and open lawns still make the tower a focal point of a walk through the city.',
    engagingHighlights: highlights([
      [
        "Your Paris postcard",
        "Frame the Eiffel Tower from the lawns of Champ de Mars.",
        "Eiffel Tower 20051010.jpg"
      ],
      [
        "A buttery bakery break",
        "Pick up a croissant before your next Paris neighbourhood walk.",
        "Croissants au beurre (18953292873).jpg"
      ]
    ]),
    visit: 'Decide whether this is a garden-and-photo stop or a visit up the tower. Leave extra time for entry if going inside, then plan a riverside break before your next attraction.',
    nearby: 'Add a Seine walk or a stop around Trocadéro. Agree on a meeting point so the group can take photographs at its own pace.',
    source: 'https://www.toureiffel.paris/en/the-monument/history',
  },
  louvre: {
    subtitle: 'Louvre Pyramid · Paris',
    history: 'The Louvre’s palace buildings reflect a long history of changing royal and cultural uses. The glass pyramid introduces a modern geometric form into that historic courtyard. Together they make the site an architectural stop as well as the entrance to one of the world’s best-known museums.',
    engagingHighlights: highlights([
      [
        "Glass meets palace",
        "The Louvre Pyramid turns the courtyard into an architectural photo stop.",
        "Louvre Pyramid from an arch 8.jpg"
      ],
      [
        "Paris, one pastry at a time",
        "Leave a little room in your museum day for a flaky croissant.",
        "Croissants au beurre (18953292873).jpg"
      ]
    ]),
    visit: 'Separate a courtyard visit from time inside the museum. If your group wants to see galleries, choose a few priorities and leave a generous block in the itinerary.',
    nearby: 'Continue toward the Tuileries gardens for a slower outdoor break after the museum or courtyard.',
  },
  lyon: {
    subtitle: 'Lyon · Rivers and Renaissance streets',
    history: 'Lyon’s historic districts preserve layers of the city’s development around the Rhône and Saône. In Vieux Lyon, Renaissance streets, courtyards and passageways reveal a different rhythm from the open squares of the peninsula. The historic site is recognised by UNESCO for this continuity of urban history.',
    engagingHighlights: highlights([
      [
        "Slip into a traboule",
        "Look for Lyon’s passageways and quiet courtyards; respect private entrances.",
        "Traboule 8.jpg"
      ],
      [
        "Meet at Bellecour",
        "Start your city wander beside the square’s equestrian statue.",
        "Place Bellecour, Lyon - statue of Louis XIV.jpg"
      ]
    ]),
    visit: 'Use Place Bellecour as a starting point, then choose a walk through the old town or along the river. Leave time to explore side streets without packing every hour with a new stop.',
    nearby: 'Plan a relaxed meal and a riverside break. If adding a hilltop viewpoint, include the climb or transfer in your schedule.',
    source: 'https://events.lyon-france.com/en/choose-lyon/the-assets-of-lyon/historical-lyon',
  },
  bordeaux: {
    subtitle: 'Bordeaux · Place de la Bourse',
    history: 'Bordeaux’s riverfront architecture reflects the city’s long connection with trade along the Garonne. Place de la Bourse brings the formal façades of the historic centre to the water’s edge. The square and nearby quays make a natural introduction to the city on foot.',
    engagingHighlights: highlights([
      [
        "A riverfront postcard",
        "Place de la Bourse brings elegant façades to the Garonne waterfront.",
        "Bordeaux place de la bourse with tram.JPG"
      ],
      [
        "Bordeaux in one bite",
        "Try a canelé: caramelised crust, soft vanilla-and-rum centre.",
        "Cannele (12559).jpg"
      ]
    ]),
    visit: 'Start with the square, then follow the quays at a comfortable pace. Leave a little unplanned time for photographs and a café stop rather than treating the waterfront as a quick transfer.',
    nearby: 'Continue into the old centre or along the Garonne promenade, depending on how much walking your group prefers.',
    source: 'https://www.bordeaux-tourisme.com/patrimoine-culturel/place-bourse.html',
  },
  marseille: {
    subtitle: 'Marseille · Vieux-Port',
    history: 'Marseille grew around its connection to the Mediterranean, and the Old Port remains one of the clearest places to see that maritime identity. Waterfront streets, boats and hillside views create a setting shaped by the sea. The harbour is a useful starting point for exploring the city’s older neighbourhoods.',
    engagingHighlights: highlights([
      [
        "Follow the harbour",
        "Boats, waterfront cafés and sea views set the pace at the Vieux-Port.",
        "Vieux port Marseile.jpg"
      ],
      [
        "A city above the water",
        "Look back over the Old Port from the Notre-Dame de la Garde hillside.",
        "Vieux port Marseile.jpg"
      ]
    ]),
    visit: 'Begin with a waterfront walk and choose one nearby neighbourhood to explore. Set aside time for a meal and a shaded break before adding a viewpoint to the route.',
    nearby: 'Pair the Old Port with Le Panier’s streets or a viewpoint near Notre-Dame de la Garde, depending on your group’s pace.',
  },
  nice: {
    subtitle: 'Nice · Promenade des Anglais',
    history: 'The Promenade des Anglais is closely connected with the British visitors who helped shape Nice as a winter resort. Its seafront setting became an enduring part of the city’s identity. A walk here links the open horizon with the architecture and colourful streets behind the coast.',
    engagingHighlights: highlights([
      [
        "Take the scenic route",
        "Stroll the Promenade des Anglais with the Mediterranean beside you.",
        "Promenade des Anglais.jpg"
      ],
      [
        "Hot socca, happy afternoon",
        "Try Nice’s peppery chickpea pancake fresh from the oven.",
        "Socca a Nice.jpg"
      ]
    ]),
    visit: 'Choose a manageable stretch of the promenade, then leave time to wander through the old town. Plan a water or café break and keep the route flexible around the group’s energy.',
    nearby: 'Add an old-town food stop or a viewpoint walk for a different perspective on the bay.',
    source: 'https://www.explorenicecotedazur.com/en/culture/promenade-des-anglais/',
  },
};
