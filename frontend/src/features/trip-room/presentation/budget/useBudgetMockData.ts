import { mockTripRooms, mockTripMembers } from '../../data/mock-trip-room';
import { mockStandardUsers } from '@/shared/data/standard-mock-data';
import { useRoomSessionState } from '../../data/useRoomSessionState';
import { createRoomBudget, budgetBalances } from '../../data/room-budget';
import type { Expense, ExpenseSplit, Settlement } from '@/models/budget';

export const useBudgetMockData = (roomId: string) => {
  const room = mockTripRooms.find(item => item.id === roomId) || mockTripRooms[0];
  const members = mockTripMembers.filter(member => member.room_id === room.id);
  const travelers = members.map(member => mockStandardUsers.find(user => user.id === member.user_id) || {
    ...mockStandardUsers[0], id: member.user_id, name: member.user?.name || 'Traveler', avatar: member.user?.avatar,
  });
  const [budget, setBudget] = useRoomSessionState(room.id, 'budget', () => createRoomBudget(room, members));
  const addExpense = (expense: Expense, splits: ExpenseSplit[]) => {
    if (room.stage === 'archived') return;
    setBudget(previous => ({ ...previous, expenses: [...previous.expenses, expense], splits: [...previous.splits, ...splits] }));
  };
  const addSettlement = (payment: Settlement) => {
    if (room.stage === 'archived') return;
    setBudget(previous => ({ ...previous, settlements: [...previous.settlements, payment] }));
  };
  return { ...budget, travelers, balances: budgetBalances(budget, travelers), addExpense, addSettlement };
};
