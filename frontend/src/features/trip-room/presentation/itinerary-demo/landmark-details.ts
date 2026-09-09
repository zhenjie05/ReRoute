export interface LandmarkDetails {
  subtitle: string;
  history: string;
  facts: { title: string; text: string; icon: 'gem' | 'water' }[];
  visit: string;
  nearby: string;
  source?: string;
}

export const landmarkDetails: Record<string, LandmarkDetails> = {
  kyoto: {
    subtitle: 'The Golden Pavilion · Kyoto',
    history: 'Kinkaku-ji is the familiar name of Rokuon-ji, a Zen Buddhist temple in northern Kyoto. Its celebrated pavilion stands beside a landscaped pond and is associated with the former estate of shogun Ashikaga Yoshimitsu. The building brings together different architectural traditions, making the changing details on each floor part of the experience.',
    facts: [
      { title: 'GOLDEN UPPER FLOORS', text: 'Gold leaf covers the upper two storeys. The warm surface contrasts with the dark roof and the surrounding greenery.', icon: 'gem' },
      { title: 'MIRROR POND', text: 'Kyoko-chi Pond frames the pavilion with islands, stones and trees. Calm water creates the reflected view that makes this garden so recognisable.', icon: 'water' },
    ],
    visit: 'Allow time for the garden path as well as the main viewpoint. Start with the pond-side view, then keep walking to see the pavilion from different angles. Plan a quiet pause instead of rushing straight to the next stop.',
    nearby: 'Pair this visit with another garden or a relaxed tea break in northern Kyoto. Keep travel time between neighbourhoods in your day plan.',
    source: 'https://www.shokoku-ji.jp/en/kinkakuji/about/',
  },
  'tokyo-tower': {
    subtitle: 'Tokyo Tower · Minato skyline',
    history: 'Tokyo Tower is one of the city’s best-known symbols of its post-war growth. Its orange-and-white steel structure rises above the Minato district, where temple grounds, park paths and modern streets sit close together. A visit combines the tower itself with a slower look at the neighbourhood below.',
    facts: [
      { title: 'A CITY LANDMARK', text: 'The open steel frame is easy to recognise from nearby streets. Looking up from the base reveals a very different pattern from the distant skyline view.', icon: 'gem' },
      { title: 'PARK AND TEMPLE VIEWS', text: 'Shiba Park and Zojo-ji give the area a mix of greenery and architecture, with the tower rising behind the traditional buildings.', icon: 'water' },
    ],
    visit: 'Choose whether your group wants an observation-deck visit or an outdoor photography stop. Leave extra time if you plan to go inside, and agree on a meeting point before exploring separately.',
    nearby: 'Add a walk through Shiba Park, then take a café break before continuing to another Tokyo neighbourhood.',
  },
  osaka: {
    subtitle: 'Osaka Castle · Castle park',
    history: 'Osaka Castle is linked to the ambitions of Toyotomi Hideyoshi and the history of Japan’s unification. Its grounds have changed through conflict, rebuilding and the growth of modern Osaka. Today the prominent keep, deep moats and massive stone walls give visitors a way to explore that layered past.',
    facts: [
      { title: 'STONE WALLS AND MOATS', text: 'The approach is part of the attraction: broad defensive walls and water surround the castle grounds, creating long views toward the central keep.', icon: 'gem' },
      { title: 'GREEN SPACE IN THE CITY', text: 'The surrounding park opens up the skyline and provides places to pause between the castle, gardens and walking paths.', icon: 'water' },
    ],
    visit: 'Plan enough time to walk from the park entrance to the keep. A visit inside and a relaxed outdoor circuit need different amounts of time, so decide which experience the group wants before confirming the stop.',
    nearby: 'Continue with a food-focused evening in central Osaka, keeping the transfer separate from the castle walking time.',
    source: 'https://www.japan.travel/en/destinations/kansai/osaka/osaka-castle-and-around/',
  },
  sapporo: {
    subtitle: 'Sapporo Clock Tower · Hokkaido',
    history: 'Sapporo’s Clock Tower was built in 1878 for Sapporo Agricultural College, the predecessor of Hokkaido University. The modest wooden building is closely tied to the development of the city. Its exhibitions introduce that educational history and the people connected with the college.',
    facts: [
      { title: 'WOODEN HERITAGE', text: 'The white timber building and red roof offer a small-scale contrast to the modern streets around it.', icon: 'gem' },
      { title: 'A CENTRAL CITY STOP', text: 'The tower fits naturally into a walking route through central Sapporo, with time left for parks, local food and the surrounding streets.', icon: 'water' },
    ],
    visit: 'Use this as a short heritage stop or leave more time for the indoor exhibits. Take a moment to view the building from across the street so the whole clock tower fits into the scene.',
    nearby: 'Combine it with Odori Park and a relaxed meal in the city centre. Keep an indoor option in your plan for a change in weather.',
    source: 'https://www.sapporo.travel/en/spot/facility/clock_tower/',
  },
  shizuoka: {
    subtitle: 'Mount Fuji views · Shizuoka',
    history: 'Mount Fuji has a lasting place in Japanese art, pilgrimage and landscape traditions. Shizuoka offers an approach from the mountain’s southern side, where coastal scenery, towns and tea-growing landscapes create different settings for the same distinctive peak. The mountain can be the focus of a scenic day without planning a climb.',
    facts: [
      { title: 'MANY VIEWPOINTS', text: 'A mountain view changes with your position: coast, town and countryside each create a different foreground for photographs.', icon: 'gem' },
      { title: 'WEATHER SHAPES THE VIEW', text: 'Clouds can hide the summit. Treat a clear view as part of the experience and leave space for an alternative stop.', icon: 'water' },
    ],
    visit: 'Choose a specific viewpoint before adding transport to your route. Keep this scenic stop flexible, with time for a walk and a break rather than scheduling several distant viewpoints back-to-back.',
    nearby: 'Consider a coastal walk, a tea stop or a local town visit as a companion to your Fuji viewpoint.',
    source: 'https://www.japan.travel/en/destinations/tokai/shizuoka/mt-fuji-area/',
  },
  eiffel: {
    subtitle: 'Eiffel Tower · Paris',
    history: 'Built for the 1889 World’s Fair, the Eiffel Tower became a defining symbol of Paris. Its exposed iron structure was a bold engineering statement for its time. The surrounding riverbanks and open lawns still make the tower a focal point of a walk through the city.',
    facts: [
      { title: 'IRON LATTICE', text: 'The tower’s structure is part of its character. Close to the base, the diagonal beams create patterns that are easy to miss from a distant viewpoint.', icon: 'gem' },
      { title: 'GARDEN AND RIVER VIEWS', text: 'Champ de Mars and the Seine offer different perspectives. A short walk between them makes room for both wide views and architectural details.', icon: 'water' },
    ],
    visit: 'Decide whether this is a garden-and-photo stop or a visit up the tower. Leave extra time for entry if going inside, then plan a riverside break before your next attraction.',
    nearby: 'Add a Seine walk or a stop around Trocadéro. Agree on a meeting point so the group can take photographs at its own pace.',
    source: 'https://www.toureiffel.paris/en/the-monument/history',
  },
  louvre: {
    subtitle: 'Louvre Pyramid · Paris',
    history: 'The Louvre’s palace buildings reflect a long history of changing royal and cultural uses. The glass pyramid introduces a modern geometric form into that historic courtyard. Together they make the site an architectural stop as well as the entrance to one of the world’s best-known museums.',
    facts: [
      { title: 'OLD AND NEW', text: 'The transparent pyramid and the stone palace façades create a striking contrast of materials, shapes and scale.', icon: 'gem' },
      { title: 'COURTYARD PERSPECTIVES', text: 'Walk around the courtyard for changing reflections and views through the palace passages toward the surrounding city.', icon: 'water' },
    ],
    visit: 'Separate a courtyard visit from time inside the museum. If your group wants to see galleries, choose a few priorities and leave a generous block in the itinerary.',
    nearby: 'Continue toward the Tuileries gardens for a slower outdoor break after the museum or courtyard.',
  },
  lyon: {
    subtitle: 'Lyon · Rivers and Renaissance streets',
    history: 'Lyon’s historic districts preserve layers of the city’s development around the Rhône and Saône. In Vieux Lyon, Renaissance streets, courtyards and passageways reveal a different rhythm from the open squares of the peninsula. The historic site is recognised by UNESCO for this continuity of urban history.',
    facts: [
      { title: 'HIDDEN PASSAGEWAYS', text: 'Traboules connect streets through buildings and courtyards. Only enter passages open to visitors, keeping residential spaces quiet.', icon: 'gem' },
      { title: 'TWO RIVERS', text: 'The Rhône and Saône shape Lyon’s neighbourhoods. Riverside walks help connect the open squares with the older streets.', icon: 'water' },
    ],
    visit: 'Use Place Bellecour as a starting point, then choose a walk through the old town or along the river. Leave time to explore side streets without packing every hour with a new stop.',
    nearby: 'Plan a relaxed meal and a riverside break. If adding a hilltop viewpoint, include the climb or transfer in your schedule.',
    source: 'https://events.lyon-france.com/en/choose-lyon/the-assets-of-lyon/historical-lyon',
  },
  bordeaux: {
    subtitle: 'Bordeaux · Place de la Bourse',
    history: 'Bordeaux’s riverfront architecture reflects the city’s long connection with trade along the Garonne. Place de la Bourse brings the formal façades of the historic centre to the water’s edge. The square and nearby quays make a natural introduction to the city on foot.',
    facts: [
      { title: 'RIVERFRONT FAÇADES', text: 'The repeated windows and pale stone buildings form a broad architectural scene. Step back toward the waterfront to appreciate the whole square.', icon: 'gem' },
      { title: 'WATER MIRROR', text: 'The Miroir d’eau is known for reflecting the square. The experience changes with the water cycle, light and weather.', icon: 'water' },
    ],
    visit: 'Start with the square, then follow the quays at a comfortable pace. Leave a little unplanned time for photographs and a café stop rather than treating the waterfront as a quick transfer.',
    nearby: 'Continue into the old centre or along the Garonne promenade, depending on how much walking your group prefers.',
    source: 'https://www.bordeaux-tourisme.com/patrimoine-culturel/place-bourse.html',
  },
  marseille: {
    subtitle: 'Marseille · Vieux-Port',
    history: 'Marseille grew around its connection to the Mediterranean, and the Old Port remains one of the clearest places to see that maritime identity. Waterfront streets, boats and hillside views create a setting shaped by the sea. The harbour is a useful starting point for exploring the city’s older neighbourhoods.',
    facts: [
      { title: 'A WORKING HARBOUR SCENE', text: 'Masts, boats and quays create layers of detail across the water. Walking around the harbour changes the view of the city behind it.', icon: 'gem' },
      { title: 'HILLSIDE PERSPECTIVES', text: 'Views from higher ground reveal the relationship between the port and the surrounding city. Allow time for the climb or transfer.', icon: 'water' },
    ],
    visit: 'Begin with a waterfront walk and choose one nearby neighbourhood to explore. Set aside time for a meal and a shaded break before adding a viewpoint to the route.',
    nearby: 'Pair the Old Port with Le Panier’s streets or a viewpoint near Notre-Dame de la Garde, depending on your group’s pace.',
  },
  nice: {
    subtitle: 'Nice · Promenade des Anglais',
    history: 'The Promenade des Anglais is closely connected with the British visitors who helped shape Nice as a winter resort. Its seafront setting became an enduring part of the city’s identity. A walk here links the open horizon with the architecture and colourful streets behind the coast.',
    facts: [
      { title: 'SEAFRONT PROMENADE', text: 'The broad walkway follows the curve of the bay, with changing views of the sea and the buildings along the shore.', icon: 'water' },
      { title: 'OLD TOWN CONTRAST', text: 'Nearby streets offer a more intimate scale of façades, squares and local food stops after the openness of the waterfront.', icon: 'gem' },
    ],
    visit: 'Choose a manageable stretch of the promenade, then leave time to wander through the old town. Plan a water or café break and keep the route flexible around the group’s energy.',
    nearby: 'Add an old-town food stop or a viewpoint walk for a different perspective on the bay.',
    source: 'https://www.explorenicecotedazur.com/en/culture/promenade-des-anglais/',
  },
};
