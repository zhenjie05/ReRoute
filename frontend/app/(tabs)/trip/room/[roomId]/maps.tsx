import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTheme } from '@/core/theme';
import { Button, Card, Badge } from '@/shared/components';
import { mockLandmarks } from '@/features/route-planning/data/mock-route-planning';
import { mockTripMembers } from '@/features/trip-room/data/mock-trip-room';

export default function TripMapsScreen() {
  const { roomId } = useLocalSearchParams<{ roomId: string }>();
  const { colors, typography, spacing, rounded, shadows } = useTheme();
  const router = useRouter();

  const [liveLocationEnabled, setLiveLocationEnabled] = useState(true);
  const [isRerouting, setIsRerouting] = useState(false);
  const [rerouteSuccess, setRerouteSuccess] = useState(false);

  const handleReroute = () => {
    setIsRerouting(true);
    setTimeout(() => {
      setIsRerouting(false);
      setRerouteSuccess(true);
      setTimeout(() => setRerouteSuccess(false), 3000);
    }, 1000);
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Map Canvas Simulated Viewport */}
      <View style={styles.mapCanvas}>
        <View style={[styles.mapPlaceholder, { backgroundColor: colors.surfaceContainer }]}>
          <Text style={{ fontSize: 32, marginBottom: 8 }}>🗺️</Text>
          <Text style={[typography.headlineSm, { color: colors.onSurface }]}>
            Tokyo City Route Map
          </Text>
          <Text style={[typography.bodySm, { color: colors.onSurfaceVariant, marginTop: 4 }]}>
            Google Maps Directions & Stop Markers
          </Text>

          {/* Live Member Pin Simulators (FR-2-8) */}
          {liveLocationEnabled ? (
            <View style={styles.memberPinArea}>
              {mockTripMembers.map((m, idx) => (
                <View
                  key={m.user_id}
                  style={[
                    styles.memberPin,
                    {
                      backgroundColor: colors.primary,
                      borderRadius: rounded.full,
                      borderColor: '#ffffff',
                      borderWidth: 2,
                    },
                  ]}
                >
                  <Text style={[typography.utilityTiny, { color: '#ffffff', fontWeight: '800' }]}>
                    {m.user?.name.slice(0, 1)}
                  </Text>
                </View>
              ))}
            </View>
          ) : null}
        </View>

        {/* Floating Map Controls */}
        <View style={styles.mapControls}>
          {/* Reroute Action Button (FR-1-6) */}
          <Button
            title={isRerouting ? 'Recalculating...' : '🔄 Reroute'}
            onPress={handleReroute}
            loading={isRerouting}
            variant="primary"
            size="sm"
            style={{ ...shadows.medium }}
          />

          {/* Live Member Location Toggle (FR-2-8) */}
          <TouchableOpacity
            onPress={() => setLiveLocationEnabled(!liveLocationEnabled)}
            style={[
              styles.controlBtn,
              {
                backgroundColor: liveLocationEnabled ? colors.season.soft : colors.card,
                borderColor: liveLocationEnabled ? colors.season.main : colors.cardBorder,
                borderRadius: rounded.lg,
                ...shadows.soft,
              },
            ]}
          >
            <Text style={[typography.labelSm, { color: colors.onSurface, fontWeight: '600' }]}>
              {liveLocationEnabled ? '📍 Group GPS: ON' : '📍 Group GPS: OFF'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Reroute Success Toast */}
      {rerouteSuccess ? (
        <View
          style={[
            styles.toast,
            { backgroundColor: colors.successContainer, borderRadius: rounded.md, padding: spacing.md },
          ]}
        >
          <Text style={[typography.labelSm, { color: colors.success, fontWeight: '700' }]}>
            ✅ Route & ETAs updated live! Shaved 14 mins off transit.
          </Text>
        </View>
      ) : null}

      {/* Route Legs & Landmark Pins */}
      <ScrollView contentContainerStyle={{ padding: spacing.lg, paddingBottom: 100 }}>
        <Text style={[typography.headlineSm, { color: colors.onSurface, marginBottom: spacing.md }]}>
          Today's Route Legs & Stops
        </Text>

        <View style={{ gap: spacing.md }}>
          {mockLandmarks.map((landmark, index) => (
            <Card
              key={landmark.id}
              variant="outlined"
              onPress={() => router.push(`/(tabs)/trip/room/${roomId}/landmark/${landmark.id}` as any)}
            >
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <Badge label={`Stop #${index + 1}`} variant="season" />
                  <Text style={[typography.labelSm, { color: colors.primary, fontWeight: '700' }]}>
                    ETA: 15 mins leg
                  </Text>
                </View>
                {landmark.model_asset_url ? <Badge label="3D Model Available" variant="outline" /> : null}
              </View>

              <Text style={[typography.headlineSm, { color: colors.onSurface, marginTop: spacing.xs }]}>
                {landmark.name}
              </Text>
              <Text style={[typography.bodySm, { color: colors.onSurfaceVariant, marginTop: 2 }]}>
                Drop-off: {landmark.dropoff_point.name}
              </Text>
              <Text style={[typography.labelSm, { color: colors.primary, marginTop: spacing.sm, fontWeight: '700' }]}>
                View Landmark Details & Drop-off Info →
              </Text>
            </Card>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  mapCanvas: {
    height: 230,
    position: 'relative',
  },
  mapPlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapControls: {
    position: 'absolute',
    top: 12,
    right: 12,
    flexDirection: 'row',
    gap: 8,
  },
  controlBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  memberPinArea: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 12,
  },
  memberPin: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toast: {
    margin: 16,
    marginBottom: 0,
  },
});
