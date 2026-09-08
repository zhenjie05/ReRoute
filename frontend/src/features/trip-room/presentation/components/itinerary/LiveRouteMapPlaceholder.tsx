import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '@/core/theme';
import { Badge } from '@/shared/components';

interface LiveRouteMapPlaceholderProps {
  dayNumber?: number;
  stopCount?: number;
  onReroute?: () => void;
  disabled?: boolean;
}

/**
 * Placeholder for the Active-stage live route map.
 * NOT a real Google Maps instance — styled placeholder per user instruction.
 *
 * Shows a map icon area, day/stop label, member live dots,
 * and a floating "Reroute" pill.
 */
export const LiveRouteMapPlaceholder: React.FC<LiveRouteMapPlaceholderProps> = ({
  dayNumber = 4,
  stopCount = 9,
  onReroute,
  disabled = false,
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
      {/* Map header labels */}
      <View style={[styles.headerLabels, { padding: spacing.sm }]}>
        <Text style={[typography.utilityTiny, { color: colors.onSurfaceVariant }]}>
          Trip Room
        </Text>
        <Text
          style={[
            typography.utilityTiny,
            { color: colors.season.accent, fontWeight: '700' },
          ]}
        >
          Active • Map Tab
        </Text>
      </View>

      {/* Map area placeholder */}
      <View
        style={[
          styles.mapArea,
          { backgroundColor: colors.surfaceContainerLow },
        ]}
      >
        {/* Route line illustration */}
        <View style={styles.routeContainer}>
          <View
            style={[
              styles.routeLinePath,
              { borderColor: colors.season.main },
            ]}
          />

          {/* Decorative map pins */}
          <View style={[styles.mapPin, { top: '20%', left: '25%' }]}>
            <View
              style={{
                width: 8,
                height: 8,
                borderRadius: 4,
                backgroundColor: colors.season.main,
              }}
            />
          </View>
          <View style={[styles.mapPin, { top: '40%', left: '55%' }]}>
            <View
              style={{
                width: 8,
                height: 8,
                borderRadius: 4,
                backgroundColor: colors.season.main,
              }}
            />
          </View>
          <View style={[styles.mapPin, { top: '65%', left: '70%' }]}>
            <View
              style={{
                width: 8,
                height: 8,
                borderRadius: 4,
                backgroundColor: colors.season.main,
              }}
            />
          </View>

          {/* "Live" marker */}
          <View style={[styles.liveMarker, { top: '45%', left: '45%' }]}>
            <View
              style={{
                width: 10,
                height: 10,
                borderRadius: 5,
                backgroundColor: colors.error,
              }}
            />
            <Text
              style={[
                typography.utilityTiny,
                { color: colors.error, fontWeight: '700', marginLeft: 3 },
              ]}
            >
              live
            </Text>
          </View>

          {/* Map icon placeholder */}
          <View style={styles.mapIconCenter}>
            <Text style={{ fontSize: 32, opacity: 0.3 }}>🗺️</Text>
            <Text
              style={[
                typography.utilityTiny,
                { color: colors.onSurfaceVariant, opacity: 0.6, marginTop: 2 },
              ]}
            >
              Map placeholder
            </Text>
          </View>
        </View>

        {/* Layers & location buttons (decorative) */}
        <View style={[styles.mapControls, { right: spacing.sm, top: spacing.sm }]}>
          <View
            style={[
              styles.controlBtn,
              {
                backgroundColor: '#ffffff',
                borderRadius: rounded.md,
                ...shadows.soft,
              },
            ]}
          >
            <Text style={{ fontSize: 14 }}>◇</Text>
          </View>
          <View
            style={[
              styles.controlBtn,
              {
                backgroundColor: '#ffffff',
                borderRadius: rounded.md,
                ...shadows.soft,
                marginTop: 6,
              },
            ]}
          >
            <Text style={{ fontSize: 14 }}>◎</Text>
          </View>
        </View>

        {/* Day number badge */}
        <View
          style={[
            styles.dayBadge,
            {
              backgroundColor: colors.season.main,
              borderRadius: rounded.full,
              bottom: spacing.sm,
              right: spacing.sm,
            },
          ]}
        >
          <Text
            style={[
              typography.labelSm,
              { color: '#ffffff', fontWeight: '800' },
            ]}
          >
            {dayNumber}
          </Text>
        </View>
      </View>

      {/* Footer: Day label + stop count */}
      <View style={[styles.footer, { padding: spacing.sm }]}>
        <Text style={[typography.labelSm, { color: colors.onSurface, fontWeight: '700' }]}>
          Day {dayNumber}
        </Text>
        <Text style={[typography.utilityTiny, { color: colors.onSurfaceVariant }]}>
          • {stopCount} Stops
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
  headerLabels: {
    alignItems: 'center',
  },
  mapArea: {
    height: 200,
    position: 'relative',
    overflow: 'hidden',
  },
  routeContainer: {
    flex: 1,
    position: 'relative',
  },
  routeLinePath: {
    position: 'absolute',
    top: '25%',
    left: '20%',
    width: '60%',
    height: '50%',
    borderWidth: 2,
    borderRadius: 30,
    borderStyle: 'solid',
    opacity: 0.4,
  },
  mapPin: {
    position: 'absolute',
    zIndex: 2,
  },
  liveMarker: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 3,
  },
  mapIconCenter: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -30 }, { translateY: -25 }],
    alignItems: 'center',
  },
  mapControls: {
    position: 'absolute',
    zIndex: 4,
  },
  controlBtn: {
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayBadge: {
    position: 'absolute',
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 4,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
});
