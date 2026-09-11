import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
} from 'react-native';
import { useTheme } from '@/core/theme';
import { mockTripRooms } from '@/features/trip-room/data/mock-trip-room';
import { publishTripToDiscover } from '@/features/discover/data/mock-discover';
import { Badge } from '@/shared/components/Badge';

interface SelectTripToPostModalProps {
  visible: boolean;
  onClose: () => void;
  onPostCreated?: (postId: string) => void;
}

export const SelectTripToPostModal: React.FC<SelectTripToPostModalProps> = ({
  visible,
  onClose,
  onPostCreated,
}) => {
  const { colors, typography, spacing, rounded, shadows } = useTheme();
  const [selectedTripId, setSelectedTripId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filter archived / past trip rooms
  const shareableTrips = mockTripRooms.filter((r) => r.stage === 'archived' || r.stage === 'planning');

  const handlePublish = (trip: (typeof mockTripRooms)[0]) => {
    setIsSubmitting(true);
    setTimeout(() => {
      const createdPost = publishTripToDiscover({
        title: trip.name,
        destination: trip.destination,
        coverImage: trip.cover_image || '',
        durationDays: 7,
        travelStyle: 'Cultural',
        notes: `Community shared itinerary for ${trip.name}. Explored the best sights in ${trip.destination}!`,
        tags: ['🏛️ Cultural', '✨ Community Pick'],
        type: 'cloneable_itinerary',
        linkedRoomId: trip.id,
      });

      setIsSubmitting(false);
      onClose();
      Alert.alert('Trip Published! 🎉', `"${trip.name}" is now live on the public Discover feed.`, [
        {
          text: 'View in Feed',
          onPress: () => {
            if (onPostCreated) onPostCreated(createdPost.id);
          },
        },
      ]);
    }, 400);
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={false} onRequestClose={onClose}>
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        {/* Top Header Row */}
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
          <TouchableOpacity onPress={onClose} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Text style={{ fontSize: 20, color: colors.onSurface }}>←</Text>
          </TouchableOpacity>
          <Text style={[typography.labelLg, { color: colors.onSurface, fontWeight: '800' }]}>
            • Share Trip to Discover
          </Text>
          <TouchableOpacity onPress={onClose}>
            <Text style={[typography.utilityTiny, { color: colors.primary, fontWeight: '800' }]}>
              Cancel
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={{ padding: spacing.lg, paddingBottom: 60 }}>
          {/* Page Headline */}
          <Text style={[typography.headlineMd, { color: colors.onSurface, fontWeight: '900' }]}>
            Select your trip to post
          </Text>
          <Text style={[typography.bodySm, { color: colors.onSurfaceVariant, marginTop: 4, marginBottom: spacing.lg }]}>
            Choose an itinerary to share with the community. Others will be able to star and clone it.
          </Text>

          {/* Trips Selection List */}
          <View style={{ gap: spacing.md }}>
            {shareableTrips.map((trip) => {
              const isSelected = selectedTripId === trip.id;
              return (
                <TouchableOpacity
                  key={trip.id}
                  activeOpacity={0.9}
                  onPress={() => setSelectedTripId(trip.id)}
                  style={[
                    styles.tripCard,
                    {
                      backgroundColor: colors.card,
                      borderColor: isSelected ? colors.primary : colors.surfaceContainerHigh,
                      borderRadius: rounded['2xl'],
                      ...shadows.soft,
                    },
                  ]}
                >
                  <View style={styles.imageWrapper}>
                    <Image
                      source={{ uri: trip.cover_image }}
                      style={[
                        styles.tripCover,
                        { borderTopLeftRadius: rounded['2xl'], borderTopRightRadius: rounded['2xl'] },
                      ]}
                    />
                    <View style={styles.tagOverlay}>
                      <View style={[styles.highlightTag, { backgroundColor: '#bf360c', borderRadius: rounded.sm }]}>
                        <Text style={{ color: '#ffffff', fontSize: 10, fontWeight: '800' }}>
                          Highlight
                        </Text>
                      </View>
                      <View
                        style={[
                          styles.archivedTag,
                          {
                            backgroundColor:
                              trip.stage === 'active'
                                ? '#15803d'
                                : trip.stage === 'planning'
                                ? '#8b4b00'
                                : '#4b5563',
                            borderRadius: rounded.sm,
                          },
                        ]}
                      >
                        <Text style={{ color: '#ffffff', fontSize: 10, fontWeight: '800' }}>
                          {trip.stage === 'active'
                            ? '🟢 ACTIVE'
                            : trip.stage === 'planning'
                            ? '📝 PLANNING'
                            : '🔒 ARCHIVED'}
                        </Text>
                      </View>
                    </View>
                  </View>

                  <View style={{ padding: spacing.md }}>
                    <Text style={[typography.headlineSm, { color: colors.onSurface, fontWeight: '800' }]}>
                      {trip.name}
                    </Text>
                    <Text style={[typography.utilityTiny, { color: colors.outline, marginTop: 2 }]}>
                      📅 {trip.start_date} - {trip.end_date} • 📍 {trip.destination}
                    </Text>

                    <View style={styles.cardFooter}>
                      <Badge label="👥 4 Travelers" variant="outline" />
                      <TouchableOpacity
                        activeOpacity={0.8}
                        disabled={isSubmitting}
                        onPress={() => handlePublish(trip)}
                        style={[
                          styles.postBtn,
                          {
                            backgroundColor: colors.primary,
                            borderRadius: rounded.xl,
                            paddingHorizontal: 14,
                            paddingVertical: 7,
                          },
                        ]}
                      >
                        <Text style={[typography.utilityTiny, { color: '#ffffff', fontWeight: '800' }]}>
                          {isSubmitting && isSelected ? 'Posting...' : 'Share Itinerary →'}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>
      </View>
    </Modal>
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
  tripCard: {
    borderWidth: 1.5,
    overflow: 'hidden',
  },
  imageWrapper: {
    position: 'relative',
    height: 130,
    width: '100%',
  },
  tripCover: {
    width: '100%',
    height: '100%',
    backgroundColor: '#e2e8f0',
  },
  tagOverlay: {
    position: 'absolute',
    top: 8,
    left: 8,
    right: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  highlightTag: {
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  archivedTag: {
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
  postBtn: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
