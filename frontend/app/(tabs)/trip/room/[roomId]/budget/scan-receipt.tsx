import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/core/theme';
import { Button, Card, Badge, LoadingState } from '@/shared/components';

export default function ScanReceiptScreen() {
  const { colors, typography, spacing } = useTheme();
  const router = useRouter();

  const [scanning, setScanning] = useState(false);
  const [extracted, setExtracted] = useState<boolean>(false);

  const handleSimulateScan = () => {
    setScanning(true);
    setTimeout(() => {
      setScanning(false);
      setExtracted(true);
    }, 1200);
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Header */}
      <View style={[styles.header, { paddingHorizontal: spacing.lg, paddingVertical: spacing.md }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={{ fontSize: 20 }}>←</Text>
        </TouchableOpacity>
        <Text style={[typography.headlineSm, { color: colors.onSurface }]}>Scan Receipt OCR</Text>
        <View style={{ width: 32 }} />
      </View>

      <View style={{ padding: spacing.lg, flex: 1 }}>
        {scanning ? (
          <LoadingState message="Mascot is reading line items & prices... 🦉" />
        ) : !extracted ? (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Card style={{ width: '100%', alignItems: 'center', padding: spacing.xl }}>
              <Text style={{ fontSize: 56, marginBottom: spacing.md }}>📷</Text>
              <Text style={[typography.headlineSm, { color: colors.onSurface, textAlign: 'center' }]}>
                Capture Receipt
              </Text>
              <Text
                style={[
                  typography.bodySm,
                  { color: colors.onSurfaceVariant, textAlign: 'center', marginVertical: spacing.md },
                ]}
              >
                Snap a photo or upload a receipt to auto-extract totals and itemized breakdowns.
              </Text>

              <Button
                title="⚡ Simulate Camera OCR Scan"
                onPress={handleSimulateScan}
                variant="primary"
                size="lg"
                style={{ width: '100%' }}
              />
            </Card>
          </View>
        ) : (
          <View style={{ gap: spacing.md }}>
            <Card variant="season">
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Badge label="✅ OCR Extracted" variant="season" />
                <Text style={[typography.labelLg, { color: colors.primary, fontWeight: '800' }]}>
                  ¥14,500 JPY
                </Text>
              </View>
              <Text style={[typography.headlineSm, { color: colors.onSurface, marginTop: spacing.xs }]}>
                Tsukiji Outer Seafood Market
              </Text>
              <Text style={[typography.bodySm, { color: colors.onSurfaceVariant, marginTop: 2 }]}>
                Date: 2026-10-11 • 3 Line Items Detected
              </Text>
            </Card>

            <Card style={{ gap: spacing.xs }}>
              <Text style={[typography.labelLg, { color: colors.onSurface, fontWeight: '700', marginBottom: 4 }]}>
                Extracted Line Items:
              </Text>
              <View style={styles.itemRow}>
                <Text style={[typography.bodySm, { color: colors.onSurface }]}>2x Fatty Tuna Sashimi Bowl</Text>
                <Text style={[typography.bodySm, { color: colors.onSurface, fontWeight: '700' }]}>¥8,000</Text>
              </View>
              <View style={styles.itemRow}>
                <Text style={[typography.bodySm, { color: colors.onSurface }]}>1x Grilled Scallop Set</Text>
                <Text style={[typography.bodySm, { color: colors.onSurface, fontWeight: '700' }]}>¥3,500</Text>
              </View>
              <View style={styles.itemRow}>
                <Text style={[typography.bodySm, { color: colors.onSurface }]}>3x Green Tea & Tamagoyaki</Text>
                <Text style={[typography.bodySm, { color: colors.onSurface, fontWeight: '700' }]}>¥3,000</Text>
              </View>
            </Card>

            <Button
              title="Confirm & Add to Expenses"
              onPress={() => router.back()}
              variant="primary"
              size="lg"
            />
          </View>
        )}
      </View>
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
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
});
