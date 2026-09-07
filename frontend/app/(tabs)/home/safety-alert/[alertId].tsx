import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTheme } from '@/core/theme';
import { Button, Badge, Card } from '@/shared/components';
import { mockSafetyAlerts } from '@/features/route-planning/data/mock-route-planning';

export default function SafetyAlertDetailScreen() {
  const { alertId } = useLocalSearchParams<{ alertId: string }>();
  const { colors, typography, spacing, rounded, shadows } = useTheme();
  const router = useRouter();

  const alert = mockSafetyAlerts.find((a) => a.id === alertId) || mockSafetyAlerts[0];

  const handleOpenSource = () => {
    Linking.openURL(alert.source_url).catch(() => {});
  };

  const handleCallEmergency = () => {
    const num = alert.emergency_number.split('/')[0].trim();
    Linking.openURL(`tel:${num}`).catch(() => {});
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Header Bar */}
      <View
        style={[
          styles.header,
          {
            backgroundColor: colors.surface,
            borderBottomColor: colors.surfaceContainerHigh,
            paddingHorizontal: spacing.lg,
            paddingVertical: spacing.md,
            ...shadows.soft,
          },
        ]}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          style={styles.backBtn}
        >
          <Text style={{ fontSize: 20, color: colors.onSurface }}>←</Text>
        </TouchableOpacity>
        <Text style={[typography.headlineSm, { color: colors.onSurface, fontWeight: '800' }]}>
          Safety & Weather Advisory
        </Text>
        <View style={{ width: 32 }} />
      </View>

      <ScrollView contentContainerStyle={{ padding: spacing.lg, paddingBottom: 100 }}>
        <View style={styles.badgeRow}>
          <Badge
            label={`⚠️ Risk: ${alert.risk_level.toUpperCase()}`}
            variant={alert.risk_level === 'high' ? 'error' : 'warning'}
          />
          <Text style={[typography.labelSm, { color: colors.outline, fontWeight: '700' }]}>
            📍 {alert.destination}
          </Text>
        </View>

        <Text style={[typography.headlineMd, { color: colors.onSurface, marginVertical: spacing.sm, fontWeight: '800' }]}>
          {alert.title}
        </Text>

        {/* Live Weather Snapshot Widget */}
        <Card variant="season" style={{ marginBottom: spacing.md }}>
          <Text style={[typography.labelSm, { color: colors.season.text, fontWeight: '800', marginBottom: spacing.xs }]}>
            🌤️ Live Weather & Risk Snapshot
          </Text>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: spacing.xs }}>
            <View>
              <Text style={[typography.headlineLg, { color: colors.onSurface, fontWeight: '900' }]}>
                {alert.weather_snapshot.temperature_c}°C
              </Text>
              <Text style={[typography.bodySm, { color: colors.onSurfaceVariant }]}>
                {alert.weather_snapshot.condition}
              </Text>
            </View>
            <View style={{ alignItems: 'flex-end', gap: 4 }}>
              <Text style={[typography.labelSm, { color: colors.onSurface }]}>
                💨 Wind: {alert.weather_snapshot.wind_kmh} km/h
              </Text>
              <Text style={[typography.labelSm, { color: colors.onSurface }]}>
                🌧️ Precipitation: {alert.weather_snapshot.precipitation_chance}%
              </Text>
            </View>
          </View>
        </Card>

        {/* Situation Report */}
        <Card style={{ marginBottom: spacing.md }}>
          <Text style={[typography.headlineSm, { color: colors.onSurface, fontWeight: '800', marginBottom: spacing.xs }]}>
            Situation Report
          </Text>
          <Text style={[typography.bodyMd, { color: colors.onSurfaceVariant, lineHeight: 22 }]}>
            {alert.summary}
          </Text>
        </Card>

        {/* Local Emergency Dispatch */}
        <Card variant="outlined" style={{ marginBottom: spacing.lg, borderColor: colors.error }}>
          <View style={styles.emergencyHeader}>
            <Text style={{ fontSize: 20 }}>🚨</Text>
            <Text style={[typography.labelLg, { color: colors.error, fontWeight: '800', marginLeft: 6 }]}>
              Local Emergency Hotlines
            </Text>
          </View>
          <Text style={[typography.bodySm, { color: colors.onSurfaceVariant, marginVertical: spacing.xs }]}>
            If you need immediate assistance in {alert.destination}:
          </Text>
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={handleCallEmergency}
            style={[
              styles.callBtn,
              {
                backgroundColor: colors.error,
                borderRadius: rounded.xl,
                paddingVertical: spacing.sm,
              },
            ]}
          >
            <Text style={[typography.labelSm, { color: '#ffffff', fontWeight: '800', textAlign: 'center' }]}>
              📞 Dial Local Hotline ({alert.emergency_number})
            </Text>
          </TouchableOpacity>
        </Card>

        {/* Official Source Link */}
        <Button
          title={`View Official Advisory on ${alert.source_name} ↗`}
          onPress={handleOpenSource}
          variant="outline"
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
    borderBottomWidth: 1,
  },
  backBtn: {
    padding: 6,
  },
  badgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  emergencyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  callBtn: {
    marginTop: 8,
  },
});
