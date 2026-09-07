import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '@/core/theme';
import { Button } from './Button';

interface EmptyStateProps {
  title: string;
  description?: string;
  actionTitle?: string;
  onAction?: () => void;
  style?: ViewStyle;
  icon?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  actionTitle,
  onAction,
  style,
  icon,
}) => {
  const { colors, typography, spacing } = useTheme();

  return (
    <View style={[styles.container, style]}>
      {icon ? <View style={{ marginBottom: spacing.md }}>{icon}</View> : null}
      <Text style={[typography.headlineSm, { color: colors.onSurface, textAlign: 'center' }]}>
        {title}
      </Text>
      {description ? (
        <Text
          style={[
            typography.bodyMd,
            {
              color: colors.onSurfaceVariant,
              textAlign: 'center',
              marginTop: spacing.xs,
              marginBottom: spacing.lg,
            },
          ]}
        >
          {description}
        </Text>
      ) : null}
      {actionTitle && onAction ? (
        <Button title={actionTitle} onPress={onAction} variant="season" size="md" />
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    marginVertical: 16,
  },
});
