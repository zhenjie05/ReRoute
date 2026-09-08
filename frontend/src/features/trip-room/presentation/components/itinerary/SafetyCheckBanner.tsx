import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '@/core/theme';

interface SafetyCheckBannerProps {
  title?: string;
  message: string;
  onDismiss?: () => void;
  disabled?: boolean;
}

/**
 * Dismissible read-only "AI Safety Check" banner for Active/Live stage.
 * Per Assumption 3: this is a third surfacing point for safety alerts,
 * implemented as dismissible, read-only (no vote action).
 * Sourced from the same `safety_alerts` feed.
 */
export const SafetyCheckBanner: React.FC<SafetyCheckBannerProps> = ({
  title = 'AI Safety Check',
  message,
  onDismiss,
  disabled = false,
}) => {
  const { colors, typography, spacing, rounded } = useTheme();
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  const handleDismiss = () => {
    setDismissed(true);
    onDismiss?.();
  };

  return (
    <View
      style={[
        styles.banner,
        {
          backgroundColor: colors.warningContainer,
          borderRadius: rounded.lg,
          paddingHorizontal: spacing.lg,
          paddingVertical: spacing.md,
          marginHorizontal: spacing.lg,
          marginBottom: spacing.md,
        },
      ]}
    >
      <View style={styles.iconContainer}>
        <Text style={{ fontSize: 20 }}>⚠️</Text>
      </View>

      <View style={styles.textContainer}>
        <Text
          style={[
            typography.labelLg,
            { color: colors.warning, fontWeight: '800', marginBottom: 2 },
          ]}
        >
          {title}
        </Text>
        <Text
          style={[
            typography.bodySm,
            { color: colors.onSurface, lineHeight: 18 },
          ]}
        >
          {message}
        </Text>
      </View>

      {!disabled && (
        <TouchableOpacity
          onPress={handleDismiss}
          style={styles.dismissBtn}
          hitSlop={12}
        >
          <Text style={{ fontSize: 16, color: colors.onSurfaceVariant }}>✕</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  iconContainer: {
    marginRight: 10,
    paddingTop: 1,
  },
  textContainer: {
    flex: 1,
  },
  dismissBtn: {
    marginLeft: 8,
    padding: 2,
  },
});
