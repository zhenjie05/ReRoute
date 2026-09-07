import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/core/theme';
import { Button } from '@/shared/components/Button';

interface AITripPlanReviewModalProps {
  visible: boolean;
  onClose: () => void;
  destination?: string;
  duration?: string;
  preferences?: {
    companions: string;
    style: string;
    pace: string;
  };
  prompt?: string;
}

export const AITripPlanReviewModal: React.FC<AITripPlanReviewModalProps> = ({
  visible,
  onClose,
  destination = 'Tokyo, Japan',
  duration = 'Oct 1 - Oct 5 (5D)',
  preferences = {
    companions: 'Couple',
    style: 'Cultural',
    pace: 'Moderate',
  },
  prompt,
}) => {
  const { colors, typography, spacing, rounded, shadows } = useTheme();
  const router = useRouter();
  const [selectedDay, setSelectedDay] = useState(1);

  const days = [
    { day: 1, date: 'Oct 1', active: true },
    { day: 2, date: 'Oct 2', active: false },
    { day: 3, date: 'Oct 3', active: false },
    { day: 4, date: 'Oct 4', active: false },
    { day: 5, date: 'Oct 5', active: false },
  ];

  const handleCreateTripRoom = () => {
    onClose();
    // Navigate to new trip room setup or direct room view in planning stage
    router.push('/(tabs)/trip/setup/new' as any);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.backdrop}>
        <TouchableOpacity style={styles.scrim} activeOpacity={1} onPress={onClose} />
        <View
          style={[
            styles.sheet,
            {
              backgroundColor: colors.surface,
              borderTopLeftRadius: rounded.cardLarge,
              borderTopRightRadius: rounded.cardLarge,
              paddingTop: spacing.md,
              ...shadows.medium,
            },
          ]}
        >
          {/* Top Drag Handle */}
          <View
            style={[
              styles.handle,
              { backgroundColor: colors.outlineVariant, borderRadius: rounded.full },
            ]}
          />

          {/* Header Row */}
          <View style={[styles.headerBar, { paddingHorizontal: spacing.lg }]}>
            <View style={styles.headerLeft}>
              <View
                style={[
                  styles.sparkleBox,
                  { backgroundColor: colors.primaryContainer, borderRadius: rounded.full },
                ]}
              >
                <Text style={{ fontSize: 16 }}>✨</Text>
              </View>
              <View style={{ marginLeft: spacing.sm }}>
                <Text style={[typography.headlineSm, { color: colors.onSurface, fontWeight: '800' }]}>
                  Review Trip Plan
                </Text>
                <Text style={[typography.utilityTiny, { color: colors.onSurfaceVariant }]}>
                  AI tailored for your group
                </Text>
              </View>
            </View>

            <TouchableOpacity
              onPress={onClose}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              style={[
                styles.closeBtn,
                { backgroundColor: colors.surfaceContainerLow, borderRadius: rounded.full },
              ]}
            >
              <Text style={{ fontSize: 14, color: colors.onSurfaceVariant }}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: spacing.lg, paddingBottom: spacing['2xl'] }}
          >
            {/* Preferences Summary Card */}
            <View
              style={[
                styles.summaryCard,
                {
                  backgroundColor: colors.surfaceContainerLow,
                  borderColor: colors.surfaceContainerHigh,
                  borderRadius: rounded.xl,
                  padding: spacing.md,
                  marginVertical: spacing.sm,
                },
              ]}
            >
              <View style={styles.summaryTopRow}>
                <Text style={[typography.utilityTiny, { color: colors.outline, fontWeight: '800' }]}>
                  PREFERENCES SUMMARY
                </Text>
                <View
                  style={[
                    styles.matchBadge,
                    { backgroundColor: '#dcfce7', borderRadius: rounded.full },
                  ]}
                >
                  <Text style={[typography.utilityTiny, { color: '#15803d', fontWeight: '800' }]}>
                    ★ Matched 98%
                  </Text>
                </View>
              </View>

              <View style={styles.gridRow}>
                <View style={{ flex: 1 }}>
                  <Text style={[typography.utilityTiny, { color: colors.outline }]}>HEADING TO</Text>
                  <Text style={[typography.labelSm, { color: colors.onSurface, fontWeight: '800', marginTop: 2 }]}>
                    📍 {destination}
                  </Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[typography.utilityTiny, { color: colors.outline }]}>DATES / DURATION</Text>
                  <Text style={[typography.labelSm, { color: colors.onSurface, fontWeight: '800', marginTop: 2 }]}>
                    📅 {duration}
                  </Text>
                </View>
              </View>

              <View style={styles.weightsRow}>
                <Text style={[typography.utilityTiny, { color: colors.onSurfaceVariant, marginBottom: 4 }]}>
                  Active AI logic weights:
                </Text>
                <View style={styles.chipsWrap}>
                  <View style={[styles.weightChip, { backgroundColor: colors.card, borderRadius: rounded.md }]}>
                    <Text style={[typography.utilityTiny, { color: colors.onSurface, fontWeight: '700' }]}>
                      👥 {preferences.companions}
                    </Text>
                  </View>
                  <View style={[styles.weightChip, { backgroundColor: colors.card, borderRadius: rounded.md }]}>
                    <Text style={[typography.utilityTiny, { color: colors.onSurface, fontWeight: '700' }]}>
                      🏛️ {preferences.style}
                    </Text>
                  </View>
                  <View style={[styles.weightChip, { backgroundColor: colors.card, borderRadius: rounded.md }]}>
                    <Text style={[typography.utilityTiny, { color: colors.onSurface, fontWeight: '700' }]}>
                      ⚖️ {preferences.pace}
                    </Text>
                  </View>
                </View>
              </View>

              {/* Soft-Gate Notice (FR-1-3a) */}
              <Text style={[typography.utilityTiny, { color: colors.outline, marginTop: spacing.xs, fontStyle: 'italic', lineHeight: 14 }]}>
                ℹ️ Using recommended defaults for unspecified parameters. You can modify these anytime in Trip Room settings.
              </Text>
            </View>

            {/* Itinerary Ideas Header */}
            <View style={styles.sectionHeaderRow}>
              <View>
                <Text style={[typography.labelMd, { color: colors.onSurface, fontWeight: '800' }]}>
                  Itinerary Ideas
                </Text>
                <Text style={[typography.utilityTiny, { color: colors.outline }]}>
                  Day {selectedDay} Curated Stepper
                </Text>
              </View>
              <View style={[styles.modulesBadge, { backgroundColor: colors.primaryContainer, borderRadius: rounded.full }]}>
                <Text style={[typography.utilityTiny, { color: colors.onPrimaryContainer, fontWeight: '800' }]}>
                  3 Modules
                </Text>
              </View>
            </View>

            {/* Day Selector Stepper Strip */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.daysStrip}>
              {days.map((d) => {
                const isSelected = selectedDay === d.day;
                return (
                  <TouchableOpacity
                    key={d.day}
                    activeOpacity={0.8}
                    onPress={() => setSelectedDay(d.day)}
                    style={[
                      styles.dayChip,
                      {
                        backgroundColor: isSelected ? colors.onSurface : colors.surfaceContainerLow,
                        borderColor: isSelected ? colors.onSurface : colors.surfaceContainerHigh,
                        borderRadius: rounded.full,
                      },
                    ]}
                  >
                    {isSelected && <View style={[styles.orangeDot, { backgroundColor: colors.primary }]} />}
                    <Text
                      style={[
                        typography.utilityTiny,
                        {
                          color: isSelected ? '#ffffff' : colors.onSurfaceVariant,
                          fontWeight: isSelected ? '800' : '600',
                        },
                      ]}
                    >
                      {d.date}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            {/* Timeline Stops Stepper */}
            <View style={styles.timelineContainer}>
              {/* Stop 1: Transportation */}
              <View style={styles.timelineItem}>
                <View style={styles.stepperCol}>
                  <View style={[styles.stepDot, { backgroundColor: colors.primary }]} />
                  <View style={[styles.stepLine, { backgroundColor: colors.outlineVariant }]} />
                </View>
                <View
                  style={[
                    styles.stepCard,
                    {
                      backgroundColor: colors.card,
                      borderColor: colors.surfaceContainerHigh,
                      borderRadius: rounded.xl,
                      padding: spacing.md,
                      ...shadows.soft,
                    },
                  ]}
                >
                  <View style={styles.cardHeaderRow}>
                    <Text style={[typography.utilityTiny, { color: colors.primary, fontWeight: '800' }]}>
                      ✈️ HOW TO GET THERE
                    </Text>
                    <View style={[styles.optBadge, { backgroundColor: colors.primaryContainer, borderRadius: rounded.md }]}>
                      <Text style={[typography.utilityTiny, { color: colors.onPrimaryContainer, fontWeight: '700' }]}>
                        ✨ Optimized for Time
                      </Text>
                    </View>
                  </View>
                  <Text style={[typography.labelMd, { color: colors.onSurface, fontWeight: '800', marginTop: 4 }]}>
                    Kuala Lumpur (KUL) ✈️ Haneda (HND)
                  </Text>
                  <View style={styles.flightMetaRow}>
                    <Text style={[typography.utilityTiny, { color: colors.outline }]}>
                      09:10 - 17:10 • Direct (7h 00m)
                    </Text>
                    <Text style={[typography.utilityTiny, { color: colors.onSurface, fontWeight: '800' }]}>
                      $340 / person
                    </Text>
                  </View>
                </View>
              </View>

              {/* Stop 2: Attractions & Sights */}
              <View style={styles.timelineItem}>
                <View style={styles.stepperCol}>
                  <View style={[styles.stepDot, { backgroundColor: colors.primary }]} />
                  <View style={[styles.stepLine, { backgroundColor: colors.outlineVariant }]} />
                </View>
                <View
                  style={[
                    styles.stepCard,
                    {
                      backgroundColor: colors.card,
                      borderColor: colors.surfaceContainerHigh,
                      borderRadius: rounded.xl,
                      padding: spacing.md,
                      ...shadows.soft,
                    },
                  ]}
                >
                  <View style={styles.cardHeaderRow}>
                    <Text style={[typography.utilityTiny, { color: colors.primary, fontWeight: '800' }]}>
                      ✨ WHAT TO SEE & DO
                    </Text>
                    <View style={[styles.optBadge, { backgroundColor: '#dcfce7', borderRadius: rounded.md }]}>
                      <Text style={[typography.utilityTiny, { color: '#15803d', fontWeight: '700' }]}>
                        Free Entry
                      </Text>
                    </View>
                  </View>
                  <Text style={[typography.labelMd, { color: colors.onSurface, fontWeight: '800', marginTop: 4 }]}>
                    Senso-ji Temple & Nakamise Street
                  </Text>
                  <Text style={[typography.bodySm, { color: colors.onSurfaceVariant, marginVertical: 4, lineHeight: 18 }]}>
                    Tokyo’s oldest temple with iconic giant red lanterns and vibrant street food stalls.
                  </Text>
                  <View style={styles.metaChipsRow}>
                    <View style={[styles.miniChip, { backgroundColor: colors.surfaceContainerLow, borderRadius: rounded.md }]}>
                      <Text style={[typography.utilityTiny, { color: colors.onSurface }]}>🕒 2 - 3 hours</Text>
                    </View>
                    <View style={[styles.miniChip, { backgroundColor: colors.surfaceContainerLow, borderRadius: rounded.md }]}>
                      <Text style={[typography.utilityTiny, { color: colors.onSurface }]}>☀️ Best at 14:00</Text>
                    </View>
                    <View style={[styles.miniChip, { backgroundColor: '#fef3c7', borderRadius: rounded.md }]}>
                      <Text style={[typography.utilityTiny, { color: '#b45309', fontWeight: '700' }]}>★ 4.8 / 5.0</Text>
                    </View>
                  </View>
                </View>
              </View>

              {/* Stop 3: Stay / Accommodation */}
              <View style={styles.timelineItem}>
                <View style={styles.stepperCol}>
                  <View style={[styles.stepDot, { backgroundColor: colors.outlineVariant }]} />
                </View>
                <View
                  style={[
                    styles.stepCard,
                    {
                      backgroundColor: colors.surfaceContainerLow,
                      borderColor: colors.outlineVariant,
                      borderStyle: 'dashed',
                      borderRadius: rounded.xl,
                      padding: spacing.md,
                    },
                  ]}
                >
                  <Text style={[typography.utilityTiny, { color: colors.outline, fontWeight: '800' }]}>
                    🏨 WHERE TO STAY
                  </Text>
                  <Text style={[typography.utilityTiny, { color: colors.onSurfaceVariant, marginVertical: 4 }]}>
                    No hotel locked in for Day 1 yet. Choose nearby Asakusa or Shinjuku Ryokan.
                  </Text>
                  <TouchableOpacity
                    activeOpacity={0.8}
                    style={[
                      styles.addStayBtn,
                      { borderColor: colors.primary, borderRadius: rounded.lg },
                    ]}
                  >
                    <Text style={[typography.utilityTiny, { color: colors.primary, fontWeight: '800' }]}>
                      + Add Suggested Stay
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            {/* Primary Action Button */}
            <View style={{ marginTop: spacing.lg }}>
              <Button
                title="🚀 Create Trip Room"
                onPress={handleCreateTripRoom}
                variant="primary"
                size="lg"
              />
              <Text style={[typography.utilityTiny, { color: colors.outline, textAlign: 'center', marginTop: 8 }]}>
                🛡️ Collaborative sync enabled • Saves into your private Planning trips
              </Text>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(10, 15, 17, 0.6)',
    justifyContent: 'flex-end',
  },
  scrim: {
    flex: 1,
  },
  sheet: {
    maxHeight: '92%',
    width: '100%',
  },
  handle: {
    width: 36,
    height: 4,
    alignSelf: 'center',
    marginBottom: 10,
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sparkleBox: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeBtn: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  summaryCard: {
    borderWidth: 1,
  },
  summaryTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  matchBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  gridRow: {
    flexDirection: 'row',
    gap: 12,
    marginVertical: 4,
  },
  weightsRow: {
    marginTop: 6,
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
  chipsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  weightChip: {
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 8,
  },
  modulesBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  daysStrip: {
    flexDirection: 'row',
    gap: 8,
    paddingBottom: 8,
  },
  dayChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderWidth: 1,
    gap: 4,
  },
  orangeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  timelineContainer: {
    marginTop: 8,
  },
  timelineItem: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  stepperCol: {
    width: 24,
    alignItems: 'center',
    marginRight: 8,
  },
  stepDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    marginTop: 4,
  },
  stepLine: {
    width: 2,
    flex: 1,
    marginVertical: 4,
  },
  stepCard: {
    flex: 1,
    borderWidth: 1,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  optBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  flightMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  metaChipsRow: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 6,
  },
  miniChip: {
    paddingHorizontal: 6,
    paddingVertical: 3,
  },
  addStayBtn: {
    borderWidth: 1,
    paddingVertical: 4,
    paddingHorizontal: 8,
    alignSelf: 'flex-start',
    marginTop: 4,
  },
});
