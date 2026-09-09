// fallow-ignore-file unused-file
export interface MascotTip {
  id: string;
  category: 'safety' | 'budget' | 'weather' | 'itinerary';
  title: string;
  message: string;
  action_label?: string;
}

export const mockMascotTips: MascotTip[] = [
  {
    id: 'tip-1',
    category: 'weather',
    title: 'Rain Advisory',
    message: 'Looks like rain is forecasted for Tokyo on Wednesday evening. Pack an umbrella or swap indoor museums!',
    action_label: 'View Weather',
  },
  {
    id: 'tip-2',
    category: 'budget',
    title: 'Budget On Track',
    message: 'You have spent 68% of your planned dining budget with 3 days remaining. Great pacing!',
    action_label: 'View Budget',
  },
];
