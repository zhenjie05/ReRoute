import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '@/core/theme';
import { AppNotification } from '@/models/notification';

interface DecisionCardNotificationItemProps {
  notification: AppNotification;
  onPress: () => void;
  onDismiss?: () => void;
}

export const DecisionCardNotificationItem: React.FC<DecisionCardNotificationItemProps> = ({
  notification,
  onPress,
}) => {
  const { colors, typography, spacing, rounded, shadows } = useTheme();

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.card,
          borderColor: notification.isRead ? colors.surfaceContainerHigh : colors.primaryContainer,
          borderRadius: rounded.xl,
          padding: spacing.md,
          ...shadows.soft,
        },
      ]}
    >
      <View style={styles.topRow}>
        <View style={styles.badgeRow}>
          <View style={[styles.iconBox, { backgroundColor: '#e0e7ff', borderRadius: rounded.md }]}>
            <Text style={{ fontSize: 13 }}>🗳️</Text>
          </View>
          <Text style={[typography.utilityTiny, { color: '#4338ca', fontWeight: '800', marginLeft: 6 }]}>
            TRIP ROOM DECISION POLL
          </Text>
          {!notification.isRead && (
            <View style={[styles.unreadDot, { backgroundColor: colors.primary, borderRadius: rounded.full }]} />
          )}
        </View>
        <Text style={[typography.utilityTiny, { color: colors.outline }]}>
          {notification.timestamp}
        </Text>
      </View>

      <Text style={[typography.labelMd, { color: colors.onSurface, fontWeight: '800', marginTop: spacing.xs }]}>
        {notification.title}
      </Text>

      <Text style={[typography.bodySm, { color: colors.onSurfaceVariant, marginVertical: spacing.xs, lineHeight: 18 }]}>
        {notification.message}
      </Text>

      {notification.metadata?.decision_options && (
        <View style={styles.optionsRow}>
          {notification.metadata.decision_options.map((opt, i) => (
            <View
              key={i}
              style={[
                styles.optionChip,
                { backgroundColor: colors.surfaceContainerLow, borderRadius: rounded.md },
              ]}
            >
              <Text style={[typography.utilityTiny, { color: colors.onSurface, fontWeight: '600' }]}>
                {opt}
              </Text>
            </View>
          ))}
        </View>
      )}

      <TouchableOpacity
        activeOpacity={0.8}
        onPress={onPress}
        style={[
          styles.actionBtn,
          {
            backgroundColor: colors.primary,
            borderRadius: rounded.lg,
            paddingVertical: 7,
            paddingHorizontal: 12,
            marginTop: spacing.xs,
          },
        ]}
      >
        <Text style={[typography.utilityTiny, { color: '#ffffff', fontWeight: '800', textAlign: 'center' }]}>
          Cast Your Vote in Trip Room →
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: '100%',
    borderWidth: 1,
    marginVertical: 4,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBox: {
    width: 22,
    height: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  unreadDot: {
    width: 7,
    height: 7,
    marginLeft: 6,
  },
  optionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginVertical: 4,
  },
  optionChip: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  actionBtn: {
    alignSelf: 'stretch',
  },
});
