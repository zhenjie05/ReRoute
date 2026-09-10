import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useRouter, useLocalSearchParams, Redirect, useSegments, useFocusEffect } from 'expo-router';
import { useTheme } from '@/core/theme';
import { Card, Badge, Button, EmptyState } from '@/shared/components';
import { Avatar } from '@/shared/components/Avatar';
import { mockTripRooms, mockTripMembers } from '@/features/trip-room/data/mock-trip-room';
import { getRoomSeasonTheme } from '@/features/trip-room/data/season-presentation';
import { Feather } from '@expo/vector-icons';
import { useLiveTrip } from '@/lib/hooks/useLiveTrip';
import { CreateRoomSheet, RoomSheetMode } from '@/features/trip-room/presentation/CreateRoomSheet';

export default function TripHubScreen({ initialSheet = null }: { initialSheet?: RoomSheetMode | null } = {}) {
  const { colors, typography, spacing, rounded } = useTheme();
  const router = useRouter();
  const { mode } = useLocalSearchParams<{ mode?: string }>();
  const { hasLiveTrip, liveTrip } = useLiveTrip();
  const segments = useSegments();

  const [selectedStage, setSelectedStage] = useState<'all' | 'planning' | 'active' | 'archived'>('all');
  const [rooms, setRooms] = useState(mockTripRooms);
  const [roomSheet, setRoomSheet] = useState<RoomSheetMode | null>(initialSheet);

  useFocusEffect(
    React.useCallback(() => {
      setRooms([...mockTripRooms]);
    }, [])
  );

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
            <Text style={[typography.headlineLg, { color: colors.onSurface }]}>Trip Rooms</Text>
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
              <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 2 }}>
                <Feather name="map-pin" size={12} color={colors.onSurfaceVariant} style={{ marginRight: 4 }} />
                <Text style={[typography.bodySm, { color: colors.onSurfaceVariant }]}>
                  {liveTrip.destination} • {liveTrip.start_date} to {liveTrip.end_date}
                </Text>
              </View>
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
            {filteredRooms.map((room) => {
              const roomMembers = mockTripMembers.filter(m => m.room_id === room.id);
              const displayMembers = roomMembers.slice(0, 3);
              const remainingCount = roomMembers.length > 3 ? roomMembers.length - 3 : 0;
              const seasonalTheme = getRoomSeasonTheme(room);
              

              return (
                <Card
                  key={room.id}
                  style={{
                    padding: spacing.md,
                    overflow: 'hidden',
                    backgroundColor: seasonalTheme.background,
                    borderColor: seasonalTheme.border,
                    borderWidth: 1,
                  }}
                  onPress={() => router.push(`/(tabs)/trip/room/${room.id}/chat` as any)}
                >
                  <View style={{ flexDirection: 'row' }}>
                    {/* Left Side: Group Profile Image */}
                    {room.groupProfileImage && (
                      <Image 
                        source={{ uri: room.groupProfileImage }} 
                        style={{ width: 80, height: 80, borderRadius: 12, marginRight: 16, alignSelf: 'center' }} 
                        resizeMode="cover" 
                      />
                    )}
                    
                    {/* Right Side: Existing Content */}
                    <View style={{ flex: 1, justifyContent: 'center' }}>
                      {/* Top Row: Title & Badge */}
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
                        <Text
                          style={[
                            typography.headlineSm,
                            { color: room.stage === 'archived' ? room.season_theme?.text : colors.onSurface, flex: 1 },
                          ]}
                          numberOfLines={1}
                        >
                          {room.name}
                        </Text>
                        <Badge
                          label={room.stage.toUpperCase()}
                          style={{ 
                            backgroundColor: seasonalTheme.badge,
                            borderWidth: 0,
                            paddingHorizontal: 8,
                            paddingVertical: 4
                          }}
                          textStyle={{ 
                            color: seasonalTheme.text,
                            fontWeight: '800' 
                          }}
                        />
                      </View>

                      {/* Middle Row: Date */}
                      <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: spacing.xs }}>
                        <Feather name="calendar" size={14} color={colors.onSurfaceVariant} style={{ marginRight: 6 }} />
                        <Text style={[typography.bodySm, { color: colors.onSurfaceVariant, flexShrink: 1 }]} numberOfLines={1}>
                          {room.start_date} - {room.end_date}
                        </Text>
                        {room.season && room.theme_color && (
                          <View style={{
                            marginLeft: 8,
                            backgroundColor: `${room.theme_color}26`,
                            paddingHorizontal: 8,
                            paddingVertical: 4,
                            borderRadius: 12,
                          }}>
                            <Text style={{
                              fontSize: 12,
                              fontWeight: '600',
                              color: room.theme_color,
                              textTransform: 'capitalize'
                            }}>
                              {room.season}
                            </Text>
                          </View>
                        )}
                      </View>

                      {/* Bottom Row: Avatars & Count */}
                      <View style={{ 
                        flexDirection: 'row', 
                        justifyContent: 'space-between', 
                        alignItems: 'center', 
                        marginTop: spacing.md, 
                        paddingTop: spacing.sm,
                        borderTopWidth: 1,
                        borderTopColor: 'rgba(0,0,0,0.06)'
                      }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                          {displayMembers.map((m, idx) => (
                            <View key={m.user_id} style={{ marginLeft: idx > 0 ? -10 : 0, borderWidth: 2, borderColor: '#fff', borderRadius: 20 }}>
                              <Avatar uri={m.user?.avatar} name={m.user?.name || 'Member'} size={26} />
                            </View>
                          ))}
                          {remainingCount > 0 && (
                            <View style={{ 
                              marginLeft: -10, 
                              borderWidth: 2, 
                              borderColor: '#fff', 
                              borderRadius: 20, 
                              backgroundColor: colors.surfaceContainerHigh, 
                              width: 26, 
                              height: 26, 
                              alignItems: 'center', 
                              justifyContent: 'center' 
                            }}>
                              <Text style={{ fontSize: 10, fontWeight: '700', color: colors.onSurface }}>+{remainingCount}</Text>
                            </View>
                          )}
                        </View>
                        
                        <Text style={[typography.utilityTiny, { color: colors.onSurfaceVariant, fontWeight: '700' }]}>
                          {roomMembers.length} Traveler{roomMembers.length !== 1 ? 's' : ''}
                        </Text>
                      </View>
                    </View>
                  </View>
                </Card>
              );
            })}
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
