import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, Animated } from 'react-native';
import { useTheme } from '@/core/theme';
import { Message } from '@/models/chat';

interface MascotMessageCardProps {
  message: Message;
}

/**
 * Visually distinct mascot message card per FR-2-7/FR-9-2.
 * Uses existing tertiary tokens (tertiaryContainer / onTertiaryContainer)
 * as the mascot's distinct tint — these are the pink/rose tones in the
 * ReRoute palette. Includes optimistic placeholder state (NFR-9-1) with
 * a pulsing shimmer effect while the mascot message is "generating."
 */
export const MascotMessageCard: React.FC<MascotMessageCardProps> = ({ message }) => {
  const { colors, typography, spacing, rounded, shadows } = useTheme();
  const isGenerating = message.payload?.generating === true;
  const [pulseAnim] = useState(() => new Animated.Value(0.4));

  useEffect(() => {
    if (isGenerating) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 0.4,
            duration: 800,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      pulseAnim.stopAnimation();
      pulseAnim.setValue(1);
    }
  }, [isGenerating, pulseAnim]);

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.onTertiary, // #ffeff1 — soft pink
          borderLeftColor: colors.tertiaryContainer, // #feb1c6
          borderRadius: rounded.xl,
          padding: spacing.md,
          marginHorizontal: spacing.lg,
          marginVertical: spacing.xs,
          ...shadows.soft,
        },
      ]}
    >
      {/* Header row: mascot icon + name + badge */}
      <View style={styles.headerRow}>
        <View style={styles.nameRow}>
          <View
            style={[
              styles.mascotIcon,
              {
                backgroundColor: colors.tertiaryContainer,
                borderRadius: rounded.full,
              },
            ]}
          >
            <Image source={require('../../../../../assets/Roti.png')} accessibilityLabel="Roti, your AI travel assistant" resizeMode="contain" style={{ width: 28, height: 28 }} />
          </View>
          <Text
            style={[
              typography.labelSm,
              {
                color: colors.onTertiaryContainer, // #652e40
                fontWeight: '800',
                marginLeft: spacing.xs,
              },
            ]}
          >
            {message.sender_name || 'ReRoute Corgi'}
          </Text>
          <View
            style={[
              styles.aiBadge,
              {
                backgroundColor: colors.tertiaryContainer,
                borderRadius: rounded.full,
                marginLeft: spacing.xs,
                paddingHorizontal: spacing.xs + 2,
                paddingVertical: 2,
              },
            ]}
          >
            <Text
              style={[
                typography.utilityTiny,
                { color: colors.onTertiaryContainer, fontWeight: '700' },
              ]}
            >
              AI Assistant
            </Text>
          </View>
        </View>
      </View>

      {/* Message body or generating placeholder */}
      {isGenerating ? (
        <Animated.View style={[styles.shimmerContainer, { opacity: pulseAnim }]}>
          <View
            style={[
              styles.shimmerLine,
              {
                backgroundColor: colors.tertiaryContainer,
                borderRadius: rounded.sm,
                width: '85%',
                marginTop: spacing.sm,
              },
            ]}
          />
          <View
            style={[
              styles.shimmerLine,
              {
                backgroundColor: colors.tertiaryContainer,
                borderRadius: rounded.sm,
                width: '60%',
                marginTop: spacing.xs,
              },
            ]}
          />
          <Text
            style={[
              typography.utilityTiny,
              { color: colors.onSurfaceVariant, marginTop: spacing.xs, fontStyle: 'italic' },
            ]}
          >
            Generating response...
          </Text>
        </Animated.View>
      ) : (
        <Text
          style={[
            typography.bodyMd,
            { color: colors.onSurface, lineHeight: 20, marginTop: spacing.xs },
          ]}
        >
          {message.text}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderLeftWidth: 4,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  mascotIcon: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  aiBadge: {},
  shimmerContainer: {},
  shimmerLine: {
    height: 10,
  },
});
