import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '@/core/theme';
import { Card, Button } from '@/shared/components';
import { useBudgetMockData } from './useBudgetMockData';
import { useRouter } from 'expo-router';

export const BudgetDashboard: React.FC<{ roomId: string }> = ({ roomId }) => {
  const { colors, typography, spacing, rounded } = useTheme();
  const router = useRouter();
  const { expenses } = useBudgetMockData();

  // Mocked totals from screenshot
  const totalSpent = 2450;
  const planned = 3500;
  const contribution = 600;
  const share = 490;
  const owed = 110;

  // Currencies flag
  const currencies = Array.from(new Set(expenses.map(e => e.currency)));
  const hasMixedCurrencies = currencies.length > 1;

  const handleAddExpense = () => {
    router.push(`/(tabs)/trip/room/${roomId}/budget/add-expense` as any);
  };

  const handleSettle = () => {
    // Open settle up modal/screen
    router.push(`/(tabs)/trip/room/${roomId}/budget/settle-up` as any);
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView contentContainerStyle={{ padding: spacing.lg, paddingBottom: 180 }}>
        
        {hasMixedCurrencies ? (
          <Card variant="season" style={{ marginBottom: spacing.md, borderLeftWidth: 4, borderLeftColor: colors.warning }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Text style={{ fontSize: 18 }}>⚠️</Text>
              <Text style={[typography.labelLg, { color: colors.warning, fontWeight: '800' }]}>
                Mixed Currencies Detected ({currencies.join(', ')})
              </Text>
            </View>
          </Card>
        ) : null}

        {/* Total Budget Card */}
        <Card variant="outlined" style={{ marginBottom: spacing.lg, padding: spacing.lg }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.sm }}>
            <View>
              <Text style={[typography.labelSm, { color: colors.onSurfaceVariant, textTransform: 'uppercase', fontWeight: 'bold' }]}>Total Spent</Text>
              <Text style={[typography.headlineLg, { color: colors.onSurface, fontWeight: 'bold' }]}>${totalSpent.toLocaleString()}</Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={[typography.labelSm, { color: colors.onSurfaceVariant, textTransform: 'uppercase', fontWeight: 'bold' }]}>Planned</Text>
              <Text style={[typography.headlineSm, { color: colors.onSurface, fontWeight: 'bold' }]}>${planned.toLocaleString()}</Text>
            </View>
          </View>
          
          {/* Progress Bar */}
          <View style={{ height: 8, backgroundColor: colors.surfaceContainerHighest, borderRadius: 4, marginBottom: spacing.lg, overflow: 'hidden' }}>
            <View style={{ width: `${Math.min((totalSpent / planned) * 100, 100)}%`, height: '100%', backgroundColor: colors.primary }} />
          </View>

          {/* Personal Summary Sub-card */}
          <View style={{ backgroundColor: '#EBF4E5', padding: spacing.md, borderRadius: rounded.lg }}>
            <View style={styles.summaryRow}>
              <Text style={[typography.bodySm, { color: '#4A5D4E' }]}>Your Contribution:</Text>
              <Text style={[typography.labelLg, { color: '#2C3E30', fontWeight: 'bold' }]}>${contribution}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={[typography.bodySm, { color: '#4A5D4E' }]}>Your Share:</Text>
              <Text style={[typography.labelLg, { color: '#2C3E30', fontWeight: 'bold' }]}>${share}</Text>
            </View>
            <View style={[styles.summaryRow, { marginTop: spacing.xs, borderTopWidth: 1, borderTopColor: '#C4D6B9', paddingTop: spacing.xs }]}>
              <Text style={[typography.labelLg, { color: '#A16A06', fontWeight: 'bold' }]}>You are owed</Text>
              <Text style={[typography.labelLg, { color: '#A16A06', fontWeight: 'bold' }]}>${owed}</Text>
            </View>
          </View>
        </Card>

        {/* Categories */}
        <Text style={[typography.headlineSm, { color: colors.onSurface, marginBottom: spacing.md, fontWeight: 'bold' }]}>Categories</Text>
        <View style={{ gap: spacing.md, marginBottom: spacing.xl }}>
          {/* Mocked Categories to match screenshot exactly */}
          <Card variant="outlined" style={{ padding: spacing.md }}>
             <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.xs }}>
               <Text style={[typography.labelLg, { color: colors.onSurface, fontWeight: 'bold' }]}>🛏️ Accommodation</Text>
               <Text style={[typography.bodySm, { color: colors.onSurfaceVariant }]}>$1,200 / $1,200</Text>
             </View>
             <View style={{ height: 6, backgroundColor: colors.surfaceContainerHighest, borderRadius: 3, overflow: 'hidden' }}>
                <View style={{ width: '100%', height: '100%', backgroundColor: colors.primary }} />
             </View>
          </Card>
          <Card variant="outlined" style={{ padding: spacing.md }}>
             <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.xs }}>
               <Text style={[typography.labelLg, { color: colors.onSurface, fontWeight: 'bold' }]}>🍴 Food</Text>
               <Text style={[typography.bodySm, { color: colors.onSurfaceVariant }]}>$850 / $800</Text>
             </View>
             <View style={{ height: 6, backgroundColor: colors.surfaceContainerHighest, borderRadius: 3, overflow: 'hidden' }}>
                <View style={{ width: '100%', height: '100%', backgroundColor: '#F9A826' }} />
             </View>
          </Card>
          <Card variant="outlined" style={{ padding: spacing.md }}>
             <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.xs }}>
               <Text style={[typography.labelLg, { color: colors.onSurface, fontWeight: 'bold' }]}>🚆 Transport</Text>
               <Text style={[typography.bodySm, { color: colors.onSurfaceVariant }]}>$400 / $500</Text>
             </View>
             <View style={{ height: 6, backgroundColor: colors.surfaceContainerHighest, borderRadius: 3, overflow: 'hidden' }}>
                <View style={{ width: '80%', height: '100%', backgroundColor: colors.primary }} />
             </View>
          </Card>
        </View>

        {/* Recent Expenses */}
        <Text style={[typography.headlineSm, { color: colors.onSurface, marginBottom: spacing.md, fontWeight: 'bold' }]}>Recent Expenses</Text>
        <View style={{ gap: spacing.sm, marginBottom: spacing.xl }}>
          <Card variant="outlined" style={{ padding: spacing.md, flexDirection: 'row', alignItems: 'center' }}>
            <View style={{ width: 48, height: 48, backgroundColor: '#EBF4E5', borderRadius: 8, justifyContent: 'center', alignItems: 'center', marginRight: spacing.md }}>
               <Text style={{ fontSize: 24 }}>🍴</Text>
            </View>
            <View style={{ flex: 1 }}>
               <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                 <Text style={[typography.labelLg, { color: colors.onSurface, fontWeight: 'bold' }]}>Sushi Dinner</Text>
                 <Text style={[typography.labelLg, { color: colors.onSurface, fontWeight: 'bold' }]}>$120</Text>
               </View>
               <Text style={[typography.bodySm, { color: colors.onSurfaceVariant, marginTop: 2 }]}>Mia paid • Equal split</Text>
               <View style={{ alignSelf: 'flex-start', backgroundColor: '#E0E4E8', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12, marginTop: 6 }}>
                  <Text style={[typography.utilityTiny, { color: '#4A5D4E' }]}>Food</Text>
               </View>
            </View>
          </Card>
          <Card variant="outlined" style={{ padding: spacing.md, flexDirection: 'row', alignItems: 'center' }}>
            <View style={{ width: 48, height: 48, backgroundColor: '#E6E1C5', borderRadius: 8, justifyContent: 'center', alignItems: 'center', marginRight: spacing.md }}>
               <Text style={{ fontSize: 24 }}>🚆</Text>
            </View>
            <View style={{ flex: 1 }}>
               <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                 <Text style={[typography.labelLg, { color: colors.onSurface, fontWeight: 'bold' }]}>JR Pass</Text>
                 <Text style={[typography.labelLg, { color: colors.onSurface, fontWeight: 'bold' }]}>$350</Text>
               </View>
               <Text style={[typography.bodySm, { color: colors.onSurfaceVariant, marginTop: 2 }]}>Alex paid • Percentage</Text>
               <View style={{ alignSelf: 'flex-start', backgroundColor: '#E0E4E8', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12, marginTop: 6 }}>
                  <Text style={[typography.utilityTiny, { color: '#4A5D4E' }]}>Transport</Text>
               </View>
            </View>
          </Card>
        </View>

        {/* Settle Up */}
        <Text style={[typography.headlineSm, { color: colors.onSurface, marginBottom: spacing.md, fontWeight: 'bold' }]}>Settle Up</Text>
        <Card variant="outlined" style={{ padding: spacing.md, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
           <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: '#ccc', marginRight: spacing.md, overflow: 'hidden' }}>
                 {/* Mock Avatar */}
                 <View style={{ width: '100%', height: '100%', backgroundColor: colors.primaryContainer }} />
              </View>
              <View>
                 <Text style={[typography.bodySm, { color: colors.onSurfaceVariant }]}>You owes Alex</Text>
                 <Text style={[typography.labelLg, { color: colors.onSurface, fontWeight: 'bold' }]}>$45</Text>
              </View>
           </View>
           <TouchableOpacity 
             onPress={handleSettle}
             style={{ paddingHorizontal: 16, paddingVertical: 8, borderRadius: 16, borderWidth: 1, borderColor: colors.outline }}
           >
             <Text style={[typography.labelSm, { color: colors.onSurface, fontWeight: 'bold' }]}>Settle</Text>
           </TouchableOpacity>
         </Card>

      </ScrollView>

      {/* Fixed Bottom Button Container */}
      <View style={{ position: 'absolute', bottom: 100, left: 16, right: 16 }}>
        <Button
          title="+ Add Expense"
          onPress={handleAddExpense}
          variant="primary"
          style={{ backgroundColor: '#FF8A00', borderRadius: rounded.md }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  }
});
