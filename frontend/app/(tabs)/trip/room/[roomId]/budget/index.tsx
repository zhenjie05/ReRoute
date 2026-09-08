import React from 'react';
import { useLocalSearchParams } from 'expo-router';
import { BudgetDashboard } from '@/features/trip-room/presentation/budget/BudgetDashboard';

export default function BudgetScreen() {
  const { roomId } = useLocalSearchParams<{ roomId: string }>();

  return <BudgetDashboard roomId={roomId} />;
}
