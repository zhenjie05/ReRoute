import { useSyncExternalStore } from 'react';
import type { DecisionCard } from '@/models/decision';
import { getCity, getPlace } from './demo-data';

export interface PlannedStop { id: string; placeId: string; confirmed: boolean; time: string }
export interface DemoPoll { card: DecisionCard; stopId: string; userVotes: Record<string, string> }
export interface DemoPlan { days: PlannedStop[][]; finalized: boolean; polls: DemoPoll[] }
const plans: Record<string, DemoPlan> = {};
const listeners = new Set<() => void>();
let sequence = 0;
const uid = () => `demo-${Date.now()}-${++sequence}`;
export function getDemoPlan(roomId: string) {
  if (!plans[roomId]) {
    const first = getCity(roomId) === 'bali' ? 'kuta' : getCity(roomId) === 'paris' ? 'eiffel' : 'tokyo-tower';
    const stops = [{ id: `${roomId}-first`, placeId: first, confirmed: true, time: '09:00' }];
    if (getCity(roomId) === 'tokyo') stops.push({ id: `${roomId}-kyoto`, placeId: 'kyoto', confirmed: false, time: '12:00' });
    plans[roomId] = { days: [stops, []], finalized: false, polls: [] };
  }
  return plans[roomId];
}
function update(roomId: string, change: (previous: DemoPlan) => DemoPlan) {
  plans[roomId] = change(getDemoPlan(roomId));
  listeners.forEach((listener) => listener());
}
function subscribe(listener: () => void) { listeners.add(listener); return () => { listeners.delete(listener); }; }
export function useDemoPlan(roomId: string) {
  return useSyncExternalStore(subscribe, () => getDemoPlan(roomId), () => getDemoPlan(roomId));
}
export function addStop(roomId: string, day: number, placeId: string) {
  if (!getPlace(placeId) || getPlace(placeId).city !== getCity(roomId)) return;
  update(roomId, (plan) => {
    if (plan.finalized || plan.days[day].some((stop) => stop.placeId === placeId)) return plan;
    return { ...plan, days: plan.days.map((stops, index) => index === day ? [...stops, { id: uid(), placeId, confirmed: false, time: `${String(9 + stops.length * 3).padStart(2, '0')}:00` }] : stops) };
  });
}
export function editStop(roomId: string, day: number, stopId: string, action: 'remove' | 'up' | 'down' | 'confirm') {
  update(roomId, (plan) => {
    if (plan.finalized) return plan;
    const days = plan.days.map((stops) => [...stops]);
    const index = days[day].findIndex((stop) => stop.id === stopId);
    if (index < 0) return plan;
    if (action === 'remove') days[day].splice(index, 1);
    else if (action === 'confirm') days[day][index] = { ...days[day][index], confirmed: !days[day][index].confirmed };
    else {
      const next = index + (action === 'up' ? -1 : 1);
      if (next < 0 || next >= days[day].length) return plan;
      [days[day][index], days[day][next]] = [days[day][next], days[day][index]];
      days[day] = days[day].map((stop, order) => ({ ...stop, time: `${String(9 + order * 3).padStart(2, '0')}:00` }));
    }
    return { ...plan, days };
  });
}
export function finalizePlan(roomId: string, finalized: boolean) { update(roomId, (plan) => ({ ...plan, finalized })); }
export function proposeStopVote(roomId: string, stop: PlannedStop, title: string, anonymous: boolean) {
  let cardId = '';
  update(roomId, (plan) => {
    const existing = plan.polls.find((poll) => poll.stopId === stop.id && poll.card.status === 'active');
    if (existing) { cardId = existing.card.id; return plan; }
    cardId = uid();
    const card: DecisionCard = {
      id: cardId, room_id: roomId, trigger_type: 'conflict', title: title.trim() || `Add ${getPlace(stop.placeId).name} to our route?`,
      description: `Itinerary suggestion · ${getPlace(stop.placeId).name} · ${stop.time}`, anonymous, status: 'active', created_at: new Date().toISOString(),
      options: [{ id: `${cardId}-yes`, label: 'Let’s go!', votes_count: 0 }, { id: `${cardId}-later`, label: 'Save for another day', votes_count: 0 }],
    };
    return { ...plan, polls: [...plan.polls, { card, stopId: stop.id, userVotes: {} }] };
  });
  return cardId;
}
export function voteOnStop(roomId: string, cardId: string, optionId: string, userId: string) {
  update(roomId, (plan) => ({ ...plan, polls: plan.polls.map((poll) => {
    if (poll.card.id !== cardId || poll.card.status !== 'active' || !poll.card.options.some((option) => option.id === optionId)) return poll;
    const old = poll.userVotes[userId];
    return { ...poll, userVotes: { ...poll.userVotes, [userId]: optionId }, card: { ...poll.card, options: poll.card.options.map((option) => ({ ...option, votes_count: (option.votes_count || 0) - (option.id === old ? 1 : 0) + (option.id === optionId ? 1 : 0) })) } };
  }) }));
}
