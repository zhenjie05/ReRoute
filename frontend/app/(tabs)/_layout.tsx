import React from 'react';
import { Tabs } from 'expo-router';
import { BottomNavBar } from '@/shared/components/BottomNavBar';
import { TopBar } from '@/shared/components/TopBar';

export default function TabLayout() {
  return (
    <Tabs
      tabBar={(props) => <BottomNavBar {...props} />}
      screenOptions={{
        header: () => <TopBar unreadCount={0} />,
        headerShown: true,
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
        }}
      />
      <Tabs.Screen
        name="trip"
        options={{
          title: 'Trip',
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
        }}
      />
    </Tabs>
  );
}
