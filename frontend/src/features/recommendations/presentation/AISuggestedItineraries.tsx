import React from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/core/theme';
import { mockRecommendations, RecommendedTrip } from '@/features/recommendations/data/mock-recommendations';

export const AISuggestedItineraries: React.FC = () => {
  const { colors, typography, spacing, rounded, shadows } = useTheme();
  const router = useRouter();

  const handleCardPress = (trip: RecommendedTrip) => {
    router.push(`/(tabs)/home/discover/${trip.clone_post_id}` as any);
  };

  const handleClonePress = (trip: RecommendedTrip) => {
    router.push(`/(tabs)/trip/setup/new?clone_post_id=${trip.clone_post_id}` as any);
  };

  return (
    <View style={{ marginVertical: spacing.sm }}>
      {/* Section Header */}
      <View style={[styles.headerRow, { paddingHorizontal: spacing.lg }]}>
        <View>
          <View style={styles.titleRow}>
            <Text style={{ fontSize: 16 }}>✨</Text>
            <Text style={[typography.headlineSm, { color: colors.onSurface, fontWeight: '800', marginLeft: 6 }]}>
              Trending AI Itineraries
            </Text>
          </View>
          <Text style={[typography.utilityTiny, { color: colors.outline }]}>
            from 1.2k anonymized traveler journeys
          </Text>
        </View>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => router.push('/(tabs)/home/discover/post-kyoto-1' as any)}
        >
          <Text style={[typography.utilityTiny, { color: colors.primary, fontWeight: '700' }]}>
            View All →
          </Text>
        </TouchableOpacity>
      </View>

      {/* Horizontal Carousel */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={[styles.carouselContainer, { paddingHorizontal: spacing.lg }]}
      >
        {mockRecommendations.map((trip) => (
          <TouchableOpacity
            key={trip.id}
            activeOpacity={0.9}
            onPress={() => handleCardPress(trip)}
            style={[
              styles.card,
              {
                backgroundColor: colors.card,
                borderColor: colors.surfaceContainerHigh,
                borderRadius: rounded['2xl'],
                ...shadows.soft,
              },
            ]}
          >
            {/* Hero Image & Match Badge */}
            <View style={styles.imageBox}>
              <Image source={{ uri: trip.cover_image }} style={styles.coverImg} />
              <View
                style={[
                  styles.matchBadge,
                  {
                    backgroundColor: 'rgba(255, 255, 255, 0.92)',
                    borderColor: colors.primary,
                    borderRadius: rounded.full,
                  },
                ]}
              >
                <Text style={[typography.utilityTiny, { color: colors.primary, fontWeight: '900' }]}>
                  ★ {trip.match_score}% Match
                </Text>
              </View>
            </View>

            {/* Content Body */}
            <View style={{ padding: spacing.sm }}>
              <Text
                style={[typography.labelMd, { color: colors.onSurface, fontWeight: '800' }]}
                numberOfLines={1}
              >
                {trip.title}
              </Text>

              <Text
                style={[typography.utilityTiny, { color: colors.onSurfaceVariant, marginTop: 2 }]}
                numberOfLines={1}
              >
                {trip.match_tags.join(' • ')} ({trip.duration_days} Days)
              </Text>

              {/* Card Footer: Clone Counter + Clone CTA */}
              <View style={styles.cardFooter}>
                <Text style={[typography.utilityTiny, { color: colors.outline }]}>
                  📋 243 cloned
                </Text>

                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => handleClonePress(trip)}
                  style={[
                    styles.cloneBtn,
                    {
                      backgroundColor: colors.primary,
                      borderRadius: rounded.lg,
                      paddingVertical: 3,
                      paddingHorizontal: 8,
                    },
                  ]}
                >
                  <Text style={[typography.utilityTiny, { color: '#ffffff', fontWeight: '800' }]}>
                    Clone
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  carouselContainer: {
    flexDirection: 'row',
    gap: 12,
    paddingVertical: 4,
  },
  card: {
    width: 230,
    borderWidth: 1,
    overflow: 'hidden',
  },
  imageBox: {
    position: 'relative',
    width: '100%',
    height: 110,
  },
  coverImg: {
    width: '100%',
    height: '100%',
    backgroundColor: '#e2e8f0',
  },
  matchBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderWidth: 1,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
  cloneBtn: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
