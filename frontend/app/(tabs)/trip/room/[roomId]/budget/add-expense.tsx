import React from 'react';
import { useLocalSearchParams } from 'expo-router';
import { AddExpenseSheet } from '@/features/trip-room/presentation/budget/AddExpenseSheet';

export default function AddExpenseScreen() {
  const { roomId } = useLocalSearchParams<{ roomId: string }>();
  return <AddExpenseSheet roomId={roomId} />;
}
