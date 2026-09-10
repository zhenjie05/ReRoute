import React from 'react';
import { View, Text, ScrollView, StyleSheet, Alert } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from '@/core/theme';
import { Card, Button, Avatar } from '@/shared/components';
import { useAuth } from '@/lib/hooks/useAuth';
import { mockTripRooms } from '../../data/mock-trip-room';
import { getRoomSeasonTheme } from '../../data/season-presentation';
import { ArchivedBanner } from '../components';
import { useBudgetMockData } from './useBudgetMockData';

const money = (amount: number) => '$' + amount.toLocaleString('en-US', { maximumFractionDigits: 2 });
export const BudgetDashboard: React.FC<{ roomId: string }> = ({ roomId }) => {
  const { colors, typography, spacing } = useTheme();
  const router = useRouter();
  const { user } = useAuth();
  const room = mockTripRooms.find(item => item.id === roomId);
  const archived = room?.stage === 'archived';
  const theme = getRoomSeasonTheme(room);
  const { expenses, categories, settlements, balances, travelers, addSettlement } = useBudgetMockData(roomId);
  const total = expenses.reduce((sum, expense) => sum + expense.total_amount, 0);
  const planned = categories.reduce((sum, category) => sum + category.planned_amount, 0);
  const me = balances.find(item => item.id === user?.id) || balances[0];
  const balance = me?.balance || 0;
  const myUserId = user?.id || 'demo-user-1';
  const pairwise = new Map<string, number>();
  travelers.forEach(t => { if (t.id !== myUserId) pairwise.set(t.id, 0); });

  expenses.forEach(expense => {
    const share = expense.total_amount / travelers.length;
    expense.paid_by.forEach(payerId => {
      if (payerId === myUserId) {
        travelers.forEach(t => {
          if (t.id !== myUserId && !expense.paid_by.includes(t.id)) {
            pairwise.set(t.id, (pairwise.get(t.id) || 0) + share);
          }
        });
      } else {
        pairwise.set(payerId, (pairwise.get(payerId) || 0) - share);
      }
    });
  });

  settlements.forEach(settlement => {
    if (settlement.from_user_id === myUserId) {
      pairwise.set(settlement.to_user_id, (pairwise.get(settlement.to_user_id) || 0) + settlement.amount);
    } else if (settlement.to_user_id === myUserId) {
      pairwise.set(settlement.from_user_id, (pairwise.get(settlement.from_user_id) || 0) - settlement.amount);
    }
  });

  const myOwedPayments: { from: string; to: string; amount: number }[] = [];
  const myCreditPayments: { from: string; to: string; amount: number }[] = [];
  const mySettledCounterparties: string[] = [];

  pairwise.forEach((amount, counterpartyId) => {
    const net = Math.round(amount * 100) / 100;
    if (net < -0.01) myOwedPayments.push({ from: myUserId, to: counterpartyId, amount: -net });
    else if (net > 0.01) myCreditPayments.push({ from: counterpartyId, to: myUserId, amount: net });
    else {
      const hasActivity = expenses.some(e => e.paid_by.includes(myUserId) || e.paid_by.includes(counterpartyId)) || 
                          settlements.some(s => (s.from_user_id === myUserId && s.to_user_id === counterpartyId) || (s.from_user_id === counterpartyId && s.to_user_id === myUserId));
      if (hasActivity) mySettledCounterparties.push(counterpartyId);
    }
  });

  const textColor = { color: colors.onSurface };
  return <View style={{ flex: 1, backgroundColor: colors.background }}>
    <ScrollView contentContainerStyle={{ padding: spacing.lg, paddingBottom: 130, gap: 20 }}>
      {archived && <ArchivedBanner />}
      <Card style={{ padding: 20, gap: 16, backgroundColor: theme.background, borderColor: theme.border, borderWidth: 1 }}>
        <View style={s.row}><View><Text style={s.muted}>Total Spent</Text><Text style={[typography.headlineLg, textColor]}>{money(total)}</Text></View>
          <View style={{ alignItems: 'flex-end' }}><Text style={s.muted}>Planned · USD</Text><Text style={[typography.headlineSm, textColor]}>{money(planned)}</Text></View></View>
        <View style={s.track}><View style={{ width: `${planned ? Math.min(total / planned * 100, 100) : 0}%`, height: '100%', backgroundColor: colors.primary }} /></View>
        <View style={s.summary}>
          {[['Your contribution', me?.contribution || 0], ['Your share', me?.share || 0], ['You owe', Math.max(-balance, 0)], ['You are owed', Math.max(balance, 0)]].map(([label, amount]) =>
            <View key={String(label)} style={s.row}><Text style={s.muted}>{label}</Text><Text style={[s.strong, textColor]}>{money(Number(amount))}</Text></View>)}
        </View>
      </Card>
      {archived && <View style={[s.settled, { backgroundColor: theme.background }]}><Feather name="check-circle" size={28} color="#49713B" /><View style={{ flex: 1 }}><Text style={[s.heading, textColor]}>All Settle Up!</Text><Text style={s.muted}>Every traveler is settled. No balance owed or owing.</Text></View></View>}
      <Text style={[s.heading, textColor]}>Categories</Text>
      {categories.map(category => {
        const spent = expenses.filter(expense => expense.category_id === category.id).reduce((sum, expense) => sum + expense.total_amount, 0);
        return <Card key={category.id} variant="outlined" style={{ padding: 16, gap: 12 }}>
          <View style={s.row}><Text style={[s.strong, textColor]}>{category.category_name}</Text><Text style={s.muted}>{money(spent)} / {money(category.planned_amount)}</Text></View>
          <View style={s.track}><View style={{ width: `${category.planned_amount ? Math.min(spent / category.planned_amount * 100, 100) : 0}%`, height: '100%', backgroundColor: colors.primary }} /></View>
        </Card>;
      })}
      <Text style={[s.heading, textColor]}>{archived ? 'Expense history' : 'Expenses'}</Text>
      {!expenses.length && <Card variant="outlined" style={{ padding: 28, alignItems: 'center', gap: 10 }}><Feather name="credit-card" size={32} color={colors.onSurfaceVariant} /><Text style={[s.strong, textColor]}>No expenses yet</Text><Text style={[s.muted, { textAlign: 'center' }]}>Your trip is still ahead. Add your first shared expense when you are ready.</Text></Card>}
      {expenses.map(expense => <Card key={expense.id} variant="outlined" style={{ padding: 16, gap: 8 }}>
        <View style={s.row}><Text style={[s.strong, textColor, { flex: 1 }]}>{expense.description}</Text><Text style={[s.strong, textColor]}>{money(expense.total_amount)}</Text></View>
        <Text style={s.muted}>{travelers.filter(person => expense.paid_by.includes(person.id)).map(person => person.name).join(', ')} paid · {expense.created_at.slice(0, 10)}</Text>
        <Text style={{ fontSize: 12, color: archived ? '#49713B' : colors.onSurfaceVariant }}>{archived ? '✓ Paid · Settle Up Done' : expense.category_name || categories.find(category => category.id === expense.category_id)?.category_name}</Text>
      </Card>)}
      {!!settlements.length && <Text style={[s.heading, textColor]}>Paid transaction history</Text>}
      {settlements.map(payment => <Card key={payment.id} variant="outlined" style={{ padding: 16, gap: 8 }}>
        <View style={s.row}><Text style={[s.strong, textColor, { flex: 1 }]}>{payment.from_user_name || travelers.find(person => person.id === payment.from_user_id)?.name} → {payment.to_user_name || travelers.find(person => person.id === payment.to_user_id)?.name}</Text><Text style={[s.strong, textColor]}>{money(payment.amount)}</Text></View>
        <Text style={s.muted}>{payment.settled_at.slice(0, 10)} · {payment.method}</Text><Text style={{ color: '#49713B', fontSize: 12 }}>✓ Settle Up Done</Text>
      </Card>)}
      {(!archived && (myOwedPayments.length > 0 || myCreditPayments.length > 0 || mySettledCounterparties.length > 0)) && (
        <View style={{ gap: 12 }}>
          <Text style={[s.heading, textColor]}>Settle Up</Text>
          {myOwedPayments.map((payment, index) => {
            const targetUser = travelers.find(t => t.id === payment.to);
            return (
              <Card key={`owed-${index}`} variant="outlined" style={{ padding: 16, flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                <Avatar uri={targetUser?.avatar} name={targetUser?.name} size={40} />
                <View style={{ flex: 1 }}>
                  <Text style={[s.strong, textColor]}>You owe {targetUser?.name}</Text>
                  <Text style={{ fontSize: 16, fontWeight: '700', color: colors.primary }}>${payment.amount.toFixed(2)}</Text>
                </View>
                <Button 
                  title="Settle" 
                  variant="outline"
                  size="sm"
                  style={{ borderRadius: 9999, paddingVertical: 4, paddingHorizontal: 12, minHeight: 0 }}
                  textStyle={{ fontSize: 12 }}
                  onPress={() => addSettlement({
                    id: `payment-${Date.now()}-${index}`, room_id: roomId, from_user_id: payment.from, to_user_id: payment.to,
                    from_user_name: travelers.find(t => t.id === payment.from)?.name || 'Me', to_user_name: targetUser?.name || 'Traveler', amount: payment.amount,
                    currency: 'USD', method: 'Recorded transfer', settled_at: new Date().toISOString(),
                  })} 
                />
              </Card>
            );
          })}
          {myCreditPayments.map((payment, index) => {
            const sourceUser = travelers.find(t => t.id === payment.from);
            return (
              <Card key={`credit-${index}`} variant="outlined" style={{ padding: 16, flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                <Avatar uri={sourceUser?.avatar} name={sourceUser?.name} size={40} />
                <View style={{ flex: 1 }}>
                  <Text style={[s.strong, textColor]}>{sourceUser?.name} owes you</Text>
                  <Text style={{ fontSize: 16, fontWeight: '700', color: colors.primary }}>${payment.amount.toFixed(2)}</Text>
                </View>
                <Button 
                  title="Send Notification" 
                  variant="outline"
                  size="sm"
                  style={{ borderRadius: 9999, paddingVertical: 4, paddingHorizontal: 12, minHeight: 0 }}
                  textStyle={{ fontSize: 12 }}
                  onPress={() => Alert.alert('Notification sent', `A reminder has been sent to ${sourceUser?.name}.`)} 
                />
              </Card>
            );
          })}
          {mySettledCounterparties.map((counterpartyId, index) => {
            const user = travelers.find(t => t.id === counterpartyId);
            return (
              <Card key={`settled-${index}`} variant="outlined" style={{ padding: 16, flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                <Avatar uri={user?.avatar} name={user?.name} size={40} />
                <View style={{ flex: 1 }}>
                  <Text style={[s.strong, textColor]}>{user?.name}</Text>
                  <Text style={{ fontSize: 16, fontWeight: '700', color: '#49713B' }}>Settled</Text>
                </View>
                <Button 
                  title="Settled" 
                  variant="outline"
                  size="sm"
                  disabled
                  style={{ borderRadius: 9999, paddingVertical: 4, paddingHorizontal: 12, minHeight: 0, opacity: 0.5 }}
                  textStyle={{ fontSize: 12 }}
                  onPress={() => {}} 
                />
              </Card>
            );
          })}
        </View>
      )}

      {!archived && <Button title="+ Add Expense" onPress={() => router.push(`/(tabs)/trip/room/${roomId}/budget/add-expense` as any)} />}
    </ScrollView>
  </View>;
};
const s = StyleSheet.create({
  row: { flexDirection: 'row', justifyContent: 'space-between', gap: 12, alignItems: 'center' },
  muted: { fontSize: 12, lineHeight: 19, color: '#666C72' },
  strong: { fontSize: 14, fontWeight: '600' },
  heading: { fontSize: 18, fontWeight: '700' },
  track: { height: 6, borderRadius: 3, backgroundColor: '#E3E9ED', overflow: 'hidden' },
  summary: { gap: 10, paddingTop: 8 },
  settled: { padding: 20, borderRadius: 20, flexDirection: 'row', gap: 12, alignItems: 'center' },
});
