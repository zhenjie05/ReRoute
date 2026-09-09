import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/core/theme';
import { CommunityPost } from '@/models/discover';
import { Avatar } from '@/shared/components/Avatar';
import { cloneDiscoverItinerary } from '@/features/discover/data/mock-discover';

interface DiscoverPostCardProps {
  post: CommunityPost;
  onToggleStar: (postId: string) => void;
  onClone?: (postId: string) => void;
  sourceTab?: string;
}

export const DiscoverPostCard: React.FC<DiscoverPostCardProps> = ({
  post,
  onToggleStar,
  onClone,
  sourceTab,
}) => {
  const { colors, typography, spacing, rounded, shadows } = useTheme();
  const router = useRouter();

  const handleCardPress = () => {
    if (sourceTab) {
      router.push(`/(tabs)/home/discover/${post.id}?source=${sourceTab}` as any);
    } else {
      router.push(`/(tabs)/home/discover/${post.id}` as any);
    }
  };

  const handleClonePress = (e: any) => {
    e.stopPropagation?.();
    if (onClone) {
      onClone(post.id);
    } else {
      const newRoom = cloneDiscoverItinerary(post.id);
      Alert.alert(
        'Itinerary Cloned! 🎉',
        `"${post.title}" has been copied into a new Planning Trip Room.`,
        [
          {
            text: 'View Itinerary 📅',
            onPress: () => router.push(`/(tabs)/trip/room/${newRoom.id}/itinerary` as any),
          },
          { text: 'Keep Browsing', style: 'cancel' },
        ]
      );
    }
  };

  const isCloneable = post.type === 'cloneable_itinerary';

  return (
    <TouchableOpacity
      activeOpacity={0.92}
      onPress={handleCardPress}
      style={[
        styles.card,
        {
          backgroundColor: colors.card,
          borderColor: colors.surfaceContainerHigh,
          borderRadius: rounded['2xl'],
          marginBottom: spacing.md,
          ...shadows.soft,
        },
      ]}
    >
      {/* Cover Image with Badges */}
      <View style={styles.imageWrapper}>
        <Image
          source={{ uri: post.cover_image }}
          style={[
            styles.coverImage,
            { borderTopLeftRadius: rounded['2xl'], borderTopRightRadius: rounded['2xl'] },
          ]}
        />
        <View style={styles.badgeOverlay}>
          {isCloneable ? (
            <View style={[styles.clonesBadge, { backgroundColor: '#dcfce7', borderRadius: rounded.full }]}>
              <Text style={[typography.utilityTiny, { color: '#15803d', fontWeight: '800' }]}>
                {post.clones_count ? `${post.clones_count} Clones` : '12 Clones'}
              </Text>
            </View>
          ) : (
            <View style={[styles.locationBadge, { backgroundColor: 'rgba(255,255,255,0.92)', borderRadius: rounded.full }]}>
              <Text style={[typography.utilityTiny, { color: colors.onSurface, fontWeight: '700' }]}>
                📖 Recap
              </Text>
            </View>
          )}
          <View style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)', borderRadius: rounded.full, paddingHorizontal: 8, paddingVertical: 4 }}>
            <Text style={[typography.utilityTiny, { color: '#FFFFFF', fontWeight: '800' }]}>
              {post.duration_days} Days
            </Text>
          </View>
          {post.budget_tier && (
            <View style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)', borderRadius: rounded.full, paddingHorizontal: 8, paddingVertical: 4 }}>
              <Text style={[typography.utilityTiny, { color: '#FFFFFF', fontWeight: '800' }]}>
                {post.budget_tier}
              </Text>
            </View>
          )}
        </View>
      </View>

      {/* Content Container */}
      <View style={{ padding: spacing.md }}>
        {/* Author Row */}
        <View style={styles.authorRow}>
          <View style={styles.authorInfo}>
            <Avatar uri={post.author_avatar} name={post.author_name} size={28} />
            <View style={{ marginLeft: spacing.xs }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                <Text style={[typography.utilityTiny, { color: colors.onSurface, fontWeight: '700' }]}>
                  {post.author_name}
                </Text>
                {post.author_level && (
                  <View style={[styles.lvlBadge, { backgroundColor: '#e2f7e2', borderRadius: rounded.sm }]}>
                    <Text style={{ fontSize: 9, color: '#1e3a1e', fontWeight: '800' }}>
                      {post.author_level}
                    </Text>
                  </View>
                )}
              </View>
              <Text style={[typography.utilityTiny, { color: colors.outline, fontSize: 10 }]}>
                {post.travel_style} Explorer
              </Text>
            </View>
          </View>

          {/* Star Toggle Button (Save) */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={(e) => {
              e.stopPropagation?.();
              onToggleStar(post.id);
            }}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            style={[
              styles.starBtn,
              {
                backgroundColor: post.is_starred ? '#fef3c7' : colors.surfaceContainerLow,
                borderColor: post.is_starred ? '#fde68a' : colors.surfaceContainerHigh,
                borderRadius: rounded.full,
              },
            ]}
          >
            <Text style={{ fontSize: 13 }}>{post.is_starred ? '⭐' : '☆'}</Text>
            <Text
              style={[
                typography.utilityTiny,
                {
                  color: post.is_starred ? '#b45309' : colors.outline,
                  fontWeight: '800',
                  marginLeft: 4,
                },
              ]}
            >
              {post.stars_count}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Title & Description */}
        <Text style={[typography.labelLg, { color: colors.onSurface, fontWeight: '800', marginTop: spacing.xs }]}>
          {post.title}
        </Text>

        <Text
          style={[
            typography.bodySm,
            { color: colors.onSurfaceVariant, marginVertical: spacing.xs, lineHeight: 18 },
          ]}
          numberOfLines={2}
        >
          {post.content}
        </Text>

        {/* Key Stops Preview (if available) */}
        {post.key_stops && post.key_stops.length > 0 && (
          <View style={[styles.keyStopsBox, { backgroundColor: colors.surfaceContainerLow, borderRadius: rounded.lg }]}>
            <Text style={[typography.utilityTiny, { color: colors.outline, fontWeight: '800', fontSize: 9, marginBottom: 2 }]}>
              KEY STOPS
            </Text>
            {post.key_stops.slice(0, 2).map((stop, idx) => (
              <Text
                key={idx}
                style={[typography.utilityTiny, { color: colors.onSurfaceVariant, fontSize: 11 }]}
                numberOfLines={1}
              >
                📍 {stop}
              </Text>
            ))}
          </View>
        )}

        {/* Card Footer Actions */}
        <View style={styles.footerRow}>
          <Text style={[typography.utilityTiny, { color: colors.outline, fontWeight: '600' }]}>
            📍 {post.destination}
          </Text>

          {isCloneable && (
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handleClonePress}
              style={[
                styles.cloneBtn,
                {
                  backgroundColor: colors.primary,
                  borderRadius: rounded.xl,
                  paddingVertical: 6,
                  paddingHorizontal: 14,
                },
              ]}
            >
              <Text style={[typography.utilityTiny, { color: '#ffffff', fontWeight: '800' }]}>
                📋 Clone
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    overflow: 'hidden',
    width: '100%',
  },
  imageWrapper: {
    position: 'relative',
    width: '100%',
    height: 150,
  },
  coverImage: {
    width: '100%',
    height: '100%',
    backgroundColor: '#e2e8f0',
  },
  badgeOverlay: {
    position: 'absolute',
    top: 8,
    left: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  clonesBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  locationBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  authorRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  authorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  lvlBadge: {
    paddingHorizontal: 4,
    paddingVertical: 1,
  },
  starBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderWidth: 1,
  },
  keyStopsBox: {
    padding: 8,
    marginTop: 4,
    marginBottom: 6,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
  cloneBtn: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

