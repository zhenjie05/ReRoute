import React from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { useTheme } from '@/core/theme';

interface MascotSpeechBubbleProps {
  userName?: string;
  isFirstTime?: boolean;
  opacity?: Animated.Value;
}

export const MascotSpeechBubble: React.FC<MascotSpeechBubbleProps> = ({
  userName,
  isFirstTime = false,
  opacity,
}) => {
  const { colors, typography, spacing, rounded, shadows } = useTheme();

  const title = isFirstTime
    ? `Welcome to ReRoute${userName ? `, ${userName}` : ''}! 🐾`
    : `Welcome back${userName ? `, ${userName}` : ''}! 🐾`;

  const message = isFirstTime
    ? "I'm Roti, your AI travel companion. I'll help you plan adventures, collaborate with friends, and stay safe wherever you go!"
    : "Ready for your next adventure? Let's check your trip rooms and explore new destinations!";

  const content = (
    <View
      style={[
        styles.card,
        {
          backgroundColor: '#ffffff',
          borderColor: colors.surfaceContainerHigh,
          borderRadius: rounded['2xl'] || 24,
          padding: spacing.lg,
          ...shadows.medium,
        },
      ]}
    >
      <View style={[styles.arrow, { borderBottomColor: '#ffffff' }]} />
      <View style={[styles.arrowBorder, { borderBottomColor: colors.surfaceContainerHigh }]} />

      <Text
        style={[
          typography.headlineSm,
          {
            color: colors.primary,
            fontWeight: '800',
            marginBottom: spacing.xs,
            textAlign: 'center',
          },
        ]}
      >
        {title}
      </Text>

      <Text
        style={[
          typography.bodyMd,
          {
            color: colors.onSurfaceVariant,
            textAlign: 'center',
            lineHeight: 22,
          },
        ]}
      >
        {message}
      </Text>
    </View>
  );

  if (opacity) {
    return (
      <Animated.View style={[styles.wrapper, { opacity }]}>
        {content}
      </Animated.View>
    );
  }

  return <View style={styles.wrapper}>{content}</View>;
};

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    maxWidth: 360,
    alignItems: 'center',
    marginVertical: 12,
  },
  card: {
    width: '100%',
    borderWidth: 1,
    position: 'relative',
  },
  arrow: {
    position: 'absolute',
    top: -10,
    alignSelf: 'center',
    width: 0,
    height: 0,
    borderLeftWidth: 10,
    borderRightWidth: 10,
    borderBottomWidth: 10,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    zIndex: 2,
  },
  arrowBorder: {
    position: 'absolute',
    top: -12,
    alignSelf: 'center',
    width: 0,
    height: 0,
    borderLeftWidth: 11,
    borderRightWidth: 11,
    borderBottomWidth: 12,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    zIndex: 1,
  },
});
