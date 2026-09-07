import React, { useState } from 'react';
import { View, Text, ScrollView, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTheme } from '@/core/theme';
import { Card, Badge } from '@/shared/components';
import { mockLandmarks } from '@/features/route-planning/data/mock-route-planning';

export default function LandmarkDetailScreen() {
  const { landmarkId } = useLocalSearchParams<{ landmarkId: string }>();
  const { colors, typography, spacing } = useTheme();
  const router = useRouter();

  const landmark = mockLandmarks.find((l) => l.id === landmarkId) || mockLandmarks[0];

  // If model_asset_url exists, user can switch between 'photos' and '3d'; otherwise tab is completely hidden (FR-1-7)
  const has3D = !!landmark.model_asset_url;
  const [activeTab, setActiveTab] = useState<'photos' | '3d'>('photos');

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Header */}
      <View style={[styles.header, { paddingHorizontal: spacing.lg, paddingVertical: spacing.md }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={{ fontSize: 20 }}>←</Text>
        </TouchableOpacity>
        <Text style={[typography.headlineSm, { color: colors.onSurface }]}>{landmark.name}</Text>
        <View style={{ width: 32 }} />
      </View>

      {/* Tab Switcher: Rendered ONLY if 3D model is available (FR-1-7) */}
      {has3D ? (
        <View style={[styles.tabBar, { backgroundColor: '#ffffff', borderBottomColor: colors.cardBorder }]}>
          <TouchableOpacity
            onPress={() => setActiveTab('photos')}
            style={[
              styles.tabBtn,
              activeTab === 'photos' && { borderBottomColor: colors.primary, borderBottomWidth: 3 },
            ]}
          >
            <Text
              style={[
                typography.labelLg,
                { color: activeTab === 'photos' ? colors.primary : colors.onSurfaceVariant, fontWeight: '700' },
              ]}
            >
              📷 Photos & Info
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setActiveTab('3d')}
            style={[
              styles.tabBtn,
              activeTab === '3d' && { borderBottomColor: colors.primary, borderBottomWidth: 3 },
            ]}
          >
            <Text
              style={[
                typography.labelLg,
                { color: activeTab === '3d' ? colors.primary : colors.onSurfaceVariant, fontWeight: '700' },
              ]}
            >
              🧊 3D Viewer
            </Text>
          </TouchableOpacity>
        </View>
      ) : null}

      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        {activeTab === '3d' && has3D ? (
          // 3D Model Interactive Viewer Simulation
          <View style={{ padding: spacing.lg }}>
            <Card style={{ height: 320, alignItems: 'center', justifyContent: 'center', backgroundColor: '#0a0f11' }}>
              <Text style={{ fontSize: 56 }}>🏛️</Text>
              <Text style={[typography.headlineSm, { color: '#ffffff', marginTop: spacing.md }]}>
                Interactive 3D Landmark Model
              </Text>
              <Text style={[typography.bodySm, { color: '#999ea0', marginTop: 4, textAlign: 'center' }]}>
                Touch to rotate 360° • Pinch to zoom architectural details
              </Text>
              <Badge label="WebGL GLTF Asset" variant="season" style={{ marginTop: spacing.lg }} />
            </Card>
          </View>
        ) : (
          // Photos & Practical Info (Default)
          <>
            <Image source={{ uri: landmark.photo_urls[0] }} style={{ width: '100%', height: 220 }} />

            <View style={{ padding: spacing.lg }}>
              <Text style={[typography.headlineLg, { color: colors.onSurface }]}>
                {landmark.name}
              </Text>
              <Text style={[typography.bodySm, { color: colors.onSurfaceVariant, marginTop: 2, marginBottom: spacing.lg }]}>
                📍 {landmark.destination} • Coordinates ({landmark.lat.toFixed(4)}, {landmark.lng.toFixed(4)})
              </Text>

              {/* Exact Drop-off Point Card (FR-1-7) */}
              <Card
                variant="season"
                style={{
                  marginBottom: spacing.lg,
                  borderLeftWidth: 4,
                  borderLeftColor: colors.season.main,
                }}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                  <Text style={{ fontSize: 18 }}>🚖</Text>
                  <Text style={[typography.labelLg, { color: colors.season.text, fontWeight: '800' }]}>
                    Exact Drop-off Point
                  </Text>
                </View>
                <Text style={[typography.labelSm, { color: colors.onSurface, fontWeight: '700' }]}>
                  {landmark.dropoff_point.name}
                </Text>
                <Text style={[typography.bodySm, { color: colors.onSurfaceVariant, marginTop: 4 }]}>
                  {landmark.dropoff_point.notes}
                </Text>
              </Card>

              {/* Landmark History & Overview */}
              <Card style={{ marginBottom: spacing.lg }}>
                <Text style={[typography.headlineSm, { color: colors.onSurface, marginBottom: spacing.xs }]}>
                  History & Overview
                </Text>
                <Text style={[typography.bodyMd, { color: colors.onSurfaceVariant, lineHeight: 22 }]}>
                  {landmark.info_text}
                </Text>
              </Card>

              {/* Fun Facts Accordion */}
              <Card variant="outlined">
                <Text style={[typography.headlineSm, { color: colors.onSurface, marginBottom: spacing.sm }]}>
                  💡 Fun Facts & Tips
                </Text>
                {landmark.fun_facts.map((fact, i) => (
                  <Text
                    key={i}
                    style={[
                      typography.bodySm,
                      { color: colors.onSurfaceVariant, marginBottom: 6, lineHeight: 18 },
                    ]}
                  >
                    • {fact}
                  </Text>
                ))}
              </Card>
            </View>
          </>
        )}
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
  tabBar: {
    flexDirection: 'row',
    borderBottomWidth: 1,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
