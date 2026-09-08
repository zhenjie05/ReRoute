import React from 'react';
import { useLocalSearchParams } from 'expo-router';
import { SettleUpModal } from '@/features/trip-room/presentation/budget/SettleUpModal';

export default function SettleUpScreen() {
  const { roomId } = useLocalSearchParams<{ roomId: string }>();
  return <SettleUpModal roomId={roomId} />;
}
