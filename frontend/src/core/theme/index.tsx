import React, { createContext, useContext, useState } from 'react';
import { Season, getSeasonTheme } from './colors';
import { typography } from './typography';
import { spacing, rounded, shadows } from './spacing';

export * from './colors';
export * from './typography';
export * from './spacing';

export interface Theme {
  colors: ReturnType<typeof getSeasonTheme>;
  typography: typeof typography;
  spacing: typeof spacing;
  rounded: typeof rounded;
  shadows: typeof shadows;
  season: Season;
  setSeason: (season: Season) => void;
}

const ThemeContext = createContext<Theme | null>(null);

export const ThemeProvider: React.FC<{ children: React.ReactNode; initialSeason?: Season }> = ({
  children,
  initialSeason = 'autumn',
}) => {
  const [season, setSeason] = useState<Season>(initialSeason);

  const theme: Theme = {
    colors: getSeasonTheme(season),
    typography,
    spacing,
    rounded,
    shadows,
    season,
    setSeason,
  };

  return <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>;
};

export const useTheme = (): Theme => {
  const context = useContext(ThemeContext);
  if (!context) {
    // Fallback theme if outside provider
    return {
      colors: getSeasonTheme('autumn'),
      typography,
      spacing,
      rounded,
      shadows,
      season: 'autumn',
      setSeason: () => {},
    };
  }
  return context;
};
