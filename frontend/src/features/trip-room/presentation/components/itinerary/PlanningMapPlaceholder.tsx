import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/core/theme';

interface CityPin {
  name: string;
  top: string;
  left: string;
  highlighted?: boolean;
}

interface PlanningMapPlaceholderProps {
  country?: string;
  cities?: CityPin[];
}

const defaultCities: CityPin[] = [
  { name: 'Sapporo', top: '18%', left: '72%' },
  { name: 'Tokyo', top: '52%', left: '68%', highlighted: false },
  { name: 'KYOTO', top: '58%', left: '48%', highlighted: true },
  { name: 'Osaka', top: '64%', left: '44%' },
];

/**
 * Lightweight stylized country-level overview map placeholder.
 * NOT a real Google Maps instance — this is a visual placeholder
 * per Assumption 1 (Planning-stage illustrative country map).
 *
 * Shows country label, city pins with one highlighted.
 */
export const PlanningMapPlaceholder: React.FC<PlanningMapPlaceholderProps> = ({
  country = 'Japan',
  cities = defaultCities,
}) => {
  const { colors, typography, spacing, rounded, shadows } = useTheme();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: '#ffffff',
          borderRadius: rounded.xl,
          marginHorizontal: spacing.lg,
          marginBottom: spacing.lg,
          ...shadows.soft,
          borderWidth: 1,
          borderColor: colors.cardBorder,
        },
      ]}
    >
      {/* Country label */}
      <View style={[styles.countryLabel, { top: spacing.md, left: spacing.md }]}>
        <View
          style={{
            width: 8,
            height: 8,
            borderRadius: 4,
            backgroundColor: colors.season.main,
            marginRight: 6,
          }}
        />
        <Text style={[typography.labelSm, { color: colors.onSurface, fontWeight: '700' }]}>
          {country}
        </Text>
      </View>

      {/* Map body — stylized background */}
      <View style={styles.mapBody}>
        {/* Abstract island shape */}
        <View
          style={[
            styles.islandShape,
            {
              backgroundColor: colors.surfaceContainerLow,
              borderColor: colors.outlineVariant,
            },
          ]}
        />

        {/* Dotted route line */}
        <View style={[styles.routeLine, { borderColor: colors.outlineVariant }]} />

        {/* City pins */}
        {cities.map((city) => (
          <View
            key={city.name}
            style={[
              styles.cityPin,
              { top: city.top as any, left: city.left as any },
            ]}
          >
            {city.highlighted ? (
              <View style={styles.highlightedPinContainer}>
                <View
                  style={[
                    styles.highlightedPin,
                    { backgroundColor: colors.error },
                  ]}
                >
                  <View style={styles.pinInner} />
                </View>
                <View
                  style={[
                    styles.cityLabel,
                    {
                      backgroundColor: colors.error,
                      borderRadius: rounded.sm,
                      paddingHorizontal: spacing.sm,
                      paddingVertical: 2,
                      marginTop: 2,
                    },
                  ]}
                >
                  <Text
                    style={[
                      typography.utilityTiny,
                      { color: '#ffffff', fontWeight: '800', letterSpacing: 1 },
                    ]}
                  >
                    {city.name}
                  </Text>
                </View>
              </View>
            ) : (
              <View style={styles.normalPinContainer}>
                <View
                  style={[
                    styles.normalPin,
                    { borderColor: colors.outline },
                  ]}
                >
                  <View
                    style={{
                      width: 4,
                      height: 4,
                      borderRadius: 2,
                      backgroundColor: colors.outline,
                    }}
                  />
                </View>
                <Text
                  style={[
                    typography.utilityTiny,
                    {
                      color: colors.onSurfaceVariant,
                      marginTop: 2,
                      textAlign: 'center',
                    },
                  ]}
                >
                  {city.name}
                </Text>
              </View>
            )}
          </View>
        ))}
      </View>

      {/* Back arrow (decorative) */}
      <View style={[styles.backArrow, { top: spacing.md, left: spacing.md }]}>
        <Text style={{ fontSize: 16, color: colors.onSurfaceVariant }}>←</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 200,
    overflow: 'hidden',
    position: 'relative',
  },
  countryLabel: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 2,
  },
  mapBody: {
    flex: 1,
    position: 'relative',
  },
  islandShape: {
    position: 'absolute',
    top: '20%',
    left: '30%',
    width: '50%',
    height: '65%',
    borderRadius: 60,
    borderWidth: 1,
    transform: [{ rotate: '-30deg' }, { scaleX: 0.4 }],
    opacity: 0.5,
  },
  routeLine: {
    position: 'absolute',
    top: '30%',
    left: '40%',
    width: '35%',
    height: 0,
    borderWidth: 1,
    borderStyle: 'dashed',
    transform: [{ rotate: '-45deg' }],
    opacity: 0.4,
  },
  cityPin: {
    position: 'absolute',
    alignItems: 'center',
    zIndex: 3,
  },
  highlightedPinContainer: {
    alignItems: 'center',
  },
  highlightedPin: {
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pinInner: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#ffffff',
  },
  cityLabel: {
    alignItems: 'center',
  },
  normalPinContainer: {
    alignItems: 'center',
  },
  normalPin: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
  },
  backArrow: {
    position: 'absolute',
    zIndex: 5,
  },
});
