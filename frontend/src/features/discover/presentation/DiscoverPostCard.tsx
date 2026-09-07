import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/core/theme';
import { CommunityPost } from '@/models/discover';
import { Avatar } from '@/shared/components/Avatar';
import { Badge } from '@/shared/components/Badge';

interface DiscoverPostCardProps {
  post: CommunityPost;
  onToggleStar: (postId: string) => void;
  onClone?: (postId: string) => void;
}

export const DiscoverPostCard: React.FC<DiscoverPostCardProps> = ({
  post,
  onToggleStar,
  onClone,
}) => {
  const { colors, typography, spacing, rounded, shadows } = useTheme();
  const router = useRouter();

  const handleCardPress = () => {
    router.push(`/(tabs)/home/discover/${post.id}` as any);
  };

  const handleClonePress = () => {
    if (onClone) {
      onClone(post.id);
    } else {
      router.push(`/(tabs)/trip/setup/new?clone_post_id=${post.id}` as any);
    }
  };

  return (
    <TouchableOpacity
      activeOpacity={0.9}
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
      {/* Cover Image with Type & Duration Badges */}
      <View style={styles.imageWrapper}>
        <Image
          source={{ uri: post.cover_image }}
          style={[styles.coverImage, { borderTopLeftRadius: rounded['2xl'], borderTopRightRadius: rounded['2xl'] }]}
        />
        <View style={styles.badgeOverlay}>
          <Badge
            label={post.type === 'cloneable_itinerary' ? '📋 Cloneable' : '📖 Recap'}
            variant={post.type === 'cloneable_itinerary' ? 'primary' : 'secondary'}
          />
          <Badge label={`${post.duration_days} Days`} variant="outline" />
        </View>
      </View>

      {/* Content Container */}
      <View style={{ padding: spacing.md }}>
        {/* Author Row */}
        <View style={styles.authorRow}>
          <View style={styles.authorInfo}>
            <Avatar uri={post.author_avatar} name={post.author_name} size={28} />
            <View style={{ marginLeft: spacing.xs }}>
              <Text style={[typography.utilityTiny, { color: colors.onSurface, fontWeight: '700' }]}>
                {post.author_name}
              </Text>
              <Text style={[typography.utilityTiny, { color: colors.outline }]}>
                {post.travel_style} Explorer
              </Text>
            </View>
          </View>

          {/* Star Toggle Button */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => onToggleStar(post.id)}
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

        {/* Card Footer Actions */}
        <View style={styles.footerRow}>
          <Text style={[typography.utilityTiny, { color: colors.outline, fontWeight: '600' }]}>
            📍 {post.destination}
          </Text>

          {post.type === 'cloneable_itinerary' && (
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handleClonePress}
              style={[
                styles.cloneBtn,
                {
                  backgroundColor: colors.primary,
                  borderRadius: rounded.lg,
                  paddingVertical: 4,
                  paddingHorizontal: 10,
                },
              ]}
            >
              <Text style={[typography.utilityTiny, { color: '#ffffff', fontWeight: '800' }]}>
                Clone Itinerary →
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
    height: 140,
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
    gap: 6,
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
  starBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderWidth: 1,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
  cloneBtn: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
