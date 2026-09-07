import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Switch } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTheme } from '@/core/theme';
import { Card, Badge, Button } from '@/shared/components';
import { mockTripRooms } from '@/features/trip-room/data/mock-trip-room';
import { useLiveTrip } from '@/lib/hooks/useLiveTrip';

export default function RoomSettingsScreen() {
  const { roomId } = useLocalSearchParams<{ roomId: string }>();
  const { colors, typography, spacing, rounded } = useTheme();
  const router = useRouter();
  const { startTrip, endTrip } = useLiveTrip();

  const room = mockTripRooms.find((r) => r.id === roomId) || mockTripRooms[0];
  const [isPublic, setIsPublic] = useState(room.is_public);
  const [stage, setStage] = useState(room.stage);

  const handleStartTrip = () => {
    setStage('active');
    startTrip({ ...room, stage: 'active' });
  };

  const handleArchiveTrip = () => {
    setStage('archived');
    endTrip();
    router.replace('/(tabs)/trip' as any);
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Header */}
      <View style={[styles.header, { paddingHorizontal: spacing.lg, paddingVertical: spacing.md }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={{ fontSize: 20 }}>←</Text>
        </TouchableOpacity>
        <Text style={[typography.headlineSm, { color: colors.onSurface }]}>Room Settings</Text>
        <View style={{ width: 32 }} />
      </View>

      <ScrollView contentContainerStyle={{ padding: spacing.lg, paddingBottom: 100 }}>
        {/* Trip Stage Management & Owner Start Trip Action (FR-2-2a, FR-2-10a) */}
        <Card variant="season" style={{ marginBottom: spacing.lg }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={[typography.labelLg, { color: colors.season.text, fontWeight: '800' }]}>
              Current Stage
            </Text>
            <Badge label={stage.toUpperCase()} variant={stage === 'active' ? 'season' : 'outline'} />
          </View>
          <Text style={[typography.bodySm, { color: colors.onSurfaceVariant, marginTop: 4, marginBottom: spacing.md }]}>
            Owner-initiated transition sets this room live and enables global emergency SOS across the app.
          </Text>

          {stage === 'planning' ? (
            <Button
              title="🚀 Start Trip (Set Live)"
              onPress={handleStartTrip}
              variant="primary"
              size="lg"
            />
          ) : stage === 'active' ? (
            <Button
              title="📦 Archive Trip"
              onPress={handleArchiveTrip}
              variant="outline"
              size="md"
            />
          ) : (
            <Text style={[typography.labelSm, { color: colors.onSurfaceVariant }]}>
              This trip is archived.
            </Text>
          )}
        </Card>

        {/* Public Sharing Toggle (FR-2-10a, FR-8-3) */}
        <Card style={{ marginBottom: spacing.lg }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <View style={{ flex: 1, paddingRight: spacing.md }}>
              <Text style={[typography.labelLg, { color: colors.onSurface, fontWeight: '700' }]}>
                Share to Discover Feed 🌏
              </Text>
              <Text style={[typography.bodySm, { color: colors.onSurfaceVariant, marginTop: 2 }]}>
                Allows the public to browse and star your itinerary.
              </Text>
            </View>
            <Switch
              value={isPublic}
              onValueChange={setIsPublic}
              trackColor={{ false: colors.outlineVariant, true: colors.primary }}
            />
          </View>
        </Card>

        {/* Edit Preferences Shortcut (FR-1-3, FR-2-10a) */}
        <Card style={{ marginBottom: spacing.lg }}>
          <Text style={[typography.labelLg, { color: colors.onSurface, fontWeight: '700' }]}>
            Group Preferences
          </Text>
          <Text style={[typography.bodySm, { color: colors.onSurfaceVariant, marginTop: 2, marginBottom: spacing.md }]}>
            Adjust travel style and pace for future Reroutes.
          </Text>
          <Button
            title="Edit Style & Pace Preferences →"
            onPress={() => router.push(`/(tabs)/trip/setup/${roomId}` as any)}
            variant="outline"
            size="md"
          />
        </Card>

        {/* Invite Code & Share Link (FR-2-1) */}
        <Card style={{ marginBottom: spacing.lg }}>
          <Text style={[typography.labelLg, { color: colors.onSurface, fontWeight: '700' }]}>
            Invite Members
          </Text>
          <Text style={[typography.bodySm, { color: colors.onSurfaceVariant, marginTop: 2, marginBottom: spacing.md }]}>
            Share this room code with friends:
          </Text>
          <View
            style={[
              styles.codeBox,
              { backgroundColor: colors.surfaceContainerLow, borderRadius: rounded.md, padding: spacing.md },
            ]}
          >
            <Text style={[typography.headlineSm, { color: colors.primary, letterSpacing: 2, fontWeight: '800' }]}>
              {room.invite_code || 'TOK26A'}
            </Text>
          </View>
        </Card>

        {/* Leave Room Action (FR-2-5) */}
        <Button
          title="Leave Room"
          onPress={() => router.replace('/(tabs)/trip' as any)}
          variant="danger"
          size="md"
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
  codeBox: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
