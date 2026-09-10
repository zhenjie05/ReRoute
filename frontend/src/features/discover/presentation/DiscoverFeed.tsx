import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/core/theme';
import { useDiscoverStore } from '@/features/discover/data/mock-discover';
import { DiscoverPostCard } from './DiscoverPostCard';
import { Feather } from '@expo/vector-icons';

type FilterOption = 'All' | 'Cloneable' | 'Cultural' | 'Nature';

export const DiscoverFeed: React.FC = () => {
  const { colors, typography, spacing, rounded } = useTheme();
  const router = useRouter();
  const [selectedFilter, setSelectedFilter] = useState<FilterOption>('All');

  const { posts, toggleStar } = useDiscoverStore({
    type: selectedFilter === 'Cloneable' ? 'cloneable' : undefined,
    travelStyle: selectedFilter === 'Cultural' ? 'Cultural' : selectedFilter === 'Nature' ? 'Nature' : undefined,
  });

  const filterOptions: { key: FilterOption; label: string; icon: string }[] = [
    { key: 'All', label: 'All', icon: '' },
    { key: 'Cloneable', label: 'Cloneable', icon: '' },
    { key: 'Cultural', label: 'Cultural', icon: '' },
    { key: 'Nature', label: 'Nature', icon: '' },
  ];

  const handleMorePress = () => {
    router.push('/(tabs)/home/discover' as any);
  };

  return (
    <View style={{ marginHorizontal: spacing.lg, marginVertical: spacing.md }}>
      {/* Header Row */}
      <View style={styles.headerRow}>
        <View style={styles.titleGroup}>
          <Text style={{ fontSize: 18 }}></Text>
          <Text style={[typography.headlineSm, { color: colors.onSurface, fontWeight: '800', marginLeft: 6 }]}>
            Discover
          </Text>
        </View>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={handleMorePress}
          style={[
            styles.moreBtn,
            { backgroundColor: colors.primary, borderRadius: rounded.full },
          ]}
        >
          <Text style={[typography.utilityTiny, { color: '#ffffff', fontWeight: '800' }]}>
            More &gt;
          </Text>
        </TouchableOpacity>
      </View>

      {/* Filter Category Pills */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterStrip}
      >
        {filterOptions.map((opt) => {
          const isActive = selectedFilter === opt.key;
          return (
            <TouchableOpacity
              key={opt.key}
              activeOpacity={0.8}
              onPress={() => setSelectedFilter(opt.key)}
              style={[
                styles.filterChip,
                {
                  backgroundColor: isActive ? colors.primary : colors.surfaceContainerLow,
                  borderColor: isActive ? colors.primary : colors.surfaceContainerHigh,
                  borderRadius: rounded.full,
                },
              ]}
            >
              <Text style={{ fontSize: 12 }}>{opt.icon}</Text>
              <Text
                style={[
                  typography.utilityTiny,
                  {
                    color: isActive ? '#ffffff' : colors.onSurface,
                    fontWeight: isActive ? '800' : '600',
                    marginLeft: 4,
                  },
                ]}
              >
                {opt.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Cards List */}
      <View style={{ marginTop: spacing.sm }}>
        {posts.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={{ fontSize: 28, marginBottom: 4 }}>🔍</Text>
            <Text style={[typography.labelSm, { color: colors.onSurface, fontWeight: '700' }]}>
              No matching community itineraries
            </Text>
            <Text style={[typography.utilityTiny, { color: colors.outline, marginTop: 2 }]}>
              Try selecting another category or clearing filters.
            </Text>
          </View>
        ) : (
          posts.slice(0, 3).map((post) => (
            <DiscoverPostCard
              key={post.id}
              post={post}
              onToggleStar={toggleStar}
            />
          ))
        )}
      </View>

      {/* Recommendation Transparency Notice (FR-NAV-4 / Section 4.4) */}
      <View style={[styles.transparencyNotice, { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }]}>
        <Feather name="star" size={12} color={colors.outline} style={{ marginRight: 6 }} />
        <Text style={[typography.utilityTiny, { color: colors.outline, textAlign: 'center', fontStyle: 'italic', lineHeight: 14 }]}>
          Starred trips and preferences help tailor your personalized AI recommendations.
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  titleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  moreBtn: {
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  filterStrip: {
    flexDirection: 'row',
    gap: 8,
    paddingVertical: 4,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderWidth: 1,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 32,
  },
  transparencyNotice: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
});
