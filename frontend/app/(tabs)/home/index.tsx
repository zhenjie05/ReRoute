import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/core/theme';
import { TopBar, Card, Badge, Button, ModalSheet } from '@/shared/components';
import { mockSafetyAlerts } from '@/features/route-planning/data/mock-route-planning';
import { mockRecommendations } from '@/features/recommendations/data/mock-recommendations';
import { mockDiscoverPosts } from '@/features/discover/data/mock-discover';
import { defaultTripPreferences } from '@/features/route-planning/data/mock-route-planning';

export default function HomeScreen() {
  const { colors, typography, spacing, rounded, season } = useTheme();
  const router = useRouter();

  // AI Chatbox state
  const [promptText, setPromptText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('All');

  // Discover feed state
  const [posts, setPosts] = useState(mockDiscoverPosts);

  const handleGenerateTrip = () => {
    if (!promptText.trim()) return;
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setConfirmModalVisible(true);
    }, 800);
  };

  const handleConfirmTrip = () => {
    setConfirmModalVisible(false);
    setPromptText('');
    router.push('/(tabs)/trip/setup/room-new-generated' as any);
  };

  const handleToggleStar = (postId: string) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          const isStarred = !p.is_starred;
          return {
            ...p,
            is_starred: isStarred,
            stars_count: isStarred ? p.stars_count + 1 : p.stars_count - 1,
          };
        }
        return p;
      })
    );
  };

  const handleClonePost = (postId: string) => {
    router.push('/(tabs)/trip/create' as any);
  };

  const filteredPosts = posts.filter((p) => {
    if (selectedFilter === 'All') return true;
    if (selectedFilter === 'Cloneable') return p.type === 'cloneable_itinerary';
    if (selectedFilter === 'Cultural') return p.travel_style === 'Cultural';
    if (selectedFilter === 'Nature') return p.travel_style === 'Nature';
    return true;
  });

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <TopBar unreadCount={1} onNotificationPress={() => {}} />

      <ScrollView
        contentContainerStyle={{ paddingBottom: spacing.safeBottom + 32 }}
        showsVerticalScrollIndicator={false}
      >
        {/* 1. AI Chatbox Section (FR-1-0) */}
        <View style={{ paddingHorizontal: spacing.lg, paddingTop: spacing.md }}>
          <Card variant="season">
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: spacing.xs }}>
              <Text style={{ fontSize: 20, marginRight: spacing.xs }}>✨</Text>
              <Text style={[typography.headlineSm, { color: colors.season.text }]}>
                Where to next?
              </Text>
            </View>
            <Text style={[typography.bodySm, { color: colors.onSurfaceVariant, marginBottom: spacing.md }]}>
              Describe your dream escape and let ReRoute build your group itinerary.
            </Text>

            <TextInput
              value={promptText}
              onChangeText={setPromptText}
              placeholder="e.g. 5 days in Tokyo with my partner, food & cultural sights..."
              placeholderTextColor={colors.outline}
              multiline
              style={[
                styles.promptInput,
                {
                  backgroundColor: '#ffffff',
                  borderColor: colors.season.main,
                  borderRadius: rounded.lg,
                  padding: spacing.md,
                  color: colors.onSurface,
                },
              ]}
            />

            <Button
              title={isGenerating ? 'Curating Itinerary...' : 'Generate Trip ✨'}
              onPress={handleGenerateTrip}
              loading={isGenerating}
              variant="primary"
              size="md"
              style={{ marginTop: spacing.md }}
            />
          </Card>
        </View>

        {/* 2. Personalized Recent News / Incident Banner (FR-NAV-6) */}
        {mockSafetyAlerts.length > 0 ? (
          <View style={{ paddingHorizontal: spacing.lg, paddingTop: spacing.lg }}>
            <TouchableOpacity
              activeOpacity={0.88}
              onPress={() => router.push(`/(tabs)/home/safety-alert/${mockSafetyAlerts[0].id}` as any)}
            >
              <Card
                variant="outlined"
                style={{
                  backgroundColor: '#fffdfa',
                  borderColor: colors.warning,
                  borderLeftWidth: 4,
                  borderLeftColor: colors.warning,
                }}
              >
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Badge label="📍 Active Trip Alert" variant="warning" />
                  <Text style={[typography.utilityTiny, { color: colors.onSurfaceVariant }]}>
                    {mockSafetyAlerts[0].destination}
                  </Text>
                </View>
                <Text
                  style={[
                    typography.labelLg,
                    { color: colors.onSurface, marginTop: spacing.xs, fontWeight: '700' },
                  ]}
                >
                  {mockSafetyAlerts[0].title}
                </Text>
                <Text
                  numberOfLines={2}
                  style={[
                    typography.bodySm,
                    { color: colors.onSurfaceVariant, marginTop: spacing.xs },
                  ]}
                >
                  {mockSafetyAlerts[0].summary}
                </Text>
                <Text
                  style={[
                    typography.labelSm,
                    { color: colors.primary, marginTop: spacing.sm, fontWeight: '700' },
                  ]}
                >
                  View weather & safety details →
                </Text>
              </Card>
            </TouchableOpacity>
          </View>
        ) : null}

        {/* 3. AI-Suggested Itineraries Carousel (FR-3-2) */}
        <View style={{ paddingTop: spacing.xl }}>
          <View style={{ paddingHorizontal: spacing.lg, marginBottom: spacing.md }}>
            <Text style={[typography.headlineSm, { color: colors.onSurface }]}>
              Curated For You 🧭
            </Text>
            <Text style={[typography.bodySm, { color: colors.onSurfaceVariant }]}>
              Travelers with similar preferences also loved these
            </Text>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: spacing.lg, gap: spacing.md }}
          >
            {mockRecommendations.map((rec) => (
              <Card
                key={rec.id}
                style={{ width: 240, padding: 0, overflow: 'hidden' }}
                onPress={() => router.push(`/(tabs)/home/discover/${rec.clone_post_id}` as any)}
              >
                <Image source={{ uri: rec.cover_image }} style={{ width: '100%', height: 120 }} />
                <View style={{ padding: spacing.md }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Badge label={`${rec.match_score}% Match`} variant="season" />
                    <Text style={[typography.utilityTiny, { color: colors.onSurfaceVariant }]}>
                      {rec.duration_days} Days
                    </Text>
                  </View>
                  <Text
                    numberOfLines={1}
                    style={[typography.labelLg, { color: colors.onSurface, marginTop: spacing.xs }]}
                  >
                    {rec.title}
                  </Text>
                  <Text style={[typography.bodySm, { color: colors.onSurfaceVariant, marginTop: 2 }]}>
                    {rec.destination}
                  </Text>
                </View>
              </Card>
            ))}
          </ScrollView>
        </View>

        {/* 4. Discover Feed (Public Only) (FR-8-3, FR-NAV-3) */}
        <View style={{ paddingHorizontal: spacing.lg, paddingTop: spacing.xl }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: spacing.md }}>
            <View>
              <Text style={[typography.headlineSm, { color: colors.onSurface }]}>
                Discover Public Trips 🌏
              </Text>
              <Text style={[typography.bodySm, { color: colors.onSurfaceVariant }]}>
                Browse, star, or clone itineraries
              </Text>
            </View>
          </View>

          {/* Filter Pills */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: spacing.xs, marginBottom: spacing.md }}
          >
            {['All', 'Cloneable', 'Cultural', 'Nature'].map((filter) => (
              <TouchableOpacity
                key={filter}
                onPress={() => setSelectedFilter(filter)}
                style={[
                  styles.filterPill,
                  {
                    backgroundColor:
                      selectedFilter === filter ? colors.primary : colors.surfaceContainerLow,
                    borderRadius: rounded.full,
                    paddingHorizontal: spacing.md,
                    paddingVertical: spacing.xs,
                  },
                ]}
              >
                <Text
                  style={[
                    typography.labelSm,
                    {
                      color: selectedFilter === filter ? '#ffffff' : colors.onSurfaceVariant,
                      fontWeight: '600',
                    },
                  ]}
                >
                  {filter}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Post Feed List */}
          <View style={{ gap: spacing.lg }}>
            {filteredPosts.map((post) => (
              <Card
                key={post.id}
                style={{ padding: 0, overflow: 'hidden' }}
                onPress={() => router.push(`/(tabs)/home/discover/${post.id}` as any)}
              >
                <Image source={{ uri: post.cover_image }} style={{ width: '100%', height: 160 }} />
                <View style={{ padding: spacing.lg }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <View style={{ flexDirection: 'row', gap: spacing.xs }}>
                      <Badge
                        label={post.type === 'cloneable_itinerary' ? '📋 Cloneable' : '📖 Recap'}
                        variant="secondary"
                      />
                      <Badge label={post.travel_style} variant="outline" />
                    </View>
                    <Text style={[typography.labelSm, { color: colors.onSurfaceVariant }]}>
                      {post.duration_days} Days
                    </Text>
                  </View>

                  <Text
                    style={[
                      typography.headlineSm,
                      { color: colors.onSurface, marginTop: spacing.sm },
                    ]}
                  >
                    {post.title}
                  </Text>

                  <Text
                    numberOfLines={2}
                    style={[
                      typography.bodySm,
                      { color: colors.onSurfaceVariant, marginVertical: spacing.xs },
                    ]}
                  >
                    {post.content}
                  </Text>

                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginTop: spacing.md,
                      paddingTop: spacing.sm,
                      borderTopWidth: 1,
                      borderTopColor: colors.cardMuted,
                    }}
                  >
                    <Text style={[typography.bodySm, { color: colors.onSurfaceVariant }]}>
                      By {post.author_name}
                    </Text>

                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md }}>
                      {/* Star Action (FR-8-4) */}
                      <TouchableOpacity
                        onPress={() => handleToggleStar(post.id)}
                        style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}
                      >
                        <Text style={{ fontSize: 16 }}>{post.is_starred ? '⭐' : '☆'}</Text>
                        <Text style={[typography.labelSm, { color: colors.onSurfaceVariant }]}>
                          {post.stars_count}
                        </Text>
                      </TouchableOpacity>

                      {/* Clone Action (FR-8-5) */}
                      {post.type === 'cloneable_itinerary' ? (
                        <Button
                          title="Clone Trip"
                          onPress={() => handleClonePost(post.id)}
                          variant="season"
                          size="sm"
                        />
                      ) : null}
                    </View>
                  </View>
                </View>
              </Card>
            ))}
          </View>

          {/* Recommendation Disclosure Note (FR-3-1, NFR-3-1) */}
          <Text
            style={[
              typography.utilityTiny,
              { color: colors.outline, textAlign: 'center', marginTop: spacing.xl },
            ]}
          >
            🔒 Anonymized activity & starred preferences help tailor suggestions.
          </Text>
        </View>
      </ScrollView>

      {/* AI Trip Generation Confirmation Modal (Unit 14 Pop-up Tab) */}
      <ModalSheet
        visible={confirmModalVisible}
        onClose={() => setConfirmModalVisible(false)}
        title="Review Generated Itinerary ✨"
      >
        <View style={{ gap: spacing.md }}>
          <View
            style={{
              backgroundColor: colors.season.soft,
              padding: spacing.md,
              borderRadius: rounded.lg,
            }}
          >
            <Text style={[typography.labelSm, { color: colors.season.text, fontWeight: '700' }]}>
              📍 Tokyo, Japan • 5 Days
            </Text>
            <Text style={[typography.bodySm, { color: colors.onSurface, marginTop: spacing.xs }]}>
              Autumn Escape with Food & Cultural Highlights
            </Text>
          </View>

          <View>
            <Text style={[typography.labelSm, { color: colors.onSurface, fontWeight: '700', marginBottom: spacing.xs }]}>
              Applied Preferences (Soft-Gate Defaults):
            </Text>
            <View style={{ flexDirection: 'row', gap: spacing.xs, flexWrap: 'wrap' }}>
              <Badge label="👥 Couple" variant="season" />
              <Badge label="🏛️ Cultural" variant="season" />
              <Badge label="🚶 Moderate Pace" variant="season" />
            </View>
          </View>

          <Text style={[typography.bodySm, { color: colors.onSurfaceVariant }]}>
            Includes Shibuya Sky, Senso-ji Temple, Shinkansen booking links, and Hotel Gracery suggestions.
          </Text>

          <View style={{ gap: spacing.sm, marginTop: spacing.md }}>
            <Button
              title="Save to Trip Room"
              onPress={handleConfirmTrip}
              variant="primary"
              size="lg"
            />
            <Button
              title="Adjust Preferences First"
              onPress={() => {
                setConfirmModalVisible(false);
                router.push('/(tabs)/trip/create');
              }}
              variant="outline"
              size="md"
            />
          </View>
        </View>
      </ModalSheet>
    </View>
  );
}

const styles = StyleSheet.create({
  promptInput: {
    borderWidth: 1,
    minHeight: 70,
    textAlignVertical: 'top',
    fontSize: 14,
  },
  filterPill: {
    marginRight: 6,
  },
});
