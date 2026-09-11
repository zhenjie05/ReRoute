import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Share,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/core/theme';
import { Avatar } from '@/shared/components/Avatar';
import { CommunityPost, DayBreakdownDetail } from '@/models/discover';
import { toggleStarPost, cloneDiscoverItinerary } from '@/features/discover/data/mock-discover';

interface DiscoverPostDetailScreenProps {
  post: CommunityPost;
  sourceTab?: string;
}

export const DiscoverPostDetailScreen: React.FC<DiscoverPostDetailScreenProps> = ({
  post: initialPost,
  sourceTab,
}) => {
  const { colors, typography, spacing, rounded, shadows } = useTheme();
  const router = useRouter();

  const [post, setPost] = useState<CommunityPost>(initialPost);
  const [expandedDays, setExpandedDays] = useState<Record<number, boolean>>({ 1: true });
  const [isCloning, setIsCloning] = useState(false);

  const fallbackBreakdown: DayBreakdownDetail[] = [
    {
      day_number: 1,
      title: 'Arrival & Scenic Neighborhood Walk',
      subtitle: '3 stops • 4.2 km walk',
      stops: [
        { time: '14:30', name: 'Check-in & Settle Bags', category: 'stay' },
        { time: '17:30', name: 'Golden Hour Canal Walk', category: 'attraction' },
        { time: '19:30', name: 'Communal Group Dinner Feast', category: 'meal' },
      ],
    },
    {
      day_number: 2,
      title: 'Historic Shrines & Tea Ceremony',
      subtitle: '4 stops • Dawn launch',
      stops: [
        { time: '07:00', name: 'Dawn Shrine Exploration', category: 'attraction' },
        { time: '12:00', name: 'Traditional Green Tea Ceremony', category: 'meal' },
      ],
    },
  ];

  const dailyBreakdownList: DayBreakdownDetail[] =
    post.daily_breakdown && post.daily_breakdown.length > 0
      ? post.daily_breakdown
      : fallbackBreakdown;

  const handleToggleStar = () => {
    const result = toggleStarPost(post.id);
    setPost((prev) => ({
      ...prev,
      is_starred: result.is_starred,
      stars_count: result.stars_count,
    }));
  };

  const handleBack = () => {
    if (sourceTab === 'profile') {
      router.navigate('/(tabs)/profile' as any);
    } else {
      router.back();
    }
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out this travel itinerary: "${post.title}" on ReRoute! 🗺️`,
      });
    } catch {
      // Ignored
    }
  };

  const handleClone = () => {
    if (post.type !== 'cloneable_itinerary') {
      Alert.alert('Trip Recap', 'This post is a travel recap story and is not configured as a cloneable itinerary template.');
      return;
    }

    setIsCloning(true);
    try {
      const newRoom = cloneDiscoverItinerary(post.id);
      setIsCloning(false);

      Alert.alert(
        'Itinerary Cloned! 🎉',
        `"${post.title}" has been cloned into your Planning Trip Rooms with all ${post.duration_days} days and stops.`,
        [
          {
            text: 'View Itinerary 📅',
            onPress: () => router.push(`/(tabs)/trip/room/${newRoom.id}/itinerary` as any),
          },
          { text: 'Keep Viewing', style: 'cancel' },
        ]
      );
    } catch (err: any) {
      setIsCloning(false);
      Alert.alert('Cloning Failed', err.message || 'Could not clone itinerary.');
    }
  };

  const toggleDayExpansion = (dayNum: number) => {
    setExpandedDays((prev) => ({
      ...prev,
      [dayNum]: !prev[dayNum],
    }));
  };

  const toggleAllDays = () => {
    const totalDays = dailyBreakdownList.length;
    const allExpanded =
      Object.keys(expandedDays).length >= totalDays &&
      Object.values(expandedDays).every(Boolean);

    if (allExpanded) {
      setExpandedDays({});
    } else {
      const next: Record<number, boolean> = {};
      for (let i = 1; i <= totalDays; i++) {
        next[i] = true;
      }
      setExpandedDays(next);
    }
  };

  const isAllExpanded = () => {
    const totalDays = dailyBreakdownList.length;
    if (totalDays === 0) return false;
    return (
      Object.keys(expandedDays).length >= totalDays &&
      Object.values(expandedDays).every(Boolean)
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* 1. Header Row */}
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
        <TouchableOpacity onPress={handleBack} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Text style={{ fontSize: 20, color: colors.onSurface }}>←</Text>
        </TouchableOpacity>

        <Text style={[typography.headlineSm, { color: colors.onSurface, fontWeight: '800' }]}>
          • Itinerary Detail
        </Text>

        <View style={styles.headerRightGroup}>
          <TouchableOpacity
            onPress={handleShare}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            style={styles.iconBtn}
          >
            <Text style={{ fontSize: 18 }}>↗️</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 160 }}
      >
        {/* 2. Hero Image Banner */}
        <View style={styles.heroBanner}>
          <Image source={{ uri: post.cover_image }} style={styles.heroImage} />
          <View style={styles.heroOverlayGradient} />

          {/* Top Tags */}
          <View style={styles.heroTopTags}>
            <View style={[styles.editionTag, { backgroundColor: 'rgba(255,255,255,0.92)', borderRadius: rounded.full }]}>
              <Text style={[typography.utilityTiny, { color: '#0f172a', fontWeight: '800' }]}>
                🍂 {post.travel_style} Edition
              </Text>
            </View>
            <View style={[styles.durationTag, { backgroundColor: 'rgba(0,0,0,0.65)', borderRadius: rounded.full }]}>
              <Text style={[typography.utilityTiny, { color: '#ffffff', fontWeight: '800' }]}>
                📅 {post.duration_days} Days • {post.nights_count || post.duration_days - 1} Nights
              </Text>
            </View>
          </View>

          {/* Bottom Overlay Title Info */}
          <View style={styles.heroBottomContent}>
            <Text style={[typography.utilityTiny, { color: '#ffa951', fontWeight: '900', letterSpacing: 1 }]}>
              🛡️ CURATED COMMUNITY ROUTE
            </Text>
            <Text style={[typography.headlineLg, { color: '#ffffff', fontWeight: '900', marginTop: 2 }]}>
              {post.title}
            </Text>
            {post.subtitle ? (
              <Text style={[typography.bodySm, { color: 'rgba(255,255,255,0.9)', marginTop: 2 }]} numberOfLines={2}>
                {post.subtitle}
              </Text>
            ) : null}
          </View>
        </View>

        {/* 3. Creator Author Card */}
        <View
          style={[
            styles.creatorCard,
            {
              backgroundColor: colors.card,
              borderColor: colors.surfaceContainerHigh,
              borderRadius: rounded['2xl'],
              marginHorizontal: spacing.lg,
              ...shadows.soft,
            },
          ]}
        >
          <View style={styles.creatorLeft}>
            <Avatar uri={post.author_avatar} name={post.author_name} size={40} />
            <View style={{ marginLeft: spacing.sm }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <Text style={[typography.labelLg, { color: colors.onSurface, fontWeight: '800' }]}>
                  {post.author_name}
                </Text>
                {post.author_level && (
                  <View style={[styles.authorLevelTag, { backgroundColor: '#dcfce7', borderRadius: rounded.sm }]}>
                    <Text style={{ fontSize: 10, color: '#15803d', fontWeight: '800' }}>
                      {post.author_level}
                    </Text>
                  </View>
                )}
              </View>
              <Text style={[typography.utilityTiny, { color: colors.outline, marginTop: 1 }]}>
                Shared recently • {post.author_trips_count || 12} trips completed
              </Text>
            </View>
          </View>

          {/* Star Save Action Button */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={handleToggleStar}
            style={[
              styles.creatorStarBtn,
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

        {/* 4. Key Stats Metric 4-Grid */}
        <View style={[styles.statsGrid, { marginHorizontal: spacing.lg, marginTop: spacing.md }]}>
          <View style={[styles.statBox, { backgroundColor: colors.card, borderColor: colors.surfaceContainerHigh, borderRadius: rounded.xl }]}>
            <Text style={{ fontSize: 16 }}>📋</Text>
            <Text style={[typography.labelLg, { color: colors.onSurface, fontWeight: '800', marginTop: 2 }]}>
              {post.clones_count || 1420}
            </Text>
            <Text style={[typography.utilityTiny, { color: colors.outline, fontSize: 10 }]}>Clones</Text>
          </View>

          <View style={[styles.statBox, { backgroundColor: colors.card, borderColor: colors.surfaceContainerHigh, borderRadius: rounded.xl }]}>
            <Text style={{ fontSize: 16 }}>⭐</Text>
            <Text style={[typography.labelLg, { color: colors.onSurface, fontWeight: '800', marginTop: 2 }]}>
              {post.rating || '4.9'}
            </Text>
            <Text style={[typography.utilityTiny, { color: colors.outline, fontSize: 10 }]}>
              {post.reviews_count || 84} reviews
            </Text>
          </View>

          <View style={[styles.statBox, { backgroundColor: colors.card, borderColor: colors.surfaceContainerHigh, borderRadius: rounded.xl }]}>
            <Text style={{ fontSize: 16 }}>🚶</Text>
            <Text style={[typography.labelLg, { color: colors.onSurface, fontWeight: '800', marginTop: 2 }]}>
              {post.travel_pace}
            </Text>
            <Text style={[typography.utilityTiny, { color: colors.outline, fontSize: 10 }]}>Pace</Text>
          </View>

          <View style={[styles.statBox, { backgroundColor: colors.card, borderColor: colors.surfaceContainerHigh, borderRadius: rounded.xl }]}>
            <Text style={{ fontSize: 16 }}>💵</Text>
            <Text style={[typography.labelLg, { color: colors.onSurface, fontWeight: '800', marginTop: 2 }]}>
              ${post.estimated_cost_per_person || 1250}
            </Text>
            <Text style={[typography.utilityTiny, { color: colors.outline, fontSize: 10 }]}>Est./person</Text>
          </View>
        </View>

        {/* 5. Tags Row */}
        {post.tags && post.tags.length > 0 && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={[styles.tagsScroll, { paddingHorizontal: spacing.lg, marginTop: spacing.md }]}
          >
            {post.tags.map((tag, idx) => (
              <View
                key={idx}
                style={[
                  styles.tagPill,
                  {
                    backgroundColor: colors.surfaceContainerLow,
                    borderColor: colors.surfaceContainerHigh,
                    borderRadius: rounded.full,
                  },
                ]}
              >
                <Text style={[typography.utilityTiny, { color: colors.onSurface, fontWeight: '700' }]}>
                  {tag}
                </Text>
              </View>
            ))}
          </ScrollView>
        )}

        {/* 6. Field Notes Card */}
        {post.field_notes && (
          <View
            style={[
              styles.fieldNotesCard,
              {
                backgroundColor: '#fef9f5',
                borderColor: '#fed7aa',
                borderRadius: rounded['2xl'],
                marginHorizontal: spacing.lg,
                marginTop: spacing.md,
                padding: spacing.md,
              },
            ]}
          >
            <Text style={[typography.labelLg, { color: '#9a3412', fontWeight: '800', marginBottom: 4 }]}>
              📝 {post.author_name.split(' ')[0]}'s Field Notes
            </Text>
            <Text style={[typography.bodySm, { color: '#7c2d12', fontStyle: 'italic', lineHeight: 20 }]}>
              "{post.field_notes.quote}"
            </Text>

            {post.field_notes.prime_window && (
              <View style={[styles.highlightBox, { backgroundColor: '#fff7ed', borderRadius: rounded.xl, marginTop: spacing.sm }]}>
                <Text style={[typography.utilityTiny, { color: '#c2410c', fontWeight: '800' }]}>
                  ☀️ Prime Window: {post.field_notes.prime_window}
                </Text>
                {post.field_notes.highlight ? (
                  <Text style={[typography.utilityTiny, { color: '#9a3412', marginTop: 2, lineHeight: 16 }]}>
                    {post.field_notes.highlight}
                  </Text>
                ) : null}
              </View>
            )}
          </View>
        )}

        {/* 7. Route Architecture Card */}
        <View
          style={[
            styles.routeCard,
            {
              backgroundColor: colors.card,
              borderColor: colors.surfaceContainerHigh,
              borderRadius: rounded['2xl'],
              marginHorizontal: spacing.lg,
              marginTop: spacing.md,
              padding: spacing.md,
              ...shadows.soft,
            },
          ]}
        >
          <View style={styles.routeHeader}>
            <Text style={[typography.headlineSm, { color: colors.onSurface, fontWeight: '800' }]}>
              🗺️ Route Architecture
            </Text>
            <Text style={[typography.utilityTiny, { color: colors.primary, fontWeight: '800' }]}>
              {post.route_chain?.length || 4} Hubs
            </Text>
          </View>

          {/* Route Chain Pills */}
          <View style={styles.routeChainRow}>
            {(post.route_chain || ['Tokyo', 'Hakone', 'Kyoto', 'Osaka']).map((hub, idx, arr) => (
              <React.Fragment key={idx}>
                <View style={[styles.hubChip, { backgroundColor: colors.surfaceContainerLow, borderRadius: rounded.lg }]}>
                  <Text style={[typography.utilityTiny, { color: colors.onSurface, fontWeight: '700' }]}>
                    {hub}
                  </Text>
                </View>
                {idx < arr.length - 1 && (
                  <Text style={{ color: colors.outline, fontWeight: '900', marginHorizontal: 2 }}>→</Text>
                )}
              </React.Fragment>
            ))}
          </View>

          {/* Map Snippet Simulation */}
          <View style={[styles.mapSnippet, { backgroundColor: '#e2e8f0', borderRadius: rounded.xl, marginTop: spacing.sm }]}>
            <Text style={{ fontSize: 24 }}>🗾</Text>
            <View style={styles.mapPinRow}>
              <Text style={[typography.utilityTiny, { color: '#1e293b', fontWeight: '800' }]}>
                📍 Start: {post.destination.split(',')[0]}
              </Text>
              <Text style={[typography.utilityTiny, { color: '#1e293b', fontWeight: '800' }]}>
                📍 End: Osaka Dotonbori
              </Text>
            </View>
            <View style={[styles.inspectBadge, { backgroundColor: '#ffffff', borderRadius: rounded.full }]}>
              <Text style={[typography.utilityTiny, { color: colors.primary, fontWeight: '800' }]}>
                🔍 Inspect Waypoints
              </Text>
            </View>
          </View>
        </View>

        {/* 8. Daily Breakdown Accordion */}
        <View style={{ marginHorizontal: spacing.lg, marginTop: spacing.md }}>
          <View style={styles.breakdownHeaderRow}>
            <Text style={[typography.headlineSm, { color: colors.onSurface, fontWeight: '800' }]}>
              📅 Daily Breakdown
            </Text>
            <TouchableOpacity onPress={toggleAllDays} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <Text style={[typography.utilityTiny, { color: colors.primary, fontWeight: '800' }]}>
                {isAllExpanded() ? 'Collapse All' : 'Expand All'}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={{ gap: spacing.sm, marginTop: spacing.xs }}>
            {dailyBreakdownList.map((day) => {
              const isExpanded = !!expandedDays[day.day_number];
              return (
                <View
                  key={day.day_number}
                  style={[
                    styles.dayCard,
                    {
                      backgroundColor: colors.card,
                      borderColor: isExpanded ? colors.primary : colors.surfaceContainerHigh,
                      borderRadius: rounded['2xl'],
                      ...shadows.soft,
                    },
                  ]}
                >
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => toggleDayExpansion(day.day_number)}
                    style={styles.dayCardHeader}
                  >
                    <View style={{ flex: 1 }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                        <View style={[styles.dayBadge, { backgroundColor: colors.primary, borderRadius: rounded.sm }]}>
                          <Text style={{ color: '#ffffff', fontSize: 10, fontWeight: '900' }}>
                            DAY {day.day_number < 10 ? `0${day.day_number}` : day.day_number}
                          </Text>
                        </View>
                        <Text style={[typography.labelLg, { color: colors.onSurface, fontWeight: '800' }]}>
                          {day.title}
                        </Text>
                      </View>
                      {day.subtitle && (
                        <Text style={[typography.utilityTiny, { color: colors.outline, marginTop: 2 }]}>
                          {day.subtitle}
                        </Text>
                      )}
                    </View>
                    <Text style={{ fontSize: 16, color: colors.outline }}>
                      {isExpanded ? '▲' : '▼'}
                    </Text>
                  </TouchableOpacity>

                  {/* Expanded Stops Timeline */}
                  {isExpanded && (
                    <View style={[styles.stopsContainer, { borderTopColor: colors.surfaceContainerHigh }]}>
                      {day.stops.map((stop, sIdx) => {
                        const getCategoryIcon = () => {
                          switch (stop.category) {
                            case 'stay':
                              return '🟤';
                            case 'meal':
                              return '🟣';
                            case 'transit':
                              return '🚆';
                            default:
                              return '🟢';
                          }
                        };

                        return (
                          <View key={sIdx} style={styles.stopRow}>
                            <View style={styles.stopTimeline}>
                              <Text style={{ fontSize: 12 }}>{getCategoryIcon()}</Text>
                              {sIdx < day.stops.length - 1 && <View style={styles.timelineLine} />}
                            </View>
                            <View style={{ flex: 1, paddingBottom: 10 }}>
                              <Text style={[typography.labelSm, { color: colors.onSurface, fontWeight: '800' }]}>
                                {stop.time ? `${stop.time} • ` : ''}{stop.name}
                              </Text>
                              {stop.description && (
                                <Text style={[typography.bodySm, { color: colors.onSurfaceVariant, marginTop: 2, lineHeight: 18 }]}>
                                  {stop.description}
                                </Text>
                              )}
                              {stop.tag && (
                                <View style={[styles.stopTag, { backgroundColor: colors.surfaceContainerLow, borderRadius: rounded.sm }]}>
                                  <Text style={[typography.utilityTiny, { color: colors.primary, fontWeight: '700' }]}>
                                    {stop.tag}
                                  </Text>
                                </View>
                              )}
                            </View>
                          </View>
                        );
                      })}

                      {day.transit_note && (
                        <View style={[styles.transitBox, { backgroundColor: colors.surfaceContainerLow, borderRadius: rounded.lg }]}>
                          <Text style={[typography.utilityTiny, { color: colors.onSurfaceVariant, fontWeight: '600' }]}>
                            {day.transit_note}
                          </Text>
                        </View>
                      )}
                    </View>
                  )}
                </View>
              );
            })}
          </View>
        </View>

        {/* 9. Group Budget Anatomy Card */}
        {post.budget_breakdown && post.budget_breakdown.length > 0 && (
          <View
            style={[
              styles.budgetCard,
              {
                backgroundColor: colors.card,
                borderColor: colors.surfaceContainerHigh,
                borderRadius: rounded['2xl'],
                marginHorizontal: spacing.lg,
                marginTop: spacing.md,
                padding: spacing.md,
                ...shadows.soft,
              },
            ]}
          >
            <View style={styles.budgetHeader}>
              <Text style={[typography.headlineSm, { color: colors.onSurface, fontWeight: '800' }]}>
                ⏱️ Group Budget Anatomy
              </Text>
              <View style={[styles.crewBadge, { backgroundColor: '#dcfce7', borderRadius: rounded.sm }]}>
                <Text style={{ fontSize: 10, color: '#15803d', fontWeight: '800' }}>
                  Best for 2-5 Crew
                </Text>
              </View>
            </View>

            {/* Proportion Bar */}
            <View style={[styles.proportionBar, { borderRadius: rounded.full }]}>
              {post.budget_breakdown.map((seg, idx) => (
                <View
                  key={idx}
                  style={{
                    flex: seg.percent,
                    height: 10,
                    backgroundColor: seg.color || '#ff8f06',
                  }}
                />
              ))}
            </View>

            {/* Legend Grid */}
            <View style={styles.legendGrid}>
              {post.budget_breakdown.map((seg, idx) => (
                <View key={idx} style={styles.legendItem}>
                  <View style={[styles.legendDot, { backgroundColor: seg.color || '#ff8f06' }]} />
                  <Text style={[typography.utilityTiny, { color: colors.onSurface, fontWeight: '700' }]}>
                    {seg.category}: <Text style={{ color: colors.outline }}>{seg.percent}%</Text>
                  </Text>
                </View>
              ))}
            </View>

            {post.splitting_tip && (
              <View style={[styles.splittingTipBox, { backgroundColor: colors.surfaceContainerLow, borderRadius: rounded.xl }]}>
                <Text style={[typography.utilityTiny, { color: colors.onSurfaceVariant, lineHeight: 16 }]}>
                  👥 {post.splitting_tip}
                </Text>
              </View>
            )}
          </View>
        )}
      </ScrollView>

      {/* 10. Sticky Bottom Action Bar (Star & Clone) */}
      <View
        style={[
          styles.stickyBottomBar,
          {
            backgroundColor: colors.surface,
            borderTopColor: colors.surfaceContainerHigh,
            paddingHorizontal: spacing.lg,
            paddingVertical: spacing.md,
            ...shadows.medium,
          },
        ]}
      >
        {/* Star Button */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={handleToggleStar}
          style={[
            styles.bottomIconBtn,
            {
              backgroundColor: post.is_starred ? '#fef3c7' : colors.surfaceContainerLow,
              borderColor: post.is_starred ? '#fde68a' : colors.surfaceContainerHigh,
              borderRadius: rounded['2xl'],
            },
          ]}
        >
          <Text style={{ fontSize: 20 }}>{post.is_starred ? '⭐' : '☆'}</Text>
        </TouchableOpacity>

        {/* Primary CTA: Clone Itinerary */}
        <TouchableOpacity
          activeOpacity={0.85}
          disabled={isCloning}
          onPress={handleClone}
          style={[
            styles.cloneCTA,
            {
              backgroundColor: colors.primary,
              borderRadius: rounded['2xl'],
            },
          ]}
        >
          <Text style={[typography.labelLg, { color: '#ffffff', fontWeight: '900' }]}>
            {isCloning ? 'Cloning Itinerary...' : '📋 Clone Itinerary'}
          </Text>
          <Text style={{ color: 'rgba(255,255,255,0.85)', fontSize: 10, fontWeight: '600' }}>
            Customizable in Trip Room →
          </Text>
        </TouchableOpacity>

        {/* Share Button */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={handleShare}
          style={[
            styles.bottomIconBtn,
            {
              backgroundColor: colors.surfaceContainerLow,
              borderColor: colors.surfaceContainerHigh,
              borderRadius: rounded['2xl'],
            },
          ]}
        >
          <Text style={{ fontSize: 18 }}>↗️</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
  },
  headerRightGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconBtn: {
    padding: 6,
  },
  heroBanner: {
    position: 'relative',
    height: 240,
    width: '100%',
  },
  heroImage: {
    width: '100%',
    height: '100%',
    backgroundColor: '#0f172a',
  },
  heroOverlayGradient: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  heroTopTags: {
    position: 'absolute',
    top: 12,
    left: 16,
    right: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  editionTag: {
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  durationTag: {
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  heroBottomContent: {
    position: 'absolute',
    bottom: 14,
    left: 16,
    right: 16,
  },
  creatorCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderWidth: 1,
    marginTop: -16,
  },
  creatorLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  authorLevelTag: {
    paddingHorizontal: 5,
    paddingVertical: 1,
  },
  creatorStarBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 8,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderWidth: 1,
  },
  tagsScroll: {
    flexDirection: 'row',
    gap: 8,
  },
  tagPill: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderWidth: 1,
  },
  fieldNotesCard: {
    borderWidth: 1,
  },
  highlightBox: {
    padding: 8,
  },
  routeCard: {
    borderWidth: 1,
  },
  routeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  routeChainRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 4,
  },
  hubChip: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  mapSnippet: {
    height: 90,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  mapPinRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 4,
  },
  inspectBadge: {
    position: 'absolute',
    bottom: 6,
    paddingHorizontal: 10,
    paddingVertical: 2,
  },
  breakdownHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  dayCard: {
    borderWidth: 1,
    overflow: 'hidden',
  },
  dayCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
  },
  dayBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  stopsContainer: {
    paddingHorizontal: 12,
    paddingBottom: 12,
    borderTopWidth: 1,
    paddingTop: 10,
  },
  stopRow: {
    flexDirection: 'row',
    gap: 8,
  },
  stopTimeline: {
    alignItems: 'center',
    width: 20,
  },
  timelineLine: {
    width: 2,
    flex: 1,
    backgroundColor: '#cbd5e1',
    marginVertical: 2,
  },
  stopTag: {
    alignSelf: 'flex-start',
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginTop: 4,
  },
  transitBox: {
    padding: 8,
    marginTop: 6,
  },
  budgetCard: {
    borderWidth: 1,
  },
  budgetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  crewBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  proportionBar: {
    flexDirection: 'row',
    overflow: 'hidden',
    height: 10,
    marginBottom: 10,
  },
  legendGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  splittingTipBox: {
    padding: 10,
    marginTop: 10,
  },
  stickyBottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderTopWidth: 1,
  },
  bottomIconBtn: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  cloneCTA: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
