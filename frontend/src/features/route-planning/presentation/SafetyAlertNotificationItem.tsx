import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '@/core/theme';
import { AppNotification } from '@/models/notification';
import { Feather } from '@expo/vector-icons';

interface SafetyAlertNotificationItemProps {
  notification: AppNotification;
  onPress: () => void;
  onDismiss?: () => void;
}

export const SafetyAlertNotificationItem: React.FC<SafetyAlertNotificationItemProps> = ({
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
          borderColor: notification.isRead ? colors.surfaceContainerHigh : '#fed7aa',
          borderRadius: rounded.xl,
          padding: spacing.md,
          ...shadows.soft,
        },
      ]}
    >
      <View style={styles.topRow}>
        <View style={styles.badgeRow}>
          <View style={[styles.iconBox, { backgroundColor: '#ffedd5', borderRadius: rounded.md }]}>
            <Feather name="cloud-rain" size={13} color="#c2410c" />
          </View>
          <Text style={[typography.utilityTiny, { color: '#c2410c', fontWeight: '800', marginLeft: 6 }]}>
            SAFETY & WEATHER ADVISORY
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

      {notification.metadata?.location_name && (
        <View style={styles.locationRow}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <Feather name="map-pin" size={12} color={colors.outline} />
            <Text style={[typography.utilityTiny, { color: colors.outline, fontWeight: '600' }]}>
              Affected: {notification.metadata.location_name}
            </Text>
          </View>
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
          View Dynamic Alternative Routes →
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
  locationRow: {
    marginVertical: 2,
  },
  actionBtn: {
    borderWidth: 1,
    alignSelf: 'stretch',
  },
});
