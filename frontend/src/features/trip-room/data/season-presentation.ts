import type { TripRoom, TripSeason, TripSeasonTheme, TripStage } from '@/models/trip-room';
import { seasonalPalettes } from '@/core/theme/colors';

// Opaque pastel blends keep the whole card readable on every surface.
export const seasonalThemes: Record<TripSeason, TripSeasonTheme> = {
  spring: { background: seasonalPalettes.spring.soft, border: seasonalPalettes.spring.main, badge: seasonalPalettes.spring[100], text: seasonalPalettes.spring.text },
  summer: { background: seasonalPalettes.summer.soft, border: seasonalPalettes.summer.main, badge: seasonalPalettes.summer[100], text: seasonalPalettes.summer.text },
  autumn: { background: seasonalPalettes.autumn.soft, border: seasonalPalettes.autumn.main, badge: seasonalPalettes.autumn[100], text: seasonalPalettes.autumn.text },
  winter: { background: seasonalPalettes.winter.soft, border: seasonalPalettes.winter.main, badge: seasonalPalettes.winter[100], text: seasonalPalettes.winter.text },
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

