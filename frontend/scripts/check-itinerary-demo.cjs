// Small dependency-free checks for the demo's shared state and map coordinates.
// Run: node scripts/check-itinerary-demo.cjs
const assert = require('node:assert/strict');
const { load: loadFile } = require('./load-frontend-mock.cjs');
const load = name => loadFile(`src/features/trip-room/presentation/itinerary-demo/${name}.ts`);
const data = load('demo-data');
const store = load('demo-store');
let checks = 0;
function check(name, run) { run(); checks++; console.log(`PASS ${name}`); }
const room = 'test-paris', other = 'test-tokyo';
const read = () => store.getDemoPlan(room);
check('Mercator projection round-trips both cities at all UI zoom levels', () => {
  for (const city of Object.values(data.demoCities)) for (let zoom = 11; zoom <= 17; zoom++) {
    const pixel = data.project(city, zoom), location = data.unproject(pixel.x, pixel.y, zoom);
    assert.ok(Math.abs(location.lat - city.lat) < 1e-8);
    assert.ok(Math.abs(location.lng - city.lng) < 1e-8);
  }
});
check('Active Bali has unique, independently selectable transport drop-offs', () => {
  for (const place of data.demoPlaces.filter(place => place.city === 'bali')) {
    assert.equal(place.transport.length, 3);
    assert.equal(place.transport.filter((item) => item.recommended).length, 1);
    assert.equal(new Set(place.transport.map((item) => `${item.lat},${item.lng}`)).size, 3);
  }
});
check('Adding a landmark updates only its room and day', () => {
  store.addStop(room, 0, 'louvre');
  assert.deepEqual(read().days[0].map((stop) => stop.placeId), ['eiffel', 'louvre']);
  assert.equal(read().days[1].length, 0);
  assert.equal(store.getDemoPlan(other).days[0].length, 2);
});
check('Duplicate and cross-country additions are ignored', () => {
  store.addStop(room, 0, 'louvre'); store.addStop(room, 0, 'sensoji');
  assert.equal(read().days[0].length, 2);
});
const stop = read().days[0][1];
check('Reordering preserves stops and updates timeline times', () => {
  store.editStop(room, 0, stop.id, 'up');
  assert.equal(read().days[0][0].placeId, 'louvre');
  assert.deepEqual(read().days[0].map((item) => item.time), ['09:00', '12:00']);
});
check('One itinerary suggestion creates one Discussion poll', () => {
  const first = store.proposeStopVote(room, stop, 'Visit the Louvre?', true);
  const again = store.proposeStopVote(room, stop, 'Visit the Louvre?', true);
  assert.equal(first, again); assert.equal(read().polls.length, 1);
  assert.equal(read().polls[0].card.anonymous, true);
  assert.equal(store.getDemoPlan(other).polls.length, 0);
});
check('Repeated voting is idempotent; changing a vote transfers its count', () => {
  const card = read().polls[0].card;
  store.voteOnStop(room, card.id, card.options[0].id, 'alex');
  store.voteOnStop(room, card.id, card.options[0].id, 'alex');
  assert.deepEqual(read().polls[0].card.options.map((option) => option.votes_count), [1, 0]);
  store.voteOnStop(room, card.id, card.options[1].id, 'alex');
  assert.deepEqual(read().polls[0].card.options.map((option) => option.votes_count), [0, 1]);
});
check('Finalized planning blocks edits and reopening restores editing', () => {
  store.finalizePlan(room, true);
  store.editStop(room, 0, stop.id, 'remove');
  store.addStop(room, 1, 'eiffel');
  assert.equal(read().days[0].length, 2); assert.equal(read().days[1].length, 0);
  store.finalizePlan(room, false); store.editStop(room, 0, stop.id, 'remove');
  assert.equal(read().days[0].length, 1);
});
check('Every active transport point has its own arrival photo, separate from the landmark', () => {
  for (const place of data.demoPlaces.filter(item => item.city === 'bali')) {
    for (const option of place.transport) {
      const arrival = data.arrivalPhotos[`${place.id}-${option.mode}`];
      assert.ok(arrival?.name && arrival?.source && arrival?.credit);
      assert.notEqual(arrival.photo, place.photo);
    }
  }
});
check('France and Japan planning cities stay isolated from Bali', () => {
  for (const roomId of ['room-paris-2026', 'room-tokyo-2026']) {
    const cities = data.getPlanningCities(roomId);
    assert.equal(cities.length, 5);
    for (const city of cities) assert.equal(data.getPlace(city.id).city, data.getCity(roomId));
    const before = store.getDemoPlan(roomId).days[0].length;
    store.addStop(roomId, 0, 'kuta');
    assert.equal(store.getDemoPlan(roomId).days[0].length, before);
  }
  assert.equal(data.getCity('room-bali-2026'), 'bali');
});
console.log(`${checks} itinerary demo checks passed.`);
