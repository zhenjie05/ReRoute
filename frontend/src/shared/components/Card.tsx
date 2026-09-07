import React from 'react';
import { View, StyleSheet, ViewStyle, TouchableOpacity } from 'react-native';
import { useTheme } from '@/core/theme';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  onPress?: () => void;
  variant?: 'default' | 'elevated' | 'season' | 'outlined';
}

export const Card: React.FC<CardProps> = ({
  children,
  style,
  onPress,
  variant = 'default',
}) => {
  const { colors, rounded, spacing, shadows } = useTheme();

  const getVariantStyle = (): ViewStyle => {
    switch (variant) {
      case 'elevated':
        return {
          backgroundColor: colors.card,
          ...shadows.medium,
        };
      case 'season':
        return {
          backgroundColor: colors.season.soft,
          borderColor: colors.season.main,
          borderWidth: 1,
        };
      case 'outlined':
        return {
          backgroundColor: colors.card,
          borderColor: colors.cardBorder,
          borderWidth: 1,
        };
      case 'default':
      default:
        return {
          backgroundColor: colors.card,
          ...shadows.soft,
        };
    }
  };

  const cardStyle: ViewStyle = {
    borderRadius: rounded.card,
    padding: spacing.lg,
    ...getVariantStyle(),
    ...style,
  };

  if (onPress) {
    return (
      <TouchableOpacity activeOpacity={0.88} onPress={onPress} style={cardStyle}>
        {children}
      </TouchableOpacity>
    );
  }

  return <View style={cardStyle}>{children}</View>;
};
