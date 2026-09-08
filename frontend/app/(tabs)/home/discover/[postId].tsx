import React, { useState } from 'react';
import { View, Text, ScrollView, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTheme } from '@/core/theme';
import { Button, Badge, Card, Avatar } from '@/shared/components';
import { mockDiscoverPosts } from '@/features/discover/data/mock-discover';

export default function DiscoverPostDetailScreen() {
  const { postId, source } = useLocalSearchParams<{ postId: string; source?: string }>();
  const { colors, typography, spacing, shadows } = useTheme();
  const router = useRouter();

  const post = mockDiscoverPosts.find((p) => p.id === postId) || mockDiscoverPosts[0];
  const [isStarred, setIsStarred] = useState(post.is_starred || false);
  const [starCount, setStarCount] = useState(post.stars_count);

  const toggleStar = () => {
    setIsStarred(!isStarred);
    setStarCount((prev) => (isStarred ? prev - 1 : prev + 1));
  };

  const handleClone = () => {
    // Clone itinerary into a new Planning Trip Room (FR-8-5)
    router.push(`/(tabs)/trip/setup/new?clone_post_id=${post.id}` as any);
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Top Header Bar */}
      <View
        style={[
          styles.header,
          {
            backgroundColor: colors.surface,
            borderBottomColor: colors.surfaceContainerHigh,
            paddingHorizontal: spacing.lg,
            paddingVertical: spacing.md,
            ...shadows.soft,
          },
        ]}
      >
        <TouchableOpacity
          onPress={() => router.navigate('/(tabs)/profile' as any)}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          style={styles.backBtn}
        >
          <Text style={{ fontSize: 20, color: colors.onSurface }}>←</Text>
        </TouchableOpacity>
        <Text style={[typography.headlineSm, { color: colors.onSurface, fontWeight: '800' }]}>
          Itinerary Preview
        </Text>
        <TouchableOpacity
          onPress={toggleStar}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          style={styles.starBtn}
        >
          <Text style={{ fontSize: 22 }}>{isStarred ? '⭐' : '☆'}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 200 }}>
        {/* Hero Cover Image */}
        <Image source={{ uri: post.cover_image }} style={styles.heroImage} />

        <View style={{ padding: spacing.lg }}>
          {/* Badges Row */}
          <View style={styles.badgeRow}>
            <Badge
              label={post.type === 'cloneable_itinerary' ? '📋 Cloneable Itinerary' : '📖 Trip Recap'}
              variant={post.type === 'cloneable_itinerary' ? 'primary' : 'secondary'}
            />
            <Badge label={post.travel_style} variant="season" />
            <Badge label={`${post.duration_days} Days`} variant="outline" />
          </View>

          {/* Title */}
          <Text style={[typography.headlineLg, { color: colors.onSurface, fontWeight: '800', marginTop: spacing.xs }]}>
            {post.title}
          </Text>

          {/* Author Profile Row */}
          <View style={styles.authorBar}>
            <Avatar uri={post.author_avatar} name={post.author_name} size={32} />
            <View style={{ marginLeft: spacing.xs }}>
              <Text style={[typography.labelSm, { color: colors.onSurface, fontWeight: '700' }]}>
                Curated by {post.author_name}
              </Text>
              <Text style={[typography.utilityTiny, { color: colors.outline }]}>
                ★ {starCount} travelers starred this guide
              </Text>
            </View>
          </View>

          {/* Overview Section */}
          <Card style={{ marginBottom: spacing.md }}>
            <Text style={[typography.headlineSm, { color: colors.onSurface, fontWeight: '800', marginBottom: spacing.xs }]}>
              Overview & Concept
            </Text>
            <Text style={[typography.bodyMd, { color: colors.onSurfaceVariant, lineHeight: 22 }]}>
              {post.content}
            </Text>
          </Card>

          {/* Day-by-Day Timeline Outline */}
          <Text style={[typography.headlineSm, { color: colors.onSurface, fontWeight: '800', marginVertical: spacing.sm }]}>
            Itinerary Outline ({post.duration_days} Days)
          </Text>

          <View style={{ gap: spacing.sm }}>
            <Card variant="outlined">
              <Text style={[typography.labelLg, { color: colors.onSurface, fontWeight: '800' }]}>
                Day 1 • Arrival, City Lights & Gastronomy
              </Text>
              <Text style={[typography.bodySm, { color: colors.onSurfaceVariant, marginTop: 4, lineHeight: 18 }]}>
                Airport transfer, check-in, evening panoramic observatory deck, street food alleyways.
              </Text>
            </Card>

            <Card variant="outlined">
              <Text style={[typography.labelLg, { color: colors.onSurface, fontWeight: '800' }]}>
                Day 2 • Historic Temples & Cultural Heritage
              </Text>
              <Text style={[typography.bodySm, { color: colors.onSurfaceVariant, marginTop: 4, lineHeight: 18 }]}>
                Morning temple exploration, Nakamise shopping street, traditional tea house experience.
              </Text>
            </Card>

            <Card variant="outlined">
              <Text style={[typography.labelLg, { color: colors.onSurface, fontWeight: '800' }]}>
                Day 3 • Modern Districts & Scenic Nature Escapes
              </Text>
              <Text style={[typography.bodySm, { color: colors.onSurfaceVariant, marginTop: 4, lineHeight: 18 }]}>
                Scenic gardens, high-speed rail hop, trendy cafe hopping and local market souvenirs.
              </Text>
            </Card>
          </View>
        </View>
      </ScrollView>

      {/* Sticky Bottom Actions (Star & Clone) */}
      <View
        style={[
          styles.bottomBar,
          {
            backgroundColor: colors.surface,
            borderTopColor: colors.surfaceContainerHigh,
            paddingHorizontal: spacing.lg,
            paddingVertical: spacing.md,
            bottom: 100, // Elevated above global Bottom Navigation Bar
            ...shadows.medium,
          },
        ]}
      >
        <Button
          title={isStarred ? 'Starred ⭐' : 'Star Trip ☆'}
          onPress={toggleStar}
          variant="outline"
          size="lg"
          style={{ flex: 1, marginRight: spacing.md }}
        />

        {post.type === 'cloneable_itinerary' && (
          <Button
            title="Clone to My Trips 🚀"
            onPress={handleClone}
            variant="primary"
            size="lg"
            style={{ flex: 2 }}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
  },
  backBtn: {
    padding: 6,
  },
  starBtn: {
    padding: 6,
  },
  heroImage: {
    width: '100%',
    height: 220,
    backgroundColor: '#e2e8f0',
  },
  badgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 6,
  },
  authorBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 16,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
  },
});
