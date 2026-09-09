import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/core/theme';
import { useDiscoverStore } from '@/features/discover/data/mock-discover';
import { DiscoverPostCard } from './DiscoverPostCard';
import { SelectTripToPostModal } from './SelectTripToPostModal';
import { EmptyState } from '@/shared/components/EmptyState';
import { ErrorState } from '@/shared/components/ErrorState';

export const DiscoverFeedScreen: React.FC = () => {
  const { colors, typography, spacing, rounded, shadows } = useTheme();
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStyle, setSelectedStyle] = useState('All');
  const [selectedPace, setSelectedPace] = useState('All');
  const [selectedBudget, setSelectedBudget] = useState('All');
  const [selectedDest, setSelectedDest] = useState('All');
  const [selectedType, setSelectedType] = useState<'all' | 'cloneable' | 'recap'>('all');

  const [isLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  const { posts, toggleStar } = useDiscoverStore({
    searchQuery,
    travelStyle: selectedStyle !== 'All' ? selectedStyle : undefined,
    travelPace: selectedPace !== 'All' ? selectedPace : undefined,
    budgetTier: selectedBudget !== 'All' ? selectedBudget : undefined,
    destination: selectedDest !== 'All' ? selectedDest : undefined,
    type: selectedType,
  });

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedStyle('All');
    setSelectedPace('All');
    setSelectedBudget('All');
    setSelectedDest('All');
    setSelectedType('all');
  };

  const styleOptions = ['All', 'Cultural', 'City', 'Relaxing', 'Nature'];
  const paceOptions = ['All', 'Relaxed', 'Moderate', 'Fast', 'Ambitious'];
  const budgetOptions = ['All', '$', '$$', '$$$'];
  const destOptions = ['All', 'Japan', 'Italy', 'Chile', 'France', 'Indonesia'];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header Bar */}
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
          onPress={() => router.back()}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          style={styles.backBtn}
        >
          <Text style={{ fontSize: 20, color: colors.onSurface }}>←</Text>
        </TouchableOpacity>

        <Text style={[typography.headlineSm, { color: colors.onSurface, fontWeight: '800' }]}>
          Discover Feed
        </Text>

        <TouchableOpacity
          onPress={() => setIsShareModalOpen(true)}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          style={[styles.shareHeaderBtn, { backgroundColor: colors.surfaceContainerLow, borderRadius: rounded.full }]}
        >
          <Text style={{ fontSize: 16 }}>➕</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: 120 }]}
      >
        {/* Search Bar */}
        <View style={{ paddingHorizontal: spacing.lg, marginTop: spacing.md }}>
          <View
            style={[
              styles.searchBox,
              {
                backgroundColor: colors.surfaceContainerLow,
                borderColor: colors.surfaceContainerHigh,
                borderRadius: rounded.xl,
                paddingHorizontal: spacing.md,
              },
            ]}
          >
            <Text style={{ fontSize: 16, marginRight: 8 }}>🔍</Text>
            <TextInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search destination, style, tags..."
              placeholderTextColor={colors.outline}
              style={[typography.bodySm, { flex: 1, color: colors.onSurface, paddingVertical: 10 }]}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                <Text style={{ fontSize: 14, color: colors.outline }}>✕</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Filter Categories Horizontal Strips */}
        <View style={{ marginTop: spacing.sm }}>
          {/* Post Type Selector */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={[styles.filterStrip, { paddingHorizontal: spacing.lg }]}
          >
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => setSelectedType('all')}
              style={[
                styles.chip,
                {
                  backgroundColor: selectedType === 'all' ? colors.primary : colors.surfaceContainerLow,
                  borderColor: selectedType === 'all' ? colors.primary : colors.surfaceContainerHigh,
                  borderRadius: rounded.full,
                },
              ]}
            >
              <Text
                style={[
                  typography.utilityTiny,
                  { color: selectedType === 'all' ? '#ffffff' : colors.onSurface, fontWeight: '800' },
                ]}
              >
                🌐 All Types
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => setSelectedType('cloneable')}
              style={[
                styles.chip,
                {
                  backgroundColor: selectedType === 'cloneable' ? colors.primary : colors.surfaceContainerLow,
                  borderColor: selectedType === 'cloneable' ? colors.primary : colors.surfaceContainerHigh,
                  borderRadius: rounded.full,
                },
              ]}
            >
              <Text
                style={[
                  typography.utilityTiny,
                  { color: selectedType === 'cloneable' ? '#ffffff' : colors.onSurface, fontWeight: '800' },
                ]}
              >
                📋 Cloneable Only
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => setSelectedType('recap')}
              style={[
                styles.chip,
                {
                  backgroundColor: selectedType === 'recap' ? colors.primary : colors.surfaceContainerLow,
                  borderColor: selectedType === 'recap' ? colors.primary : colors.surfaceContainerHigh,
                  borderRadius: rounded.full,
                },
              ]}
            >
              <Text
                style={[
                  typography.utilityTiny,
                  { color: selectedType === 'recap' ? '#ffffff' : colors.onSurface, fontWeight: '800' },
                ]}
              >
                📖 Recaps Only
              </Text>
            </TouchableOpacity>
          </ScrollView>

          {/* Travel Style Filter */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={[styles.filterStrip, { paddingHorizontal: spacing.lg, marginTop: 6 }]}
          >
            <Text style={[typography.utilityTiny, { color: colors.outline, alignSelf: 'center', marginRight: 4, fontWeight: '700' }]}>
              STYLE:
            </Text>
            {styleOptions.map((opt) => {
              const isActive = selectedStyle === opt;
              return (
                <TouchableOpacity
                  key={opt}
                  activeOpacity={0.8}
                  onPress={() => setSelectedStyle(opt)}
                  style={[
                    styles.chip,
                    {
                      backgroundColor: isActive ? colors.surfaceContainerHigh : colors.surfaceContainerLow,
                      borderColor: isActive ? colors.primary : colors.surfaceContainerHigh,
                      borderRadius: rounded.full,
                    },
                  ]}
                >
                  <Text
                    style={[
                      typography.utilityTiny,
                      { color: isActive ? colors.primary : colors.onSurfaceVariant, fontWeight: isActive ? '800' : '600' },
                    ]}
                  >
                    {opt}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* Destination Filter */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={[styles.filterStrip, { paddingHorizontal: spacing.lg, marginTop: 6 }]}
          >
            <Text style={[typography.utilityTiny, { color: colors.outline, alignSelf: 'center', marginRight: 4, fontWeight: '700' }]}>
              DEST:
            </Text>
            {destOptions.map((opt) => {
              const isActive = selectedDest === opt;
              return (
                <TouchableOpacity
                  key={opt}
                  activeOpacity={0.8}
                  onPress={() => setSelectedDest(opt)}
                  style={[
                    styles.chip,
                    {
                      backgroundColor: isActive ? colors.surfaceContainerHigh : colors.surfaceContainerLow,
                      borderColor: isActive ? colors.primary : colors.surfaceContainerHigh,
                      borderRadius: rounded.full,
                    },
                  ]}
                >
                  <Text
                    style={[
                      typography.utilityTiny,
                      { color: isActive ? colors.primary : colors.onSurfaceVariant, fontWeight: isActive ? '800' : '600' },
                    ]}
                  >
                    {opt === 'All' ? 'All Dests' : `📍 ${opt}`}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* Pace Filter */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={[styles.filterStrip, { paddingHorizontal: spacing.lg, marginTop: 6 }]}
          >
            <Text style={[typography.utilityTiny, { color: colors.outline, alignSelf: 'center', marginRight: 4, fontWeight: '700' }]}>
              PACE:
            </Text>
            {paceOptions.map((opt) => {
              const isActive = selectedPace === opt;
              return (
                <TouchableOpacity
                  key={opt}
                  activeOpacity={0.8}
                  onPress={() => setSelectedPace(opt)}
                  style={[
                    styles.chip,
                    {
                      backgroundColor: isActive ? colors.surfaceContainerHigh : colors.surfaceContainerLow,
                      borderColor: isActive ? colors.primary : colors.surfaceContainerHigh,
                      borderRadius: rounded.full,
                    },
                  ]}
                >
                  <Text
                    style={[
                      typography.utilityTiny,
                      { color: isActive ? colors.primary : colors.onSurfaceVariant, fontWeight: isActive ? '800' : '600' },
                    ]}
                  >
                    {opt}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* Budget Filter */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={[styles.filterStrip, { paddingHorizontal: spacing.lg, marginTop: 6 }]}
          >
            <Text style={[typography.utilityTiny, { color: colors.outline, alignSelf: 'center', marginRight: 4, fontWeight: '700' }]}>
              BUDGET:
            </Text>
            {budgetOptions.map((opt) => {
              const isActive = selectedBudget === opt;
              return (
                <TouchableOpacity
                  key={opt}
                  activeOpacity={0.8}
                  onPress={() => setSelectedBudget(opt)}
                  style={[
                    styles.chip,
                    {
                      backgroundColor: isActive ? colors.surfaceContainerHigh : colors.surfaceContainerLow,
                      borderColor: isActive ? colors.primary : colors.surfaceContainerHigh,
                      borderRadius: rounded.full,
                    },
                  ]}
                >
                  <Text
                    style={[
                      typography.utilityTiny,
                      { color: isActive ? colors.primary : colors.onSurfaceVariant, fontWeight: isActive ? '800' : '600' },
                    ]}
                  >
                    {opt}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Feed Stream Content */}
        <View style={{ paddingHorizontal: spacing.lg, marginTop: spacing.md }}>
          {isLoading ? (
            <View style={{ paddingVertical: 40, alignItems: 'center' }}>
              <ActivityIndicator size="large" color={colors.primary} />
              <Text style={[typography.bodySm, { color: colors.onSurfaceVariant, marginTop: 12 }]}>
                Loading community itineraries...
              </Text>
            </View>
          ) : hasError ? (
            <ErrorState
              title="Unable to load feed"
              message="Check your connection and try again."
              onRetry={() => setHasError(false)}
            />
          ) : posts.length === 0 ? (
            <EmptyState
              title="No matching itineraries"
              description="No public itineraries match your current filters. Try clearing some tags."
              actionTitle="Reset Filters"
              onAction={resetFilters}
            />
          ) : (
            posts.map((post) => (
              <DiscoverPostCard
                key={post.id}
                post={post}
                onToggleStar={toggleStar}
              />
            ))
          )}
        </View>

        {/* Recommendation Transparency Notice (FR-NAV-4 / Section 4.4) */}
        <View style={[styles.transparencyBox, { marginHorizontal: spacing.lg, marginTop: spacing.lg }]}>
          <Text style={[typography.utilityTiny, { color: colors.outline, textAlign: 'center', fontStyle: 'italic', lineHeight: 16 }]}>
            💡 Starred trips and preferences help tailor your personalized AI recommendations.
          </Text>
        </View>
      </ScrollView>

      {/* Floating Action Button (FAB) to Share / Post Trip */}
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={() => setIsShareModalOpen(true)}
        style={[
          styles.fab,
          {
            backgroundColor: colors.primary,
            borderRadius: rounded['2xl'],
            ...shadows.medium,
          },
        ]}
      >
        <Text style={{ fontSize: 24, color: '#ffffff', fontWeight: '900' }}>+</Text>
      </TouchableOpacity>

      {/* Share / Publish Trip Modal */}
      <SelectTripToPostModal
        visible={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
      />
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
  backBtn: {
    padding: 6,
  },
  shareHeaderBtn: {
    padding: 6,
    width: 34,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    flexGrow: 1,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
  },
  filterStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 2,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderWidth: 1,
  },
  transparencyBox: {
    padding: 12,
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 20,
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 30,
  },
});
