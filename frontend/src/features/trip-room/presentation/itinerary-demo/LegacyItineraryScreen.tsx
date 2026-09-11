import React, { useState, useCallback, useMemo } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTheme } from '@/core/theme';
import {
  mockTripRooms,
  mockItineraryDays,
  mockItineraryItems,
  mockItineraryVoteStatus,
  mockItineraryDecisionCards,
  mockCandidateStops,
  mockSuggestedRoutes,
  mockSafetyBanner,
  mockLandmarks,
} from '@/features/trip-room/data/mock-trip-room';
import {
  ArchivedBanner,
  ProposeVoteSheet,
} from '@/features/trip-room/presentation/components';
import {
  CitySearchBar,
  PlanningMapPlaceholder,
  DayTimelineStepper,
  SafetyCheckBanner,
  LiveRouteMapPlaceholder,
  SuggestedRouteLegCard,
  DropoffPointCard,
} from '@/features/trip-room/presentation/components/itinerary';
import type { VoteState } from '@/features/trip-room/presentation/components/itinerary';

/**
 * Itinerary tab main screen — stage-aware rendering.
 *
 * - **Planning**: City search, illustrative map, day timeline with vote states, "Complete Planning" CTA
 * - **Active/Live**: Safety banner, live map, suggested routes with transport chips + drop-off cards
 * - **Archived**: ArchivedBanner (reused from Discussion) + Active layout with interactions disabled
 *
 * Does NOT rebuild the Trip Room header, tab row, or stage indicator
 * (those live in the [roomId]/_layout.tsx shell).
 */
export default function ItineraryScreen() {
  const { roomId } = useLocalSearchParams<{ roomId: string }>();
  const { colors, typography, spacing, rounded, shadows } = useTheme();
  const router = useRouter();

  // Resolve room and stage
  const room = mockTripRooms.find((r) => r.id === roomId) || mockTripRooms[0];
  const stage = room.stage; // 'planning' | 'active' | 'archived'
  const isArchived = stage === 'archived';
  const isPlanning = stage === 'planning';
  const isActive = stage === 'active';

  // State
  const [voteSheetVisible, setVoteSheetVisible] = useState(false);
  const [planningComplete, setPlanningComplete] = useState(false);

  // Build timeline items for each day
  const buildDayTimeline = useCallback(
    (dayId: string) => {
      const dayItems = mockItineraryItems
        .filter((item) => item.day_id === dayId)
        .sort((a, b) => a.sort_order - b.sort_order);

      const candidates = mockCandidateStops.filter((c) => c.day_id === dayId);

      // Map itinerary items to timeline items with vote state
      const timelineItems = dayItems.map((item) => {
        const voteInfo = mockItineraryVoteStatus[item.id];
        let voteState: VoteState = 'pending';
        let voteTally: string | undefined;

        if (voteInfo) {
          const linkedCard = mockItineraryDecisionCards.find(
            (c) => c.id === voteInfo.decision_card_id
          );
          if (linkedCard?.status === 'resolved') {
            voteState = 'voted';
            voteTally = `${voteInfo.votes_for}/${voteInfo.votes_total} agreed`;
          } else {
            voteState = 'pending';
          }
        }

        // Find matching landmark for photo
        const landmark = mockLandmarks.find(
          (l) =>
            Math.abs(l.lat - item.lat) < 0.01 &&
            Math.abs(l.lng - item.lng) < 0.01
        );
        const photoUrl = landmark?.photo_urls?.[0];

        // Generate note based on category
        const getCategoryNote = () => {
          switch (item.category) {
            case 'transportation':
              return item.tags?.join(', ') || 'Transit connection';
            case 'stay':
              return item.address || 'Accommodation';
            case 'attraction':
              return item.tags?.join(' & ') || 'Sightseeing';
            default:
              return '';
          }
        };

        return {
          id: item.id,
          time: item.scheduled_time || `Stop ${item.sort_order}`,
          name: item.name,
          note: getCategoryNote(),
          photoUrl,
          voteState,
          voteTally,
        };
      });

      // Add candidate stops as 'candidate' state nodes
      const candidateNodes = candidates.map((c) => ({
        id: c.id,
        time: c.scheduled_time,
        name: c.name,
        note: c.note,
        voteState: 'candidate' as VoteState,
      }));

      return [...timelineItems, ...candidateNodes];
    },
    []
  );



  // Handle "Suggest Vote" — opens reused ProposeVoteSheet
  const handleSuggestVote = useCallback((itemId: string) => {
    setVoteSheetVisible(true);
  }, []);

  // Handle "Add Details" for candidate stops
  const handleAddDetails = useCallback((itemId: string) => {
    Alert.alert(
      'Add Details',
      'This candidate stop can be detailed and promoted to a full itinerary item. (Feature pending backend wiring)',
    );
  }, []);

  // Handle item press — navigate to landmark detail
  const handleItemPress = useCallback(
    (itemId: string) => {
      const item = mockItineraryItems.find((i) => i.id === itemId);
      if (!item) return;

      // Find matching landmark
      const landmark = mockLandmarks.find(
        (l) =>
          Math.abs(l.lat - item.lat) < 0.01 &&
          Math.abs(l.lng - item.lng) < 0.01
      );

      if (landmark) {
        router.push(
          `/(tabs)/trip/room/${room.id}/landmark/${landmark.id}` as any
        );
      }
    },
    [router, room.id]
  );

  // Handle vote publish from ProposeVoteSheet
  const handlePublishVote = useCallback(
    (data: { title: string; triggerType: any; options: string[]; anonymous: boolean }) => {
      setVoteSheetVisible(false);
      // In real app, this would create a decision card linked to the item
      Alert.alert(
        'Vote Published',
        `"${data.title}" has been published to the room chat for voting.`
      );
    },
    []
  );

  // Handle "Complete Planning" CTA
  const handleCompletePlanning = useCallback(() => {
    Alert.alert(
      'Complete Planning',
      'Mark all days as finalized? This does NOT transition the room to Active. The owner must use "Start Trip" in Room Settings.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Finalize',
          onPress: () => setPlanningComplete(true),
        },
      ]
    );
  }, []);

  // Handle Reroute button
  const handleReroute = useCallback(() => {
    Alert.alert('Reroute', 'AI reroute suggestion feature — pending backend wiring.');
  }, []);

  // Memoize suggested routes for current room
  const suggestedRoutes = useMemo(
    () => mockSuggestedRoutes.filter((r) => r.room_id === (roomId || room.id)),
    [roomId, room.id]
  );

  // ==========================================
  // PLANNING STAGE
  // ==========================================
  if (isPlanning) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background }}>
        <ScrollView
          contentContainerStyle={{ paddingTop: spacing.md, paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
        >
          {/* City search bar */}
          <CitySearchBar placeholder="Search Japan cities..." />

          {/* Illustrative country map (placeholder) */}
          <PlanningMapPlaceholder />

          {/* Day timeline sections */}
          {mockItineraryDays.map((day) => {
            const items = buildDayTimeline(day.id);
            return (
              <DayTimelineStepper
                key={day.id}
                dayNumber={day.day_number}
                dayTitle={day.title}
                tripDate={day.trip_date}
                arrivalNote={
                  day.day_number === 1
                    ? `${day.title.split(' & ')[0] || 'Arrival'}`
                    : day.title
                }
                items={items}
                disabled={planningComplete}
                onSuggestVote={handleSuggestVote}
                onAddDetails={handleAddDetails}
                onItemPress={handleItemPress}
              />
            );
          })}

          {/* Complete Planning CTA */}
          <View style={{ paddingHorizontal: spacing.lg, marginTop: spacing.md }}>
            <TouchableOpacity
              onPress={handleCompletePlanning}
              disabled={planningComplete}
              activeOpacity={0.85}
              style={[
                styles.completePlanningBtn,
                {
                  backgroundColor: planningComplete
                    ? colors.surfaceContainerHigh
                    : colors.season.main,
                  borderRadius: rounded.xl,
                  paddingVertical: spacing.lg,
                  ...shadows.season,
                },
              ]}
            >
              <Text
                style={[
                  typography.labelLg,
                  {
                    color: planningComplete ? colors.onSurfaceVariant : '#ffffff',
                    fontWeight: '700',
                    textAlign: 'center',
                  },
                ]}
              >
                {planningComplete ? '✓ Planning Finalized' : '✓ Complete Planning'}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        {/* Propose Vote Sheet — reused from Discussion */}
        <ProposeVoteSheet
          visible={voteSheetVisible}
          onClose={() => setVoteSheetVisible(false)}
          onPublish={handlePublishVote}
        />
      </View>
    );
  }

  // ==========================================
  // ACTIVE / ARCHIVED STAGE
  // ==========================================
  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView
        contentContainerStyle={{ paddingTop: spacing.md, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Archived banner (reused from Discussion tab) */}
        {isArchived && <ArchivedBanner />}

        {/* AI Safety Check banner (Active only) */}
        {isActive && (
          <SafetyCheckBanner
            title={mockSafetyBanner.title}
            message={mockSafetyBanner.message}
          />
        )}

        {/* Live route map (placeholder) */}
        <LiveRouteMapPlaceholder
          dayNumber={1}
          stopCount={mockItineraryItems.filter(
            (i) => i.day_id === mockItineraryDays[0]?.id
          ).length}
          onReroute={handleReroute}
          disabled={isArchived}
        />

        {/* Suggested Routes header + Reroute pill */}
        <View
          style={[
            styles.suggestedHeader,
            { paddingHorizontal: spacing.lg, marginBottom: spacing.md },
          ]}
        >
          <Text
            style={[
              typography.headlineSm,
              { color: colors.onSurface },
            ]}
          >
            Suggested Routes
          </Text>

          {!isArchived && (
            <TouchableOpacity
              onPress={handleReroute}
              style={[
                styles.reroutePill,
                {
                  backgroundColor: colors.season.soft,
                  borderRadius: rounded.full,
                  paddingHorizontal: spacing.md,
                  paddingVertical: spacing.xs,
                  borderWidth: 1,
                  borderColor: colors.season.main,
                },
              ]}
            >
              <Text style={{ fontSize: 12 }}>🔄</Text>
              <Text
                style={[
                  typography.labelSm,
                  { color: colors.season.accent, fontWeight: '700', marginLeft: 4 },
                ]}
              >
                Reroute
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Route leg cards */}
        <View style={{ paddingHorizontal: spacing.lg }}>
          {suggestedRoutes.map((leg) => {
            // Find landmark for drop-off point
            const landmark = mockLandmarks.find((l: any) => l.id === leg.landmark_id);
            const dropoff = landmark?.dropoff_point;

            return (
              <View key={leg.id}>
                <SuggestedRouteLegCard
                  departureTime={leg.departure_time}
                  from={leg.from}
                  to={leg.to}
                  options={leg.options}
                  disabled={isArchived}
                />

                {/* Exact Drop-off Point sub-card */}
                {dropoff && (
                  <DropoffPointCard
                    name={dropoff.name}
                    notes={dropoff.notes}
                    photoUrl={landmark?.photo_urls?.[0]}
                    verified
                  />
                )}
              </View>
            );
          })}

          {suggestedRoutes.length === 0 && (
            <View
              style={{
                padding: spacing['2xl'],
                alignItems: 'center',
              }}
            >
              <Text style={{ fontSize: 32 }}>🗺️</Text>
              <Text
                style={[
                  typography.bodyMd,
                  {
                    color: colors.onSurfaceVariant,
                    textAlign: 'center',
                    marginTop: spacing.sm,
                  },
                ]}
              >
                No suggested routes yet. Routes will appear once the trip is active and itinerary items are finalized.
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  completePlanningBtn: {
    alignItems: 'center',
  },
  suggestedHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  reroutePill: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
