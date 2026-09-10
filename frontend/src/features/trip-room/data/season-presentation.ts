import type { TripRoom, TripSeason, TripSeasonTheme } from '@/models/trip-room';

// Opaque pastel blends keep the whole card readable on every surface.
export const seasonalThemes: Record<TripSeason, TripSeasonTheme> = {
  spring: { background: '#FFF3F6', border: '#F1E2E7', badge: '#FFE0E6', text: '#85495C' },
  summer: { background: '#F1F9FD', border: '#DFECF2', badge: '#E0F0F8', text: '#375F73' },
  autumn: { background: '#FFF5EC', border: '#F2E5D9', badge: '#FDE5D1', text: '#894927' },
  winter: { background: '#F4F8FC', border: '#E1E8EF', badge: '#E6F1FA', text: '#4D6476' },
};

export function getRoomSeasonTheme(room?: TripRoom): TripSeasonTheme {
  return room?.season_theme || seasonalThemes[room?.season || 'autumn'];
}

export const rotiPresentation = {
  image: require('../../../../assets/Roti.png'),
  imageLabel: 'Roti, your AI travel assistant',
  name: 'Roti', badge: 'AI Assistant', generating: 'Thinking about your trip…',
};
