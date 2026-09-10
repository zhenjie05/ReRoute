const assert = require('node:assert/strict');
const { load } = require('./load-frontend-mock.cjs');
const fixtures = load('src/features/trip-room/data/mock-trip-room.ts');
const { createRoomBudget, budgetBalances } = load('src/features/trip-room/data/room-budget.ts');
const { landmarkDetails } = load('src/features/trip-room/presentation/itinerary-demo/landmark-details.ts');
const { getPlanningCities, demoPlaces } = load('src/features/trip-room/presentation/itinerary-demo/demo-data.ts');
let checks = 0;
const check = (name, fn) => { fn(); console.log('PASS ' + name); checks++; };
const archived = fixtures.mockTripRooms.filter(room => room.stage === 'archived');
check('Seven rooms preserve Bali active, France/Japan planning, and four seasonal archives', () => {
  assert.equal(fixtures.mockTripRooms.length, 7);
  assert.deepEqual(fixtures.mockTripRooms.slice(0, 3).map(room => room.stage), ['active', 'planning', 'planning']);
  assert.equal(archived.length, 4);
  assert.deepEqual(archived.map(room => room.season).sort(), ['autumn', 'spring', 'summer', 'winter']);
});
for (const room of fixtures.mockTripRooms) {
  const members = fixtures.mockTripMembers.filter(member => member.room_id === room.id);
  check(room.name + ': populated travelers, chats and photos', () => {
    assert.ok(members.length >= 4);
    assert.ok(members.every(member => member.user.avatar));
    const types = new Set(fixtures.mockMessages.filter(message => message.room_id === room.id).map(message => message.sender_type));
    for (const type of ['user', 'system', 'mascot']) assert.ok(types.has(type));
    assert.ok(fixtures.mockAlbumPhotos.filter(photo => photo.room_id === room.id).length >= 6);
  });
  const budget = createRoomBudget(room, members);
  check(room.name + ': stage-appropriate budget and balanced splits', () => {
    if (room.stage === 'planning') { assert.equal(budget.expenses.length, 0); assert.equal(budget.splits.length, 0); }
    for (const expense of budget.expenses) assert.ok(Math.abs(budget.splits.filter(split => split.expense_id === expense.id).reduce((sum, split) => sum + split.amount_owed, 0) - expense.total_amount) < 0.01);
    const balances = budgetBalances(budget, members.map(member => ({ id: member.user_id })));
    assert.ok(Math.abs(balances.reduce((sum, person) => sum + person.balance, 0)) < 0.02);
    if (room.stage === 'archived') {
      assert.ok(budget.expenses.length >= 3 && budget.settlements.length >= 3);
      assert.ok(balances.every(person => person.balance === 0));
    }
  });
}
for (const room of archived) check(room.name + ': every trip day has linked, photographed history', () => {
  const days = fixtures.mockItineraryDays.filter(day => day.room_id === room.id);
  assert.equal(days.length, (Date.parse(room.end_date) - Date.parse(room.start_date)) / 86400000 + 1);
  assert.equal(days[0].trip_date, room.start_date);
  assert.equal(days.at(-1).trip_date, room.end_date);
  for (const day of days) {
    const stops = fixtures.mockArchivedStops.filter(stop => stop.day_id === day.id);
    assert.ok(stops.length >= 3);
    assert.ok(stops.every(stop => stop.photo.url.startsWith('https://') && stop.photo.itinerary_day_id === day.id));
    assert.ok(stops.some(stop => stop.category === 'transportation'));
  }
});
check('Each city opens its own story and image-backed highlights', () => {
  for (const roomId of ['room-paris-2026', 'room-tokyo-2026']) for (const city of getPlanningCities(roomId)) {
    const details = landmarkDetails[city.id];
    assert.ok(details.history.length > 100);
    assert.ok(details.engagingHighlights.length >= 2);
    assert.ok(details.engagingHighlights.every(item => item.title && item.shortDescription.length < 160 && item.imageUrl.startsWith('https://') && item.sourceUrl && item.credit));
    assert.equal(details.facts, undefined);
  }
  assert.ok(demoPlaces.find(place => place.id === 'kyoto').photo.includes('Kinkaku'));
  assert.ok(demoPlaces.find(place => place.id === 'shizuoka').photo.includes('Mount_Fuji'));
  assert.ok(demoPlaces.find(place => place.id === 'eiffel').photo.includes('Eiffel'));
});
console.log(checks + ' room checks passed.');

