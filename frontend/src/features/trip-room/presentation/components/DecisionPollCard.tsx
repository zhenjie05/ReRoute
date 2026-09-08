import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '@/core/theme';
import { DecisionCard, DecisionOption } from '@/models/decision';

interface DecisionPollCardProps {
  card: DecisionCard;
  onVote: (cardId: string, optionId: string) => void;
  onSafetyAlertPress?: (alertId: string) => void;
  isArchived?: boolean;
  userVoteOptionId?: string | null;
}

/**
 * Reusable in-feed interactive voting card — used for both manual
 * (disruption/conflict) and auto-triggered (safety_risk) decision cards.
 * Lives in trip-room/presentation/components so both the Discussion tab
 * and safety subsystem can import it.
 */
export const DecisionPollCard: React.FC<DecisionPollCardProps> = ({
  card,
  onVote,
  onSafetyAlertPress,
  isArchived = false,
  userVoteOptionId,
}) => {
  const { colors, typography, spacing, rounded, shadows } = useTheme();

  const totalVotes = card.options.reduce((sum, opt) => sum + (opt.votes_count || 0), 0);
  const isResolved = card.status === 'resolved';
  const isVotingDisabled = isResolved || isArchived;

  const getTriggerBadge = () => {
    switch (card.trigger_type) {
      case 'safety_risk':
        return { emoji: '⚠️', label: 'Safety Alert', color: colors.warning, bg: colors.warningContainer };
      case 'disruption':
        return { emoji: '⚡', label: 'Disruption', color: colors.primaryContainer, bg: colors.season.soft };
      case 'conflict':
      default:
        return { emoji: '🤝', label: 'Conflict', color: colors.tertiary, bg: colors.onTertiary };
    }
  };

  const badge = getTriggerBadge();

  const getPercentage = (opt: DecisionOption) => {
    if (totalVotes === 0) return 0;
    return Math.round(((opt.votes_count || 0) / totalVotes) * 100);
  };

  const getBarColor = (opt: DecisionOption, index: number) => {
    if (isResolved && card.winning_option_id === opt.id) {
      return colors.success;
    }
    if (userVoteOptionId === opt.id) {
      return colors.primaryContainer;
    }
    // Alternate between two accent tones
    return index % 2 === 0 ? '#FDC591' : colors.primaryContainer;
  };

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: '#ffffff',
          borderColor: card.trigger_type === 'safety_risk'
            ? colors.warningContainer
            : colors.surfaceContainer,
          borderRadius: rounded.xl,
          padding: spacing.lg,
          marginHorizontal: spacing.lg,
          marginBottom: spacing.lg,
          ...shadows.soft,
        },
      ]}
    >
      {/* Header Row: Trigger Badge + Anonymous indicator */}
      <View style={styles.headerRow}>
        <View
          style={[
            styles.triggerBadge,
            {
              backgroundColor: badge.bg,
              borderRadius: rounded.full,
              paddingHorizontal: spacing.sm,
              paddingVertical: spacing.xs,
            },
          ]}
        >
          <Text style={{ fontSize: 11 }}>{badge.emoji}</Text>
          <Text
            style={[
              typography.utilityTiny,
              { color: badge.color, fontWeight: '700', marginLeft: 4 },
            ]}
          >
            {badge.label}
          </Text>
        </View>
        {card.anonymous && (
          <Text style={[typography.utilityTiny, { color: colors.onSurfaceVariant }]}>
            🔒 Anonymous
          </Text>
        )}
      </View>

      {/* Title */}
      <Text
        style={[
          typography.labelLg,
          { color: colors.onSurface, fontWeight: '700', marginTop: spacing.sm, marginBottom: spacing.xs },
        ]}
      >
        📊 {card.title}
      </Text>

      {/* Description (if present) */}
      {card.description ? (
        <Text
          style={[
            typography.bodySm,
            { color: colors.onSurfaceVariant, marginBottom: spacing.md, lineHeight: 18 },
          ]}
        >
          {card.description}
        </Text>
      ) : null}

      {/* Safety Alert deep-link */}
      {card.trigger_type === 'safety_risk' && card.safety_alert_id && onSafetyAlertPress ? (
        <TouchableOpacity
          onPress={() => onSafetyAlertPress(card.safety_alert_id!)}
          style={{ marginBottom: spacing.md }}
        >
          <Text style={[typography.labelSm, { color: colors.primary, fontWeight: '700' }]}>
            View official weather & safety report →
          </Text>
        </TouchableOpacity>
      ) : null}

      {/* Options with tally bars */}
      <View style={{ gap: spacing.sm }}>
        {card.options.map((opt, index) => {
          const pct = getPercentage(opt);
          const barColor = getBarColor(opt, index);
          const isUserVote = userVoteOptionId === opt.id;
          const isWinner = isResolved && card.winning_option_id === opt.id;

          return (
            <TouchableOpacity
              key={opt.id}
              activeOpacity={isVotingDisabled ? 1 : 0.7}
              onPress={() => {
                if (!isVotingDisabled) {
                  onVote(card.id, opt.id);
                }
              }}
              style={[
                styles.optionBar,
                {
                  backgroundColor: colors.surfaceContainerLow,
                  borderRadius: rounded.lg,
                  overflow: 'hidden',
                  borderWidth: isUserVote ? 2 : 0,
                  borderColor: isUserVote ? colors.primaryContainer : 'transparent',
                },
              ]}
            >
              {/* Fill bar */}
              <View
                style={[
                  styles.optionFill,
                  {
                    width: `${pct}%`,
                    backgroundColor: barColor,
                    borderRadius: rounded.lg,
                    opacity: 0.5,
                  },
                ]}
              />
              {/* Content overlay */}
              <View style={styles.optionContent}>
                <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                  {isWinner && (
                    <Text style={{ fontSize: 12, marginRight: 4 }}>✅</Text>
                  )}
                  <Text
                    style={[
                      typography.bodySm,
                      {
                        color: colors.onSurface,
                        fontWeight: isUserVote || isWinner ? '700' : '500',
                        flex: 1,
                      },
                    ]}
                    numberOfLines={2}
                  >
                    {opt.label}
                  </Text>
                </View>
                <Text
                  style={[
                    typography.labelSm,
                    { color: colors.onSurfaceVariant, fontWeight: '700', marginLeft: spacing.sm },
                  ]}
                >
                  {pct}%
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Vote count + anonymous indicator */}
      <View style={[styles.footerRow, { marginTop: spacing.sm }]}>
        <Text style={[typography.utilityTiny, { color: colors.outline }]}>
          {totalVotes} vote{totalVotes !== 1 ? 's' : ''} total
        </Text>
        {card.anonymous && (
          <Text style={[typography.utilityTiny, { color: colors.onSurfaceVariant, fontStyle: 'italic' }]}>
            🔒 Individual picks hidden
          </Text>
        )}
      </View>

      {/* Resolved banner */}
      {isResolved && (
        <View
          style={[
            styles.resolvedBanner,
            {
              backgroundColor: colors.successContainer,
              borderRadius: rounded.md,
              padding: spacing.sm,
              marginTop: spacing.sm,
            },
          ]}
        >
          <Text style={[typography.labelSm, { color: colors.success, fontWeight: '700' }]}>
            ✅ Resolved: {card.options.find((o) => o.id === card.winning_option_id)?.label || 'N/A'}
          </Text>
        </View>
      )}

      {/* Action button */}
      {!isResolved && (
        <TouchableOpacity
          activeOpacity={isArchived ? 1 : 0.8}
          onPress={() => {}}
          disabled={isArchived}
          style={[
            styles.actionButton,
            {
              backgroundColor: isArchived ? colors.surfaceContainerHigh : colors.primaryContainer,
              borderRadius: rounded.lg,
              paddingVertical: spacing.md,
              marginTop: spacing.md,
            },
          ]}
        >
          <Text
            style={[
              typography.labelMd,
              {
                color: isArchived ? colors.onSurfaceVariant : '#ffffff',
                fontWeight: '700',
                textAlign: 'center',
              },
            ]}
          >
            {isArchived
              ? 'Vote End'
              : card.anonymous
              ? 'Vote Anonymously'
              : 'Cast Your Vote'}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  triggerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionBar: {
    height: 40,
    position: 'relative',
    justifyContent: 'center',
  },
  optionFill: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    zIndex: 1,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  resolvedBanner: {
    alignItems: 'center',
  },
  actionButton: {
    alignItems: 'center',
  },
});
