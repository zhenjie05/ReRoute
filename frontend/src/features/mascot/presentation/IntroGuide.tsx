import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '@/core/theme';
import { Button } from '@/shared/components/Button';

interface GuideSlide {
  icon: string;
  badge: string;
  title: string;
  description: string;
  highlights: string[];
}

const GUIDE_SLIDES: GuideSlide[] = [
  {
    icon: '🧭',
    badge: 'SMART PLANNING',
    title: 'AI-Powered Trip Planning',
    description:
      'Describe your dream destination in plain words. Roti tailors multi-day itineraries, transit routes, and stays matching your pace.',
    highlights: ['Natural Language AI', 'Modular Suggestions', 'Pace & Style Tailored'],
  },
  {
    icon: '👥',
    badge: 'GROUP COLLABORATION',
    title: 'Trip Rooms & Smart Splitting',
    description:
      'Invite friends with a room code. Chat in real-time, vote on group decisions, and scan receipts with OCR for instant bill splitting.',
    highlights: ['Realtime Group Chat', 'OCR Receipt Scanner', 'Polls & Voting Cards'],
  },
  {
    icon: '🛡️',
    badge: 'SAFETY & LIVE ASSIST',
    title: 'Proactive Safety & Reroutes',
    description:
      'Get automated weather & safety warnings for your route, offline survival phrase lessons, and instant one-tap emergency SOS broadcast.',
    highlights: ['Weather Advisories', 'Survival Translation', '1-Tap Emergency SOS'],
  },
];

interface IntroGuideProps {
  onComplete: () => void;
  onSkip?: () => void;
}

export const IntroGuide: React.FC<IntroGuideProps> = ({ onComplete }) => {
  const { colors, typography, spacing, rounded, shadows } = useTheme();
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  const currentSlide = GUIDE_SLIDES[currentSlideIndex];
  const isLastSlide = currentSlideIndex === GUIDE_SLIDES.length - 1;

  const handleNext = () => {
    if (isLastSlide) {
      onComplete();
    } else {
      setCurrentSlideIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex((prev) => prev - 1);
    }
  };

  return (
    <View style={styles.container}>
      {/* Slide Card Container */}
      <View
        style={[
          styles.card,
          {
            backgroundColor: '#ffffff',
            borderColor: colors.surfaceContainerHigh,
            borderRadius: rounded['3xl'] || 28,
            padding: spacing.xl,
            ...shadows.medium,
          },
        ]}
      >
        {/* Top Badge & Icon */}
        <View style={styles.topRow}>
          <View
            style={[
              styles.iconCircle,
              { backgroundColor: colors.primaryContainer, borderRadius: rounded.full },
            ]}
          >
            <Text style={{ fontSize: 32 }}>{currentSlide.icon}</Text>
          </View>

          <View
            style={[
              styles.badgePill,
              {
                backgroundColor: colors.surfaceContainerLow,
                borderColor: colors.surfaceContainerHigh,
                borderRadius: rounded.full,
              },
            ]}
          >
            <Text
              style={[
                typography.utilityTiny,
                { color: colors.primary, fontWeight: '800', letterSpacing: 0.5 },
              ]}
            >
              {currentSlide.badge}
            </Text>
          </View>
        </View>

        {/* Title & Description */}
        <Text
          style={[
            typography.headlineMd,
            {
              color: colors.onSurface,
              fontWeight: '800',
              marginTop: spacing.md,
              marginBottom: spacing.xs,
            },
          ]}
        >
          {currentSlide.title}
        </Text>

        <Text
          style={[
            typography.bodyMd,
            {
              color: colors.onSurfaceVariant,
              lineHeight: 22,
              marginBottom: spacing.md,
            },
          ]}
        >
          {currentSlide.description}
        </Text>

        {/* Highlight Chips */}
        <View style={styles.chipsRow}>
          {currentSlide.highlights.map((item, idx) => (
            <View
              key={idx}
              style={[
                styles.chip,
                {
                  backgroundColor: colors.surfaceContainerLow,
                  borderColor: colors.surfaceContainerHigh,
                  borderRadius: rounded.md,
                },
              ]}
            >
              <Text
                style={[
                  typography.utilityTiny,
                  { color: colors.onSurface, fontWeight: '700' },
                ]}
              >
                ✓ {item}
              </Text>
            </View>
          ))}
        </View>

        {/* Pagination Dots */}
        <View style={styles.dotsRow}>
          {GUIDE_SLIDES.map((_, idx) => {
            const isActive = idx === currentSlideIndex;
            return (
              <TouchableOpacity
                key={idx}
                onPress={() => setCurrentSlideIndex(idx)}
                style={[
                  styles.dot,
                  {
                    backgroundColor: isActive ? colors.primary : colors.outlineVariant,
                    width: isActive ? 24 : 8,
                    borderRadius: rounded.full,
                  },
                ]}
              />
            );
          })}
        </View>

        {/* Action Controls */}
        <View style={styles.actionsRow}>
          {currentSlideIndex > 0 ? (
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={handlePrev}
              style={[
                styles.backBtn,
                {
                  borderColor: colors.outlineVariant,
                  borderRadius: rounded.xl,
                  paddingHorizontal: spacing.lg,
                  paddingVertical: spacing.md - 2,
                },
              ]}
            >
              <Text style={[typography.labelSm, { color: colors.onSurfaceVariant, fontWeight: '700' }]}>
                ← Back
              </Text>
            </TouchableOpacity>
          ) : <View style={{ width: 80 }} />}

          <Button
            title={isLastSlide ? '🚀 Get Started' : 'Next →'}
            onPress={handleNext}
            variant="primary"
            size="md"
            style={{ flex: 1, maxWidth: 180 }}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    marginVertical: 10,
  },
  card: {
    width: '100%',
    maxWidth: 380,
    borderWidth: 1,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  iconCircle: {
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgePill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 16,
  },
  chip: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderWidth: 1,
  },
  dotsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginVertical: 12,
  },
  dot: {
    height: 8,
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
    gap: 12,
  },
  backBtn: {
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
