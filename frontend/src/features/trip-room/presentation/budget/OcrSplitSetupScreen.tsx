import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useTheme } from '@/core/theme';
import { Card } from '@/shared/components';
import { useRouter } from 'expo-router';

export const OcrSplitSetupScreen: React.FC<{ roomId: string }> = ({ roomId }) => {
  const { colors, typography, spacing, rounded } = useTheme();
  const router = useRouter();

  const [splitMethod, setSplitMethod] = useState<'Equal' | '%' | 'Shares' | 'Exact'>('Equal');

  const handleSave = () => {
    // Return to dashboard
    router.push(`/(tabs)/trip/room/${roomId}/budget` as any);
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Header */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: spacing.lg, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' }}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={{ fontSize: 24, color: colors.onSurfaceVariant }}>✕</Text>
        </TouchableOpacity>
        <Text style={[typography.headlineSm, { color: colors.onSurface, fontWeight: 'bold' }]}>Split Item Assignment</Text>
        <View style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: '#B8721A', justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ color: '#fff', fontSize: 16 }}>🧑</Text>
        </View>
      </View>

      {/* Tabs */}
      <View style={{ flexDirection: 'row', paddingHorizontal: spacing.lg, paddingTop: spacing.md }}>
        <View style={{ flex: 1, flexDirection: 'row', backgroundColor: '#E0E4E8', borderRadius: rounded.full, padding: 4 }}>
          <View style={{ flex: 1, backgroundColor: '#fff', borderRadius: rounded.full, paddingVertical: 8, alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.1, shadowOffset: { width: 0, height: 2 }, shadowRadius: 4, elevation: 2 }}>
            <Text style={[typography.labelSm, { color: '#B8721A', fontWeight: 'bold' }]}>✓ OCR Success</Text>
          </View>
          <View style={{ flex: 1, borderRadius: rounded.full, paddingVertical: 8, alignItems: 'center' }}>
            <Text style={[typography.labelSm, { color: colors.onSurfaceVariant }]}>! Simulate Error Sheet</Text>
          </View>
        </View>
      </View>

      <ScrollView contentContainerStyle={{ padding: spacing.lg, paddingBottom: 100 }}>
        
        {/* Banner */}
        <View style={{ flexDirection: 'row', backgroundColor: '#D4E8D4', borderRadius: rounded.lg, padding: spacing.md, alignItems: 'center', marginBottom: spacing.lg, justifyContent: 'space-between' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={{ width: 24, height: 24, borderRadius: 12, backgroundColor: '#2C5A2E', justifyContent: 'center', alignItems: 'center', marginRight: spacing.sm }}>
              <Text style={{ color: '#fff', fontSize: 12, fontWeight: 'bold' }}>✓</Text>
            </View>
            <View>
              <Text style={[typography.labelSm, { color: '#2C5A2E', fontWeight: 'bold' }]}>Receipt Verified Successfully!</Text>
              <Text style={[typography.utilityTiny, { color: '#2C5A2E' }]}>¥5,544 JPY recorded from Sakura Izakaya</Text>
            </View>
          </View>
          <Text style={{ color: '#2C5A2E', fontSize: 18 }}>{'<'}</Text>
        </View>

        {/* Detail Card */}
        <Card variant="outlined" style={{ padding: spacing.md, marginBottom: spacing.lg, backgroundColor: '#fff' }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: spacing.md }}>
            <View>
              <View style={{ backgroundColor: '#F0F0F0', borderRadius: rounded.full, paddingHorizontal: 10, paddingVertical: 4, alignSelf: 'flex-start', marginBottom: 8 }}>
                <Text style={[typography.utilityTiny, { color: colors.onSurfaceVariant }]}>🍴 Dining & Izakaya</Text>
              </View>
              <Text style={[typography.headlineSm, { color: colors.onSurface, fontWeight: 'bold' }]}>Sakura Izakaya</Text>
              <Text style={[typography.utilityTiny, { color: colors.onSurfaceVariant, marginTop: 4 }]}>📅 Oct 26, 2024 • Kyoto, Japan</Text>
            </View>
            <View style={{ width: 60, height: 60, backgroundColor: '#D3D3D3', borderRadius: rounded.md, overflow: 'hidden' }}>
               {/* Mock image */}
               <View style={{ flex: 1, backgroundColor: '#A0A0A0' }} />
               <View style={{ position: 'absolute', bottom: -5, right: -5, backgroundColor: '#B8721A', borderRadius: 10, width: 20, height: 20, justifyContent: 'center', alignItems: 'center' }}>
                  <Text style={{ color: '#fff', fontSize: 10 }}>🔍</Text>
               </View>
            </View>
          </View>

          <View style={{ flexDirection: 'row', justifyContent: 'space-between', borderTopWidth: 1, borderTopColor: '#F0F0F0', paddingTop: spacing.md, marginBottom: spacing.md }}>
            <View>
              <Text style={[typography.utilityTiny, { color: colors.onSurfaceVariant, textTransform: 'uppercase' }]}>Total Amount</Text>
              <Text style={[typography.headlineSm, { color: '#B8721A', fontWeight: 'bold' }]}>¥5,544 <Text style={{ fontSize: 12 }}>JPY</Text></Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={[typography.utilityTiny, { color: colors.onSurfaceVariant, textTransform: 'uppercase' }]}>Tax Included (10%)</Text>
              <Text style={[typography.labelLg, { color: colors.onSurface, fontWeight: 'bold' }]}>¥504 JPY</Text>
            </View>
          </View>

          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTopWidth: 1, borderTopColor: '#F0F0F0', paddingTop: spacing.md }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
               <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: '#FF8A00', justifyContent: 'center', alignItems: 'center', marginRight: spacing.sm }}>
                 <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 14 }}>AC</Text>
               </View>
               <View>
                 <Text style={[typography.utilityTiny, { color: colors.onSurfaceVariant }]}>Paid by</Text>
                 <Text style={[typography.labelSm, { color: colors.onSurface, fontWeight: 'bold' }]}>Alex Chen (You)</Text>
               </View>
            </View>
            <View style={{ backgroundColor: '#E0E0E0', borderRadius: rounded.full, paddingHorizontal: 12, paddingVertical: 6 }}>
              <Text style={[typography.utilityTiny, { color: colors.onSurfaceVariant, fontWeight: 'bold' }]}>Change</Text>
            </View>
          </View>
        </Card>

        {/* Split Expense */}
        <Card variant="outlined" style={{ padding: spacing.md, marginBottom: spacing.xl, backgroundColor: '#F9F9F9' }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md }}>
            <View>
               <Text style={[typography.headlineSm, { color: colors.onSurface, fontWeight: 'bold' }]}>Split Expense</Text>
               <Text style={[typography.utilityTiny, { color: colors.onSurfaceVariant }]}>4 travelers in Kyoto Room</Text>
            </View>
            <View style={{ backgroundColor: '#D4E8D4', borderRadius: rounded.full, paddingHorizontal: 10, paddingVertical: 4 }}>
               <Text style={[typography.utilityTiny, { color: '#2C5A2E', fontWeight: 'bold' }]}>4 Active</Text>
            </View>
          </View>

          {/* Split Method Tabs */}
          <View style={{ flexDirection: 'row', backgroundColor: '#E0E4E8', borderRadius: rounded.md, padding: 4, marginBottom: spacing.md }}>
            {(['Equal', '%', 'Shares', 'Exact'] as const).map(method => (
              <TouchableOpacity 
                key={method} 
                onPress={() => setSplitMethod(method)}
                style={{ flex: 1, paddingVertical: 8, alignItems: 'center', backgroundColor: splitMethod === method ? '#fff' : 'transparent', borderRadius: rounded.sm, shadowColor: splitMethod === method ? '#000' : 'transparent', shadowOpacity: 0.1, shadowOffset: { width: 0, height: 1 }, shadowRadius: 2, elevation: splitMethod === method ? 1 : 0 }}
              >
                <Text style={[typography.labelSm, { color: splitMethod === method ? '#B8721A' : '#4A5D4E', fontWeight: splitMethod === method ? 'bold' : 'normal' }]}>{method}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Members List */}
          <View style={{ gap: spacing.sm, marginBottom: spacing.md }}>
             <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#F0F0F0', padding: spacing.sm, borderRadius: rounded.md }}>
               <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: '#FF8A00', justifyContent: 'center', alignItems: 'center', marginRight: spacing.sm }}>
                     <Text style={{ color: '#fff', fontWeight: 'bold' }}>AC</Text>
                     <View style={{ position: 'absolute', bottom: -2, right: -2, backgroundColor: '#2C5A2E', borderRadius: 8, width: 16, height: 16, justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={{ color: '#fff', fontSize: 10 }}>✓</Text>
                     </View>
                  </View>
                  <View>
                     <Text style={[typography.labelSm, { color: colors.onSurface, fontWeight: 'bold' }]}>Alex Chen <Text style={{ color: '#B8721A' }}>(You)</Text></Text>
                     <Text style={[typography.utilityTiny, { color: colors.onSurfaceVariant }]}>Payer • 1 share (25%)</Text>
                  </View>
               </View>
               <View style={{ alignItems: 'flex-end' }}>
                 <Text style={[typography.labelLg, { color: colors.onSurface, fontWeight: 'bold' }]}>¥1,386</Text>
                 <Text style={[typography.utilityTiny, { color: colors.onSurfaceVariant }]}>JPY</Text>
               </View>
             </View>

             <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#F0F0F0', padding: spacing.sm, borderRadius: rounded.md }}>
               <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: '#FFB6C1', justifyContent: 'center', alignItems: 'center', marginRight: spacing.sm }}>
                     <Text style={{ color: '#C2185B', fontWeight: 'bold' }}>SJ</Text>
                  </View>
                  <View>
                     <Text style={[typography.labelSm, { color: colors.onSurface, fontWeight: 'bold' }]}>Sarah Jenkins</Text>
                     <Text style={[typography.utilityTiny, { color: colors.onSurfaceVariant }]}>1 share (25%)</Text>
                  </View>
               </View>
               <View style={{ alignItems: 'flex-end' }}>
                 <Text style={[typography.labelLg, { color: colors.onSurface, fontWeight: 'bold' }]}>¥1,386</Text>
                 <Text style={[typography.utilityTiny, { color: colors.onSurfaceVariant }]}>JPY</Text>
               </View>
             </View>

             <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#E0E0E0', padding: spacing.sm, borderRadius: rounded.md }}>
               <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: '#C8E6C9', justifyContent: 'center', alignItems: 'center', marginRight: spacing.sm }}>
                     <Text style={{ color: '#2E7D32', fontWeight: 'bold' }}>KS</Text>
                  </View>
                  <View>
                     <Text style={[typography.labelSm, { color: colors.onSurface, fontWeight: 'bold' }]}>Kenji Sato</Text>
                     <Text style={[typography.utilityTiny, { color: colors.onSurfaceVariant }]}>1 share (25%)</Text>
                  </View>
               </View>
               <View style={{ alignItems: 'flex-end' }}>
                 <Text style={[typography.labelLg, { color: colors.onSurface, fontWeight: 'bold' }]}>¥1,386</Text>
                 <Text style={[typography.utilityTiny, { color: colors.onSurfaceVariant }]}>JPY</Text>
               </View>
             </View>

             <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#F0F0F0', padding: spacing.sm, borderRadius: rounded.md }}>
               <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: '#CFD8DC', justifyContent: 'center', alignItems: 'center', marginRight: spacing.sm }}>
                     <Text style={{ color: '#455A64', fontWeight: 'bold' }}>ER</Text>
                  </View>
                  <View>
                     <Text style={[typography.labelSm, { color: colors.onSurface, fontWeight: 'bold' }]}>Elena Rostova</Text>
                     <Text style={[typography.utilityTiny, { color: colors.onSurfaceVariant }]}>1 share (25%)</Text>
                  </View>
               </View>
               <View style={{ alignItems: 'flex-end' }}>
                 <Text style={[typography.labelLg, { color: colors.onSurface, fontWeight: 'bold' }]}>¥1,386</Text>
                 <Text style={[typography.utilityTiny, { color: colors.onSurfaceVariant }]}>JPY</Text>
               </View>
             </View>
          </View>

          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: spacing.xs }}>
             <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={{ color: '#B8721A', marginRight: 4 }}>👤+</Text>
                <Text style={[typography.labelSm, { color: '#B8721A', fontWeight: 'bold' }]}>Add Traveler</Text>
             </TouchableOpacity>
             <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={{ color: '#2C5A2E', marginRight: 4 }}>🔓</Text>
                <Text style={[typography.utilityTiny, { color: colors.onSurfaceVariant }]}>Exact match (¥5,544)</Text>
             </View>
          </View>

        </Card>

        {/* Confirm Button */}
        <TouchableOpacity 
          onPress={handleSave}
          style={{ backgroundColor: '#FF8A00', borderRadius: rounded.md, paddingVertical: 16, alignItems: 'center' }}
        >
          <Text style={[typography.labelLg, { color: '#fff', fontWeight: 'bold' }]}>Save Expense & Split with Group →</Text>
        </TouchableOpacity>

      </ScrollView>
    </View>
  );
};
