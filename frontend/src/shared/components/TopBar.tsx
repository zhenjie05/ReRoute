import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  Easing,
} from 'react-native-reanimated';
import { useTheme } from '@/core/theme';
import { useAuth } from '@/lib/hooks/useAuth';
import { useNotifications } from '@/lib/hooks/useNotifications';
import { Avatar } from './Avatar';
import {
  dismissRotiSpeechBubbleSession,
  isRotiSpeechBubbleDismissed,
} from '@/lib/session/roti-session';

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
  const { colors, typography, spacing, rounded, shadows } = useTheme();
  const { user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const { unreadCount: hookUnreadCount, openNotificationCenter } = useNotifications();

  const [showSpeechBubble, setShowSpeechBubble] = useState(() => !isRotiSpeechBubbleDismissed());

  // Floating animation for speech bubble
  const floatOffset = useSharedValue(0);

  useEffect(() => {
    if (!isRotiSpeechBubbleDismissed()) {
      floatOffset.value = withRepeat(
        withSequence(
          withTiming(-4, { duration: 1600, easing: Easing.inOut(Easing.quad) }),
          withTiming(0, { duration: 1600, easing: Easing.inOut(Easing.quad) })
        ),
        -1,
        true
      );
    }
  }, [floatOffset]);

  const animatedBubbleStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: floatOffset.value }],
  }));

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

  const handleCloseSpeechBubble = () => {
    dismissRotiSpeechBubbleSession();
    setShowSpeechBubble(false);
  };

  const handleSpeechBubblePress = () => {
    dismissRotiSpeechBubbleSession();
    setShowSpeechBubble(false);
    handleNotificationPress();
  };

  const handleMascotPress = () => {
    if (showSpeechBubble) {
      dismissRotiSpeechBubbleSession();
      setShowSpeechBubble(false);
    }
    handleNotificationPress();
  };

  return (
    <View style={styles.outerWrapper}>
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
          onPress={() => router.navigate('/(tabs)/profile' as any)}
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
        </View>

        {/* Right: Roti Mascot & Notification Center Trigger */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={handleMascotPress}
          accessibilityLabel={`Roti AI Assistant and Notification Center, ${effectiveUnreadCount} unread`}
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

      {/* Floating Pop-Up Speech Bubble from Roti Icon */}
      {showSpeechBubble && (
        <Animated.View
          style={[
            styles.floatingSpeechBubble,
            animatedBubbleStyle,
            {
              backgroundColor: '#ffffff',
              borderColor: '#fed7aa',
              borderRadius: rounded.xl,
              ...shadows.medium,
            },
          ]}
        >
          {/* Arrow pointing up to Roti icon */}
          <View style={styles.bubbleArrowTop} />

          <TouchableOpacity
            activeOpacity={0.88}
            onPress={handleSpeechBubblePress}
            style={styles.bubbleContent}
          >
            <Text style={{ fontSize: 16, marginRight: 6 }}>🐾</Text>
            <View style={{ flex: 1 }}>
              <Text style={[typography.labelSm, { color: '#8b4b00', fontWeight: '800' }]}>
                I'm Roti, your AI assistance!
              </Text>
              <Text style={[typography.utilityTiny, { color: colors.onSurfaceVariant, fontSize: 10, marginTop: 1 }]}>
                Tap to check notifications & trip alerts
              </Text>
            </View>
            <TouchableOpacity
              onPress={handleCloseSpeechBubble}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              style={styles.closeBubbleBtn}
              accessibilityLabel="Dismiss message"
              accessibilityRole="button"
            >
              <Text style={{ fontSize: 11, color: colors.outlineVariant, fontWeight: '700' }}>✕</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        </Animated.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  outerWrapper: {
    position: 'relative',
    zIndex: 100,
  },
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
    width: 38,
    height: 38,
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

  // Floating Speech Bubble Styles
  floatingSpeechBubble: {
    position: 'absolute',
    top: 58,
    right: 12,
    zIndex: 9999,
    borderWidth: 1.5,
    maxWidth: 290,
    elevation: 10,
  },
  bubbleArrowTop: {
    position: 'absolute',
    top: -8,
    right: 18,
    width: 0,
    height: 0,
    borderLeftWidth: 7,
    borderRightWidth: 7,
    borderBottomWidth: 8,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#fed7aa',
  },
  bubbleContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 9,
  },
  closeBubbleBtn: {
    marginLeft: 6,
    padding: 2,
  },
});
