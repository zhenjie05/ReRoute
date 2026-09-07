import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTheme } from '@/core/theme';
import { Button, Card } from '@/shared/components';
import { mockModularSuggestions } from '@/features/route-planning/data/mock-route-planning';
import { TravelCompanions, TravelStyle, TravelPace } from '@/models/trip-room';

export default function TripSetupScreen() {
  const { roomId } = useLocalSearchParams<{ roomId: string }>();
  const { colors, typography, spacing, rounded } = useTheme();
  const router = useRouter();

  // Step 1: Preferences Form State (with soft-gate defaults: Couple / Cultural / Moderate)
  const [companions, setCompanions] = useState<TravelCompanions>('couple');
  const [style, setStyle] = useState<TravelStyle>('cultural');
  const [pace, setPace] = useState<TravelPace>('moderate');
  const [step, setStep] = useState<'preferences' | 'modular'>('preferences');

  // Step 2: Modular Suggestions Selection
  const [acceptedItems, setAcceptedItems] = useState<Record<string, boolean>>({
    'sug-trans-1': true,
    'sug-trans-2': true,
    'sug-acc-1': true,
    'sug-acc-2': false,
    'sug-att-1': true,
    'sug-att-2': true,
    'sug-att-3': true,
  });

  const toggleItem = (id: string) => {
    setAcceptedItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleOpenBooking = (url?: string | null) => {
    if (url) {
      Linking.openURL(url).catch(() => {});
    }
  };

  const handleFinishSetup = () => {
    const targetRoomId = roomId && roomId !== 'new' ? roomId : 'room-tokyo-2026';
    router.replace(`/(tabs)/trip/room/${targetRoomId}/chat` as any);
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Header */}
      <View style={[styles.header, { paddingHorizontal: spacing.lg, paddingVertical: spacing.md }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={{ fontSize: 20 }}>←</Text>
        </TouchableOpacity>
        <Text style={[typography.headlineSm, { color: colors.onSurface }]}>
          {step === 'preferences' ? 'Trip Preferences' : 'Modular Suggestions'}
        </Text>
        <View style={{ width: 32 }} />
      </View>

      <ScrollView contentContainerStyle={{ padding: spacing.lg, paddingBottom: 100 }}>
        {step === 'preferences' ? (
          // STEP 1: PREFERENCES FORM (FR-1-3, FR-1-3a)
          <>
            <Card style={{ marginBottom: spacing.lg }}>
              <Text style={[typography.headlineSm, { color: colors.onSurface, marginBottom: spacing.xs }]}>
                Tailor Your Trip 🧭
              </Text>
              <Text style={[typography.bodySm, { color: colors.onSurfaceVariant, marginBottom: spacing.lg }]}>
                Set group preferences to customize itinerary suggestions.
              </Text>

              {/* 1. Companions */}
              <Text style={[typography.labelLg, { color: colors.onSurface, marginBottom: spacing.xs, fontWeight: '700' }]}>
                1. Who is traveling?
              </Text>
              <View style={styles.pillGroup}>
                {(['solo', 'couple', 'family', 'friends', 'elderly'] as TravelCompanions[]).map((c) => (
                  <TouchableOpacity
                    key={c}
                    onPress={() => setCompanions(c)}
                    style={[
                      styles.prefPill,
                      {
                        backgroundColor: companions === c ? colors.primary : colors.surfaceContainerLow,
                        borderRadius: rounded.full,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        typography.labelSm,
                        { color: companions === c ? '#ffffff' : colors.onSurface, fontWeight: '600', textTransform: 'capitalize' },
                      ]}
                    >
                      {c}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* 2. Style */}
              <Text style={[typography.labelLg, { color: colors.onSurface, marginTop: spacing.lg, marginBottom: spacing.xs, fontWeight: '700' }]}>
                2. Travel Style
              </Text>
              <View style={styles.pillGroup}>
                {(['cultural', 'classic', 'nature', 'cityscape', 'historical'] as TravelStyle[]).map((s) => (
                  <TouchableOpacity
                    key={s}
                    onPress={() => setStyle(s)}
                    style={[
                      styles.prefPill,
                      {
                        backgroundColor: style === s ? colors.primary : colors.surfaceContainerLow,
                        borderRadius: rounded.full,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        typography.labelSm,
                        { color: style === s ? '#ffffff' : colors.onSurface, fontWeight: '600', textTransform: 'capitalize' },
                      ]}
                    >
                      {s}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* 3. Pace */}
              <Text style={[typography.labelLg, { color: colors.onSurface, marginTop: spacing.lg, marginBottom: spacing.xs, fontWeight: '700' }]}>
                3. Travel Pace
              </Text>
              <View style={styles.pillGroup}>
                {(['relaxed', 'moderate', 'ambitious'] as TravelPace[]).map((p) => (
                  <TouchableOpacity
                    key={p}
                    onPress={() => setPace(p)}
                    style={[
                      styles.prefPill,
                      {
                        backgroundColor: pace === p ? colors.primary : colors.surfaceContainerLow,
                        borderRadius: rounded.full,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        typography.labelSm,
                        { color: pace === p ? '#ffffff' : colors.onSurface, fontWeight: '600', textTransform: 'capitalize' },
                      ]}
                    >
                      {p}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </Card>

            <View style={{ gap: spacing.sm }}>
              <Button
                title="Generate Modular Suggestions →"
                onPress={() => setStep('modular')}
                variant="primary"
                size="lg"
              />
              <Button
                title="Skip & Use Defaults (Couple / Cultural / Moderate)"
                onPress={() => setStep('modular')}
                variant="ghost"
                size="md"
              />
            </View>
          </>
        ) : (
          // STEP 2: MODULAR SUGGESTIONS (FR-1-4, FR-1-4a)
          <>
            <Text style={[typography.headlineSm, { color: colors.onSurface, marginBottom: spacing.xs }]}>
              Modular Recommendations
            </Text>
            <Text style={[typography.bodySm, { color: colors.onSurfaceVariant, marginBottom: spacing.lg }]}>
              Accept or reject individual suggestions. Booking links direct you to official websites.
            </Text>

            {/* Module 1: Transportation */}
            <Text style={[typography.labelLg, { color: colors.primary, fontWeight: '800', marginBottom: spacing.sm }]}>
              🚆 1. Transportation Module
            </Text>
            <View style={{ gap: spacing.sm, marginBottom: spacing.lg }}>
              {mockModularSuggestions.transportation.map((item) => (
                <Card
                  key={item.id}
                  variant={acceptedItems[item.id] ? 'season' : 'outlined'}
                  style={{ opacity: acceptedItems[item.id] ? 1 : 0.6 }}
                >
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text style={[typography.labelLg, { color: colors.onSurface, fontWeight: '700', flex: 1 }]}>
                      {item.name}
                    </Text>
                    <TouchableOpacity
                      onPress={() => toggleItem(item.id)}
                      style={[
                        styles.checkBtn,
                        { backgroundColor: acceptedItems[item.id] ? colors.primary : colors.outlineVariant },
                      ]}
                    >
                      <Text style={{ color: '#fff', fontSize: 14 }}>{acceptedItems[item.id] ? '✓' : '+'}</Text>
                    </TouchableOpacity>
                  </View>
                  <Text style={[typography.bodySm, { color: colors.onSurfaceVariant, marginTop: 4 }]}>
                    Time: {item.scheduled_time} • Est: ${item.cost_estimate}
                  </Text>
                  {item.booking_url ? (
                    <TouchableOpacity
                      onPress={() => handleOpenBooking(item.booking_url)}
                      style={{ marginTop: spacing.sm }}
                    >
                      <Text style={[typography.labelSm, { color: colors.primary, fontWeight: '700' }]}>
                        Book Transit Tickets ↗
                      </Text>
                    </TouchableOpacity>
                  ) : null}
                </Card>
              ))}
            </View>

            {/* Module 2: Accommodation */}
            <Text style={[typography.labelLg, { color: colors.primary, fontWeight: '800', marginBottom: spacing.sm }]}>
              🏨 2. Accommodation Module
            </Text>
            <View style={{ gap: spacing.sm, marginBottom: spacing.lg }}>
              {mockModularSuggestions.accommodation.map((item) => (
                <Card
                  key={item.id}
                  variant={acceptedItems[item.id] ? 'season' : 'outlined'}
                  style={{ opacity: acceptedItems[item.id] ? 1 : 0.6 }}
                >
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text style={[typography.labelLg, { color: colors.onSurface, fontWeight: '700', flex: 1 }]}>
                      {item.name}
                    </Text>
                    <TouchableOpacity
                      onPress={() => toggleItem(item.id)}
                      style={[
                        styles.checkBtn,
                        { backgroundColor: acceptedItems[item.id] ? colors.primary : colors.outlineVariant },
                      ]}
                    >
                      <Text style={{ color: '#fff', fontSize: 14 }}>{acceptedItems[item.id] ? '✓' : '+'}</Text>
                    </TouchableOpacity>
                  </View>
                  <Text style={[typography.bodySm, { color: colors.onSurfaceVariant, marginTop: 4 }]}>
                    {item.address} • Est: ${item.cost_estimate}/night
                  </Text>
                  {item.booking_url ? (
                    <TouchableOpacity
                      onPress={() => handleOpenBooking(item.booking_url)}
                      style={{ marginTop: spacing.sm }}
                    >
                      <Text style={[typography.labelSm, { color: colors.primary, fontWeight: '700' }]}>
                        View Booking Site ↗
                      </Text>
                    </TouchableOpacity>
                  ) : null}
                </Card>
              ))}
            </View>

            {/* Module 3: Attractions */}
            <Text style={[typography.labelLg, { color: colors.primary, fontWeight: '800', marginBottom: spacing.sm }]}>
              🏯 3. Attractions Module
            </Text>
            <View style={{ gap: spacing.sm, marginBottom: spacing.xl }}>
              {mockModularSuggestions.attractions.map((item) => (
                <Card
                  key={item.id}
                  variant={acceptedItems[item.id] ? 'season' : 'outlined'}
                  style={{ opacity: acceptedItems[item.id] ? 1 : 0.6 }}
                >
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text style={[typography.labelLg, { color: colors.onSurface, fontWeight: '700', flex: 1 }]}>
                      {item.name}
                    </Text>
                    <TouchableOpacity
                      onPress={() => toggleItem(item.id)}
                      style={[
                        styles.checkBtn,
                        { backgroundColor: acceptedItems[item.id] ? colors.primary : colors.outlineVariant },
                      ]}
                    >
                      <Text style={{ color: '#fff', fontSize: 14 }}>{acceptedItems[item.id] ? '✓' : '+'}</Text>
                    </TouchableOpacity>
                  </View>
                  <Text style={[typography.bodySm, { color: colors.onSurfaceVariant, marginTop: 4 }]}>
                    Suggested: {item.scheduled_time} ({item.duration_minutes} mins)
                  </Text>
                </Card>
              ))}
            </View>

            <Button
              title="Confirm Itinerary & Open Room ✨"
              onPress={handleFinishSetup}
              variant="primary"
              size="lg"
            />
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
  pillGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  prefPill: {
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  checkBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
});
