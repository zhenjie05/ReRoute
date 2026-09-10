import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '@/core/theme';
import { useBudgetMockData } from './useBudgetMockData';
import { useRouter } from 'expo-router';

export const AddExpenseSheet: React.FC<{ roomId: string }> = ({ roomId }) => {
  const { colors, typography, spacing, rounded } = useTheme();
  const router = useRouter();
  const { travelers, addExpense } = useBudgetMockData(roomId);

  const [amount, setAmount] = useState('');
  const [currency] = useState('USD');
  const [description, setDescription] = useState('');
  const [category] = useState('Food & Drink');
  const [splitMethod, setSplitMethod] = useState<'Equal' | 'Percentage' | 'Shares' | 'Exact'>('Equal');

  const handleScanReceipt = () => {
    // Navigate to OCR flow
    router.push(`/(tabs)/trip/room/${roomId}/budget/scan-receipt` as any);
  };

  const handleAddExpense = () => {
    const total = Number(amount);
    if (!Number.isFinite(total) || total <= 0 || !description.trim() || !travelers.length) return;
    const expenseId = `expense-${Date.now()}`;
    addExpense({
      id: expenseId,
      room_id: roomId,
      category_id: 'c2',
      category_name: category,
      description,
      total_amount: total,
      currency,
      paid_by: [travelers[0].id],
      created_by: travelers[0].id,
      created_at: new Date().toISOString()
    }, travelers.map((person, index) => ({
      id: `${expenseId}-split-${index}`, expense_id: expenseId, user_id: person.id,
      split_type: splitMethod.toLowerCase() as 'equal' | 'percentage' | 'shares' | 'exact',
      share_value: splitMethod === 'Percentage' ? 100 / travelers.length : splitMethod === 'Exact' ? total / travelers.length : 1,
      amount_owed: total / travelers.length,
    })));
    router.back();
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24, marginTop: 40 }}>
      {/* Handle */}
      <View style={{ alignItems: 'center', marginTop: 12 }}>
        <View style={{ width: 40, height: 4, backgroundColor: '#E0E0E0', borderRadius: 2 }} />
      </View>

      {/* Header */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: spacing.lg, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' }}>
        <Text style={[typography.headlineSm, { color: colors.onSurface, fontWeight: 'bold' }]}>Add Expense</Text>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={{ fontSize: 20, color: colors.onSurfaceVariant }}>✕</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ padding: spacing.lg, paddingBottom: 100 }}>
        {/* Amount & Currency */}
        <View style={{ flexDirection: 'row', gap: spacing.md, marginBottom: spacing.md }}>
          <View style={{ flex: 2 }}>
            <Text style={[typography.utilityTiny, { color: colors.onSurfaceVariant, textTransform: 'uppercase', marginBottom: 4 }]}>Amount</Text>
            <View style={[styles.inputContainer, { borderColor: colors.primary }]}>
              <Text style={{ fontSize: 18, color: colors.onSurfaceVariant, marginRight: 8 }}>$</Text>
              <TextInput 
                value={amount}
                onChangeText={setAmount}
                placeholder="0.00"
                keyboardType="numeric"
                style={{ flex: 1, fontSize: 18, color: colors.onSurface }}
              />
            </View>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[typography.utilityTiny, { color: colors.onSurfaceVariant, textTransform: 'uppercase', marginBottom: 4 }]}>Currency</Text>
            <View style={[styles.inputContainer, { borderColor: colors.primary }]}>
              <Text style={{ flex: 1, fontSize: 16, color: colors.onSurface }}>{currency}</Text>
              <Text style={{ fontSize: 12 }}>▼</Text>
            </View>
          </View>
        </View>

        {/* Description */}
        <View style={{ marginBottom: spacing.md }}>
          <Text style={[typography.utilityTiny, { color: colors.onSurfaceVariant, textTransform: 'uppercase', marginBottom: 4 }]}>Description</Text>
          <View style={[styles.inputContainer, { borderColor: colors.primary }]}>
            <TextInput 
              value={description}
              onChangeText={setDescription}
              placeholder="e.g., Team Dinner"
              style={{ flex: 1, fontSize: 16, color: colors.onSurface }}
            />
          </View>
        </View>

        {/* Category */}
        <View style={{ marginBottom: spacing.lg }}>
          <Text style={[typography.utilityTiny, { color: colors.onSurfaceVariant, textTransform: 'uppercase', marginBottom: 4 }]}>Category</Text>
          <View style={[styles.inputContainer, { borderColor: colors.primary }]}>
            <Text style={{ fontSize: 18, marginRight: 8 }}>🍴</Text>
            <Text style={{ flex: 1, fontSize: 16, color: colors.onSurface }}>{category}</Text>
            <Text style={{ fontSize: 12 }}>▼</Text>
          </View>
        </View>

        {/* Paid By */}
        <View style={{ marginBottom: spacing.lg }}>
          <Text style={[typography.utilityTiny, { color: colors.onSurfaceVariant, textTransform: 'uppercase', marginBottom: 8 }]}>Paid By</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: '#F0E6D2', borderWidth: 2, borderColor: colors.primary, marginRight: -10, zIndex: 3, justifyContent: 'center', alignItems: 'center' }}>
              <Text style={{ fontSize: 10 }}>🧑</Text>
              <View style={{ position: 'absolute', bottom: -2, right: -2, backgroundColor: '#B8721A', borderRadius: 8, width: 16, height: 16, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ color: '#fff', fontSize: 10 }}>✓</Text>
              </View>
            </View>
            <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: '#E0E0E0', borderWidth: 2, borderColor: '#fff', marginRight: spacing.sm, zIndex: 2, justifyContent: 'center', alignItems: 'center' }}>
              <Text style={{ fontSize: 10 }}>👩</Text>
            </View>
            <TouchableOpacity style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: '#F5F5F5', borderWidth: 1, borderColor: '#ccc', borderStyle: 'dashed', justifyContent: 'center', alignItems: 'center' }}>
              <Text style={{ fontSize: 18, color: '#666' }}>+</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Split Method */}
        <View style={{ marginBottom: spacing.lg }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
            <Text style={[typography.utilityTiny, { color: colors.onSurfaceVariant, textTransform: 'uppercase' }]}>Split Method</Text>
            <Text style={[typography.utilityTiny, { color: '#B8721A', textTransform: 'uppercase', fontWeight: 'bold' }]}>Adjust</Text>
          </View>
          <View style={{ flexDirection: 'row', backgroundColor: '#E0E4E8', borderRadius: rounded.md, padding: 4 }}>
            {(['Equal', 'Percentage', 'Shares', 'Exact'] as const).map(method => (
              <TouchableOpacity 
                key={method} 
                onPress={() => setSplitMethod(method)}
                style={{ flex: 1, paddingVertical: 8, alignItems: 'center', backgroundColor: splitMethod === method ? '#B8721A' : 'transparent', borderRadius: rounded.sm }}
              >
                <Text style={[typography.labelSm, { color: splitMethod === method ? '#fff' : '#4A5D4E', fontWeight: splitMethod === method ? 'bold' : 'normal' }]}>{method}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Receipt */}
        <View style={{ marginBottom: spacing.xl }}>
          <Text style={[typography.utilityTiny, { color: colors.onSurfaceVariant, textTransform: 'uppercase', marginBottom: 8 }]}>Receipt</Text>
          <View style={{ flexDirection: 'row', gap: spacing.md }}>
            <TouchableOpacity onPress={handleScanReceipt} style={{ width: 80, height: 80, borderRadius: rounded.md, borderWidth: 2, borderColor: colors.primary, borderStyle: 'dashed', justifyContent: 'center', alignItems: 'center' }}>
              <Text style={{ fontSize: 24, color: colors.primary, marginBottom: 4 }}>📷</Text>
              <Text style={[typography.utilityTiny, { color: colors.primary, fontWeight: 'bold' }]}>Scan</Text>
            </TouchableOpacity>
            <View style={{ width: 80, height: 80, borderRadius: rounded.md, backgroundColor: '#E0E4E8', borderWidth: 1, borderColor: '#ccc', justifyContent: 'center', alignItems: 'center' }}>
              <Text style={{ fontSize: 24, marginBottom: 4 }}>📄</Text>
              <Text style={[typography.utilityTiny, { color: '#4A5D4E', fontWeight: 'bold' }]}>Scanning...</Text>
            </View>
          </View>
        </View>

        {/* Add Expense Button */}
        <TouchableOpacity 
          onPress={handleAddExpense}
          style={{ backgroundColor: '#FF8A00', borderRadius: rounded.md, paddingVertical: 16, alignItems: 'center' }}
        >
          <Text style={[typography.labelLg, { color: '#fff', fontWeight: 'bold' }]}>Add Expense →</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: '#fff'
  }
});
