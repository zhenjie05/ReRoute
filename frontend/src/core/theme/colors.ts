export type Season = 'spring' | 'summer' | 'autumn' | 'winter';

const seasonalPalettes = {
  spring: {
    50: '#FFECEE',
    100: '#FFE0E6',
    200: '#FFD4DE',
    300: '#FFC9D6',
    400: '#FEBDCE',
    500: '#FEB1C6',
    soft: '#FFECEE',
    main: '#FFC9D6',
    accent: '#FEB1C6',
    text: '#85495C',
  },
  summer: {
    50: '#C3CA92',
    100: '#A4B17B',
    200: '#859864',
    300: '#697E50',
    400: '#354C2B',
    500: '#20331B',
    soft: '#C3CA92',
    main: '#697E50',
    accent: '#354C2B',
    text: '#20331B',
  },
  autumn: {
    50: '#FBF9F7',
    100: '#FDC591',
    200: '#FFA951',
    300: '#FB8C00',
    400: '#F57C00',
    500: '#BF360C',
    soft: '#FBF9F7',
    main: '#FB8C00',
    accent: '#F57C00',
    text: '#BF360C',
  },
  winter: {
    50: '#F7FBFE',
    100: '#F0F7FD',
    200: '#E6F1FA',
    300: '#C9DEEF',
    400: '#AFCBE3',
    500: '#AFCBE3',
    soft: '#F7FBFE',
    main: '#C9DEEF',
    accent: '#AFCBE3',
    text: '#2A4365',
  },
};

const baseColors = {
  surface: '#f3f7fa',
  surfaceDim: '#ced6da',
  surfaceBright: '#f3f7fa',
  surfaceContainerLowest: '#ffffff',
  surfaceContainerLow: '#edf1f5',
  surfaceContainer: '#e3e9ed',
  surfaceContainerHigh: '#dde3e7',
  surfaceContainerHighest: '#d7dee2',
  onSurface: '#2a2f32',
  onSurfaceVariant: '#575c5f',
  inverseSurface: '#0a0f11',
  inverseOnSurface: '#999ea0',
  outline: '#73777a',
  outlineVariant: '#a9aeb1',
  surfaceTint: '#8b4b00',
  
  primary: '#8b4b00',
  primaryDim: '#7a4100',
  onPrimary: '#fff0e6',
  primaryContainer: '#ff8f06',
  onPrimaryContainer: '#462300',
  
  secondary: '#4a623f',
  secondaryDim: '#3e5634',
  onSecondary: '#dffbcd',
  secondaryContainer: '#cfebbe',
  onSecondaryContainer: '#405836',
  
  tertiary: '#85495c',
  tertiaryDim: '#773e50',
  onTertiary: '#ffeff1',
  tertiaryContainer: '#feb1c6',
  onTertiaryContainer: '#652e40',
  
  error: '#b02500',
  errorDim: '#b92902',
  onError: '#ffefec',
  errorContainer: '#f95630',
  onErrorContainer: '#520c00',

  success: '#1b873f',
  successContainer: '#d4edda',
  onSuccess: '#ffffff',

  warning: '#d97706',
  warningContainer: '#fef3c7',
  onWarning: '#ffffff',

  background: '#f3f7fa',
  onBackground: '#2a2f32',
  card: '#ffffff',
  cardBorder: '#dde3e7',
  cardMuted: '#edf1f5',
};

export function getSeasonTheme(season: Season = 'autumn') {
  return {
    ...baseColors,
    season: seasonalPalettes[season],
  };
}
