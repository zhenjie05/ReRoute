import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/core/theme';
import { Card, Button } from '@/shared/components';
import { useAuth } from '@/lib/hooks/useAuth';

export default function AppSettingsScreen() {
  const { colors, typography, spacing } = useTheme();
  const { signOut } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut();
    router.replace('/(auth)/login');
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Header */}
      <View style={[styles.header, { paddingHorizontal: spacing.lg, paddingVertical: spacing.md }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={{ fontSize: 20 }}>←</Text>
        </TouchableOpacity>
        <Text style={[typography.headlineSm, { color: colors.onSurface }]}>App Settings</Text>
        <View style={{ width: 32 }} />
      </View>

      <ScrollView contentContainerStyle={{ padding: spacing.lg, paddingBottom: 100 }}>
        {/* Account & Preferences */}
        <Card style={{ marginBottom: spacing.lg }}>
          <Text style={[typography.headlineSm, { color: colors.onSurface, marginBottom: spacing.sm }]}>
            Preferences
          </Text>

          <View style={styles.settingRow}>
            <Text style={[typography.bodyMd, { color: colors.onSurface }]}>🔔 Push Notifications</Text>
            <Text style={[typography.labelSm, { color: colors.primary }]}>Enabled</Text>
          </View>

          <View style={styles.settingRow}>
            <Text style={[typography.bodyMd, { color: colors.onSurface }]}>📍 Location Tracking</Text>
            <Text style={[typography.labelSm, { color: colors.primary }]}>When In Use</Text>
          </View>

          <View style={styles.settingRow}>
            <Text style={[typography.bodyMd, { color: colors.onSurface }]}>🌐 Language & Units</Text>
            <Text style={[typography.labelSm, { color: colors.onSurfaceVariant }]}>English (Metric)</Text>
          </View>
        </Card>

        {/* Legal & Hackathon Info */}
        <Card variant="outlined" style={{ marginBottom: spacing.xl }}>
          <Text style={[typography.labelLg, { color: colors.onSurface, fontWeight: '700' }]}>
            About ReRoute
          </Text>
          <Text style={[typography.bodySm, { color: colors.onSurfaceVariant, marginTop: 4 }]}>
            CodeNection 2026 — Lifestyle Track: Planning an Escape
          </Text>
          <Text style={[typography.utilityTiny, { color: colors.outline, marginTop: 4 }]}>
            Version 1.0.0 (Expo React Native + Supabase)
          </Text>
        </Card>

        {/* Logout Action */}
        <Button
          title="Log Out of ReRoute"
          onPress={handleLogout}
          variant="danger"
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
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#edf1f5',
  },
});
