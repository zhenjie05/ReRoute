import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/core/theme';
import { Button, Card } from '@/shared/components';
import { SplitType } from '@/models/budget';

export default function AddExpenseScreen() {
  const { colors, typography, spacing, rounded } = useTheme();
  const router = useRouter();

  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [splitType, setSplitType] = useState<SplitType>('equal');

  // Percentage split validation state
  const [pctAlex, setPctAlex] = useState('34');
  const [pctTaylor, setPctTaylor] = useState('33');
  const [pctSam, setPctSam] = useState('33');

  const totalPct = (parseFloat(pctAlex) || 0) + (parseFloat(pctTaylor) || 0) + (parseFloat(pctSam) || 0);
  const isPctValid = Math.abs(totalPct - 100) < 0.1;

  const handleSaveExpense = () => {
    if (!description.trim() || !amount.trim()) return;
    if (splitType === 'percentage' && !isPctValid) return;
    router.back();
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Header */}
      <View style={[styles.header, { paddingHorizontal: spacing.lg, paddingVertical: spacing.md }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={{ fontSize: 20 }}>←</Text>
        </TouchableOpacity>
        <Text style={[typography.headlineSm, { color: colors.onSurface }]}>Add Expense</Text>
        <View style={{ width: 32 }} />
      </View>

      <ScrollView contentContainerStyle={{ padding: spacing.lg, paddingBottom: 100 }}>
        <Card style={{ marginBottom: spacing.lg }}>
          <Text style={[typography.labelSm, { color: colors.onSurface, marginBottom: spacing.xs }]}>
            Description
          </Text>
          <TextInput
            value={description}
            onChangeText={setDescription}
            placeholder="e.g. Asakusa Imahan Sukiyaki Dinner"
            placeholderTextColor={colors.outline}
            style={[
              styles.input,
              {
                borderColor: colors.outlineVariant,
                borderRadius: rounded.lg,
                backgroundColor: colors.surfaceContainerLow,
                padding: spacing.md,
                color: colors.onSurface,
                marginBottom: spacing.md,
              },
            ]}
          />

          <View style={{ flexDirection: 'row', gap: spacing.md, marginBottom: spacing.md }}>
            <View style={{ flex: 2 }}>
              <Text style={[typography.labelSm, { color: colors.onSurface, marginBottom: spacing.xs }]}>
                Total Amount
              </Text>
              <TextInput
                value={amount}
                onChangeText={setAmount}
                keyboardType="numeric"
                placeholder="120.00"
                placeholderTextColor={colors.outline}
                style={[
                  styles.input,
                  {
                    borderColor: colors.outlineVariant,
                    borderRadius: rounded.lg,
                    backgroundColor: colors.surfaceContainerLow,
                    padding: spacing.md,
                    color: colors.onSurface,
                  },
                ]}
              />
            </View>

            <View style={{ flex: 1 }}>
              <Text style={[typography.labelSm, { color: colors.onSurface, marginBottom: spacing.xs }]}>
                Currency
              </Text>
              <TextInput
                value={currency}
                onChangeText={setCurrency}
                autoCapitalize="characters"
                placeholder="USD"
                placeholderTextColor={colors.outline}
                style={[
                  styles.input,
                  {
                    borderColor: colors.outlineVariant,
                    borderRadius: rounded.lg,
                    backgroundColor: colors.surfaceContainerLow,
                    padding: spacing.md,
                    color: colors.onSurface,
                  },
                ]}
              />
            </View>
          </View>
        </Card>

        {/* Split Method Tabs (Equal / Percentage / Shares / Exact) (FR-2-9) */}
        <Card style={{ marginBottom: spacing.lg }}>
          <Text style={[typography.headlineSm, { color: colors.onSurface, marginBottom: spacing.xs }]}>
            Split Method
          </Text>
          <Text style={[typography.bodySm, { color: colors.onSurfaceVariant, marginBottom: spacing.md }]}>
            Choose how this expense is shared across members.
          </Text>

          <View style={{ flexDirection: 'row', gap: 6, marginBottom: spacing.lg }}>
            {(['equal', 'percentage', 'shares', 'exact'] as SplitType[]).map((type) => (
              <TouchableOpacity
                key={type}
                onPress={() => setSplitType(type)}
                style={[
                  styles.splitTab,
                  {
                    backgroundColor: splitType === type ? colors.primary : colors.surfaceContainerLow,
                    borderRadius: rounded.md,
                  },
                ]}
              >
                <Text
                  style={[
                    typography.labelSm,
                    {
                      color: splitType === type ? '#ffffff' : colors.onSurface,
                      fontWeight: '700',
                      textTransform: 'capitalize',
                    },
                  ]}
                >
                  {type}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Inline Validation Feedback for Percentage Split (FR-2-9) */}
          {splitType === 'percentage' ? (
            <View style={{ gap: spacing.sm }}>
              <View style={styles.memberSplitRow}>
                <Text style={[typography.bodyMd, { color: colors.onSurface }]}>Alex Chen (You)</Text>
                <TextInput
                  value={pctAlex}
                  onChangeText={setPctAlex}
                  keyboardType="numeric"
                  style={[styles.smallInput, { borderColor: colors.outlineVariant, borderRadius: rounded.sm }]}
                />
              </View>
              <View style={styles.memberSplitRow}>
                <Text style={[typography.bodyMd, { color: colors.onSurface }]}>Taylor Swift</Text>
                <TextInput
                  value={pctTaylor}
                  onChangeText={setPctTaylor}
                  keyboardType="numeric"
                  style={[styles.smallInput, { borderColor: colors.outlineVariant, borderRadius: rounded.sm }]}
                />
              </View>
              <View style={styles.memberSplitRow}>
                <Text style={[typography.bodyMd, { color: colors.onSurface }]}>Sam Lee</Text>
                <TextInput
                  value={pctSam}
                  onChangeText={setPctSam}
                  keyboardType="numeric"
                  style={[styles.smallInput, { borderColor: colors.outlineVariant, borderRadius: rounded.sm }]}
                />
              </View>

              {!isPctValid ? (
                <Text style={[typography.utilityTiny, { color: colors.error, fontWeight: '700', marginTop: 4 }]}>
                  ⚠️ Percentages sum to {totalPct}% (must equal exactly 100%).
                </Text>
              ) : (
                <Text style={[typography.utilityTiny, { color: colors.success, fontWeight: '700', marginTop: 4 }]}>
                  ✅ Total sum equals 100%.
                </Text>
              )}
            </View>
          ) : (
            <Text style={[typography.bodySm, { color: colors.onSurfaceVariant }]}>
              Split evenly: 33.33% ($
              {((parseFloat(amount) || 0) / 3).toFixed(2)} per person).
            </Text>
          )}
        </Card>

        <Button
          title="Save Expense"
          onPress={handleSaveExpense}
          variant="primary"
          size="lg"
        />
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
  input: {
    borderWidth: 1,
    fontSize: 15,
  },
  splitTab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  memberSplitRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  smallInput: {
    width: 60,
    borderWidth: 1,
    padding: 6,
    textAlign: 'center',
    fontSize: 14,
  },
});
