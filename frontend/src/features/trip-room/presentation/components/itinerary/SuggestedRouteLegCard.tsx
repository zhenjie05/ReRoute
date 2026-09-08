import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '@/core/theme';

interface TransportOption {
  id: string;
  mode: string;
  icon: string;
  duration: string;
  price: string;
  ai_picked: boolean;
}

interface SuggestedRouteLegCardProps {
  departureTime: string;
  from: string;
  to: string;
  options: TransportOption[];
  disabled?: boolean;
  onSelectOption?: (optionId: string) => void;
}

/**
 * Per-leg card showing transport options for the Active/Live stage.
 * Displays time + from→to header, then 2-3 transport option chips
 * with one AI-picked option visually tagged.
 *
 * Placed under trip-room/presentation/components so a future
 * reuse in the Maps tab doesn't fork it.
 */
export const SuggestedRouteLegCard: React.FC<SuggestedRouteLegCardProps> = ({
  departureTime,
  from,
  to,
  options,
  disabled = false,
  onSelectOption,
}) => {
  const { colors, typography, spacing, rounded, shadows } = useTheme();
  const [selectedId, setSelectedId] = useState<string>(
    () => options.find((o) => o.ai_picked)?.id || options[0]?.id || ''
  );

  const handleSelect = (optionId: string) => {
    if (disabled) return;
    setSelectedId(optionId);
    onSelectOption?.(optionId);
  };

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: '#ffffff',
          borderRadius: rounded.xl,
          padding: spacing.lg,
          marginBottom: spacing.md,
          ...shadows.soft,
          borderWidth: 1,
          borderColor: colors.cardBorder,
        },
      ]}
    >
      {/* Time + route header */}
      <View style={styles.headerRow}>
        <View style={styles.timeContainer}>
          <Text style={{ fontSize: 14 }}>🕐</Text>
          <Text
            style={[
              typography.headlineSm,
              { color: colors.onSurface, marginLeft: spacing.sm },
            ]}
          >
            {departureTime}
          </Text>
        </View>

        <View style={[styles.routeRow, { marginLeft: spacing.lg }]}>
          <Text style={{ fontSize: 6, color: colors.onSurfaceVariant }}>●</Text>
          <Text
            style={[
              typography.bodySm,
              { color: colors.onSurfaceVariant, marginLeft: 6, flex: 1 },
            ]}
            numberOfLines={1}
          >
            {from} → {to}
          </Text>
        </View>
      </View>

      {/* Transport option chips */}
      <View style={[styles.optionChips, { marginTop: spacing.md, gap: spacing.sm }]}>
        {options.map((opt) => {
          const isSelected = selectedId === opt.id;
          const isAIPick = opt.ai_picked;

          return (
            <TouchableOpacity
              key={opt.id}
              activeOpacity={disabled ? 1 : 0.7}
              onPress={() => handleSelect(opt.id)}
              style={[
                styles.chip,
                {
                  backgroundColor: isSelected
                    ? colors.season.main
                    : colors.surfaceContainerLow,
                  borderRadius: rounded.lg,
                  paddingHorizontal: spacing.md,
                  paddingVertical: spacing.sm,
                  borderWidth: isSelected ? 0 : 1,
                  borderColor: colors.cardBorder,
                  position: 'relative',
                },
              ]}
            >
              {/* AI Pick tag */}
              {isAIPick && (
                <View
                  style={[
                    styles.aiTag,
                    {
                      backgroundColor: colors.season.accent,
                      borderRadius: rounded.sm,
                      paddingHorizontal: 4,
                      paddingVertical: 1,
                      position: 'absolute',
                      top: -8,
                      right: -4,
                    },
                  ]}
                >
                  <Text
                    style={[
                      typography.utilityTiny,
                      { color: '#ffffff', fontWeight: '800', fontSize: 7 },
                    ]}
                  >
                    AI PICK
                  </Text>
                </View>
              )}

              <Text style={{ fontSize: 14 }}>{opt.icon}</Text>
              <Text
                style={[
                  typography.labelSm,
                  {
                    color: isSelected ? '#ffffff' : colors.onSurface,
                    fontWeight: '700',
                    marginTop: 2,
                  },
                ]}
              >
                {opt.mode} • {opt.duration}
              </Text>
              <Text
                style={[
                  typography.utilityTiny,
                  {
                    color: isSelected ? 'rgba(255,255,255,0.8)' : colors.onSurfaceVariant,
                    fontWeight: '600',
                  },
                ]}
              >
                {opt.price}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {},
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  routeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  optionChips: {
    flexDirection: 'row',
  },
  chip: {
    alignItems: 'center',
    flex: 1,
  },
  aiTag: {},
});
