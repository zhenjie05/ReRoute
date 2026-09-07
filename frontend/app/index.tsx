import React from 'react';
import { Redirect } from 'expo-router';

export default function Index() {
  // Direct entry point redirecting to Home tab
  return <Redirect href="/(tabs)/home" />;
}
