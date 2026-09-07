import React from 'react';
import { Tabs } from 'expo-router';
import { Text, View, StyleSheet, Platform } from 'react-native';
import { useTheme } from '@/core/theme';
import { useLiveTrip } from '@/lib/hooks/useLiveTrip';

export default function TabLayout() {
  const { colors, typography, rounded, spacing } = useTheme();
  const { hasLiveTrip } = useLiveTrip();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
        tabBarStyle: {
          position: 'absolute',
          bottom: Platform.OS === 'ios' ? 24 : 16,
          left: 20,
          right: 20,
          height: 64,
          backgroundColor: '#ffffff',
          borderRadius: rounded['3xl'],
          borderTopWidth: 0,
          elevation: 8,
          shadowColor: '#0a0f11',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.12,
          shadowRadius: 16,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.onSurfaceVariant,
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },
      }}
    >
      {/* 1. Home Tab */}
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: ({ focused }) => (
            <View
              style={[
                styles.iconContainer,
                focused && { backgroundColor: colors.season.soft, borderRadius: rounded.full },
              ]}
            >
              <Text style={{ fontSize: 20 }}>🏠</Text>
            </View>
          ),
        }}
      />

      {/* 2. Trip Tab (with Live Indicator) */}
      <Tabs.Screen
        name="trip"
        options={{
          title: 'Trip',
          tabBarIcon: ({ focused }) => (
            <View
              style={[
                styles.iconContainer,
                focused && { backgroundColor: colors.season.soft, borderRadius: rounded.full },
              ]}
            >
              <Text style={{ fontSize: 20 }}>🧭</Text>
              {hasLiveTrip ? (
                <View
                  style={[
                    styles.liveIndicator,
                    { backgroundColor: colors.season.main, borderRadius: rounded.full },
                  ]}
                />
              ) : null}
            </View>
          ),
        }}
      />

      {/* 3. Profile Tab */}
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ focused }) => (
            <View
              style={[
                styles.iconContainer,
                focused && { backgroundColor: colors.season.soft, borderRadius: rounded.full },
              ]}
            >
              <Text style={{ fontSize: 20 }}>👤</Text>
            </View>
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  liveIndicator: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 8,
    height: 8,
  },
});
