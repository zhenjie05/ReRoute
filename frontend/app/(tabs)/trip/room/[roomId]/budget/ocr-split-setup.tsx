import React from 'react';
import { useLocalSearchParams } from 'expo-router';
import { OcrSplitSetupScreen } from '@/features/trip-room/presentation/budget/OcrSplitSetupScreen';

export default function OcrSplitSetupRoute() {
  const { roomId } = useLocalSearchParams<{ roomId: string }>();
  return <OcrSplitSetupScreen roomId={roomId} />;
}
