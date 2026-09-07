import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTheme } from '@/core/theme';
import { Card, Badge } from '@/shared/components';
import { mockItineraryDays, mockItineraryItems } from '@/features/trip-room/data/mock-trip-room';

export default function ItineraryDayListScreen() {
  const { roomId } = useLocalSearchParams<{ roomId: string }>();
  const { colors, typography, spacing, rounded } = useTheme();
  const router = useRouter();

  const [selectedDayId, setSelectedDayId] = useState<string>(mockItineraryDays[0].id);

  const selectedDay = mockItineraryDays.find((d) => d.id === selectedDayId) || mockItineraryDays[0];
  const dayItems = mockItineraryItems.filter((item) => item.day_id === selectedDayId);

  const handleOpenBooking = (url?: string | null) => {
    if (url) {
      Linking.openURL(url).catch(() => {});
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Day Selector Carousel */}
      <View style={{ backgroundColor: '#ffffff', borderBottomWidth: 1, borderBottomColor: colors.cardBorder }}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: spacing.lg, paddingVertical: spacing.sm, gap: spacing.xs }}
        >
          {mockItineraryDays.map((day) => {
            const isSelected = day.id === selectedDayId;
            return (
              <TouchableOpacity
                key={day.id}
                onPress={() => setSelectedDayId(day.id)}
                style={[
                  styles.dayPill,
                  {
                    backgroundColor: isSelected ? colors.primary : colors.surfaceContainerLow,
                    borderRadius: rounded.lg,
                    paddingHorizontal: spacing.md,
                    paddingVertical: spacing.xs,
                  },
                ]}
              >
                <Text
                  style={[
                    typography.labelSm,
                    { color: isSelected ? '#ffffff' : colors.onSurface, fontWeight: '700' },
                  ]}
                >
                  Day {day.day_number}
                </Text>
                <Text
                  style={[
                    typography.utilityTiny,
                    { color: isSelected ? '#ffffff' : colors.onSurfaceVariant },
                  ]}
                >
                  {day.trip_date.slice(5)}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      <ScrollView contentContainerStyle={{ padding: spacing.lg, paddingBottom: 100 }}>
        {/* Day Header with Title & Notes */}
        <Card variant="season" style={{ marginBottom: spacing.md }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Badge label={`DAY ${selectedDay.day_number}`} variant="season" />
            <TouchableOpacity onPress={() => router.push(`/(tabs)/trip/room/${roomId}/itinerary/${selectedDay.id}` as any)}>
              <Text style={[typography.labelSm, { color: colors.primary, fontWeight: '700' }]}>
                Reorder Stops ⇅
              </Text>
            </TouchableOpacity>
          </View>
          <Text style={[typography.headlineSm, { color: colors.onSurface, marginTop: spacing.xs }]}>
            {selectedDay.title}
          </Text>
          {selectedDay.notes ? (
            <Text style={[typography.bodySm, { color: colors.onSurfaceVariant, marginTop: 4 }]}>
              📝 {selectedDay.notes}
            </Text>
          ) : null}
        </Card>

        {/* Categorized Quick-Add Actions (FR-1-5) */}
        <View style={{ flexDirection: 'row', gap: spacing.xs, marginBottom: spacing.lg }}>
          <TouchableOpacity
            style={[styles.addBtn, { backgroundColor: colors.surfaceContainerLow, borderRadius: rounded.md }]}
          >
            <Text style={[typography.labelSm, { color: colors.onSurface, fontWeight: '600' }]}>
              + Transportation
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.addBtn, { backgroundColor: colors.surfaceContainerLow, borderRadius: rounded.md }]}
          >
            <Text style={[typography.labelSm, { color: colors.onSurface, fontWeight: '600' }]}>
              + Attractions
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.addBtn, { backgroundColor: colors.surfaceContainerLow, borderRadius: rounded.md }]}
          >
            <Text style={[typography.labelSm, { color: colors.onSurface, fontWeight: '600' }]}>
              + Stay
            </Text>
          </TouchableOpacity>
        </View>

        {/* Timeline Stops */}
        <View style={{ gap: spacing.md }}>
          {dayItems.map((item, index) => {
            const getCategoryIcon = (cat: string) => {
              switch (cat) {
                case 'transportation':
                  return '🚆';
                case 'stay':
                  return '🏨';
                case 'attraction':
                default:
                  return '📍';
              }
            };

            return (
              <Card key={item.id} variant="outlined">
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                    <Text style={{ fontSize: 16 }}>{getCategoryIcon(item.category)}</Text>
                    <Text style={[typography.labelSm, { color: colors.primary, fontWeight: '700' }]}>
                      {item.scheduled_time || `Stop ${index + 1}`}
                    </Text>
                  </View>
                  <Badge label={item.category.toUpperCase()} variant="outline" />
                </View>

                <Text style={[typography.headlineSm, { color: colors.onSurface, marginTop: spacing.xs }]}>
                  {item.name}
                </Text>

                {item.address ? (
                  <Text style={[typography.bodySm, { color: colors.onSurfaceVariant, marginTop: 2 }]}>
                    {item.address}
                  </Text>
                ) : null}

                {/* External Booking Link if Available (FR-1-4a) */}
                {item.booking_url ? (
                  <TouchableOpacity
                    onPress={() => handleOpenBooking(item.booking_url)}
                    style={{ marginTop: spacing.sm }}
                  >
                    <Text style={[typography.labelSm, { color: colors.primary, fontWeight: '700' }]}>
                      🎟️ Open Official Tickets & Booking ↗
                    </Text>
                  </TouchableOpacity>
                ) : null}
              </Card>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  dayPill: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  addBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
