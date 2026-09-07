export type SplitType = 'equal' | 'percentage' | 'shares' | 'exact';

export interface BudgetCategory {
  id: string;
  room_id: string;
  category_name: string;
  planned_amount: number;
  spent_amount?: number;
}

export interface ExpenseSplit {
  id: string;
  expense_id: string;
  user_id: string;
  split_type: SplitType;
  share_value: number;
  amount_owed: number;
  user_name?: string;
}

export interface Expense {
  id: string;
  room_id: string;
  category_id: string;
  category_name?: string;
  description: string;
  total_amount: number;
  currency: string;
  paid_by: string[]; // user_ids
  payer_names?: string[];
  receipt_url?: string | null;
  created_by: string;
  created_at: string;
  splits?: ExpenseSplit[];
}

export interface ReceiptScan {
  id: string;
  expense_id?: string | null;
  image_url: string;
  ocr_status: 'pending' | 'processing' | 'completed' | 'failed';
  extracted_data?: {
    merchant_name?: string;
    date?: string;
    total_amount?: number;
    currency?: string;
    line_items?: Array<{ name: string; price: number }>;
  };
}

export interface Settlement {
  id: string;
  room_id: string;
  from_user_id: string;
  from_user_name?: string;
  to_user_id: string;
  to_user_name?: string;
  amount: number;
  currency: string;
  method: string;
  settled_at: string;
}
