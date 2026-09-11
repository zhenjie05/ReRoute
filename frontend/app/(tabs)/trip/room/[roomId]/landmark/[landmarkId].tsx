import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useTheme } from '@/core/theme';
import { Badge } from '@/shared/components';
import { mockLandmarks } from '@/features/route-planning/data/mock-route-planning';

/**
 * Landmark Detail screen — bottom-sheet-style presentation.
 *
 * Matches the reference screenshots:
 * - Drag handle indicator at top
 * - Hero area that toggles between Photos (default) and 3D model
 * - 3D toggle hidden entirely if `model_asset_url` is null (FR-1-7)
 * - Zoom/link action icons on photo view
 * - Landmark name + subtitle + bookmark icon (local UI state, Assumption 6)
 * - "History" text section
 * - "Notable Facts" cards with emoji icons
 * - "Add to Itinerary" primary CTA at bottom
 *
 * 3D view uses a visual placeholder block — no real .glb rendering (user constraint).
 */
export default function LandmarkDetailScreen() {
  const { landmarkId } = useLocalSearchParams<{ landmarkId: string }>();
  const { colors, typography, spacing, rounded, shadows } = useTheme();

  const landmark = mockLandmarks.find((l) => l.id === landmarkId) || mockLandmarks[0];

  // 3D toggle: hidden entirely if model_asset_url is null (FR-1-7)
  const has3D = !!landmark.model_asset_url;
  const [activeView, setActiveView] = useState<'photos' | '3d'>('photos');

  // Bookmark: local UI state only (Assumption 6)
  const [bookmarked, setBookmarked] = useState(false);

  // Photo index for gallery
  const photoIndex = 0;

  // Extract fun facts with emoji icons
  const factIcons = ['🏅', '🌊', '🎌', '⛩️', '🍃'];

  const handleAddToItinerary = () => {
    Alert.alert(
      'Added to Itinerary',
      `"${landmark.name}" has been added to your itinerary. (Pending backend wiring)`,
    );
  };

  const handleBookmark = () => {
    setBookmarked(!bookmarked);
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Drag handle indicator (bottom-sheet style) */}
      <View style={styles.handleContainer}>
        <View
          style={[
            styles.handle,
            {
              backgroundColor: colors.outlineVariant,
              borderRadius: rounded.full,
            },
          ]}
        />
      </View>

      <ScrollView
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero area */}
        <View style={[styles.heroContainer, { marginHorizontal: spacing.lg }]}>
          {activeView === '3d' && has3D ? (
            // 3D Model Placeholder
            <View
              style={[
                styles.heroImage,
                {
                  backgroundColor: '#1a1a2e',
                  borderRadius: rounded.xl,
                  alignItems: 'center',
                  justifyContent: 'center',
                  ...shadows.medium,
                },
              ]}
            >
              <Text style={{ fontSize: 56 }}>🏛️</Text>
              <Text
                style={[
                  typography.headlineSm,
                  { color: '#ffffff', marginTop: spacing.md, textAlign: 'center' },
                ]}
              >
                Interactive 3D Landmark Model
              </Text>
              <Text
                style={[
                  typography.bodySm,
                  {
                    color: '#999ea0',
                    marginTop: 4,
                    textAlign: 'center',
                    paddingHorizontal: spacing.xl,
                  },
                ]}
              >
                Touch to rotate 360° • Pinch to zoom architectural details
              </Text>
              <Badge
                label="WebGL GLTF Asset"
                variant="season"
                style={{ marginTop: spacing.lg }}
              />
            </View>
          ) : (
            // Photo view
            <View style={{ position: 'relative' }}>
              <Image
                source={{ uri: landmark.photo_urls[photoIndex] || landmark.photo_urls[0] }}
                style={[
                  styles.heroImage,
                  { borderRadius: rounded.xl },
                ]}
                resizeMode="cover"
              />

              {/* Action icons on photo */}
              <View
                style={[
                  styles.photoActions,
                  { bottom: spacing.md, left: spacing.md },
                ]}
              >
                <TouchableOpacity
                  style={[
                    styles.photoActionBtn,
                    {
                      backgroundColor: 'rgba(0,0,0,0.5)',
                      borderRadius: rounded.full,
                    },
                  ]}
                >
                  <Text style={{ fontSize: 16, color: '#ffffff' }}>🔍</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.photoActionBtn,
                    {
                      backgroundColor: 'rgba(0,0,0,0.5)',
                      borderRadius: rounded.full,
                      marginLeft: spacing.sm,
                    },
                  ]}
                >
                  <Text style={{ fontSize: 16, color: '#ffffff' }}>🔗</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* View toggle: Photos / 3D — only shown if 3D available */}
          {has3D && (
            <View
              style={[
                styles.viewToggle,
                {
                  marginTop: spacing.sm,
                  gap: spacing.sm,
                },
              ]}
            >
              <TouchableOpacity
                onPress={() => setActiveView('photos')}
                style={[
                  styles.toggleBtn,
                  {
                    backgroundColor:
                      activeView === 'photos' ? colors.season.main : colors.surfaceContainerLow,
                    borderRadius: rounded.lg,
                    paddingHorizontal: spacing.lg,
                    paddingVertical: spacing.sm,
                  },
                ]}
              >
                <Text
                  style={[
                    typography.labelSm,
                    {
                      color: activeView === 'photos' ? '#ffffff' : colors.onSurfaceVariant,
                      fontWeight: '700',
                    },
                  ]}
                >
                  📷 Photos
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setActiveView('3d')}
                style={[
                  styles.toggleBtn,
                  {
                    backgroundColor:
                      activeView === '3d' ? colors.season.main : colors.surfaceContainerLow,
                    borderRadius: rounded.lg,
                    paddingHorizontal: spacing.lg,
                    paddingVertical: spacing.sm,
                  },
                ]}
              >
                <Text
                  style={[
                    typography.labelSm,
                    {
                      color: activeView === '3d' ? '#ffffff' : colors.onSurfaceVariant,
                      fontWeight: '700',
                    },
                  ]}
                >
                  🧊 3D Model
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Landmark name + subtitle + bookmark */}
        <View
          style={[
            styles.nameSection,
            { paddingHorizontal: spacing.lg, marginTop: spacing.lg },
          ]}
        >
          <View style={{ flex: 1 }}>
            <Text style={[typography.headlineLg, { color: colors.onSurface }]}>
              {landmark.name.split('(')[0].trim()}
            </Text>
            {landmark.name.includes('(') && (
              <Text
                style={[
                  typography.bodyMd,
                  { color: colors.onSurfaceVariant, marginTop: 2 },
                ]}
              >
                ({landmark.name.split('(')[1]?.replace(')', '') || ''})
              </Text>
            )}
          </View>

          {/* Bookmark icon — local UI state only (Assumption 6) */}
          <TouchableOpacity onPress={handleBookmark} hitSlop={12}>
            <Text style={{ fontSize: 24 }}>
              {bookmarked ? '🔖' : '🏷️'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Divider */}
        <View
          style={{
            height: 1,
            backgroundColor: colors.cardBorder,
            marginHorizontal: spacing.lg,
            marginVertical: spacing.lg,
          }}
        />

        {/* History section */}
        <View style={{ paddingHorizontal: spacing.lg, marginBottom: spacing.lg }}>
          <Text
            style={[
              typography.headlineSm,
              { color: colors.season.accent, fontWeight: '800', marginBottom: spacing.sm },
            ]}
          >
            History
          </Text>
          <Text
            style={[
              typography.bodyMd,
              { color: colors.onSurfaceVariant, lineHeight: 22 },
            ]}
          >
            {landmark.info_text}
          </Text>
        </View>

        {/* Notable Facts */}
        <View style={{ paddingHorizontal: spacing.lg, marginBottom: spacing.lg }}>
          <Text
            style={[
              typography.headlineSm,
              { color: colors.season.accent, fontWeight: '800', marginBottom: spacing.md },
            ]}
          >
            Notable Facts
          </Text>

          {landmark.fun_facts.map((fact, index) => {
            // Extract a title from the fact (first few words)
            const words = fact.split(' ');
            const title = words.slice(0, 2).join(' ').toUpperCase();
            const icon = factIcons[index % factIcons.length];

            return (
              <View
                key={index}
                style={[
                  styles.factCard,
                  {
                    backgroundColor: colors.surfaceContainerLow,
                    borderRadius: rounded.xl,
                    padding: spacing.lg,
                    marginBottom: spacing.sm,
                  },
                ]}
              >
                <View style={styles.factRow}>
                  <View
                    style={[
                      styles.factIcon,
                      {
                        backgroundColor: colors.season.soft,
                        borderRadius: rounded.full,
                        width: 40,
                        height: 40,
                      },
                    ]}
                  >
                    <Text style={{ fontSize: 18 }}>{icon}</Text>
                  </View>

                  <View style={[styles.factText, { marginLeft: spacing.md }]}>
                    <Text
                      style={[
                        typography.labelSm,
                        {
                          color: colors.onSurface,
                          fontWeight: '800',
                          letterSpacing: 0.5,
                          marginBottom: 2,
                        },
                      ]}
                    >
                      {title}
                    </Text>
                    <Text
                      style={[
                        typography.bodySm,
                        { color: colors.onSurfaceVariant, lineHeight: 18 },
                      ]}
                    >
                      {fact}
                    </Text>
                  </View>
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>

      {/* Fixed bottom CTA: Add to Itinerary */}
      <View
        style={[
          styles.bottomCta,
          {
            paddingHorizontal: spacing.lg,
            paddingVertical: spacing.lg,
            paddingBottom: spacing['2xl'],
            backgroundColor: colors.background,
            borderTopWidth: 1,
            borderTopColor: colors.cardBorder,
          },
        ]}
      >
        <TouchableOpacity
          onPress={handleAddToItinerary}
          activeOpacity={0.85}
          style={[
            styles.addBtn,
            {
              backgroundColor: colors.season.main,
              borderRadius: rounded.xl,
              paddingVertical: spacing.lg,
              ...shadows.season,
            },
          ]}
        >
          <Text
            style={[
              typography.labelLg,
              { color: '#ffffff', fontWeight: '700', textAlign: 'center' },
            ]}
          >
            ⊕ Add to Itinerary
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  handleContainer: {
    alignItems: 'center',
    paddingVertical: 10,
    backgroundColor: '#ffffff',
  },
  handle: {
    width: 40,
    height: 4,
  },
  heroContainer: {
    marginTop: 8,
  },
  heroImage: {
    width: '100%',
    height: 280,
  },
  photoActions: {
    position: 'absolute',
    flexDirection: 'row',
  },
  photoActionBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewToggle: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  toggleBtn: {},
  nameSection: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  factCard: {},
  factRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  factIcon: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  factText: {
    flex: 1,
  },
  bottomCta: {},
  addBtn: {},
});
