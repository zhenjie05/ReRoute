import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '@/core/theme';
import { Avatar } from '@/shared/components';
import { Message } from '@/models/chat';

interface MessageBubbleProps {
  message: Message;
  isOwnMessage: boolean;
  onThreadChipPress?: (itineraryDayId: string) => void;
}

/**
 * User chat message bubble. Own messages are right-aligned with primary accent;
 * others' messages are left-aligned with avatar + name.
 *
 * Handles the static Thread reference chip (deep-link to Itinerary Day).
 * NOTE: Real threading is NOT in the current data model — this chip is
 * a static, non-interactive reference per the task specification.
 */
export const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  isOwnMessage,
  onThreadChipPress,
}) => {
  const { colors, typography, spacing, rounded } = useTheme();

  const threadRef = message.payload?.thread_ref;

  return (
    <View
      style={[
        styles.row,
        isOwnMessage ? { justifyContent: 'flex-end' } : { justifyContent: 'flex-start' },
        { paddingHorizontal: spacing.lg, marginVertical: 3 },
      ]}
    >
      {/* Avatar for other users */}
      {!isOwnMessage && (
        <Avatar
          uri={message.sender_avatar}
          name={message.sender_name}
          size={28}
          style={{ marginRight: spacing.xs }}
        />
      )}

      <View style={{ maxWidth: '75%' }}>
        {/* Sender name for other users */}
        {!isOwnMessage && message.sender_name && (
          <Text
            style={[
              typography.utilityTiny,
              {
                color: colors.onSurfaceVariant,
                marginBottom: 2,
                marginLeft: 4,
                fontWeight: '600',
              },
            ]}
          >
            {message.sender_name}
          </Text>
        )}

        {/* Bubble */}
        <View
          style={[
            styles.bubble,
            {
              backgroundColor: isOwnMessage ? colors.primaryContainer : colors.surfaceContainerLow,
              borderRadius: rounded.xl,
              padding: spacing.md,
              // Rounded corners: slightly less rounding on the tail corner
              borderBottomRightRadius: isOwnMessage ? rounded.sm : rounded.xl,
              borderBottomLeftRadius: isOwnMessage ? rounded.xl : rounded.sm,
            },
          ]}
        >
          <Text
            style={[
              typography.bodySm,
              {
                color: isOwnMessage ? '#ffffff' : colors.onSurface,
                lineHeight: 18,
              },
            ]}
          >
            {message.text}
          </Text>

          {/* Thread Reference Chip (static, non-interactive deep-link) */}
          {threadRef && (
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => {
                if (onThreadChipPress && threadRef.itinerary_day_id) {
                  onThreadChipPress(threadRef.itinerary_day_id);
                }
              }}
              style={[
                styles.threadChip,
                {
                  backgroundColor: isOwnMessage ? 'rgba(255,255,255,0.2)' : colors.surfaceContainer,
                  borderRadius: rounded.md,
                  padding: spacing.xs + 2,
                  marginTop: spacing.xs,
                },
              ]}
            >
              <Text
                style={[
                  typography.utilityTiny,
                  {
                    color: isOwnMessage ? '#fff0e6' : colors.primary,
                    fontWeight: '700',
                  },
                ]}
              >
                💬 {threadRef.label}
              </Text>
              <Text
                style={[
                  typography.utilityTiny,
                  {
                    color: isOwnMessage ? 'rgba(255,255,255,0.7)' : colors.outline,
                    marginTop: 2,
                  },
                ]}
              >
                {threadRef.reply_count} replies
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Timestamp */}
        <Text
          style={[
            typography.utilityTiny,
            {
              color: colors.outline,
              marginTop: 2,
              textAlign: isOwnMessage ? 'right' : 'left',
              marginHorizontal: 4,
            },
          ]}
        >
          {formatTime(message.created_at)}
        </Text>
      </View>
    </View>
  );
};

function formatTime(iso: string): string {
  try {
    const d = new Date(iso);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } catch {
    return '';
  }
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  bubble: {},
  threadChip: {},
});
