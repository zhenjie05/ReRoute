import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { useTheme } from '@/core/theme';
import { AppNotification } from '@/models/notification';

const rotiImage = require('../../../../assests/Roti.png');

interface MascotNotificationItemProps {
  notification: AppNotification;
  onPress: () => void;
  onDismiss?: () => void;
}

export const MascotNotificationItem: React.FC<MascotNotificationItemProps> = ({
  notification,
  onPress,
}) => {
  const { colors, typography, spacing, rounded, shadows } = useTheme();

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: '#fffbeb',
          borderColor: '#fde68a',
          borderRadius: rounded.xl,
          padding: spacing.md,
          ...shadows.soft,
        },
      ]}
    >
      <View style={styles.topRow}>
        <View style={styles.badgeRow}>
          <View style={[styles.iconBox, { backgroundColor: '#fef3c7', borderRadius: rounded.md }]}>
            <Image
              source={rotiImage}
              style={styles.mascotImg}
              resizeMode="contain"
            />
          </View>
          <Text style={[typography.utilityTiny, { color: '#b45309', fontWeight: '800', marginLeft: 6 }]}>
            Roti ADVISORY
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

      <TouchableOpacity
        activeOpacity={0.8}
        onPress={onPress}
        style={[
          styles.actionBtn,
          {
            backgroundColor: '#fde68a',
            borderRadius: rounded.lg,
            paddingVertical: 6,
            paddingHorizontal: 12,
            marginTop: spacing.xs,
          },
        ]}
      >
        <Text style={[typography.utilityTiny, { color: '#92400e', fontWeight: '800', textAlign: 'center' }]}>
          Chat with Roti →
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
    overflow: 'hidden',
  },
  mascotImg: {
    width: 18,
    height: 18,
  },
  unreadDot: {
    width: 7,
    height: 7,
    marginLeft: 6,
  },
  actionBtn: {
    alignSelf: 'stretch',
  },
});
