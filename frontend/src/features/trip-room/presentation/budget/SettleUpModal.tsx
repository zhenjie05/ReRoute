import React from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/core/theme';
import { Button, Card } from '@/shared/components';
import { useBudgetMockData } from './useBudgetMockData';

export const SettleUpModal: React.FC<{ roomId: string }> = ({ roomId }) => {
  const { colors } = useTheme();
  const router = useRouter();
  const { travelers, balances, addSettlement } = useBudgetMockData(roomId);
  const creditors = balances.filter(person => person.balance > 0.01).map(person => ({ ...person }));
  const payments: { from: string; to: string; amount: number }[] = [];
  for (const debtor of balances.filter(person => person.balance < -0.01)) {
    let remaining = -debtor.balance;
    for (const creditor of creditors) {
      const amount = Math.round(Math.min(remaining, creditor.balance) * 100) / 100;
      if (amount <= 0) continue;
      payments.push({ from: debtor.id, to: creditor.id, amount });
      remaining -= amount; creditor.balance -= amount;
    }
  }
  const name = (id: string) => travelers.find(person => person.id === id)?.name || 'Traveler';
  return <ScrollView style={{ flex: 1, backgroundColor: colors.background }} contentContainerStyle={{ padding: 24, paddingBottom: 140, gap: 20 }}>
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}><Text style={{ fontSize: 22, fontWeight: '700', color: colors.onSurface }}>Settle Up</Text><Pressable accessibilityRole="button" accessibilityLabel="Close settlement" onPress={() => router.back()}><Text style={{ fontSize: 24, padding: 8 }}>×</Text></Pressable></View>
    {!payments.length && <Card style={{ padding: 24, gap: 12 }}><Text style={{ fontSize: 20, fontWeight: '700', color: '#49713B' }}>All Settle Up!</Text><Text>No outstanding balances.</Text></Card>}
    {payments.map((payment, index) => <Card key={payment.from + payment.to} style={{ padding: 20, gap: 16 }}>
      <Text style={{ fontSize: 16, fontWeight: '600', color: colors.onSurface }}>{name(payment.from)} → {name(payment.to)}</Text>
      <Text style={{ fontSize: 26, fontWeight: '700', color: colors.primary }}>${payment.amount.toFixed(2)}</Text>
      <Button title="Mark as paid" onPress={() => addSettlement({
        id: `payment-${Date.now()}-${index}`, room_id: roomId, from_user_id: payment.from, to_user_id: payment.to,
        from_user_name: name(payment.from), to_user_name: name(payment.to), amount: payment.amount,
        currency: 'USD', method: 'Recorded transfer', settled_at: new Date().toISOString(),
      })} />
    </Card>)}
  </ScrollView>;
};
