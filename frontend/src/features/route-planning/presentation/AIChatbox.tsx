import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { useTheme } from '@/core/theme';
import { AITripPlanReviewModal } from './AITripPlanReviewModal';

export const AIChatbox: React.FC = () => {
  const { colors, typography, spacing, rounded, shadows } = useTheme();

  const [origin, setOrigin] = useState('Kuala Lumpur (KUL)');
  const [destination, setDestination] = useState('Tokyo, Japan');
  const [dates, setDates] = useState('Oct 1 - Oct 5 (5D)');
  const [promptText, setPromptText] = useState('');
  const [preferencesExpanded, setPreferencesExpanded] = useState(false);

  // Preference selections
  const [companions, setCompanions] = useState('Couple');
  const [travelStyle, setTravelStyle] = useState('Cultural');
  const [travelPace, setTravelPace] = useState('Moderate');

  const [isGenerating, setIsGenerating] = useState(false);
  const [reviewModalVisible, setReviewModalVisible] = useState(false);

  const companionOptions = ['Solo', 'Family', 'Couple', 'Friends'];
  const styleOptions = ['Cultural', 'Classic', 'Nature', 'Cityscape'];
  const paceOptions = ['Ambitious', 'Moderate', 'Relaxed'];

  const quickPrompts = [
    '🍜 5 days Tokyo food & ramen tour',
    '⛩️ Kyoto shrines & bamboo grove trip',
    '⛷️ Hokkaido winter ski & hot spring escape',
  ];

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setReviewModalVisible(true);
    }, 600);
  };

  return (
    <View style={{ marginHorizontal: spacing.lg, marginVertical: spacing.sm }}>
      {/* Master Card Container */}
      <View
        style={[
          styles.card,
          {
            backgroundColor: colors.card,
            borderColor: colors.surfaceContainerHigh,
            borderRadius: rounded['3xl'],
            padding: spacing.lg,
            ...shadows.soft,
          },
        ]}
      >
        {/* Header Row */}
        <View style={styles.headerRow}>
          <View style={styles.titleWithIcon}>
            <View style={[styles.iconSparkle, { backgroundColor: colors.primaryContainer, borderRadius: rounded.md }]}>
              <Text style={{ fontSize: 16 }}>✨</Text>
            </View>
            <View style={{ marginLeft: spacing.sm }}>
              <Text style={[typography.headlineSm, { color: colors.onSurface, fontWeight: '800' }]}>
                AI Trip Planner
              </Text>
              <Text style={[typography.utilityTiny, { color: colors.outline }]}>
                Natural language group itinerary builder
              </Text>
            </View>
          </View>
          <TouchableOpacity activeOpacity={0.8} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Text style={[typography.utilityTiny, { color: colors.primary, fontWeight: '700' }]}>
              See History ↗
            </Text>
          </TouchableOpacity>
        </View>

        {/* Origin Field */}
        <View
          style={[
            styles.fieldRow,
            {
              backgroundColor: colors.surfaceContainerLow,
              borderColor: colors.surfaceContainerHigh,
              borderRadius: rounded.xl,
              paddingHorizontal: spacing.md,
              paddingVertical: spacing.sm,
              marginTop: spacing.md,
            },
          ]}
        >
          <Text style={{ fontSize: 16 }}>🎯</Text>
          <View style={{ marginLeft: spacing.sm, flex: 1 }}>
            <Text style={[typography.utilityTiny, { color: colors.outline, fontWeight: '700' }]}>
              STARTING FROM
            </Text>
            <TextInput
              value={origin}
              onChangeText={setOrigin}
              placeholder="e.g. Kuala Lumpur, New York..."
              placeholderTextColor={colors.outline}
              style={[typography.labelSm, styles.inputField, { color: colors.onSurface }]}
            />
          </View>
          {origin.length > 0 && (
            <TouchableOpacity onPress={() => setOrigin('')} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <Text style={{ fontSize: 14, color: colors.outline }}>✕</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Dual Selection Grid (Heading To & Dates) */}
        <View style={styles.dualGrid}>
          {/* Destination Box */}
          <View
            style={[
              styles.gridBox,
              {
                backgroundColor: colors.surfaceContainerLow,
                borderColor: colors.surfaceContainerHigh,
                borderRadius: rounded.xl,
                padding: spacing.md,
              },
            ]}
          >
            <Text style={[typography.utilityTiny, { color: colors.outline, fontWeight: '700' }]}>
              HEADING TO
            </Text>
            <View style={styles.gridValRow}>
              <Text style={{ fontSize: 14 }}>📍</Text>
              <TextInput
                value={destination}
                onChangeText={setDestination}
                placeholder="Destination"
                placeholderTextColor={colors.outline}
                style={[typography.labelSm, styles.gridInput, { color: colors.onSurface }]}
              />
            </View>
          </View>

          {/* Dates & Duration Box */}
          <View
            style={[
              styles.gridBox,
              {
                backgroundColor: colors.surfaceContainerLow,
                borderColor: colors.surfaceContainerHigh,
                borderRadius: rounded.xl,
                padding: spacing.md,
              },
            ]}
          >
            <Text style={[typography.utilityTiny, { color: colors.outline, fontWeight: '700' }]}>
              DATE / DURATION
            </Text>
            <View style={styles.gridValRow}>
              <Text style={{ fontSize: 14 }}>📅</Text>
              <TextInput
                value={dates}
                onChangeText={setDates}
                placeholder="Dates"
                placeholderTextColor={colors.outline}
                style={[typography.labelSm, styles.gridInput, { color: colors.onSurface }]}
              />
            </View>
          </View>
        </View>

        {/* Collapsible Preferences Section */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => setPreferencesExpanded(!preferencesExpanded)}
          style={[
            styles.prefHeader,
            {
              borderColor: colors.surfaceContainerHigh,
              marginTop: spacing.md,
              paddingVertical: spacing.xs,
            },
          ]}
        >
          <View style={styles.prefHeaderLeft}>
            <Text style={{ fontSize: 14 }}>⚙️</Text>
            <Text style={[typography.labelSm, { color: colors.onSurface, fontWeight: '800', marginLeft: 6 }]}>
              PREFERENCES & STYLES
            </Text>
            <Text style={[typography.utilityTiny, { color: colors.primary, fontWeight: '700', marginLeft: 6 }]}>
              ({companions} • {travelStyle})
            </Text>
          </View>
          <Text style={{ fontSize: 14, color: colors.outline }}>
            {preferencesExpanded ? '▲' : '▼'}
          </Text>
        </TouchableOpacity>

        {preferencesExpanded && (
          <View
            style={[
              styles.prefContent,
              {
                backgroundColor: colors.surfaceContainerLow,
                borderRadius: rounded.xl,
                padding: spacing.md,
                marginTop: spacing.xs,
              },
            ]}
          >
            {/* Companions */}
            <Text style={[typography.utilityTiny, { color: colors.outline, fontWeight: '700', marginBottom: 6 }]}>
              TRAVEL COMPANIONS
            </Text>
            <View style={styles.chipsRow}>
              {companionOptions.map((opt) => {
                const isSelected = companions === opt;
                return (
                  <TouchableOpacity
                    key={opt}
                    activeOpacity={0.8}
                    onPress={() => setCompanions(opt)}
                    style={[
                      styles.prefChip,
                      {
                        backgroundColor: isSelected ? colors.primary : colors.card,
                        borderColor: isSelected ? colors.primary : colors.surfaceContainerHigh,
                        borderRadius: rounded.full,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        typography.utilityTiny,
                        { color: isSelected ? '#ffffff' : colors.onSurface, fontWeight: isSelected ? '800' : '600' },
                      ]}
                    >
                      {opt} {isSelected ? '✓' : ''}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Travel Style */}
            <Text style={[typography.utilityTiny, { color: colors.outline, fontWeight: '700', marginTop: 8, marginBottom: 6 }]}>
              TRAVEL STYLE
            </Text>
            <View style={styles.chipsRow}>
              {styleOptions.map((opt) => {
                const isSelected = travelStyle === opt;
                return (
                  <TouchableOpacity
                    key={opt}
                    activeOpacity={0.8}
                    onPress={() => setTravelStyle(opt)}
                    style={[
                      styles.prefChip,
                      {
                        backgroundColor: isSelected ? colors.primary : colors.card,
                        borderColor: isSelected ? colors.primary : colors.surfaceContainerHigh,
                        borderRadius: rounded.full,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        typography.utilityTiny,
                        { color: isSelected ? '#ffffff' : colors.onSurface, fontWeight: isSelected ? '800' : '600' },
                      ]}
                    >
                      {opt} {isSelected ? '✓' : ''}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Travel Pace */}
            <Text style={[typography.utilityTiny, { color: colors.outline, fontWeight: '700', marginTop: 8, marginBottom: 6 }]}>
              TRAVEL PACE
            </Text>
            <View style={styles.chipsRow}>
              {paceOptions.map((opt) => {
                const isSelected = travelPace === opt;
                return (
                  <TouchableOpacity
                    key={opt}
                    activeOpacity={0.8}
                    onPress={() => setTravelPace(opt)}
                    style={[
                      styles.prefChip,
                      {
                        backgroundColor: isSelected ? colors.primary : colors.card,
                        borderColor: isSelected ? colors.primary : colors.surfaceContainerHigh,
                        borderRadius: rounded.full,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        typography.utilityTiny,
                        { color: isSelected ? '#ffffff' : colors.onSurface, fontWeight: isSelected ? '800' : '600' },
                      ]}
                    >
                      {opt} {isSelected ? '✓' : ''}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        )}

        {/* Conversational Natural Language Input Box */}
        <View
          style={[
            styles.promptBox,
            {
              backgroundColor: colors.surfaceContainerLow,
              borderColor: colors.surfaceContainerHigh,
              borderRadius: rounded.xl,
              padding: spacing.md,
              marginTop: spacing.md,
            },
          ]}
        >
          <TextInput
            value={promptText}
            onChangeText={setPromptText}
            placeholder="Ask AI: I want a Japan itinerary focused on fireworks, local street food & shrines..."
            placeholderTextColor={colors.outline}
            multiline
            style={[typography.bodySm, styles.promptInput, { color: colors.onSurface }]}
          />

          {/* Quick Prompt Ideas */}
          <View style={styles.quickPromptsWrap}>
            {quickPrompts.map((qp, i) => (
              <TouchableOpacity
                key={i}
                activeOpacity={0.75}
                onPress={() => setPromptText(qp)}
                style={[
                  styles.quickPromptChip,
                  { backgroundColor: colors.card, borderRadius: rounded.md },
                ]}
              >
                <Text style={[typography.utilityTiny, { color: colors.onSurfaceVariant }]}>
                  {qp}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Primary CTA Button */}
        <TouchableOpacity
          activeOpacity={0.85}
          disabled={isGenerating}
          onPress={handleGenerate}
          style={[
            styles.planBtn,
            {
              backgroundColor: colors.primary,
              borderRadius: rounded.xl,
              paddingVertical: spacing.md,
              marginTop: spacing.md,
              ...shadows.soft,
            },
          ]}
        >
          {isGenerating ? (
            <View style={styles.loadingRow}>
              <ActivityIndicator size="small" color="#ffffff" />
              <Text style={[typography.labelMd, { color: '#ffffff', fontWeight: '800', marginLeft: 8 }]}>
                Corgi AI Crafting Itinerary...
              </Text>
            </View>
          ) : (
            <Text style={[typography.labelMd, { color: '#ffffff', fontWeight: '800', textAlign: 'center' }]}>
              ✨ Plan a Trip with AI
            </Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Review Modal Dialog */}
      <AITripPlanReviewModal
        visible={reviewModalVisible}
        onClose={() => setReviewModalVisible(false)}
        destination={destination}
        duration={dates}
        preferences={{
          companions,
          style: travelStyle,
          pace: travelPace,
        }}
        prompt={promptText}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    width: '100%',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titleWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconSparkle: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fieldRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
  },
  inputField: {
    height: 24,
    padding: 0,
    marginTop: 2,
    fontWeight: '700',
  },
  dualGrid: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 10,
  },
  gridBox: {
    flex: 1,
    borderWidth: 1,
  },
  gridValRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  gridInput: {
    flex: 1,
    height: 24,
    padding: 0,
    marginLeft: 4,
    fontWeight: '700',
  },
  prefHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  prefHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  prefContent: {
    width: '100%',
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  prefChip: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderWidth: 1,
  },
  promptBox: {
    borderWidth: 1,
  },
  promptInput: {
    minHeight: 52,
    textAlignVertical: 'top',
  },
  quickPromptsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 8,
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
  quickPromptChip: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  planBtn: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
