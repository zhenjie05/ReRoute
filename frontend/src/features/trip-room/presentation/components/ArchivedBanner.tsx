import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/core/theme';

/**
 * Archived state banner displayed above the feed when `stage = 'archived'`.
 * Matches SCREEN_SPEC §5.16 item 5.
 */
export const ArchivedBanner: React.FC = () => {
  const { colors, typography, spacing, rounded } = useTheme();

  return (
    <View
      style={[
        styles.banner,
        {
          backgroundColor: colors.surfaceContainer,
          borderRadius: rounded.lg,
          padding: spacing.md,
          marginHorizontal: spacing.lg,
          marginBottom: spacing.md,
        },
      ]}
    >
      <Text style={{ fontSize: 13, marginRight: spacing.xs }}>ℹ️</Text>
      <Text
        style={[
          typography.bodySm,
          { color: colors.onSurfaceVariant, flex: 1, lineHeight: 18 },
        ]}
      >
        This trip is archived. Discussions, itinerary, budget and photos are view-only.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
});
