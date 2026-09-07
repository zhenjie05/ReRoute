import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '@/core/theme';
import { Button } from './Button';

interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  style?: ViewStyle;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Something went wrong',
  message,
  onRetry,
  style,
}) => {
  const { colors, typography, spacing } = useTheme();

  return (
    <View style={[styles.container, style]}>
      <Text style={[typography.headlineSm, { color: colors.error, textAlign: 'center' }]}>
        {title}
      </Text>
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
        {message}
      </Text>
      {onRetry ? <Button title="Try Again" onPress={onRetry} variant="outline" size="sm" /> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
});
