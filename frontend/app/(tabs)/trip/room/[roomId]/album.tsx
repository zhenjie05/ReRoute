import { ArchivedBanner } from '@/features/trip-room/presentation/components';
import { useRoomSessionState } from '@/features/trip-room/data/useRoomSessionState';
import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, Share, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useTheme } from '@/core/theme';
import { mockAlbumPhotos, mockTripRooms, mockItineraryDays } from '@/features/trip-room/data/mock-trip-room';
import { AlbumPhoto } from '@/models/album';
import { AlbumPhotoGrid, AlbumLightbox } from '@/features/trip-room/presentation/components/album';

export default function GroupAlbumScreen() {
  const { roomId } = useLocalSearchParams<{ roomId: string }>();
  const { colors, typography, spacing, rounded } = useTheme();

  const room = mockTripRooms.find((r) => r.id === roomId) || mockTripRooms[0];
  const isArchived = room.stage === 'archived';

  // State
  const [photos, setPhotos] = useRoomSessionState<AlbumPhoto[]>(room.id, 'photos', () =>
    mockAlbumPhotos.filter(p => p.room_id === (roomId || room.id))
  );
  
  // Lightbox state
  const [lightboxVisible, setLightboxVisible] = useState(false);
  const [initialPhotoId, setInitialPhotoId] = useState<string | null>(null);

  // Group expansion state (for +N more) - track which day groups are expanded
  const [expandedGroups, setExpandedGroups] = useState<Set<string | null>>(new Set());

  const handleUploadPhoto = () => {
    if (isArchived) return;

    // Simulate finding matching day based on current date (mock EXIF taken_at)
    const now = new Date().toISOString();
    // Simplified logic: just assign to day 1 for the mock if available
    const matchedDay = mockItineraryDays.find(d => d.room_id === room.id);
    const dayId = matchedDay ? matchedDay.id : null;

    const newPhoto: AlbumPhoto = {
      id: `photo-${Date.now()}`,
      room_id: (roomId as string) || room.id,
      uploaded_by: 'demo-user-1',
      uploader_name: 'Alex Chen',
      url: 'https://images.unsplash.com/photo-1538485399081-7191377e8241?w=800&fit=crop',
      taken_at: now,
      created_at: now,
      location_name: room.destination,
      itinerary_day_id: dayId,
    };
    
    setPhotos((prev) => [newPhoto, ...prev]);
  };

  const handlePhotoPress = useCallback((photoId: string) => {
    setInitialPhotoId(photoId);
    setLightboxVisible(true);
  }, []);

  const handleExpandGroup = useCallback((dayId: string | null) => {
    setExpandedGroups(prev => {
      const next = new Set(prev);
      next.add(dayId);
      return next;
    });
  }, []);

  const handleShare = useCallback(async (photo: AlbumPhoto) => {
    try {
      await Share.share({
        message: `Check out this photo from our trip: ${photo.url}`,
        url: photo.url, // URL might only work well on iOS for Share
      });
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
  }, []);

  // Prepare photos for grid, applying expansion logic handled by AlbumPhotoGrid
  
  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
        {isArchived && <ArchivedBanner />}
        {/* Gallery Header Row */}
        <View style={[styles.headerRow, { paddingHorizontal: spacing.lg, marginVertical: spacing.md }]}>
          <Text style={[typography.headlineSm, { color: colors.onSurface }]}>
            Shared Photos
          </Text>

          {!isArchived && (
            <TouchableOpacity
              onPress={handleUploadPhoto}
              style={[
                styles.uploadBtn,
                {
                  backgroundColor: '#ff8f06',
                  borderRadius: rounded.full,
                  paddingHorizontal: 14,
                  paddingVertical: 6,
                }
              ]}
            >
              <Text style={[typography.labelSm, { color: '#ffffff', fontWeight: '800' }]}>
                📷 Upload
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* The Grid Component */}
        <AlbumPhotoGrid 
          photos={photos} 
          expandedGroups={expandedGroups}
          onPhotoPress={handlePhotoPress}
          onExpandGroup={handleExpandGroup}
        />
      </ScrollView>

      <AlbumLightbox
        visible={lightboxVisible}
        photos={photos}
        initialPhotoId={initialPhotoId}
        isArchived={isArchived}
        onClose={() => setLightboxVisible(false)}
        onShare={handleShare}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  uploadBtn: {
    //
  }
});
