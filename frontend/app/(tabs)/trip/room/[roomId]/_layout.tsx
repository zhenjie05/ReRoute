import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { Slot, useRouter, usePathname, useLocalSearchParams } from 'expo-router';
import { useTheme } from '@/core/theme';
import { Badge } from '@/shared/components';
import { mockTripRooms } from '@/features/trip-room/data/mock-trip-room';
import ArchivedItinerary from '@/features/trip-room/presentation/itinerary-demo/ArchivedItinerary';
import { Feather } from '@expo/vector-icons';

const roomTabs = [
  { slug: 'chat', label: 'Discussion' },
  { slug: 'itinerary', label: 'Itinerary' },
  { slug: 'budget', label: 'Budget' },
  { slug: 'album', label: 'Album' },
  { slug: 'languages', label: 'Language' },
];

export default function TripRoomLayout() {
  const { colors, typography, spacing, rounded } = useTheme();
  const router = useRouter();
  const pathname = usePathname();
  const params = useLocalSearchParams();
  // Slot layouts can retain local params when switching between rooms.
  const roomId = decodeURIComponent(pathname.split('/room/')[1]?.split('/')[0] || '');

  const room = mockTripRooms.find((r) => r.id === roomId) || mockTripRooms[0];
  const stageLabel = room.stage.toUpperCase();

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Dynamic Seasonal Top Header */}
      <View
        style={[
          styles.header,
          {
            backgroundColor: room.stage === 'archived' ? room.season_theme?.background || '#ffffff' : '#ffffff',
            borderBottomColor: room.stage === 'archived' ? room.season_theme?.border || colors.cardBorder : colors.cardBorder,
            paddingHorizontal: spacing.lg,
            paddingTop: spacing.md,
            paddingBottom: spacing.sm,
          },
        ]}
      >
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <TouchableOpacity onPress={() => router.push('/(tabs)/trip?mode=list' as any)} style={{ padding: 4 }}>
            <Text style={{ fontSize: 18 }}>←</Text>
          </TouchableOpacity>

          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            {room.groupProfileImage && (
              <Image
                source={{ uri: room.groupProfileImage }}
                style={{ width: 44, height: 44, borderRadius: 22, marginRight: 12, backgroundColor: '#eee' }}
                resizeMode="cover"
              />
            )}
            <View style={{ alignItems: 'flex-start' }}>
              <Text style={[typography.headlineSm, { color: colors.onSurface }]}>
                {room.name}
              </Text>
              <View style={{ flexDirection: 'row', gap: 6, alignItems: 'center', marginTop: 2 }}>
                <Badge
                  label={room.stage === 'archived' && room.season ? `${room.season.toUpperCase()} · ${stageLabel}` : stageLabel}
                  variant={room.stage === 'active' ? 'season' : 'outline'}
                  style={room.stage === 'archived' ? { backgroundColor: room.season_theme?.badge, borderColor: room.season_theme?.border } : undefined}
                />
                <Text style={[typography.utilityTiny, { color: colors.onSurfaceVariant }]}>
                  {room.destination}
                </Text>
              </View>
            </View>
          </View>

          {/* Room Settings Gear Icon (FR-2-10a) */}
          <TouchableOpacity
            onPress={() => router.push(`/(tabs)/trip/room/${room.id}/settings` as any)}
            style={{ padding: 6 }}
          >
            <Feather name="settings" size={24} color="#333" />
          </TouchableOpacity>
        </View>

        {/* Room Sub-Tabs Pill Strip */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: spacing.xs, paddingTop: spacing.md }}
        >
          {roomTabs.map((tab) => {
            const isActive = pathname.includes(`/room/${room.id}/${tab.slug}`);
            return (
              <TouchableOpacity
                key={tab.slug}
                accessibilityRole="tab"
                accessibilityLabel={tab.label.slice(tab.label.indexOf(' ') + 1)}
                accessibilityState={{ selected: isActive }}
                onPress={() => router.push(`/(tabs)/trip/room/${room.id}/${tab.slug}` as any)}
                style={[
                  styles.tabPill,
                  {
                    backgroundColor: isActive ? colors.primary : colors.surfaceContainerLow,
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
                      color: isActive ? '#ffffff' : colors.onSurfaceVariant,
                      fontWeight: '700',
                    },
                  ]}
                >
                  {tab.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Screen Slot */}
      <View style={{ flex: 1 }}>
        {room.stage === 'archived' && /\/budget\/(add-expense|settle-up)/.test(pathname) ? <View style={{ padding: 24 }}><Text>Archived trip — expenses and settlements are read-only.</Text></View> : room.stage === 'archived' && /\/itinerary\/.+/.test(pathname) ? <ArchivedItinerary roomId={room.id} /> : <Slot key={roomId} />}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    borderBottomWidth: 1,
    zIndex: 10,
  },
  tabPill: {
    marginRight: 4,
  },
});
