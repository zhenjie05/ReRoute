import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { useTheme } from '@/core/theme';
import { useLiveTrip } from '@/lib/hooks/useLiveTrip';
import { Feather } from '@expo/vector-icons';

export type TabKey = 'home' | 'trip' | 'profile';

interface TabItemConfig {
  key: TabKey;
  label: string;
  iconName: React.ComponentProps<typeof Feather>['name'];
  route: string;
}

const TABS: TabItemConfig[] = [
  {
    key: 'home',
    label: 'Home',
    iconName: 'home',
    route: '/(tabs)/home',
  },
  {
    key: 'trip',
    label: 'Trip',
    iconName: 'map',
    route: '/(tabs)/trip',
  },
  {
    key: 'profile',
    label: 'Profile',
    iconName: 'user',
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
  const { typography, rounded, shadows } = useTheme();
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
      const targetRoute =
        props.state.routes.find((r: any) => r.name === tab.key) ||
        props.state.routes[index];

      const event = props.navigation.emit({
        type: 'tabPress',
        target: targetRoute?.key,
        canPreventDefault: true,
      });

      if (!isFocused && !event.defaultPrevented) {
        props.navigation.navigate(targetRoute ? targetRoute.name : tab.key);
      }
    } else if (props.onTabPress) {
      props.onTabPress(tab.key);
    } else {
      router.navigate(tab.route as any);
    }
  };

  return (
    <View style={styles.outerContainer} pointerEvents="box-none">
      <View
        style={[
          styles.barContainer,
          {
            backgroundColor: '#ffffff',
            borderColor: '#f4f5f7',
            borderRadius: 36,
            paddingHorizontal: 24,
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
              style={styles.tabButton}
            >
              <View
                style={[
                  styles.iconWrapper,
                  isActive && styles.activeIconBg,
                ]}
              >
                <Feather
                  name={tab.iconName}
                  size={20}
                  color={isActive ? '#3E2723' : '#6B7280'}
                />
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
                    color: isActive ? '#3E2723' : '#6B7280',
                    fontWeight: isActive ? '700' : '500',
                    marginTop: 4,
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
    maxWidth: 380,
    borderWidth: 1,
    height: 68,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
  },
  iconWrapper: {
    width: 52,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
  },
  activeIconBg: {
    backgroundColor: '#FF8C00',
  },
  liveDot: {
    position: 'absolute',
    top: -2,
    right: 8,
    width: 8,
    height: 8,
    borderWidth: 1.5,
    borderColor: '#ffffff',
  },
});
