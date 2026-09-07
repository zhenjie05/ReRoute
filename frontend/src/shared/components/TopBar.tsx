import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme, Season } from '@/core/theme';
import { Avatar } from './Avatar';
import { useAuth } from '@/lib/hooks/useAuth';
import { useRouter } from 'expo-router';

interface TopBarProps {
  unreadCount?: number;
  onNotificationPress?: () => void;
}

const seasons: Season[] = ['spring', 'summer', 'autumn', 'winter'];

export const TopBar: React.FC<TopBarProps> = ({
  unreadCount = 2,
  onNotificationPress,
}) => {
  const { colors, typography, spacing, rounded, season, setSeason } = useTheme();
  const { user } = useAuth();
  const router = useRouter();

  const cycleSeason = () => {
    const nextIndex = (seasons.indexOf(season) + 1) % seasons.length;
    setSeason(seasons[nextIndex]);
  };

  const getSeasonEmoji = (s: Season) => {
    switch (s) {
      case 'spring':
        return '🌸 Spring';
      case 'summer':
        return '🌿 Summer';
      case 'autumn':
        return '🍁 Autumn';
      case 'winter':
        return '❄️ Winter';
    }
  };

  return (
    <View style={[styles.container, { paddingHorizontal: spacing.lg, paddingVertical: spacing.md }]}>
      {/* Left: Avatar */}
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => router.push('/(tabs)/profile' as any)}
      >
        <Avatar uri={user?.avatar} name={user?.name || 'Traveler'} size={36} />
      </TouchableOpacity>

      {/* Center: Seasonal Theme Pill */}
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={cycleSeason}
        style={[
          styles.seasonPill,
          {
            backgroundColor: colors.season.soft,
            borderColor: colors.season.main,
            borderRadius: rounded.full,
            paddingHorizontal: spacing.md,
            paddingVertical: spacing.xs,
          },
        ]}
      >
        <Text style={[typography.labelSm, { color: colors.season.text, fontWeight: '700' }]}>
          {getSeasonEmoji(season)}
        </Text>
      </TouchableOpacity>

      {/* Right: Notifications */}
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={onNotificationPress}
        style={[
          styles.iconBtn,
          {
            backgroundColor: colors.surfaceContainerLow,
            borderRadius: rounded.full,
          },
        ]}
      >
        <Text style={{ fontSize: 18 }}>🔔</Text>
        {unreadCount > 0 ? (
          <View
            style={[
              styles.badgeDot,
              {
                backgroundColor: colors.error,
                borderRadius: rounded.full,
              },
            ]}
          >
            <Text style={[typography.utilityTiny, { color: '#ffffff', fontSize: 9, fontWeight: '700' }]}>
              {unreadCount}
            </Text>
          </View>
        ) : null}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#edf1f5',
    zIndex: 10,
  },
  seasonPill: {
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  badgeDot: {
    position: 'absolute',
    top: -2,
    right: -2,
    minWidth: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
});
