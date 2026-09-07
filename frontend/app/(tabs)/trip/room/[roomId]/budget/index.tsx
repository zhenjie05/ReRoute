import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTheme } from '@/core/theme';
import { Card, Badge, Button } from '@/shared/components';
import {
  mockBudgetCategories,
  mockExpenses,
} from '@/features/trip-room/data/mock-trip-room';

export default function BudgetDashboardScreen() {
  const { roomId } = useLocalSearchParams<{ roomId: string }>();
  const { colors, typography, spacing } = useTheme();
  const router = useRouter();

  // Check for mixed currencies across room expenses (FR-2-9a)
  const currencies = Array.from(new Set(mockExpenses.map((e) => e.currency)));
  const hasMixedCurrencies = currencies.length > 1;

  const totalPlannedUSD = mockBudgetCategories.reduce((sum, c) => sum + c.planned_amount, 0);
  const totalSpentUSD = mockBudgetCategories.reduce((sum, c) => sum + (c.spent_amount || 0), 0);

  return (
    <ScrollView contentContainerStyle={{ padding: spacing.lg, paddingBottom: 100 }}>
      {/* Mixed Currency Flagging Banner (FR-2-9a) */}
      {hasMixedCurrencies ? (
        <Card
          variant="season"
          style={{
            marginBottom: spacing.md,
            borderLeftWidth: 4,
            borderLeftColor: colors.warning,
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <Text style={{ fontSize: 18 }}>⚠️</Text>
            <Text style={[typography.labelLg, { color: colors.warning, fontWeight: '800' }]}>
              Mixed Currencies Detected ({currencies.join(', ')})
            </Text>
          </View>
          <Text style={[typography.bodySm, { color: colors.onSurfaceVariant, marginTop: 4 }]}>
            Expenses logged in multiple currencies. Subtotals shown per currency without automatic conversion.
          </Text>
        </Card>
      ) : null}

      {/* Planned vs Actual Budget Overview */}
      <Card variant="season" style={{ marginBottom: spacing.lg }}>
        <Text style={[typography.labelSm, { color: colors.season.text, fontWeight: '700' }]}>
          Overall Budget Tracker (USD)
        </Text>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: spacing.xs }}>
          <View>
            <Text style={[typography.headlineLg, { color: colors.onSurface }]}>
              ${totalSpentUSD}
            </Text>
            <Text style={[typography.bodySm, { color: colors.onSurfaceVariant }]}>
              of ${totalPlannedUSD} planned
            </Text>
          </View>
          <Badge label={`${Math.round((totalSpentUSD / totalPlannedUSD) * 100)}% Spent`} variant="season" />
        </View>

        {/* Category Breakdown Progress */}
        <View style={{ marginTop: spacing.md, gap: spacing.xs }}>
          {mockBudgetCategories.map((cat) => (
            <View key={cat.id} style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={[typography.labelSm, { color: colors.onSurfaceVariant }]}>
                {cat.category_name}
              </Text>
              <Text style={[typography.labelSm, { color: colors.onSurface, fontWeight: '600' }]}>
                ${cat.spent_amount || 0} / ${cat.planned_amount}
              </Text>
            </View>
          ))}
        </View>
      </Card>

      {/* Quick Action Buttons */}
      <View style={{ flexDirection: 'row', gap: spacing.xs, marginBottom: spacing.lg }}>
        <Button
          title="+ Add Expense"
          onPress={() => router.push(`/(tabs)/trip/room/${roomId}/budget/add-expense` as any)}
          variant="primary"
          size="sm"
          style={{ flex: 1 }}
        />
        <Button
          title="📷 Scan Receipt"
          onPress={() => router.push(`/(tabs)/trip/room/${roomId}/budget/scan-receipt` as any)}
          variant="outline"
          size="sm"
          style={{ flex: 1 }}
        />
        <Button
          title="🤝 Settle Up"
          onPress={() => router.push(`/(tabs)/trip/room/${roomId}/budget/settle-up` as any)}
          variant="season"
          size="sm"
          style={{ flex: 1 }}
        />
      </View>

      {/* Per-Person Balance */}
      <Text style={[typography.headlineSm, { color: colors.onSurface, marginBottom: spacing.sm }]}>
        Per-Person Balances 👥
      </Text>
      <View style={{ gap: spacing.sm, marginBottom: spacing.lg }}>
        <Card variant="outlined" style={styles.balanceRow}>
          <Text style={[typography.labelLg, { color: colors.onSurface, fontWeight: '700' }]}>
            Alex Chen (You)
          </Text>
          <Text style={[typography.labelLg, { color: colors.success, fontWeight: '800' }]}>
            +$186.67 (Gets back)
          </Text>
        </Card>
        <Card variant="outlined" style={styles.balanceRow}>
          <Text style={[typography.labelLg, { color: colors.onSurface, fontWeight: '700' }]}>
            Taylor Swift
          </Text>
          <Text style={[typography.labelLg, { color: colors.error, fontWeight: '800' }]}>
            -$101.17 (Owes)
          </Text>
        </Card>
        <Card variant="outlined" style={styles.balanceRow}>
          <Text style={[typography.labelLg, { color: colors.onSurface, fontWeight: '700' }]}>
            Sam Lee
          </Text>
          <Text style={[typography.labelLg, { color: colors.error, fontWeight: '800' }]}>
            -$85.50 (Owes)
          </Text>
        </Card>
      </View>

      {/* Recent Expenses List */}
      <Text style={[typography.headlineSm, { color: colors.onSurface, marginBottom: spacing.sm }]}>
        Recent Expenses
      </Text>
      <View style={{ gap: spacing.sm }}>
        {mockExpenses.map((exp) => (
          <Card key={exp.id} variant="outlined">
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text style={[typography.labelLg, { color: colors.onSurface, fontWeight: '700' }]}>
                {exp.description}
              </Text>
              <Text style={[typography.labelLg, { color: colors.primary, fontWeight: '800' }]}>
                {exp.currency} {exp.total_amount.toLocaleString()}
              </Text>
            </View>
            <Text style={[typography.bodySm, { color: colors.onSurfaceVariant, marginTop: 2 }]}>
              Paid by {exp.payer_names?.join(', ')} • Split across {exp.splits?.length || 3} members
            </Text>
          </Card>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  balanceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
});
