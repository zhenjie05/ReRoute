import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Slot, useLocalSearchParams, useRouter, usePathname } from 'expo-router';
import { useTheme } from '@/core/theme';
import { Badge } from '@/shared/components';
import { mockTripRooms } from '@/features/trip-room/data/mock-trip-room';

const roomTabs = [
  { slug: 'chat', label: '💬 Chat' },
  { slug: 'itinerary', label: '📅 Itinerary' },
  { slug: 'budget', label: '💰 Budget' },
  { slug: 'album', label: '📷 Album' },
  { slug: 'languages', label: '🗣️ Languages' },
];

export default function TripRoomLayout() {
  const { roomId } = useLocalSearchParams<{ roomId: string }>();
  const { colors, typography, spacing, rounded } = useTheme();
  const router = useRouter();
  const pathname = usePathname();

  const room = mockTripRooms.find((r) => r.id === roomId) || mockTripRooms[0];

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Dynamic Seasonal Top Header */}
      <View
        style={[
          styles.header,
          {
            backgroundColor: '#ffffff',
            borderBottomColor: colors.cardBorder,
            paddingHorizontal: spacing.lg,
            paddingTop: spacing.md,
            paddingBottom: spacing.sm,
          },
        ]}
      >
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <TouchableOpacity onPress={() => router.push('/(tabs)/trip' as any)} style={{ padding: 4 }}>
            <Text style={{ fontSize: 18 }}>←</Text>
          </TouchableOpacity>

          <View style={{ alignItems: 'center' }}>
            <Text style={[typography.headlineSm, { color: colors.onSurface }]}>
              {room.name}
            </Text>
            <View style={{ flexDirection: 'row', gap: 6, alignItems: 'center', marginTop: 2 }}>
              <Badge
                label={room.stage.toUpperCase()}
                variant={room.stage === 'active' ? 'season' : 'outline'}
              />
              <Text style={[typography.utilityTiny, { color: colors.onSurfaceVariant }]}>
                {room.destination}
              </Text>
            </View>
          </View>

          {/* Room Settings Gear Icon (FR-2-10a) */}
          <TouchableOpacity
            onPress={() => router.push(`/(tabs)/trip/room/${room.id}/settings` as any)}
            style={{ padding: 6 }}
          >
            <Text style={{ fontSize: 20 }}>⚙️</Text>
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
        <Slot />
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
