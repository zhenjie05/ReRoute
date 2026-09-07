import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '@/core/theme';

interface MessageComposerProps {
  isArchived: boolean;
  inputText: string;
  onChangeText: (text: string) => void;
  onSend: () => void;
  onProposeVote: () => void;
}

/**
 * Message composer bar at the bottom of the Discussion feed.
 * Active state: text input + attach (+ icon) + Propose Vote icon + send button.
 * Archived state: disabled capsule placeholder text.
 */
export const MessageComposer: React.FC<MessageComposerProps> = ({
  isArchived,
  inputText,
  onChangeText,
  onSend,
  onProposeVote,
}) => {
  const { colors, typography, spacing, rounded } = useTheme();

  if (isArchived) {
    return (
      <View
        style={[
          styles.composerBar,
          {
            backgroundColor: '#ffffff',
            borderTopColor: colors.cardBorder,
            paddingHorizontal: spacing.lg,
            paddingVertical: spacing.md,
          },
        ]}
      >
        <View
          style={[
            styles.disabledPill,
            {
              backgroundColor: colors.surfaceContainerLow,
              borderRadius: rounded.full,
              paddingHorizontal: spacing.lg,
              paddingVertical: spacing.md,
            },
          ]}
        >
          <Text
            style={[
              typography.bodySm,
              { color: colors.onSurfaceVariant, textAlign: 'center', fontStyle: 'italic' },
            ]}
          >
            Messages are no longer available for this trip.
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View
      style={[
        styles.composerBar,
        {
          backgroundColor: '#ffffff',
          borderTopColor: colors.cardBorder,
          paddingHorizontal: spacing.md,
          paddingVertical: spacing.sm,
        },
      ]}
    >
      {/* Attach/+ Action icon */}
      <TouchableOpacity
        activeOpacity={0.7}
        style={[
          styles.iconButton,
          {
            backgroundColor: colors.surfaceContainerLow,
            borderRadius: rounded.md,
          },
        ]}
      >
        <Text style={{ fontSize: 18, color: colors.onSurfaceVariant }}>+</Text>
      </TouchableOpacity>

      {/* Propose Vote Action (FR-2-6a) */}
      <TouchableOpacity
        onPress={onProposeVote}
        activeOpacity={0.7}
        style={[
          styles.iconButton,
          {
            backgroundColor: colors.surfaceContainerLow,
            borderRadius: rounded.md,
          },
        ]}
      >
        <Text style={{ fontSize: 16 }}>🗳️</Text>
      </TouchableOpacity>

      {/* Text Input */}
      <TextInput
        value={inputText}
        onChangeText={onChangeText}
        placeholder="Type a message..."
        placeholderTextColor={colors.outline}
        style={[
          styles.textInput,
          {
            backgroundColor: colors.surfaceContainerLow,
            borderRadius: rounded.full,
            paddingHorizontal: spacing.md,
            color: colors.onSurface,
            fontSize: 14,
          },
        ]}
      />

      {/* Send Button */}
      <TouchableOpacity
        onPress={onSend}
        activeOpacity={0.8}
        disabled={!inputText.trim()}
        style={[
          styles.sendButton,
          {
            backgroundColor: inputText.trim() ? colors.primaryContainer : colors.surfaceContainerHigh,
            borderRadius: rounded.full,
          },
        ]}
      >
        <Text
          style={{
            fontSize: 16,
            color: inputText.trim() ? '#ffffff' : colors.onSurfaceVariant,
          }}
        >
          ➤
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  composerBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    gap: 6,
  },
  disabledPill: {
    flex: 1,
  },
  iconButton: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textInput: {
    flex: 1,
    height: 36,
  },
  sendButton: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
