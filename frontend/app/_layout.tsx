import React, { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { Stack, useRouter, useSegments } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { ThemeProvider, useTheme } from '@/core/theme';
import { AuthProvider, useAuth } from '@/lib/hooks/useAuth';
import { LiveTripProvider } from '@/lib/hooks/useLiveTrip';
import { NotificationsProvider } from '@/lib/hooks/useNotifications';
import { SOSFloatingOverlay } from '@/features/sos/presentation/SOSFloatingOverlay';
import { NotificationCenter } from '@/shared/components/NotificationCenter';

function RootNavigationContent() {
  const { colors } = useTheme();
  const { isLoading, isAuthenticated } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === '(auth)';

    if (!isAuthenticated && !inAuthGroup) {
      router.replace('/(auth)/login');
    } else if (isAuthenticated && inAuthGroup) {
      router.replace('/(tabs)/home');
    }
  }, [isAuthenticated, isLoading, segments, router]);

  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: colors.background,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)/login" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)/register" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)/forgot-password" options={{ headerShown: false }} />
      </Stack>

      {/* Global Persistent SOS Floating Overlay & Notification Center: Mounted only for authenticated session */}
      {isAuthenticated ? (
        <>
          <SOSFloatingOverlay />
          <NotificationCenter />
        </>
      ) : null}
    </View>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <ThemeProvider initialSeason="autumn">
        <AuthProvider>
          <LiveTripProvider>
            <NotificationsProvider>
              <RootNavigationContent />
            </NotificationsProvider>
          </LiveTripProvider>
        </AuthProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
