import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useTheme } from '@/core/theme';
import { useAuth } from '@/lib/hooks/useAuth';

// Feature-owned presentation sub-sections
import { AIChatbox } from '@/features/route-planning/presentation/AIChatbox';
import { RecentNewsBanner } from '@/features/route-planning/presentation/RecentNewsBanner';
import { AISuggestedItineraries } from '@/features/recommendations/presentation/AISuggestedItineraries';
import { DiscoverFeed } from '@/features/discover/presentation/DiscoverFeed';

export default function HomeScreen() {
  const { colors, typography, spacing } = useTheme();
  const { user } = useAuth();

  const displayName = user?.name ? user.name.split(' ')[0] : 'Traveler';

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: spacing.safeBottom + 96 },
        ]}
      >
        {/* 2. Welcome Greeting Area */}
        <View style={[styles.welcomeArea, { paddingHorizontal: spacing.lg, paddingTop: spacing.sm }]}>
          <Text style={[typography.headlineLg, { color: colors.onSurface, fontWeight: '900' }]}>
            Hey {displayName} 👋
          </Text>
          <Text style={[typography.bodySm, { color: colors.onSurfaceVariant, marginTop: 2 }]}>
            Where to next?
          </Text>
        </View>

        {/* 3. AI Chatbox & Natural Language Trip Planner (Feature 1) */}
        <AIChatbox />

        {/* 4. Recent News & Personalized Safety Banner (Feature 1, scoped per FR-NAV-6) */}
        <RecentNewsBanner />

        {/* 5. Trending AI Itineraries Carousel (Feature 6) */}
        <AISuggestedItineraries />

        {/* 6. Discover Community Trips Feed (Feature 7) */}
        <DiscoverFeed />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  welcomeArea: {
    marginBottom: 4,
  },
});
