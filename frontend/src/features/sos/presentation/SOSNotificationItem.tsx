import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '@/core/theme';
import { AppNotification } from '@/models/notification';

interface SOSNotificationItemProps {
  notification: AppNotification;
  onPress: () => void;
  onDismiss?: () => void;
}

export const SOSNotificationItem: React.FC<SOSNotificationItemProps> = ({
  notification,
  onPress,
}) => {
  const { colors, typography, spacing, rounded, shadows } = useTheme();

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: '#fee2e2',
          borderColor: '#fca5a5',
          borderRadius: rounded.xl,
          padding: spacing.md,
          ...shadows.soft,
        },
      ]}
    >
      <View style={styles.topRow}>
        <View style={styles.badgeRow}>
          <View style={[styles.iconBox, { backgroundColor: colors.error, borderRadius: rounded.md }]}>
            <Text style={{ fontSize: 13, color: '#ffffff' }}>🚨</Text>
          </View>
          <Text style={[typography.utilityTiny, { color: colors.error, fontWeight: '800', marginLeft: 6 }]}>
            EMERGENCY SOS ALERT
          </Text>
        </View>
        <Text style={[typography.utilityTiny, { color: colors.outline }]}>
          {notification.timestamp}
        </Text>
      </View>

      <Text style={[typography.labelMd, { color: colors.onSurface, fontWeight: '800', marginTop: spacing.xs }]}>
        {notification.title}
      </Text>

      <Text style={[typography.bodySm, { color: colors.onSurfaceVariant, marginVertical: spacing.xs }]}>
        {notification.message}
      </Text>

      {notification.metadata?.sos_coordinates && (
        <View style={[styles.coordBox, { backgroundColor: '#ffffff', borderRadius: rounded.md }]}>
          <Text style={[typography.utilityTiny, { color: colors.error, fontWeight: '700' }]}>
            📍 Lat: {notification.metadata.sos_coordinates.lat.toFixed(4)}, Lng: {notification.metadata.sos_coordinates.lng.toFixed(4)}
          </Text>
        </View>
      )}

      <TouchableOpacity
        activeOpacity={0.8}
        onPress={onPress}
        style={[
          styles.actionBtn,
          {
            backgroundColor: colors.error,
            borderRadius: rounded.lg,
            paddingVertical: spacing.xs,
            paddingHorizontal: spacing.md,
            marginTop: spacing.xs,
          },
        ]}
      >
        <Text style={[typography.utilityTiny, { color: '#ffffff', fontWeight: '800', textAlign: 'center' }]}>
          View Member Location & Emergency Room →
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: '100%',
    borderWidth: 1.5,
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
  coordBox: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    alignSelf: 'flex-start',
    marginVertical: 4,
  },
  actionBtn: {
    alignSelf: 'stretch',
  },
});
