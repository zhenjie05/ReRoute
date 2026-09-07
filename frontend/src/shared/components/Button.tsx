import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { useTheme } from '@/core/theme';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'season';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  style,
  textStyle,
  icon,
}) => {
  const { colors, typography, rounded, spacing } = useTheme();

  const getVariantStyles = (): { container: ViewStyle; text: TextStyle } => {
    switch (variant) {
      case 'season':
        return {
          container: {
            backgroundColor: colors.season.main,
          },
          text: {
            color: colors.season.text,
            fontWeight: '700',
          },
        };
      case 'secondary':
        return {
          container: {
            backgroundColor: colors.secondaryContainer,
          },
          text: {
            color: colors.onSecondaryContainer,
            fontWeight: '600',
          },
        };
      case 'outline':
        return {
          container: {
            backgroundColor: 'transparent',
            borderWidth: 1.5,
            borderColor: colors.outlineVariant,
          },
          text: {
            color: colors.onSurface,
            fontWeight: '600',
          },
        };
      case 'ghost':
        return {
          container: {
            backgroundColor: 'transparent',
          },
          text: {
            color: colors.primary,
            fontWeight: '600',
          },
        };
      case 'danger':
        return {
          container: {
            backgroundColor: colors.error,
          },
          text: {
            color: colors.onError,
            fontWeight: '700',
          },
        };
      case 'primary':
      default:
        return {
          container: {
            backgroundColor: colors.primary,
          },
          text: {
            color: colors.onPrimary,
            fontWeight: '700',
          },
        };
    }
  };

  const getSizeStyles = (): { container: ViewStyle; text: TextStyle } => {
    switch (size) {
      case 'sm':
        return {
          container: {
            paddingVertical: spacing.xs + 2,
            paddingHorizontal: spacing.md,
            borderRadius: rounded.md,
          },
          text: typography.labelSm,
        };
      case 'lg':
        return {
          container: {
            paddingVertical: spacing.lg,
            paddingHorizontal: spacing['2xl'],
            borderRadius: rounded.xl,
          },
          text: typography.labelLg,
        };
      case 'md':
      default:
        return {
          container: {
            paddingVertical: spacing.md,
            paddingHorizontal: spacing.xl,
            borderRadius: rounded.lg,
          },
          text: typography.labelMd,
        };
    }
  };

  const variantStyle = getVariantStyles();
  const sizeStyle = getSizeStyles();

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      disabled={disabled || loading}
      style={[
        styles.base,
        variantStyle.container,
        sizeStyle.container,
        disabled && styles.disabled,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variantStyle.text.color || colors.onPrimary}
        />
      ) : (
        <>
          {icon ? <>{icon}</> : null}
          <Text
            style={[
              variantStyle.text,
              sizeStyle.text,
              icon ? { marginLeft: spacing.xs } : null,
              textStyle,
            ]}
          >
            {title}
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabled: {
    opacity: 0.5,
  },
});
