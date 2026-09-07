import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTheme } from '@/core/theme';
import { Card, Badge } from '@/shared/components';
import { mockItineraryDays, mockItineraryItems } from '@/features/trip-room/data/mock-trip-room';
import { ItineraryItem } from '@/models/itinerary';

export default function ItineraryDayDetailScreen() {
  const { dayId } = useLocalSearchParams<{ roomId: string; dayId: string }>();
  const { colors, typography, spacing, rounded } = useTheme();
  const router = useRouter();

  const day = mockItineraryDays.find((d) => d.id === dayId) || mockItineraryDays[0];
  const [items, setItems] = useState<ItineraryItem[]>(
    mockItineraryItems.filter((i) => i.day_id === day.id)
  );

  const moveUp = (index: number) => {
    if (index === 0) return;
    const newItems = [...items];
    const temp = newItems[index - 1];
    newItems[index - 1] = newItems[index];
    newItems[index] = temp;
    setItems(newItems);
  };

  const moveDown = (index: number) => {
    if (index === items.length - 1) return;
    const newItems = [...items];
    const temp = newItems[index + 1];
    newItems[index + 1] = newItems[index];
    newItems[index] = temp;
    setItems(newItems);
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Header */}
      <View style={[styles.header, { paddingHorizontal: spacing.lg, paddingVertical: spacing.md }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={{ fontSize: 20 }}>←</Text>
        </TouchableOpacity>
        <Text style={[typography.headlineSm, { color: colors.onSurface }]}>
          Day {day.day_number} Stops
        </Text>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={[typography.labelSm, { color: colors.primary, fontWeight: '700' }]}>
            Done
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ padding: spacing.lg, paddingBottom: 100 }}>
        <Text style={[typography.bodySm, { color: colors.onSurfaceVariant, marginBottom: spacing.md }]}>
          Reorder stops to optimize travel distance and itinerary timing.
        </Text>

        <View style={{ gap: spacing.md }}>
          {items.map((item, index) => (
            <Card key={item.id} variant="outlined" style={styles.reorderCard}>
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <Badge label={`#${index + 1}`} variant="season" />
                  <Text style={[typography.labelSm, { color: colors.primary, fontWeight: '700' }]}>
                    {item.scheduled_time || 'Flexible'}
                  </Text>
                </View>
                <Text style={[typography.labelLg, { color: colors.onSurface, marginTop: 4 }]}>
                  {item.name}
                </Text>
              </View>

              {/* Reorder Buttons */}
              <View style={{ flexDirection: 'row', gap: 6 }}>
                <TouchableOpacity
                  onPress={() => moveUp(index)}
                  disabled={index === 0}
                  style={[
                    styles.moveBtn,
                    {
                      backgroundColor: colors.surfaceContainerLow,
                      opacity: index === 0 ? 0.3 : 1,
                      borderRadius: rounded.md,
                    },
                  ]}
                >
                  <Text style={{ fontSize: 16 }}>▲</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => moveDown(index)}
                  disabled={index === items.length - 1}
                  style={[
                    styles.moveBtn,
                    {
                      backgroundColor: colors.surfaceContainerLow,
                      opacity: index === items.length - 1 ? 0.3 : 1,
                      borderRadius: rounded.md,
                    },
                  ]}
                >
                  <Text style={{ fontSize: 16 }}>▼</Text>
                </TouchableOpacity>
              </View>
            </Card>
          ))}
        </View>
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
  reorderCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  moveBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
