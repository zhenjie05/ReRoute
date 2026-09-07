import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTheme } from '@/core/theme';
import { Button, Badge, Card } from '@/shared/components';
import { mockSafetyAlerts } from '@/features/route-planning/data/mock-route-planning';

export default function SafetyAlertDetailScreen() {
  const { alertId } = useLocalSearchParams<{ alertId: string }>();
  const { colors, typography, spacing, rounded } = useTheme();
  const router = useRouter();

  const alert = mockSafetyAlerts.find((a) => a.id === alertId) || mockSafetyAlerts[0];

  const handleOpenSource = () => {
    Linking.openURL(alert.source_url).catch(() => {});
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Header */}
      <View style={[styles.header, { paddingHorizontal: spacing.lg, paddingVertical: spacing.md }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={{ fontSize: 20 }}>←</Text>
        </TouchableOpacity>
        <Text style={[typography.headlineSm, { color: colors.onSurface }]}>Safety Advisory</Text>
        <View style={{ width: 32 }} />
      </View>

      <ScrollView contentContainerStyle={{ padding: spacing.lg, paddingBottom: 100 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.sm }}>
          <Badge label={`⚠️ Risk Level: ${alert.risk_level.toUpperCase()}`} variant="warning" />
          <Text style={[typography.utilityTiny, { color: colors.onSurfaceVariant }]}>
            {alert.destination}
          </Text>
        </View>

        <Text style={[typography.headlineLg, { color: colors.onSurface, marginBottom: spacing.md }]}>
          {alert.title}
        </Text>

        {/* Live Weather Snapshot Widget */}
        <Card variant="season" style={{ marginBottom: spacing.lg }}>
          <Text style={[typography.labelSm, { color: colors.season.text, fontWeight: '700', marginBottom: spacing.xs }]}>
            🌤️ Live Weather & Risk Snapshot
          </Text>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: spacing.xs }}>
            <View>
              <Text style={[typography.headlineLg, { color: colors.onSurface }]}>
                {alert.weather_snapshot.temperature_c}°C
              </Text>
              <Text style={[typography.bodySm, { color: colors.onSurfaceVariant }]}>
                {alert.weather_snapshot.condition}
              </Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={[typography.labelSm, { color: colors.onSurface }]}>
                💨 Wind: {alert.weather_snapshot.wind_kmh} km/h
              </Text>
              <Text style={[typography.labelSm, { color: colors.onSurface, marginTop: 4 }]}>
                🌧️ Rain: {alert.weather_snapshot.precipitation_chance}%
              </Text>
            </View>
          </View>
        </Card>

        {/* Summary Details */}
        <Card style={{ marginBottom: spacing.lg }}>
          <Text style={[typography.headlineSm, { color: colors.onSurface, marginBottom: spacing.xs }]}>
            Situation Report
          </Text>
          <Text style={[typography.bodyMd, { color: colors.onSurfaceVariant, lineHeight: 22 }]}>
            {alert.summary}
          </Text>
        </Card>

        {/* Local Emergency Guidance */}
        <Card variant="outlined" style={{ marginBottom: spacing.lg }}>
          <Text style={[typography.labelLg, { color: colors.error, fontWeight: '700', marginBottom: spacing.xs }]}>
            🚨 Local Emergency Dispatch
          </Text>
          <Text style={[typography.bodySm, { color: colors.onSurfaceVariant }]}>
            In case of immediate medical or police assistance in {alert.destination}: dial{' '}
            <Text style={{ fontWeight: '800', color: colors.onSurface }}>{alert.emergency_number}</Text>.
          </Text>
        </Card>

        {/* Official Source Link */}
        <Button
          title={`View on ${alert.source_name} ↗`}
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
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#edf1f5',
  },
  backBtn: {
    padding: 6,
  },
});
