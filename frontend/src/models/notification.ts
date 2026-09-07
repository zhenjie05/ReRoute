export type NotificationType =
  | 'safety_risk'
  | 'decision_card'
  | 'mascot_advisory'
  | 'sos_alert'
  | 'budget_alert'
  | 'community_star';

export type NotificationUrgency = 'low' | 'medium' | 'high' | 'critical';

export interface AppNotification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  urgency: NotificationUrgency;
  routeTarget?: string;
  metadata?: {
    risk_level?: 'low' | 'moderate' | 'high' | 'severe';
    weather_condition?: string;
    location_name?: string;
    vote_id?: string;
    decision_options?: string[];
    decision_status?: 'open' | 'closed' | 'decided';
    mascot_mood?: 'happy' | 'alert' | 'curious' | 'sleepy';
    tip_category?: 'culture' | 'transit' | 'food' | 'weather';
    sos_sender_name?: string;
    sos_coordinates?: { lat: number; lng: number };
    sos_reason?: string;
    expense_amount?: string;
    payer_name?: string;
    landmark_name?: string;
    [key: string]: any;
  };
}
