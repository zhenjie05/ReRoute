import type { BudgetCategory, Expense, ExpenseSplit, Settlement } from '@/models/budget';
import type { TripRoom, TripRoomMember } from '@/models/trip-room';

export interface RoomBudget {
  categories: BudgetCategory[];
  expenses: Expense[];
  splits: ExpenseSplit[];
  settlements: Settlement[];
}

const expenseNames: Record<string, string[]> = {
  'room-bali-2026': ['Kuta hotel · first two nights', 'Beachside group lunch', 'Airport shuttle'],
  'room-china-2025': ['Beijing hotel stay', 'Beijing group meals', 'Airport and Mutianyu transfers'],
  'room-australia-2025': ['Sydney hotel stay', 'Harbour and coastal meals', 'Airport train and Blue Mountains travel'],
  'room-canada-2024': ['Lake Louise hotel stay', 'Rockies road-trip meals', 'Car rental and fuel'],
  'room-swiss-2025': ['Zermatt hotel stay', 'Alpine group meals', 'Rail transfers and Gornergrat tickets'],
};

export function createRoomBudget(room: TripRoom, members: TripRoomMember[]): RoomBudget {
  const categories = ['Accommodation', 'Food & Drink', 'Transport'].map((category_name, index) => ({
    id: `c${index + 1}`, room_id: room.id, category_name, planned_amount: [1600, 800, 900][index],
  }));
  if (room.stage === 'planning') return { categories, expenses: [], splits: [], settlements: [] };
  const payer = members[0]?.user_id || room.created_by;
  const expenses: Expense[] = (expenseNames[room.id] || []).map((description, index) => ({
    id: `${room.id}-expense-${index}`, room_id: room.id, category_id: categories[index].id,
    category_name: categories[index].category_name, description,
    total_amount: (room.stage === 'archived' ? [1200, 480, 360] : [240, 60, 40])[index],
    currency: 'USD', paid_by: [payer], payer_names: [members[0]?.user?.name || 'Alex'],
    created_by: payer, created_at: `${room.stage === 'archived' ? room.end_date : room.start_date}T10:00:00Z`,
  }));
  const splits: ExpenseSplit[] = expenses.flatMap(expense => members.map((member, index) => ({
    id: `${expense.id}-split-${index}`, expense_id: expense.id, user_id: member.user_id,
    user_name: member.user?.name, split_type: 'equal', share_value: 1,
    amount_owed: expense.total_amount / members.length,
  })));
  const share = expenses.reduce((sum, expense) => sum + expense.total_amount, 0) / (members.length || 1);
  let settlements: Settlement[] = [];
  if (room.stage === 'archived') {
    settlements = members.slice(1).map(member => ({
      id: `${room.id}-settlement-${member.user_id}`, room_id: room.id,
      from_user_id: member.user_id, from_user_name: member.user?.name,
      to_user_id: payer, to_user_name: members[0]?.user?.name,
      amount: share, currency: 'USD', method: 'Recorded transfer',
      settled_at: `${room.end_date}T18:00:00Z`,
    }));
  } else if (room.stage === 'active' && members.length >= 4) {
    // 1. User owes M1 (User pays M1 an amount greater than what M1 owes User)
    settlements.push({
      id: `${room.id}-settlement-user-owes`, room_id: room.id,
      from_user_id: payer, from_user_name: members[0]?.user?.name,
      to_user_id: members[1].user_id, to_user_name: members[1].user?.name,
      amount: share + 45, currency: 'USD', method: 'Recorded transfer',
      settled_at: `${room.start_date}T12:00:00Z`,
    });

    // 2. M2 owes User (M2 pays a partial amount, still owes)
    settlements.push({
      id: `${room.id}-settlement-user-is-owed`, room_id: room.id,
      from_user_id: members[2].user_id, from_user_name: members[2].user?.name,
      to_user_id: payer, to_user_name: members[0]?.user?.name,
      amount: share - 20, currency: 'USD', method: 'Recorded transfer',
      settled_at: `${room.start_date}T13:00:00Z`,
    });

    // 3. M3 is Already Settled (M3 pays exact amount owed)
    settlements.push({
      id: `${room.id}-settlement-settled`, room_id: room.id,
      from_user_id: members[3].user_id, from_user_name: members[3].user?.name,
      to_user_id: payer, to_user_name: members[0]?.user?.name,
      amount: share, currency: 'USD', method: 'Recorded transfer',
      settled_at: `${room.start_date}T14:00:00Z`,
    });
  }
  return { categories, expenses, splits, settlements };
}

export function budgetBalances(budget: RoomBudget, members: { id: string }[]) {
  return members.map(member => {
    const contribution = budget.expenses.reduce((sum, expense) => sum + (expense.paid_by.includes(member.id) ? expense.total_amount / expense.paid_by.length : 0), 0);
    const share = budget.splits.filter(split => split.user_id === member.id).reduce((sum, split) => sum + split.amount_owed, 0);
    const transfers = budget.settlements.reduce((sum, payment) => sum + (payment.from_user_id === member.id ? payment.amount : payment.to_user_id === member.id ? -payment.amount : 0), 0);
    return { id: member.id, contribution, share, balance: Math.round((contribution - share + transfers) * 100) / 100 };
  });
}
