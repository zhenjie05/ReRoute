export type DecisionTriggerType = 'disruption' | 'conflict' | 'safety_risk';
export type DecisionStatus = 'active' | 'resolved';

export interface DecisionOption {
  id: string;
  label: string;
  description?: string;
  votes_count?: number;
}

export interface DecisionCard {
  id: string;
  room_id: string;
  trigger_type: DecisionTriggerType;
  safety_alert_id?: string | null;
  title: string;
  description: string;
  options: DecisionOption[];
  status: DecisionStatus;
  anonymous: boolean;
  created_at: string;
  resolved_at?: string | null;
  winning_option_id?: string | null;
}

export interface Vote {
  id: string;
  decision_card_id: string;
  user_id: string;
  chosen_option: string;
  created_at: string;
}
