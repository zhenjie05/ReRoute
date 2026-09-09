export interface UserPreferences {
  language?: string;
  travelCompanions?: string;
  travelStyle?: string;
  travelPace?: string;
  safetyAlerts?: boolean;
  decisionCards?: boolean;
  mascotNotifications?: boolean;
  sosAlerts?: boolean;
}

export interface User {
  id: string;
  email: string;
  auth_provider: 'email' | 'google';
  name: string;
  avatar?: string | null;
  home_country: string;
  created_at: string;
  preferences?: UserPreferences;
}
