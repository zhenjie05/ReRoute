import React, { useState } from 'react';
import { View, Text, ScrollView, Image } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useTheme } from '@/core/theme';
import { Card, Badge, Button } from '@/shared/components';
import { mockAlbumPhotos } from '@/features/trip-room/data/mock-trip-room';
import { AlbumPhoto } from '@/models/album';

export default function GroupAlbumScreen() {
  const { roomId } = useLocalSearchParams<{ roomId: string }>();
  const { colors, typography, spacing } = useTheme();

  const [photos, setPhotos] = useState<AlbumPhoto[]>(mockAlbumPhotos);

  const handleUploadPhoto = () => {
    const newPhoto: AlbumPhoto = {
      id: `photo-${Date.now()}`,
      room_id: (roomId as string) || 'room-tokyo-2026',
      uploaded_by: 'demo-user-1',
      uploader_name: 'Alex Chen',
      url: 'https://images.unsplash.com/photo-1538485399081-7191377e8241?w=800&fit=crop',
      taken_at: new Date().toISOString(),
      location_name: 'Harajuku Takeshita Street',
      caption: 'Crepes and street fashion walk!',
    };
    setPhotos((prev) => [newPhoto, ...prev]);
  };

  return (
    <ScrollView contentContainerStyle={{ padding: spacing.lg, paddingBottom: 100 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md }}>
        <View>
          <Text style={[typography.headlineSm, { color: colors.onSurface }]}>
            Shared Group Album 📷
          </Text>
          <Text style={[typography.bodySm, { color: colors.onSurfaceVariant }]}>
            Auto-grouped by day & geotag location
          </Text>
        </View>

        <Button
          title="+ Upload"
          onPress={handleUploadPhoto}
          variant="primary"
          size="sm"
        />
      </View>

      {/* Grouped by Location / Day */}
      <View style={{ gap: spacing.lg }}>
        {photos.map((photo) => (
          <Card key={photo.id} style={{ padding: 0, overflow: 'hidden' }}>
            <Image source={{ uri: photo.url }} style={{ width: '100%', height: 220 }} />
            <View style={{ padding: spacing.md }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Badge label={`📍 ${photo.location_name || 'Tokyo'}`} variant="season" />
                <Text style={[typography.utilityTiny, { color: colors.onSurfaceVariant }]}>
                  {photo.taken_at.slice(0, 10)}
                </Text>
              </View>
              {photo.caption ? (
                <Text style={[typography.bodyMd, { color: colors.onSurface, marginTop: spacing.xs }]}>
                  {photo.caption}
                </Text>
              ) : null}
              <Text style={[typography.utilityTiny, { color: colors.onSurfaceVariant, marginTop: 4 }]}>
                Uploaded by {photo.uploader_name || 'Group Member'}
              </Text>
            </View>
          </Card>
        ))}
      </View>
    </ScrollView>
  );
}
