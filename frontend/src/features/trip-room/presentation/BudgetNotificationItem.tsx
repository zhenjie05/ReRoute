import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '@/core/theme';
import { AppNotification } from '@/models/notification';

interface BudgetNotificationItemProps {
  notification: AppNotification;
  onPress: () => void;
  onDismiss?: () => void;
}

export const BudgetNotificationItem: React.FC<BudgetNotificationItemProps> = ({
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
          borderColor: notification.isRead ? colors.surfaceContainerHigh : '#bbf7d0',
          borderRadius: rounded.xl,
          padding: spacing.md,
          ...shadows.soft,
        },
      ]}
    >
      <View style={styles.topRow}>
        <View style={styles.badgeRow}>
          <View style={[styles.iconBox, { backgroundColor: '#dcfce7', borderRadius: rounded.md }]}>
            <Text style={{ fontSize: 13 }}>💰</Text>
          </View>
          <Text style={[typography.utilityTiny, { color: '#15803d', fontWeight: '800', marginLeft: 6 }]}>
            BUDGET & EXPENSE SPLIT
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

      {notification.metadata?.expense_amount && (
        <View style={styles.detailRow}>
          <Text style={[typography.utilityTiny, { color: colors.primary, fontWeight: '800' }]}>
            Total: {notification.metadata.expense_amount} • Paid by {notification.metadata.payer_name}
          </Text>
        </View>
      )}

      <TouchableOpacity
        activeOpacity={0.8}
        onPress={onPress}
        style={[
          styles.actionBtn,
          {
            backgroundColor: colors.surfaceContainerLow,
            borderColor: colors.surfaceContainerHigh,
            borderRadius: rounded.lg,
            paddingVertical: 6,
            paddingHorizontal: 12,
            marginTop: spacing.xs,
          },
        ]}
      >
        <Text style={[typography.utilityTiny, { color: colors.primary, fontWeight: '800', textAlign: 'center' }]}>
          View Splitwise Ledger & Settle →
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
  detailRow: {
    marginVertical: 2,
  },
  actionBtn: {
    borderWidth: 1,
    alignSelf: 'stretch',
  },
});
