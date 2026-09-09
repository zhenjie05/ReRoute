import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useRouter, useLocalSearchParams, Redirect, useSegments } from 'expo-router';
import { useTheme } from '@/core/theme';
import { Card, Badge, Button, EmptyState } from '@/shared/components';
import { mockTripRooms } from '@/features/trip-room/data/mock-trip-room';
import { useLiveTrip } from '@/lib/hooks/useLiveTrip';
import { CreateRoomSheet, RoomSheetMode } from '@/features/trip-room/presentation/CreateRoomSheet';

export default function TripHubScreen({ initialSheet = null }: { initialSheet?: RoomSheetMode | null } = {}) {
  const { colors, typography, spacing, rounded } = useTheme();
  const router = useRouter();
  const { mode } = useLocalSearchParams<{ mode?: string }>();
  const { hasLiveTrip, liveTrip } = useLiveTrip();
  const segments = useSegments();

  const [selectedStage, setSelectedStage] = useState<'all' | 'planning' | 'active' | 'archived'>('all');
  const [rooms] = useState(mockTripRooms);
  const [roomSheet, setRoomSheet] = useState<RoomSheetMode | null>(initialSheet);

  // FR-2-4: Live-trip bypass - if current user has a live trip, route directly into that room
  // Only bypass if navigating directly to the trip hub (not deep-linking into a room)
  const isDeepLinking = segments.includes('room');
  if (hasLiveTrip && liveTrip && mode !== 'list' && !initialSheet && !isDeepLinking) {
    return <Redirect href={`/(tabs)/trip/room/${liveTrip.id}/chat` as any} />;
  }

  const filteredRooms = rooms.filter((r) => {
    if (selectedStage === 'all') return true;
    return r.stage === selectedStage;
  });

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>

      <ScrollView contentContainerStyle={{ padding: spacing.lg, paddingBottom: 120 }}>
        {/* Header Title & Actions */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md }}>
          <View>
            <Text style={[typography.headlineLg, { color: colors.onSurface }]}>Trip Rooms 🧭</Text>
            <Text style={[typography.bodySm, { color: colors.onSurfaceVariant }]}>
              Collaborate and manage itineraries
            </Text>
          </View>

          <View style={{ flexDirection: 'row', gap: spacing.xs }}>
            <Button
              title="+ New Trip"
              onPress={() => setRoomSheet('create')}
              variant="primary"
              size="sm"
            />
          </View>
        </View>

        {/* Live Trip Highlight Banner (FR-2-4) */}
        {hasLiveTrip && liveTrip ? (
          <TouchableOpacity
            activeOpacity={0.88}
            onPress={() => router.push(`/(tabs)/trip/room/${liveTrip.id}/chat` as any)}
            style={{ marginBottom: spacing.lg }}
          >
            <Card
              variant="season"
              style={{
                borderWidth: 2,
                borderColor: colors.season.main,
              }}
            >
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Badge label="🔴 LIVE TRIP ACTIVE" variant="season" />
                <Text style={[typography.labelSm, { color: colors.primary, fontWeight: '700' }]}>
                  Open Room →
                </Text>
              </View>
              <Text style={[typography.headlineSm, { color: colors.onSurface, marginTop: spacing.xs }]}>
                {liveTrip.name}
              </Text>
              <Text style={[typography.bodySm, { color: colors.onSurfaceVariant, marginTop: 2 }]}>
                📍 {liveTrip.destination} • {liveTrip.start_date} to {liveTrip.end_date}
              </Text>
            </Card>
          </TouchableOpacity>
        ) : null}

        {/* Stage Filter Tabs */}
        <View style={{ flexDirection: 'row', gap: spacing.xs, marginBottom: spacing.lg }}>
          {(['all', 'planning', 'active', 'archived'] as const).map((stage) => (
            <TouchableOpacity
              key={stage}
              onPress={() => setSelectedStage(stage)}
              style={[
                styles.filterPill,
                {
                  backgroundColor:
                    selectedStage === stage ? colors.primary : colors.surfaceContainerLow,
                  borderRadius: rounded.full,
                  paddingHorizontal: spacing.md,
                  paddingVertical: spacing.xs,
                },
              ]}
            >
              <Text
                style={[
                  typography.labelSm,
                  {
                    color: selectedStage === stage ? '#ffffff' : colors.onSurfaceVariant,
                    fontWeight: '600',
                    textTransform: 'capitalize',
                  },
                ]}
              >
                {stage}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Room List */}
        {filteredRooms.length === 0 ? (
          <EmptyState
            title="No trips in this stage"
            description="Create a new adventure or join with an invite code."
            actionTitle="+ Create Trip"
            onAction={() => setRoomSheet('create')}
          />
        ) : (
          <View style={{ gap: spacing.md }}>
            {filteredRooms.map((room) => (
              <Card
                key={room.id}
                style={{
                  padding: 0,
                  overflow: 'hidden',
                  backgroundColor: room.stage === 'archived' ? room.season_theme?.background : undefined,
                  borderColor: room.stage === 'archived' ? room.season_theme?.border : undefined,
                  borderWidth: room.stage === 'archived' ? 2 : undefined,
                }}
                onPress={() => router.push(`/(tabs)/trip/room/${room.id}/chat` as any)}
              >
                {room.cover_image ? (
                  <Image source={{ uri: room.cover_image }} style={{ width: '100%', height: 130 }} />
                ) : null}
                <View style={{ padding: spacing.md }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Badge
                      label={room.stage === 'archived' && room.season ? `${room.season.toUpperCase()} · ARCHIVED` : room.stage.toUpperCase()}
                      variant={room.stage === 'active' ? 'season' : 'outline'}
                      style={room.stage === 'archived' ? { backgroundColor: room.season_theme?.badge, borderColor: room.season_theme?.border } : undefined}
                    />
                    <Text style={[typography.utilityTiny, { color: colors.onSurfaceVariant }]}>
                      Code: {room.invite_code}
                    </Text>
                  </View>

                  <Text
                    style={[
                      typography.headlineSm,
                      { color: room.stage === 'archived' ? room.season_theme?.text : colors.onSurface, marginTop: spacing.xs },
                    ]}
                  >
                    {room.name}
                  </Text>
                  <Text style={[typography.bodySm, { color: colors.onSurfaceVariant, marginTop: 2 }]}>
                    📍 {room.destination} • {room.start_date}
                  </Text>
                </View>
              </Card>
            ))}
          </View>
        )}
      </ScrollView>
      {roomSheet && <CreateRoomSheet mode={roomSheet} onClose={() => setRoomSheet(null)} />}
    </View>
  );
}

const styles = StyleSheet.create({
  filterPill: {
    marginRight: 4,
  },
});
