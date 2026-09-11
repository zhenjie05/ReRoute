import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { useTheme } from '@/core/theme';
import type { TripStage } from '@/models/trip-room';
import { tripStageThemes } from '@/features/trip-room/data/season-presentation';

export type BadgeVariant =
  | 'primary'
  | 'secondary'
  | 'season'
  | 'warning'
  | 'error'
  | 'success'
  | 'outline'
  | 'planning'
  | 'active'
  | 'archived';

interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  stage?: TripStage;
  style?: ViewStyle;
  textStyle?: TextStyle;
  icon?: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
  label,
  variant = 'season',
  stage,
  style,
  textStyle,
  icon,
}) => {
  const { colors, typography, rounded, spacing } = useTheme();

  const getColors = () => {
    const effectiveStage = stage || (variant === 'active' || variant === 'planning' || variant === 'archived' ? variant : undefined);
    if (effectiveStage && tripStageThemes[effectiveStage]) {
      return tripStageThemes[effectiveStage];
    }

    switch (variant) {
      case 'primary':
        return { bg: colors.primaryContainer, text: colors.onPrimaryContainer };
      case 'secondary':
        return { bg: colors.secondaryContainer, text: colors.onSecondaryContainer };
      case 'warning':
        return { bg: colors.warningContainer, text: colors.warning };
      case 'error':
        return { bg: colors.errorContainer, text: colors.onErrorContainer };
      case 'success':
        return { bg: colors.successContainer, text: colors.success };
      case 'outline':
        return { bg: 'transparent', text: colors.onSurfaceVariant, border: colors.outlineVariant };
      case 'season':
      default:
        return { bg: colors.season.soft, text: colors.season.text };
    }
  };

  const c = getColors();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: c.bg,
          borderRadius: rounded.full,
          paddingVertical: spacing.xs,
          paddingHorizontal: spacing.sm + 2,
          borderColor: (c as any).border || 'transparent',
          borderWidth: (c as any).border ? 1 : 0,
        },
        style,
      ]}
    >
      {icon ? <View style={{ marginRight: spacing.xs }}>{icon}</View> : null}
      <Text style={[typography.labelSm, { color: c.text, fontWeight: '700' }, textStyle]}>
        {label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
});
