import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '@/core/theme';
import { Badge } from '@/shared/components';

export type VoteState = 'voted' | 'pending' | 'candidate';

interface ItineraryItemNodeProps {
  /** Unique ID */
  id: string;
  /** Time label e.g. "09:30 AM" */
  time: string;
  /** Stop name */
  name: string;
  /** Short description/note */
  note?: string;
  /** Photo URL for thumbnail */
  photoUrl?: string;
  /** Current vote state */
  voteState: VoteState;
  /** For voted items: "x/y agreed" */
  voteTally?: string;
  /** Whether this is the last item in the timeline */
  isLast?: boolean;
  /** Whether interactions are disabled (archived) */
  disabled?: boolean;
  /** Called when "Suggest Vote" is tapped */
  onSuggestVote?: () => void;
  /** Called when "+ Add Details" is tapped */
  onAddDetails?: () => void;
  /** Called when item is tapped (navigate to landmark) */
  onPress?: () => void;
  /** Called when edit icon is tapped */
  onEdit?: () => void;
  /** Called when delete icon is tapped */
  onDelete?: () => void;
}

/**
 * Single stepper node in the day timeline.
 * Renders the timeline dot, connecting line, and content card with vote status.
 * Three visual states: voted (solid dot, green check), pending (orange border),
 * candidate (dashed border, hollow dot).
 */
export const ItineraryItemNode: React.FC<ItineraryItemNodeProps> = ({
  id,
  time,
  name,
  note,
  photoUrl,
  voteState,
  voteTally,
  isLast = false,
  disabled = false,
  onSuggestVote,
  onAddDetails,
  onPress,
  onEdit,
  onDelete,
}) => {
  const { colors, typography, spacing, rounded, shadows } = useTheme();

  const getDotStyle = () => {
    switch (voteState) {
      case 'voted':
        return {
          backgroundColor: colors.onSurface,
          borderColor: colors.onSurface,
          borderWidth: 3,
        };
      case 'pending':
        return {
          backgroundColor: '#ffffff',
          borderColor: colors.season.main,
          borderWidth: 3,
        };
      case 'candidate':
      default:
        return {
          backgroundColor: colors.surfaceContainer,
          borderColor: colors.outlineVariant,
          borderWidth: 2,
        };
    }
  };

  const getLineStyle = () => {
    if (voteState === 'candidate') {
      return { borderLeftWidth: 2, borderLeftColor: colors.outlineVariant, borderStyle: 'dashed' as const };
    }
    return { borderLeftWidth: 2, borderLeftColor: colors.outlineVariant };
  };

  const getCardBorder = () => {
    switch (voteState) {
      case 'voted':
        return { borderColor: colors.cardBorder, borderWidth: 1 };
      case 'pending':
        return { borderColor: colors.season.main, borderWidth: 1.5 };
      case 'candidate':
        return { borderColor: colors.outlineVariant, borderWidth: 1.5, borderStyle: 'dashed' as const };
    }
  };

  return (
    <View style={styles.container}>
      {/* Timeline track (dot + line) */}
      <View style={styles.track}>
        <View style={[styles.dot, getDotStyle()]} />
        {!isLast && <View style={[styles.line, getLineStyle()]} />}
      </View>

      {/* Content card */}
      <TouchableOpacity
        activeOpacity={voteState === 'candidate' ? 1 : 0.7}
        onPress={voteState !== 'candidate' ? onPress : undefined}
        style={[
          styles.card,
          {
            backgroundColor: '#ffffff',
            borderRadius: rounded.xl,
            padding: spacing.lg,
            marginLeft: spacing.md,
            marginBottom: spacing.md,
            flex: 1,
            ...shadows.soft,
            ...(getCardBorder() as any),
          },
        ]}
      >
        {/* Top row: time + name + action icons */}
        <View style={styles.topRow}>
          <View style={{ flex: 1 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Text
                style={[
                  typography.labelLg,
                  { color: colors.season.accent, fontWeight: '800' },
                ]}
              >
                {time}
              </Text>
              <Text
                style={[
                  typography.labelLg,
                  { color: colors.onSurface, fontWeight: '700', flex: 1 },
                ]}
                numberOfLines={1}
              >
                {name}
              </Text>

              {voteState === 'pending' && (
                <Badge label="Pending" variant="warning" />
              )}
            </View>

            {note && voteState !== 'candidate' && (
              <Text
                style={[
                  typography.bodySm,
                  { color: colors.onSurfaceVariant, marginTop: 2 },
                ]}
                numberOfLines={1}
              >
                {note}
              </Text>
            )}

            {voteState === 'candidate' && (
              <Text
                style={[
                  typography.bodySm,
                  { color: colors.onSurfaceVariant, marginTop: 2 },
                ]}
              >
                Candidate stop proposal
              </Text>
            )}
          </View>

          {/* Edit/Delete icons for voted items */}
          {voteState === 'voted' && !disabled && (
            <View style={{ flexDirection: 'row', gap: 8, marginLeft: 8 }}>
              <TouchableOpacity onPress={onEdit} hitSlop={8}>
                <Text style={{ fontSize: 16 }}>✏️</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={onDelete} hitSlop={8}>
                <Text style={{ fontSize: 16 }}>🗑️</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Photo thumbnail (for non-candidate items with a photo) */}
        {photoUrl && voteState !== 'candidate' && (
          <Image
            source={{ uri: photoUrl }}
            style={[
              styles.thumbnail,
              { borderRadius: rounded.lg, marginTop: spacing.sm },
            ]}
            resizeMode="cover"
          />
        )}

        {/* Vote status row */}
        {voteState === 'voted' && (
          <View style={[styles.voteRow, { marginTop: spacing.sm }]}>
            <View
              style={[
                styles.voteBadge,
                {
                  backgroundColor: colors.successContainer,
                  borderRadius: rounded.full,
                  paddingHorizontal: spacing.sm + 2,
                  paddingVertical: spacing.xs,
                },
              ]}
            >
              <Text style={[typography.labelSm, { color: colors.success, fontWeight: '700' }]}>
                ✓ Voted ({voteTally || '—'})
              </Text>
            </View>
            <Text style={[typography.bodySm, { color: colors.onSurfaceVariant, marginLeft: spacing.sm }]}>
              Locked in route
            </Text>
          </View>
        )}

        {/* Suggest Vote button for pending items */}
        {voteState === 'pending' && !disabled && (
          <TouchableOpacity
            onPress={onSuggestVote}
            style={[
              styles.suggestVoteBtn,
              {
                backgroundColor: colors.season.main,
                borderRadius: rounded.full,
                paddingHorizontal: spacing.lg,
                paddingVertical: spacing.sm,
                marginTop: spacing.sm,
                alignSelf: 'flex-start',
              },
            ]}
          >
            <Text style={[typography.labelSm, { color: '#ffffff', fontWeight: '700' }]}>
              Suggest Vote
            </Text>
          </TouchableOpacity>
        )}

        {/* + Add Details for candidate stops */}
        {voteState === 'candidate' && !disabled && (
          <TouchableOpacity onPress={onAddDetails} style={{ marginTop: spacing.sm }}>
            <Text style={[typography.labelSm, { color: colors.season.accent, fontWeight: '700' }]}>
              + Add Details
            </Text>
          </TouchableOpacity>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  track: {
    alignItems: 'center',
    width: 24,
    paddingTop: 4,
  },
  dot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    zIndex: 2,
  },
  line: {
    flex: 1,
    marginTop: -2,
  },
  card: {},
  topRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  thumbnail: {
    width: '100%',
    height: 140,
  },
  voteRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  voteBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  suggestVoteBtn: {},
});
