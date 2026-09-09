import React from 'react';
import { View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTheme } from '@/core/theme';
import { getCommunityPostById, initialMockCommunityPosts } from '@/features/discover/data/mock-discover';
import { DiscoverPostDetailScreen } from '@/features/discover/presentation/DiscoverPostDetailScreen';
import { EmptyState } from '@/shared/components/EmptyState';

export default function PostDetailRoute() {
  const { postId, source } = useLocalSearchParams<{ postId: string; source?: string }>();
  const { colors, spacing } = useTheme();
  const router = useRouter();

  const post = (postId ? getCommunityPostById(postId) : null) || initialMockCommunityPosts.find((p) => p.id === postId) || initialMockCommunityPosts[0];

  if (!post) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background, padding: spacing.xl, justifyContent: 'center' }}>
        <EmptyState
          title="Itinerary Not Found"
          description="This community post could not be found or may have been removed."
          actionTitle="Back to Discover"
          onAction={() => router.navigate('/(tabs)/home/discover' as any)}
        />
      </View>
    );
  }

  return <DiscoverPostDetailScreen post={post} sourceTab={source} />;
}
