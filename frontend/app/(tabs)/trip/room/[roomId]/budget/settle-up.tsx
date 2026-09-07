import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTheme } from '@/core/theme';
import { Button, Card, Badge } from '@/shared/components';

export default function SettleUpScreen() {
  const { roomId } = useLocalSearchParams<{ roomId: string }>();
  const { colors, typography, spacing, rounded } = useTheme();
  const router = useRouter();

  const [settled, setSettled] = useState(false);

  const handleRecordPayment = () => {
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
          <Text style={{ fontSize: 20 }}>←</Text>
        </TouchableOpacity>
        <Text style={[typography.headlineSm, { color: colors.onSurface }]}>Settle Up Debts</Text>
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
              Optimized Settlements 🤝
            </Text>
            <Text style={[typography.bodySm, { color: colors.onSurfaceVariant, marginBottom: spacing.lg }]}>
              Debt simplification pairs all members into the minimum transactions needed.
            </Text>

            <Card style={{ marginBottom: spacing.lg }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <View>
                  <Text style={[typography.labelLg, { color: colors.onSurface, fontWeight: '700' }]}>
                    Taylor Swift → Alex Chen
                  </Text>
                  <Text style={[typography.bodySm, { color: colors.onSurfaceVariant }]}>
                    Via Venmo / Cash
                  </Text>
                </View>
                <Text style={[typography.headlineSm, { color: colors.success, fontWeight: '800' }]}>
                  $101.17
                </Text>
              </View>

              <Button
                title="Mark $101.17 as Settled"
                onPress={handleRecordPayment}
                variant="primary"
                size="md"
                style={{ marginTop: spacing.md }}
              />
            </Card>

            <Card style={{ marginBottom: spacing.lg }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <View>
                  <Text style={[typography.labelLg, { color: colors.onSurface, fontWeight: '700' }]}>
                    Sam Lee → Alex Chen
                  </Text>
                  <Text style={[typography.bodySm, { color: colors.onSurfaceVariant }]}>
                    Via Bank Transfer
                  </Text>
                </View>
                <Text style={[typography.headlineSm, { color: colors.success, fontWeight: '800' }]}>
                  $85.50
                </Text>
              </View>

              <Button
                title="Mark $85.50 as Settled"
                onPress={handleRecordPayment}
                variant="outline"
                size="md"
                style={{ marginTop: spacing.md }}
              />
            </Card>
          </>
        )}
      </ScrollView>
    </View>
  );
}

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
