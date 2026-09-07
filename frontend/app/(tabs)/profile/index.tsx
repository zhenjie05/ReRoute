import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/core/theme';
import { Avatar, Card, Badge, Button, TopBar } from '@/shared/components';
import { useAuth } from '@/lib/hooks/useAuth';
import { getUnifiedProfileData } from '@/features/profile/data/mock-profile';

export default function ProfileScreen() {
  const { colors, typography, spacing, rounded } = useTheme();
  const { user } = useAuth();
  const router = useRouter();

  // Unified single-query dataset per NFR-7-1
  const profileData = getUnifiedProfileData();

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <TopBar unreadCount={0} />

      <ScrollView contentContainerStyle={{ padding: spacing.lg, paddingBottom: 120 }}>
        {/* User Profile Card */}
        <Card variant="season" style={{ marginBottom: spacing.xl, alignItems: 'center' }}>
          <Avatar uri={user?.avatar} name={user?.name || 'Alex Chen'} size={72} />
          <Text style={[typography.headlineMd, { color: colors.onSurface, marginTop: spacing.sm }]}>
            {user?.name || 'Alex Chen'}
          </Text>
          <Text style={[typography.bodySm, { color: colors.onSurfaceVariant }]}>
            📍 {user?.home_country || 'Singapore'} • Explorer since 2026
          </Text>

          <View style={{ flexDirection: 'row', gap: spacing.md, marginTop: spacing.md }}>
            <Button
              title="⚙️ Settings"
              onPress={() => router.push('/(tabs)/profile/settings' as any)}
              variant="outline"
              size="sm"
            />
          </View>
        </Card>

        {/* Section 1: Badges & Achievements (FR-7-2) */}
        <View style={{ marginBottom: spacing.xl }}>
          <Text style={[typography.headlineSm, { color: colors.onSurface, marginBottom: spacing.xs }]}>
            Badges & Milestones 🏆
          </Text>
          <Text style={[typography.bodySm, { color: colors.onSurfaceVariant, marginBottom: spacing.md }]}>
            Earned through trips, quizzes, and group coordination
          </Text>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: spacing.md }}
          >
            {profileData.badges.map((b) => (
              <Card key={b.id} variant="outlined" style={{ width: 150, alignItems: 'center', padding: spacing.md }}>
                <Text style={{ fontSize: 36, marginBottom: 4 }}>{b.icon_name}</Text>
                <Text style={[typography.labelSm, { color: colors.onSurface, fontWeight: '700', textAlign: 'center' }]}>
                  {b.title}
                </Text>
                <Text
                  numberOfLines={2}
                  style={[typography.utilityTiny, { color: colors.onSurfaceVariant, textAlign: 'center', marginTop: 2 }]}
                >
                  {b.description}
                </Text>
              </Card>
            ))}
          </ScrollView>
        </View>

        {/* Section 2: Starred Trips from Discover (FR-7-3, FR-NAV-5) */}
        <View style={{ marginBottom: spacing.xl }}>
          <Text style={[typography.headlineSm, { color: colors.onSurface, marginBottom: spacing.xs }]}>
            Starred Community Trips ⭐
          </Text>
          <Text style={[typography.bodySm, { color: colors.onSurfaceVariant, marginBottom: spacing.md }]}>
            Saved inspirations ready to clone anytime
          </Text>

          {profileData.starredTrips.length === 0 ? (
            <Card variant="outlined">
              <Text style={[typography.bodySm, { color: colors.onSurfaceVariant, textAlign: 'center' }]}>
                No starred trips yet. Explore the Discover feed on Home!
              </Text>
            </Card>
          ) : (
            <View style={{ gap: spacing.md }}>
              {profileData.starredTrips.map((post) => (
                <Card
                  key={post.id}
                  variant="outlined"
                  onPress={() => router.push(`/(tabs)/home/discover/${post.id}` as any)}
                >
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Badge label={post.travel_style} variant="season" />
                    <Text style={[typography.utilityTiny, { color: colors.onSurfaceVariant }]}>
                      {post.duration_days} Days
                    </Text>
                  </View>
                  <Text style={[typography.headlineSm, { color: colors.onSurface, marginTop: spacing.xs }]}>
                    {post.title}
                  </Text>
                  <Text style={[typography.bodySm, { color: colors.onSurfaceVariant, marginTop: 2 }]}>
                    📍 {post.destination} • By {post.author_name}
                  </Text>
                </Card>
              ))}
            </View>
          )}
        </View>

        {/* Section 3: Trip History (FR-7-1) */}
        <View>
          <Text style={[typography.headlineSm, { color: colors.onSurface, marginBottom: spacing.xs }]}>
            Trip History 📖
          </Text>
          <Text style={[typography.bodySm, { color: colors.onSurfaceVariant, marginBottom: spacing.md }]}>
            All past and active trips
          </Text>

          <View style={{ gap: spacing.md }}>
            {profileData.pastTrips.map((trip) => (
              <Card
                key={trip.id}
                variant="outlined"
                onPress={() => router.push(`/(tabs)/trip/room/${trip.id}/chat` as any)}
              >
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Badge label={trip.stage.toUpperCase()} variant={trip.stage === 'active' ? 'season' : 'outline'} />
                  <Text style={[typography.utilityTiny, { color: colors.onSurfaceVariant }]}>
                    {trip.start_date}
                  </Text>
                </View>
                <Text style={[typography.labelLg, { color: colors.onSurface, fontWeight: '700', marginTop: spacing.xs }]}>
                  {trip.name}
                </Text>
                <Text style={[typography.bodySm, { color: colors.onSurfaceVariant, marginTop: 2 }]}>
                  📍 {trip.destination}
                </Text>
              </Card>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
