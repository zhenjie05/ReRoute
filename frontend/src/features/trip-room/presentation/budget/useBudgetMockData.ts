import { useState } from 'react';
import { User } from '@/models/user';
import { BudgetCategory, Expense, ExpenseSplit, Settlement } from '@/models/budget';

// Mock Users
const mockTravelers: User[] = [
  { id: 'u1', name: 'Alex Chen', email: 'alex@example.com', auth_provider: 'email', home_country: 'US', created_at: '2024-01-01', avatar: null },
  { id: 'u2', name: 'Sarah Jenkins', email: 'sarah@example.com', auth_provider: 'email', home_country: 'US', created_at: '2024-01-02', avatar: null },
  { id: 'u3', name: 'Kenji Sato', email: 'kenji@example.com', auth_provider: 'email', home_country: 'JP', created_at: '2024-01-03', avatar: null },
  { id: 'u4', name: 'Elena Rostova', email: 'elena@example.com', auth_provider: 'email', home_country: 'RU', created_at: '2024-01-04', avatar: null },
];

export const useBudgetMockData = () => {
  const [categories] = useState<BudgetCategory[]>([
    { id: 'c1', room_id: 'r1', category_name: 'Accommodation', planned_amount: 1200 },
    { id: 'c2', room_id: 'r1', category_name: 'Food & Drink', planned_amount: 800 },
    { id: 'c3', room_id: 'r1', category_name: 'Transport', planned_amount: 500 },
  ]);

  const [expenses, setExpenses] = useState<Expense[]>([
    { id: 'e1', room_id: 'r1', category_id: 'c2', description: 'Sushi Dinner', total_amount: 120, currency: 'USD', paid_by: ['u2'], created_by: 'u2', created_at: '2024-10-25T19:00:00Z' },
    { id: 'e2', room_id: 'r1', category_id: 'c3', description: 'JR Pass', total_amount: 350, currency: 'USD', paid_by: ['u1'], created_by: 'u1', created_at: '2024-10-26T10:00:00Z' },
  ]);

  const [splits, setSplits] = useState<ExpenseSplit[]>([
    { id: 's1', expense_id: 'e1', user_id: 'u1', split_type: 'equal', share_value: 1, amount_owed: 30 },
    { id: 's2', expense_id: 'e1', user_id: 'u2', split_type: 'equal', share_value: 1, amount_owed: 30 },
    { id: 's3', expense_id: 'e1', user_id: 'u3', split_type: 'equal', share_value: 1, amount_owed: 30 },
    { id: 's4', expense_id: 'e1', user_id: 'u4', split_type: 'equal', share_value: 1, amount_owed: 30 },
    { id: 's5', expense_id: 'e2', user_id: 'u1', split_type: 'percentage', share_value: 25, amount_owed: 87.5 },
    { id: 's6', expense_id: 'e2', user_id: 'u2', split_type: 'percentage', share_value: 25, amount_owed: 87.5 },
    { id: 's7', expense_id: 'e2', user_id: 'u3', split_type: 'percentage', share_value: 25, amount_owed: 87.5 },
    { id: 's8', expense_id: 'e2', user_id: 'u4', split_type: 'percentage', share_value: 25, amount_owed: 87.5 },
  ]);

  const [settlements, setSettlements] = useState<Settlement[]>([]);

  const addExpense = (expense: Expense, expenseSplits: ExpenseSplit[]) => {
    setExpenses([...expenses, expense]);
    setSplits([...splits, ...expenseSplits]);
  };

  const addSettlement = (settlement: Settlement) => {
    setSettlements([...settlements, settlement]);
  };

  return {
    categories,
    expenses,
    splits,
    settlements,
    travelers: mockTravelers,
    addExpense,
    addSettlement,
  };
};
