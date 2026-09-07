export type BadgeType =
  | 'first_escape'
  | 'globe_trotter'
  | 'language_scholar'
  | 'budget_guru'
  | 'route_master'
  | 'photo_keeper'
  | 'decision_hero';

export interface Badge {
  id: string;
  user_id: string;
  badge_type: BadgeType;
  title: string;
  description: string;
  icon_name: string;
  earned_at: string;
}
