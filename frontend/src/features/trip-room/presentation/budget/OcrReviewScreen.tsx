import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Image, TextInput } from 'react-native';
import { useTheme } from '@/core/theme';
import { Card, Button } from '@/shared/components';
import { useRouter } from 'expo-router';

export const OcrReviewScreen: React.FC<{ roomId: string }> = ({ roomId }) => {
  const { colors, typography, spacing, rounded } = useTheme();
  const router = useRouter();

  const [merchant, setMerchant] = useState('Sakura Izakaya (居酒屋 錦小路 さくら)');
  
  const [items, setItems] = useState([
    { id: '1', name: '生ビール (Draft Beer)', qty: 1, price: 680 },
    { id: '2', name: '枝豆 (Edamame)', qty: 2, price: 450 },
    { id: '3', name: '鶏唐揚げ (Fried Chicken)', qty: 1, price: 780 },
    { id: '4', name: '焼き鳥盛合 (Yakitori Platter)', qty: 1, price: 1200 },
    { id: '5', name: 'ラーメン (Ramen)', qty: 1, price: 980 },
    { id: '6', name: '冷酒 (Chilled Sake)', qty: 1, price: 950 },
  ]);

  const subtotal = items.reduce((sum, item) => sum + item.price * item.qty, 0);
  const tax = Math.round(subtotal * 0.10);
  const total = subtotal + tax;

  const handleDelete = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const handleConfirm = () => {
    // Navigate to OCR Split Setup Screen
    router.push(`/(tabs)/trip/room/${roomId}/budget/ocr-split-setup` as any);
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Header */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: spacing.lg, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' }}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={{ fontSize: 24, color: colors.onSurfaceVariant }}>✕</Text>
        </TouchableOpacity>
        <Text style={[typography.headlineSm, { color: colors.onSurface, fontWeight: 'bold' }]}>Ocr Processing Review</Text>
        <View style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: '#B8721A', justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ color: '#fff', fontSize: 16 }}>🧑</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={{ padding: spacing.lg, paddingBottom: 100 }}>
        
        {/* Banner */}
        <View style={{ flexDirection: 'row', backgroundColor: '#F5F5F5', borderRadius: rounded.lg, padding: spacing.md, alignItems: 'center', marginBottom: spacing.lg }}>
          <View style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: '#EBF4E5', justifyContent: 'center', alignItems: 'center', marginRight: spacing.md }}>
            <Text style={{ fontSize: 16 }}>✨</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[typography.labelLg, { color: colors.onSurface, fontWeight: 'bold' }]}>Auto-Audit Ready</Text>
            <Text style={[typography.bodySm, { color: colors.onSurfaceVariant }]}>Verify against receipt slip</Text>
          </View>
          <View style={{ backgroundColor: '#4A5D4E', borderRadius: rounded.full, paddingHorizontal: 12, paddingVertical: 4 }}>
            <Text style={[typography.utilityTiny, { color: '#fff', fontWeight: 'bold' }]}>✓ 98% Match</Text>
          </View>
        </View>

        {/* Source Receipt */}
        <Card variant="outlined" style={{ padding: spacing.md, marginBottom: spacing.lg, backgroundColor: '#F5F5F5' }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md }}>
            <Text style={[typography.labelLg, { color: colors.onSurface, fontWeight: 'bold' }]}>🧾 Source Receipt</Text>
            <View style={{ backgroundColor: '#E0E0E0', borderRadius: rounded.full, paddingHorizontal: 12, paddingVertical: 4 }}>
              <Text style={[typography.utilityTiny, { color: colors.onSurfaceVariant }]}>🔍 Tap to Inspect</Text>
            </View>
          </View>
          <View style={{ height: 120, backgroundColor: '#D3D3D3', borderRadius: rounded.md, overflow: 'hidden', justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ color: '#666' }}>[Receipt Image Mock]</Text>
            <View style={{ position: 'absolute', bottom: 8, right: 8, backgroundColor: 'rgba(0,0,0,0.6)', borderRadius: rounded.full, paddingHorizontal: 8, paddingVertical: 4 }}>
              <Text style={[typography.utilityTiny, { color: '#fff' }]}>Pinch to zoom & compare</Text>
            </View>
          </View>
        </Card>

        {/* Merchant & Category */}
        <View style={{ marginBottom: spacing.lg }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
            <Text style={[typography.utilityTiny, { color: colors.onSurfaceVariant }]}>Merchant / Store</Text>
            <Text style={[typography.utilityTiny, { color: '#4A5D4E' }]}>Kyoto, Japan</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#F0F0F0', borderRadius: rounded.md, paddingHorizontal: 12, paddingVertical: 8, marginBottom: spacing.md }}>
            <TextInput 
              value={merchant}
              onChangeText={setMerchant}
              style={{ flex: 1, fontSize: 16, color: colors.onSurface }}
            />
            <Text style={{ fontSize: 16 }}>✏️</Text>
          </View>
          
          <Text style={[typography.utilityTiny, { color: colors.onSurfaceVariant, marginBottom: 4 }]}>Expense Category</Text>
          <View style={{ flexDirection: 'row', gap: spacing.sm }}>
            <View style={{ backgroundColor: '#FF8A00', borderRadius: rounded.full, paddingHorizontal: 12, paddingVertical: 6, flexDirection: 'row', alignItems: 'center' }}>
              <Text style={{ marginRight: 4 }}>🍴</Text>
              <Text style={[typography.labelSm, { color: '#fff', fontWeight: 'bold' }]}>Food, Drinks & Dining ✓</Text>
            </View>
            <View style={{ backgroundColor: '#F0F0F0', borderRadius: rounded.full, paddingHorizontal: 12, paddingVertical: 6, flexDirection: 'row', alignItems: 'center' }}>
              <Text style={{ marginRight: 4 }}>🍸</Text>
              <Text style={[typography.labelSm, { color: colors.onSurfaceVariant }]}>Nightlife</Text>
            </View>
          </View>
        </View>

        {/* Extracted Items */}
        <Card variant="outlined" style={{ padding: spacing.md, marginBottom: spacing.lg, backgroundColor: '#F9F9F9' }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md }}>
            <Text style={[typography.labelLg, { color: colors.onSurface, fontWeight: 'bold' }]}>🧾 Extracted Items</Text>
            <View style={{ backgroundColor: '#E0E0E0', borderRadius: rounded.full, paddingHorizontal: 8, paddingVertical: 2 }}>
              <Text style={[typography.utilityTiny, { color: colors.onSurfaceVariant }]}>{items.length} items</Text>
            </View>
          </View>

          <View style={{ gap: spacing.sm }}>
            {items.map(item => (
              <View key={item.id} style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fff', borderRadius: rounded.md, padding: spacing.md }}>
                <View style={{ flex: 1 }}>
                  <Text style={[typography.labelSm, { color: colors.onSurface }]}>{item.name}</Text>
                  <Text style={[typography.utilityTiny, { color: colors.onSurfaceVariant }]}>Qty: {item.qty}</Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
                  <View style={{ backgroundColor: '#F5F5F5', borderRadius: rounded.sm, paddingHorizontal: 12, paddingVertical: 4 }}>
                    <Text style={[typography.labelSm, { color: colors.onSurface }]}>¥{item.price}</Text>
                  </View>
                  <TouchableOpacity onPress={() => handleDelete(item.id)}>
                    <Text style={{ fontSize: 16, color: colors.onSurfaceVariant }}>🗑️</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>

          <TouchableOpacity style={{ marginTop: spacing.md, backgroundColor: '#F0F0F0', borderRadius: rounded.md, paddingVertical: 12, alignItems: 'center' }}>
            <Text style={[typography.labelSm, { color: '#B8721A', fontWeight: 'bold' }]}>⊕ + Add Missing Line Item</Text>
          </TouchableOpacity>
        </Card>

        {/* Financial Summary */}
        <Card variant="outlined" style={{ padding: spacing.md, marginBottom: spacing.lg }}>
           <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md }}>
             <Text style={[typography.headlineSm, { color: colors.onSurface, fontWeight: 'bold' }]}>Financial Summary</Text>
             <Text style={[typography.utilityTiny, { color: colors.onSurfaceVariant }]}>JPY (¥)</Text>
           </View>

           <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.sm }}>
             <Text style={[typography.labelSm, { color: colors.onSurfaceVariant }]}>Subtotal</Text>
             <View style={{ flexDirection: 'row', alignItems: 'center' }}>
               <Text style={[typography.labelSm, { color: colors.onSurfaceVariant, marginRight: 8 }]}>¥</Text>
               <View style={{ backgroundColor: '#F0F0F0', borderRadius: rounded.sm, paddingHorizontal: 12, paddingVertical: 4, width: 80, alignItems: 'flex-end' }}>
                 <Text style={[typography.labelSm, { color: colors.onSurface }]}>{subtotal.toLocaleString()}</Text>
               </View>
             </View>
           </View>

           <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md }}>
             <View style={{ flexDirection: 'row', alignItems: 'center' }}>
               <Text style={[typography.labelSm, { color: colors.onSurfaceVariant, marginRight: 8 }]}>Tax</Text>
               <View style={{ backgroundColor: '#E0E0E0', borderRadius: rounded.sm, paddingHorizontal: 6, paddingVertical: 2 }}>
                 <Text style={[typography.utilityTiny, { color: colors.onSurfaceVariant }]}>10%</Text>
               </View>
             </View>
             <View style={{ flexDirection: 'row', alignItems: 'center' }}>
               <Text style={[typography.labelSm, { color: colors.onSurfaceVariant, marginRight: 8 }]}>¥</Text>
               <View style={{ backgroundColor: '#F0F0F0', borderRadius: rounded.sm, paddingHorizontal: 12, paddingVertical: 4, width: 80, alignItems: 'flex-end' }}>
                 <Text style={[typography.labelSm, { color: colors.onSurface }]}>{tax.toLocaleString()}</Text>
               </View>
             </View>
           </View>

           <View style={{ backgroundColor: '#B8721A', borderRadius: rounded.md, padding: spacing.md, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
             <View>
               <Text style={[typography.utilityTiny, { color: '#fff', textTransform: 'uppercase' }]}>Total Amount</Text>
               <Text style={[typography.utilityTiny, { color: 'rgba(255,255,255,0.8)' }]}>Converted: ~RM144</Text>
             </View>
             <Text style={[typography.headlineLg, { color: '#fff', fontWeight: 'bold' }]}>¥{total.toLocaleString()}</Text>
           </View>
        </Card>

        {/* Confirm Button */}
        <TouchableOpacity 
          onPress={handleConfirm}
          style={{ backgroundColor: '#FF8A00', borderRadius: rounded.md, paddingVertical: 16, alignItems: 'center' }}
        >
          <Text style={[typography.labelLg, { color: '#fff', fontWeight: 'bold' }]}>Confirm Extracted Data →</Text>
        </TouchableOpacity>

      </ScrollView>
    </View>
  );
};
