import React from 'react';
import { useLocalSearchParams } from 'expo-router';
import { OcrReviewScreen } from '@/features/trip-room/presentation/budget/OcrReviewScreen';

export default function OcrReviewRoute() {
  const { roomId } = useLocalSearchParams<{ roomId: string }>();
  return <OcrReviewScreen roomId={roomId || ''} />;
}