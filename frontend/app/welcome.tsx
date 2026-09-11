import React from 'react';
import { useLocalSearchParams } from 'expo-router';
import { WelcomeScreen } from '@/features/mascot/presentation/WelcomeScreen';

export default function WelcomeRoute() {
  const { firstTime } = useLocalSearchParams<{ firstTime?: string }>();
  const isFirstTime = firstTime === 'true' || firstTime === '1';

  return <WelcomeScreen isFirstTime={isFirstTime} />;
}
