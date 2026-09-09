import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { useTheme } from '@/core/theme';
import { useLiveTrip } from '@/lib/hooks/useLiveTrip';

export type TabKey = 'home' | 'trip' | 'profile';

interface TabItemConfig {
  key: TabKey;
  label: string;
  icon: string;
  activeIcon: string;
  route: string;
}

const TABS: TabItemConfig[] = [
  {
    key: 'home',
    label: 'Home',
    icon: '🏠',
    activeIcon: '🏡',
    route: '/(tabs)/home',
  },
  {
    key: 'trip',
    label: 'Trip',
    icon: '🗺️',
    activeIcon: '🧭',
    route: '/(tabs)/trip',
  },
  {
    key: 'profile',
    label: 'Profile',
    icon: '👤',
    activeIcon: '✨',
    route: '/(tabs)/profile',
  },
];

interface StandaloneBottomNavBarProps {
  activeTab?: TabKey;
  onTabPress?: (tab: TabKey) => void;
  state?: any;
  navigation?: any;
}

export const BottomNavBar: React.FC<StandaloneBottomNavBarProps> = (
  props
) => {
  const { colors, typography, spacing, rounded, shadows } = useTheme();
  const router = useRouter();
  const pathname = usePathname();
  const { hasLiveTrip } = useLiveTrip();

  // Hide BottomNavBar on itinerary detail screens, trip room screens, setup screens, and alerts
  const isDetailScreen =
    pathname.includes('/discover/') ||
    pathname.includes('/room/') ||
    pathname.includes('/setup/') ||
    pathname.includes('/safety-alert');

  if (isDetailScreen) {
    return null;
  }

  // Determine active tab either from React Navigation state, pathname, or prop override
  const getActiveTab = (): TabKey => {
    if (props.state) {
      const routeName = props.state.routes[props.state.index]?.name;
      if (routeName === 'home' || routeName === 'trip' || routeName === 'profile') {
        return routeName;
      }
    }
    if (props.activeTab) {
      return props.activeTab;
    }
    if (pathname.includes('/trip')) return 'trip';
    if (pathname.includes('/profile')) return 'profile';
    return 'home';
  };

  const currentTab = getActiveTab();

  const handlePress = (tab: TabItemConfig, index: number) => {
    if (props.navigation && props.state) {
      const isFocused = props.state.index === index;
      const event = props.navigation.emit({
        type: 'tabPress',
        target: props.state.routes[index]?.key,
        canPreventDefault: true,
      });

      if (!isFocused && !event.defaultPrevented) {
        router.push(tab.route as any);
      }
    } else if (props.onTabPress) {
      props.onTabPress(tab.key);
    } else {
      router.push(tab.route as any);
    }
  };

  return (
    <View style={styles.outerContainer} pointerEvents="box-none">
      <View
        style={[
          styles.barContainer,
          {
            backgroundColor: colors.surface,
            borderColor: colors.surfaceContainerHigh,
            borderRadius: rounded.cardLarge,
            paddingHorizontal: spacing.sm,
            paddingVertical: spacing.xs,
            ...shadows.medium,
          },
        ]}
      >
        {TABS.map((tab, index) => {
          const isActive = currentTab === tab.key;
          const isTrip = tab.key === 'trip';

          return (
            <TouchableOpacity
              key={tab.key}
              activeOpacity={0.8}
              onPress={() => handlePress(tab, index)}
              accessibilityRole="tab"
              accessibilityState={{ selected: isActive }}
              accessibilityLabel={`${tab.label} tab`}
              style={[
                styles.tabButton,
                isActive && [
                  styles.activeTabCapsule,
                  {
                    backgroundColor: colors.primaryContainer,
                    borderRadius: rounded.xl,
                  },
                ],
              ]}
            >
              <View style={styles.iconWrapper}>
                <Text style={styles.tabIcon}>{isActive ? tab.activeIcon : tab.icon}</Text>
                {isTrip && hasLiveTrip && (
                  <View
                    style={[
                      styles.liveDot,
                      {
                        backgroundColor: '#15803d',
                        borderRadius: rounded.full,
                      },
                    ]}
                  />
                )}
              </View>

              <Text
                style={[
                  typography.utilityTiny,
                  {
                    color: isActive ? colors.onPrimaryContainer : colors.outline,
                    fontWeight: isActive ? '800' : '600',
                    marginTop: 2,
                  },
                ]}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 24 : 16,
    left: 16,
    right: 16,
    alignItems: 'center',
    zIndex: 90,
  },
  barContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    maxWidth: 420,
    borderWidth: 1,
    height: 64,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    marginHorizontal: 4,
  },
  activeTabCapsule: {
    paddingVertical: 6,
  },
  iconWrapper: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabIcon: {
    fontSize: 20,
  },
  liveDot: {
    position: 'absolute',
    top: -2,
    right: -6,
    width: 7,
    height: 7,
    borderWidth: 1.5,
    borderColor: '#ffffff',
  },
});
