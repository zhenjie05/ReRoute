// fallow-ignore-file unused-file
import { useTheme, Season } from '@/core/theme';
import { useEffect } from 'react';

export function useSeasonalTheme(destinationSeason?: Season) {
  const { season, setSeason, colors } = useTheme();

  useEffect(() => {
    if (destinationSeason && destinationSeason !== season) {
      setSeason(destinationSeason);
    }
  }, [destinationSeason, season, setSeason]);

  return {
    season,
    setSeason,
    colors,
  };
}
