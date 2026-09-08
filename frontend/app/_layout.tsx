import React from 'react';
import { View } from 'react-native';
import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { ThemeProvider } from '@/core/theme';
import { AuthProvider } from '@/lib/hooks/useAuth';
import { LiveTripProvider } from '@/lib/hooks/useLiveTrip';
import { NotificationsProvider } from '@/lib/hooks/useNotifications';
import { SOSFloatingOverlay } from '@/features/sos/presentation/SOSFloatingOverlay';
import { NotificationCenter } from '@/shared/components/NotificationCenter';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <ThemeProvider initialSeason="autumn">
        <AuthProvider>
          <LiveTripProvider>
            <NotificationsProvider>
              <View style={{ flex: 1 }}>
                <StatusBar style="dark" />
                <Stack screenOptions={{ headerShown: false }}>
                  <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                  <Stack.Screen name="(auth)/login" options={{ headerShown: false }} />
                  <Stack.Screen name="(auth)/register" options={{ headerShown: false }} />
                  <Stack.Screen name="(auth)/forgot-password" options={{ headerShown: false }} />
                </Stack>

                {/* Global Persistent SOS Floating Overlay (Feature 4, visible when user has a live trip) */}
                <SOSFloatingOverlay />

                {/* Global Shared Notification Center Modal Sheet */}
                <NotificationCenter />
              </View>
            </NotificationsProvider>
          </LiveTripProvider>
        </AuthProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
