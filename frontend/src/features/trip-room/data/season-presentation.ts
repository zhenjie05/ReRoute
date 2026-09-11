import type { TripRoom, TripSeason, TripSeasonTheme, TripStage } from '@/models/trip-room';

// Opaque pastel blends keep the whole card readable on every surface.
export const seasonalThemes: Record<TripSeason, TripSeasonTheme> = {
  spring: { background: '#FFF3F6', border: '#F1E2E7', badge: '#FFE0E6', text: '#85495C' },
  summer: { background: '#F1F9FD', border: '#DFECF2', badge: '#E0F0F8', text: '#375F73' },
  autumn: { background: '#FFF5EC', border: '#F2E5D9', badge: '#FDE5D1', text: '#894927' },
  winter: { background: '#F4F8FC', border: '#E1E8EF', badge: '#E6F1FA', text: '#4D6476' },
};

export interface TripStageTheme {
  bg: string;
  text: string;
  border: string;
  pillBg: string;
  label: string;
}

// Standardized Plan Phase / Stage Colors:
// - Active: Green
// - Planning: Brown
// - Archived: Grey
export const tripStageThemes: Record<TripStage, TripStageTheme> = {
  active: {
    bg: '#dcfce7',
    text: '#15803d',
    border: '#bbf7d0',
    pillBg: '#15803d',
    label: 'Active',
  },
  planning: {
    bg: '#fff0e6',
    text: '#8b4b00',
    border: '#fed7aa',
    pillBg: '#8b4b00',
    label: 'Planning',
  },
  archived: {
    bg: '#f3f4f6',
    text: '#4b5563',
    border: '#d1d5db',
    pillBg: '#6b7280',
    label: 'Archived',
  },
};

export function getTripStageTheme(stage?: TripStage): TripStageTheme {
  if (!stage || !tripStageThemes[stage]) {
    return tripStageThemes.planning;
  }
  return tripStageThemes[stage];
}

export function getRoomSeasonTheme(room?: TripRoom): TripSeasonTheme {
  return room?.season_theme || seasonalThemes[room?.season || 'autumn'];
}

export const rotiPresentation = {
  image: require('../../../../assets/Roti.png'),
  imageLabel: 'Roti, your AI travel assistant',
  name: 'Roti', badge: 'AI Assistant', generating: 'Thinking about your trip…',
};

