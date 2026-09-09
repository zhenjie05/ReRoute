import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/core/theme';
import { Button, Card } from '@/shared/components';
import { useBudgetMockData } from './useBudgetMockData';

export const SettleUpModal: React.FC<{ roomId: string }> = ({ roomId }) => {
  const { colors, typography, spacing } = useTheme();
  const router = useRouter();
  const { travelers, addSettlement } = useBudgetMockData();

  const [settled, setSettled] = useState(false);

  const handleRecordPayment = (amount: number) => {
    addSettlement({
      id: Math.random().toString(),
      room_id: roomId,
      from_user_id: travelers[1].id,
      to_user_id: travelers[0].id,
      amount,
      currency: 'USD',
      method: 'cash',
      settled_at: new Date().toISOString(),
    });
    setSettled(true);
    setTimeout(() => {
      router.back();
    }, 1200);
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Header */}
      <View style={[styles.header, { paddingHorizontal: spacing.lg, paddingVertical: spacing.md }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={{ fontSize: 20 }}>✕</Text>
        </TouchableOpacity>
        <Text style={[typography.headlineSm, { color: colors.onSurface }]}>Settle Up</Text>
        <View style={{ width: 32 }} />
      </View>

      <ScrollView contentContainerStyle={{ padding: spacing.lg }}>
        {settled ? (
          <Card variant="season" style={{ alignItems: 'center', padding: spacing.xl }}>
            <Text style={{ fontSize: 44, marginBottom: spacing.md }}>🎉</Text>
            <Text style={[typography.headlineSm, { color: colors.onSurface, textAlign: 'center' }]}>
              Settlement Recorded!
            </Text>
            <Text style={[typography.bodySm, { color: colors.onSurfaceVariant, textAlign: 'center', marginTop: 4 }]}>
              Balances updated across all members.
            </Text>
          </Card>
        ) : (
          <>
            <Text style={[typography.headlineSm, { color: colors.onSurface, marginBottom: spacing.xs }]}>
              Record Payment
            </Text>
            <Text style={[typography.bodySm, { color: colors.onSurfaceVariant, marginBottom: spacing.lg }]}>
              You owe Alex $45. Select a method to record this settlement.
            </Text>

            <Card style={{ marginBottom: spacing.lg }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <View>
                  <Text style={[typography.labelLg, { color: colors.onSurface, fontWeight: '700' }]}>
                    You → Alex Chen
                  </Text>
                  <Text style={[typography.bodySm, { color: colors.onSurfaceVariant }]}>
                    Amount Owed
                  </Text>
                </View>
                <Text style={[typography.headlineSm, { color: '#FF8A00', fontWeight: '800' }]}>
                  $45.00
                </Text>
              </View>

              <Button
                title="Mark $45.00 as Settled"
                onPress={() => handleRecordPayment(45)}
                variant="primary"
                size="md"
                style={{ marginTop: spacing.md, backgroundColor: '#FF8A00' }}
              />
            </Card>
          </>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#edf1f5',
  },
  backBtn: {
    padding: 6,
  },
});
