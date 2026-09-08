import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { useTheme } from '@/core/theme';

interface DropoffPointCardProps {
  name: string;
  notes?: string;
  photoUrl?: string;
  verified?: boolean;
}

/**
 * "Exact Drop-off Point" sub-card for suggested route legs.
 * Shows thumbnail photo, name, walk-time note, and "Street View Verified" checkmark.
 * Populated from `landmarks.dropoff_point` when the leg destination is a known landmark.
 * Returns null gracefully when data is unavailable (no crash, no error).
 */
export const DropoffPointCard: React.FC<DropoffPointCardProps> = ({
  name,
  notes,
  photoUrl,
  verified = true,
}) => {
  const { colors, typography, spacing, rounded } = useTheme();

  if (!name) return null;

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.surfaceContainerLow,
          borderRadius: rounded.lg,
          padding: spacing.md,
          marginTop: spacing.sm,
          borderWidth: 1,
          borderColor: colors.cardBorder,
        },
      ]}
    >
      <View style={styles.row}>
        {/* Thumbnail */}
        {photoUrl ? (
          <Image
            source={{ uri: photoUrl }}
            style={[styles.thumbnail, { borderRadius: rounded.md }]}
            resizeMode="cover"
          />
        ) : (
          <View
            style={[
              styles.thumbnail,
              {
                borderRadius: rounded.md,
                backgroundColor: colors.surfaceContainer,
                alignItems: 'center',
                justifyContent: 'center',
              },
            ]}
          >
            <Text style={{ fontSize: 18 }}>📍</Text>
          </View>
        )}

        {/* Text content */}
        <View style={[styles.textContent, { marginLeft: spacing.md }]}>
          <Text
            style={[
              typography.labelLg,
              { color: colors.season.accent, fontWeight: '800' },
            ]}
          >
            Exact Drop-off Point
          </Text>
          <Text
            style={[
              typography.labelSm,
              { color: colors.onSurface, fontWeight: '700', marginTop: 2 },
            ]}
            numberOfLines={2}
          >
            {name}
          </Text>
          {notes && (
            <Text
              style={[
                typography.bodySm,
                { color: colors.onSurfaceVariant, marginTop: 2 },
              ]}
              numberOfLines={2}
            >
              {notes}
            </Text>
          )}

          {/* Street View Verified */}
          {verified && (
            <View style={[styles.verifiedRow, { marginTop: 4 }]}>
              <Text style={{ fontSize: 12, color: colors.success }}>✓</Text>
              <Text
                style={[
                  typography.utilityTiny,
                  { color: colors.success, fontWeight: '700', marginLeft: 4 },
                ]}
              >
                Street View Verified
              </Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {},
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  thumbnail: {
    width: 64,
    height: 64,
  },
  textContent: {
    flex: 1,
  },
  verifiedRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
