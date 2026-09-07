import React from 'react';
import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { ThemeProvider } from '@/core/theme';
import { AuthProvider } from '@/lib/hooks/useAuth';
import { LiveTripProvider } from '@/lib/hooks/useLiveTrip';
import { SOSOverlay } from '@/shared/components/SOSOverlay';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <ThemeProvider initialSeason="autumn">
        <AuthProvider>
          <LiveTripProvider>
            <StatusBar style="dark" />
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="(auth)/login" options={{ headerShown: false }} />
              <Stack.Screen name="(auth)/register" options={{ headerShown: false }} />
              <Stack.Screen name="(auth)/forgot-password" options={{ headerShown: false }} />
            </Stack>
            {/* Global Persistent SOS Floating Button */}
            <SOSOverlay />
          </LiveTripProvider>
        </AuthProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
