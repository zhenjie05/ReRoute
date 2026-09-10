import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/core/theme';
import { Feather } from '@expo/vector-icons';

interface SystemNoticePillProps {
  text: string;
}

/**
 * Centered muted pill for system announcements in the chat feed.
 * e.g. "ReRoute Notice: Itinerary updated by Sarah" or "Alex joined the room"
 */
export const SystemNoticePill: React.FC<SystemNoticePillProps> = ({ text }) => {
  const { colors, typography, spacing, rounded } = useTheme();

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.pill,
          {
            backgroundColor: colors.surfaceContainer,
            borderRadius: rounded.full,
            paddingHorizontal: spacing.md,
            paddingVertical: spacing.xs + 2,
          },
        ]}
      >
        <Feather name="info" size={14} color="#4A90E2" style={{ marginRight: 6 }} />
        <Text
          style={[
            typography.labelSm,
            { color: colors.onSurfaceVariant, fontSize: 11, fontWeight: '500' },
          ]}
        >
          {text}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 8,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    maxWidth: '90%',
  },
});
