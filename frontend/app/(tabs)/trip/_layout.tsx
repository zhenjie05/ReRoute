import React from 'react';
import { Stack } from 'expo-router';

export default function TripLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="create" options={{ headerShown: false }} />
      <Stack.Screen name="join" options={{ headerShown: false }} />
      <Stack.Screen name="setup/[roomId]" options={{ headerShown: false }} />
      <Stack.Screen name="room/[roomId]" options={{ headerShown: false }} />
    </Stack>
  );
}
