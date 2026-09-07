export type MessageSenderType = 'user' | 'system' | 'mascot';
export type MessageType = 'text' | 'decision_card' | 'safety_alert' | 'budget_alert' | 'system_event';

export interface Message {
  id: string;
  room_id: string;
  sender_id?: string | null;
  sender_type: MessageSenderType;
  sender_name?: string;
  sender_avatar?: string | null;
  text: string;
  type: MessageType;
  payload?: any;
  created_at: string;
}
