import React, { useState } from 'react';
import { View, Text, ScrollView, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTheme } from '@/core/theme';
import { Button, Badge, Card } from '@/shared/components';
import { mockDiscoverPosts } from '@/features/discover/data/mock-discover';

export default function DiscoverPostDetailScreen() {
  const { postId } = useLocalSearchParams<{ postId: string }>();
  const { colors, typography, spacing, rounded } = useTheme();
  const router = useRouter();

  const post = mockDiscoverPosts.find((p) => p.id === postId) || mockDiscoverPosts[0];
  const [isStarred, setIsStarred] = useState(post.is_starred || false);
  const [starCount, setStarCount] = useState(post.stars_count);

  const toggleStar = () => {
    setIsStarred(!isStarred);
    setStarCount((prev) => (isStarred ? prev - 1 : prev + 1));
  };

  const handleClone = () => {
    router.push('/(tabs)/trip/create' as any);
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Top Header */}
      <View style={[styles.header, { paddingHorizontal: spacing.lg, paddingVertical: spacing.md }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={{ fontSize: 20 }}>←</Text>
        </TouchableOpacity>
        <Text style={[typography.headlineSm, { color: colors.onSurface }]}>Trip Preview</Text>
        <TouchableOpacity onPress={toggleStar} style={styles.starBtn}>
          <Text style={{ fontSize: 22 }}>{isStarred ? '⭐' : '☆'}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
        <Image source={{ uri: post.cover_image }} style={{ width: '100%', height: 240 }} />

        <View style={{ padding: spacing.lg }}>
          <View style={{ flexDirection: 'row', gap: spacing.xs, marginBottom: spacing.sm }}>
            <Badge label={post.type === 'cloneable_itinerary' ? '📋 Cloneable' : '📖 Recap'} variant="secondary" />
            <Badge label={post.travel_style} variant="season" />
            <Badge label={`${post.duration_days} Days`} variant="outline" />
          </View>

          <Text style={[typography.headlineLg, { color: colors.onSurface }]}>
            {post.title}
          </Text>

          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: spacing.md, marginBottom: spacing.lg }}>
            <Text style={[typography.bodySm, { color: colors.onSurfaceVariant }]}>
              Curated by <Text style={{ fontWeight: '700', color: colors.onSurface }}>{post.author_name}</Text> • {starCount} travelers starred
            </Text>
          </View>

          <Card style={{ marginBottom: spacing.lg }}>
            <Text style={[typography.headlineSm, { color: colors.onSurface, marginBottom: spacing.xs }]}>
              Overview
            </Text>
            <Text style={[typography.bodyMd, { color: colors.onSurfaceVariant }]}>
              {post.content}
            </Text>
          </Card>

          {/* Sample Itinerary Days */}
          <Text style={[typography.headlineSm, { color: colors.onSurface, marginBottom: spacing.md }]}>
            Itinerary Outline
          </Text>

          <View style={{ gap: spacing.md }}>
            <Card variant="outlined">
              <Text style={[typography.labelLg, { color: colors.onSurface, fontWeight: '700' }]}>
                Day 1 • Arrival & City Lights
              </Text>
              <Text style={[typography.bodySm, { color: colors.onSurfaceVariant, marginTop: 4 }]}>
                Check-in, evening walking tour, panoramic observation deck.
              </Text>
            </Card>

            <Card variant="outlined">
              <Text style={[typography.labelLg, { color: colors.onSurface, fontWeight: '700' }]}>
                Day 2 • Cultural Heritage & Shrines
              </Text>
              <Text style={[typography.bodySm, { color: colors.onSurfaceVariant, marginTop: 4 }]}>
                Morning temple exploration, street food lunch, traditional crafts.
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
            backgroundColor: '#ffffff',
            borderTopColor: colors.cardBorder,
            paddingHorizontal: spacing.lg,
            paddingVertical: spacing.md,
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

        {post.type === 'cloneable_itinerary' ? (
          <Button
            title="Clone to My Trips"
            onPress={handleClone}
            variant="primary"
            size="lg"
            style={{ flex: 2 }}
          />
        ) : null}
      </View>
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
  starBtn: {
    padding: 6,
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
