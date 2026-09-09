import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { useTheme } from '@/core/theme';
import { useAuth } from '@/lib/hooks/useAuth';
import { useNotifications } from '@/lib/hooks/useNotifications';
import { Avatar } from './Avatar';

const rotiImage = require('../../../assets/Roti.png');

interface TopBarProps {
  /** Optional custom title; defaults to 'ReRoute' */
  title?: string;
  /** Optional override for unread notification count */
  unreadCount?: number;
  /** Optional callback when tapping notifications/mascot */
  onNotificationPress?: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  title = 'ReRoute',
  unreadCount: customUnreadCount,
  onNotificationPress,
}) => {
  const { colors, typography, spacing, rounded, season } = useTheme();
  const { user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const { unreadCount: hookUnreadCount, openNotificationCenter } = useNotifications();

  // Hide TopBar on detail screens that provide their own custom header
  const isDetailScreen =
    pathname.includes('/discover/') ||
    pathname.includes('/room/') ||
    pathname.includes('/setup/') ||
    pathname.includes('/safety-alert');

  if (isDetailScreen) {
    return null;
  }

  const effectiveUnreadCount = customUnreadCount ?? hookUnreadCount;

  const handleNotificationPress = () => {
    if (onNotificationPress) {
      onNotificationPress();
    } else {
      openNotificationCenter();
    }
  };

  const getSeasonLabel = () => {
    switch (season) {
      case 'spring':
        return '🌸 Spring';
      case 'summer':
        return '🌿 Summer';
      case 'autumn':
        return '🍁 Autumn';
      case 'winter':
        return '❄️ Winter';
      default:
        return '🍁 Autumn';
    }
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.surface,
          borderBottomColor: colors.surfaceContainerHigh,
          paddingHorizontal: spacing.lg,
          paddingVertical: spacing.sm,
        },
      ]}
    >
      {/* Left: User Avatar */}
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => router.push('/(tabs)/profile' as any)}
        accessibilityLabel="View Profile"
        accessibilityRole="button"
        style={styles.avatarWrapper}
      >
        <Avatar uri={user?.avatar} name={user?.name || 'Traveler'} size={38} />
      </TouchableOpacity>

      {/* Center: App Title + Open Item Theme Placeholder */}
      <View style={styles.centerCol}>
        <View style={styles.titleRow}>
          <Text style={[typography.headlineSm, { color: colors.primary, fontWeight: '900', letterSpacing: -0.5 }]}>
            {title}
          </Text>
        </View>

        {/* 
          TODO: Open Item from ReRoute_Page_Refined_v2_1.md:
          Decision pending between app-level light/dark mode toggle vs. automatic weather/season-driven Trip Room theming.
          Currently rendered as an informational indicator placeholder without interactive toggle logic.
        */}
        <View
          style={[
            styles.themePlaceholderChip,
            {
              backgroundColor: colors.season.soft,
              borderColor: colors.season.main,
              borderRadius: rounded.full,
              paddingHorizontal: spacing.sm,
              paddingVertical: 2,
            },
          ]}
        >
          <Text style={[typography.utilityTiny, { color: colors.season.text, fontWeight: '700' }]}>
            {getSeasonLabel()}
          </Text>
        </View>
      </View>

      {/* Right: Corgi Mascot & Notification Center Trigger */}
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={handleNotificationPress}
        accessibilityLabel={`Notification Center, ${effectiveUnreadCount} unread`}
        accessibilityRole="button"
        style={[
          styles.mascotButton,
          {
            backgroundColor: colors.surfaceContainerLow,
            borderColor: colors.surfaceContainerHigh,
            borderRadius: rounded.full,
          },
        ]}
      >
        <Image source={rotiImage} style={styles.mascotImage} resizeMode="contain" />
        {effectiveUnreadCount > 0 && (
          <View
            style={[
              styles.badgePill,
              {
                backgroundColor: colors.error,
                borderRadius: rounded.full,
              },
            ]}
          >
            <Text style={[typography.utilityTiny, styles.badgeText]}>
              {effectiveUnreadCount > 9 ? '9+' : effectiveUnreadCount}
            </Text>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    zIndex: 20,
    height: 56,
  },
  avatarWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerCol: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  themePlaceholderChip: {
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  mascotButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    position: 'relative',
    overflow: 'visible',
  },
  mascotImage: {
    width: 28,
    height: 28,
  },
  badgePill: {
    position: 'absolute',
    top: -3,
    right: -3,
    minWidth: 18,
    height: 18,
    paddingHorizontal: 4,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#ffffff',
  },
  badgeText: {
    color: '#ffffff',
    fontSize: 9,
    fontWeight: '800',
    textAlign: 'center',
  },
});
