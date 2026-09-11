import React from 'react';
import { Stack } from 'expo-router';

export default function HomeLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="discover/index" options={{ headerShown: false }} />
      <Stack.Screen name="discover/[postId]" options={{ headerShown: false }} />
      <Stack.Screen name="safety-alert/[alertId]" options={{ headerShown: false }} />
    </Stack>
  );
}
