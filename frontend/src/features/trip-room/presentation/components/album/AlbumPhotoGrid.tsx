import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { useTheme } from '@/core/theme';
import { AlbumPhoto } from '@/models/album';
import { mockItineraryDays } from '@/features/trip-room/data/mock-trip-room';

interface AlbumPhotoGridProps {
  photos: AlbumPhoto[];
  expandedGroups: Set<string | null>;
  onPhotoPress: (photoId: string) => void;
  onExpandGroup?: (dayId: string | null) => void;
}

/**
 * Groups photos by itinerary_day_id (fallback to 'Unsorted'), sorts by day number descending.
 * Renders 3-column grid per group.
 * Shows up to 4 photos + 1 overflow tile ("+N more") if group has > 4 photos and is not expanded.
 */
export const AlbumPhotoGrid: React.FC<AlbumPhotoGridProps> = ({
  photos,
  expandedGroups,
  onPhotoPress,
  onExpandGroup,
}) => {
  const { colors, typography, spacing, rounded } = useTheme();

  // Group photos
  const groups: Record<string, AlbumPhoto[]> = {};
  photos.forEach(p => {
    const key = p.itinerary_day_id || 'unsorted';
    if (!groups[key]) groups[key] = [];
    groups[key].push(p);
  });

  // Sort photos within group by taken_at descending
  Object.keys(groups).forEach(k => {
    groups[k].sort((a, b) => new Date(b.taken_at).getTime() - new Date(a.taken_at).getTime());
  });

  // Sort groups: numbered days descending, then unsorted
  const groupKeys = Object.keys(groups).sort((a, b) => {
    if (a === 'unsorted') return 1;
    if (b === 'unsorted') return -1;
    const dayA = mockItineraryDays.find(d => d.id === a)?.day_number || 0;
    const dayB = mockItineraryDays.find(d => d.id === b)?.day_number || 0;
    return dayB - dayA;
  });

  // Use percentage-based sizing for cross-platform Native compatibility
  // 3 columns = 32% width each, leaving 4% total for 2 gaps (2% each)
  const cellWidth = '32%';

  return (
    <View style={styles.container}>
      {groupKeys.map(key => {
        const groupPhotos = groups[key];
        const day = mockItineraryDays.find(d => d.id === key);
        
        let headerLabel = 'UNSORTED';
        if (day) {
           const locationHint = day.title.split('&')[0]?.trim() || day.title;
           headerLabel = `DAY ${day.day_number} • ${locationHint.toUpperCase()}`;
        }

        const isExpanded = expandedGroups.has(key === 'unsorted' ? null : key);
        const showOverflow = !isExpanded && groupPhotos.length > 4;
        const visiblePhotos = showOverflow ? groupPhotos.slice(0, 4) : groupPhotos;
        const overflowCount = groupPhotos.length - 4;

        return (
          <View key={key} style={[styles.groupContainer, { marginBottom: spacing.lg }]}>
            <Text style={[typography.utilityTiny, { color: colors.outline, fontWeight: '800', marginBottom: spacing.sm, paddingHorizontal: spacing.lg }]}>
              {headerLabel}
            </Text>

            <View style={[styles.grid, { paddingHorizontal: spacing.lg }]}>
              {visiblePhotos.map(photo => (
                <TouchableOpacity
                  key={photo.id}
                  accessibilityRole="button"
                  accessibilityLabel={`View photo: ${photo.location_name || 'Trip memory'}`}
                  activeOpacity={0.8}
                  onPress={() => onPhotoPress(photo.id)}
                  style={{ width: cellWidth, aspectRatio: 1, marginBottom: '2%' }}
                >
                  <Image
                    source={{ uri: photo.url }}
                    style={{ width: '100%', height: '100%', borderRadius: rounded.md }}
                    resizeMode="cover"
                  />
                </TouchableOpacity>
              ))}

              {showOverflow && (
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => onExpandGroup?.(key === 'unsorted' ? null : key)}
                  style={[
                    styles.overflowTile,
                    {
                      width: cellWidth,
                      aspectRatio: 1,
                      marginBottom: '2%',
                      backgroundColor: colors.surfaceContainer,
                      borderRadius: rounded.md,
                    }
                  ]}
                >
                  <Text style={[typography.headlineSm, { color: colors.onSurfaceVariant }]}>
                    •••
                  </Text>
                  <Text style={[typography.labelSm, { color: colors.onSurfaceVariant, fontWeight: '700' }]}>
                    +{overflowCount} more
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        );
      })}

      {groupKeys.length === 0 && (
         <View style={{ padding: spacing.xl, alignItems: 'center' }}>
            <Text style={{ fontSize: 40, marginBottom: spacing.md }}>📸</Text>
            <Text style={[typography.bodyMd, { color: colors.onSurfaceVariant, textAlign: 'center' }]}>
              No photos shared yet.
            </Text>
         </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 16,
  },
  groupContainer: {},
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  overflowTile: {
    alignItems: 'center',
    justifyContent: 'center',
  }
});
