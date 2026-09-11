import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { useTheme } from '@/core/theme';
import { ModalSheet } from '@/shared/components';
import { DecisionTriggerType } from '@/models/decision';
import { Feather } from '@expo/vector-icons';

interface ProposeVoteSheetProps {
  visible: boolean;
  onClose: () => void;
  onPublish: (data: {
    title: string;
    triggerType: DecisionTriggerType;
    options: string[];
    anonymous: boolean;
  }) => void;
}

/**
 * Propose Vote compose sheet — opened from the composer toolbar.
 * Trigger type is limited to `disruption` | `conflict` only
 * (`safety_risk` is auto-triggered elsewhere, never user-selectable here).
 * Supports dynamic add/remove option rows (minimum 2).
 */
export const ProposeVoteSheet: React.FC<ProposeVoteSheetProps> = ({
  visible,
  onClose,
  onPublish,
}) => {
  const { colors, typography, spacing, rounded } = useTheme();

  const [title, setTitle] = useState('');
  const [triggerType, setTriggerType] = useState<'disruption' | 'conflict'>('conflict');
  const [options, setOptions] = useState(['', '']);
  const [anonymous, setAnonymous] = useState(true);

  const canPublish =
    title.trim().length > 0 &&
    options.filter((o) => o.trim().length > 0).length >= 2;

  const handleAddOption = () => {
    setOptions((prev) => [...prev, '']);
  };

  const handleRemoveOption = (index: number) => {
    if (options.length <= 2) return;
    setOptions((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpdateOption = (index: number, value: string) => {
    setOptions((prev) => prev.map((o, i) => (i === index ? value : o)));
  };

  const handlePublish = () => {
    if (!canPublish) return;
    onPublish({
      title: title.trim(),
      triggerType,
      options: options.filter((o) => o.trim().length > 0),
      anonymous,
    });
    // Reset form
    setTitle('');
    setTriggerType('conflict');
    setOptions(['', '']);
    setAnonymous(true);
  };

  return (
    <ModalSheet 
      visible={visible} 
      onClose={onClose} 
      title={
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Feather name="check-square" size={22} color={colors.onSurface} />
          <Text style={[typography.headlineSm, { color: colors.onSurface }]}>Propose Group Vote</Text>
        </View>
      }
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{ gap: spacing.md }}>
          {/* Decision Question */}
          <View>
            <Text style={[typography.labelSm, { color: colors.onSurface, fontWeight: '700', marginBottom: spacing.xs }]}>
              Decision Question / Topic
            </Text>
            <TextInput
              value={title}
              onChangeText={setTitle}
              placeholder="e.g. Which ramen shop for dinner?"
              placeholderTextColor={colors.outline}
              style={[
                styles.input,
                {
                  borderColor: colors.outlineVariant,
                  borderRadius: rounded.md,
                  padding: spacing.md,
                  color: colors.onSurface,
                },
              ]}
            />
          </View>

          {/* Trigger Type Selector */}
          <View>
            <Text style={[typography.labelSm, { color: colors.onSurface, fontWeight: '700', marginBottom: spacing.xs }]}>
              Trigger Type
            </Text>
            <View style={[styles.typeRow, { gap: spacing.sm }]}>
              <TouchableOpacity
                onPress={() => setTriggerType('conflict')}
                style={[
                  styles.typeOption,
                  {
                    backgroundColor: triggerType === 'conflict' ? colors.primaryContainer : colors.surfaceContainerLow,
                    borderRadius: rounded.md,
                    padding: spacing.md,
                  },
                ]}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                  <Feather name="alert-circle" size={16} color={triggerType === 'conflict' ? '#ffffff' : colors.onSurface} />
                  <Text
                    style={[
                      typography.labelSm,
                      {
                        color: triggerType === 'conflict' ? '#ffffff' : colors.onSurface,
                        fontWeight: '700',
                      },
                    ]}
                  >
                    Conflict
                  </Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setTriggerType('disruption')}
                style={[
                  styles.typeOption,
                  {
                    backgroundColor: triggerType === 'disruption' ? colors.primaryContainer : colors.surfaceContainerLow,
                    borderRadius: rounded.md,
                    padding: spacing.md,
                  },
                ]}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                  <Feather name="zap" size={16} color={triggerType === 'disruption' ? '#ffffff' : colors.onSurface} />
                  <Text
                    style={[
                      typography.labelSm,
                      {
                        color: triggerType === 'disruption' ? '#ffffff' : colors.onSurface,
                        fontWeight: '700',
                      },
                    ]}
                  >
                    Disruption
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>

          {/* Options */}
          <View>
            <Text style={[typography.labelSm, { color: colors.onSurface, fontWeight: '700', marginBottom: spacing.xs }]}>
              Vote Options (min 2)
            </Text>
            {options.map((opt, idx) => (
              <View key={idx} style={[styles.optionRow, { marginBottom: spacing.xs }]}>
                <TextInput
                  value={opt}
                  onChangeText={(v) => handleUpdateOption(idx, v)}
                  placeholder={`Option ${idx + 1}`}
                  placeholderTextColor={colors.outline}
                  style={[
                    styles.input,
                    {
                      flex: 1,
                      borderColor: colors.outlineVariant,
                      borderRadius: rounded.md,
                      padding: spacing.md,
                      color: colors.onSurface,
                    },
                  ]}
                />
                {options.length > 2 && (
                  <TouchableOpacity
                    onPress={() => handleRemoveOption(idx)}
                    style={[styles.removeBtn, { marginLeft: spacing.xs }]}
                  >
                    <Text style={{ fontSize: 16, color: colors.error }}>✕</Text>
                  </TouchableOpacity>
                )}
              </View>
            ))}
            <TouchableOpacity
              onPress={handleAddOption}
              style={[
                styles.addOptionBtn,
                {
                  borderColor: colors.outlineVariant,
                  borderRadius: rounded.md,
                  paddingVertical: spacing.sm,
                  marginTop: spacing.xs,
                },
              ]}
            >
              <Text style={[typography.labelSm, { color: colors.primary, fontWeight: '700' }]}>
                + Add Another Option
              </Text>
            </TouchableOpacity>
          </View>

          {/* Anonymous Toggle */}
          <TouchableOpacity
            onPress={() => setAnonymous(!anonymous)}
            style={[styles.toggleRow, { marginVertical: spacing.xs }]}
          >
            <Text style={{ fontSize: 18, marginRight: spacing.sm }}>
              {anonymous ? '☑️' : '◻️'}
            </Text>
            <Text style={[typography.bodySm, { color: colors.onSurface }]}>
              Anonymous Voting (hide member picks)
            </Text>
          </TouchableOpacity>

          {/* Publish */}
          <TouchableOpacity
            onPress={handlePublish}
            disabled={!canPublish}
            activeOpacity={0.85}
            style={[
              styles.publishBtn,
              {
                backgroundColor: canPublish ? colors.primaryContainer : colors.surfaceContainerHigh,
                borderRadius: rounded.lg,
                paddingVertical: spacing.lg,
                marginTop: spacing.sm,
              },
            ]}
          >
            <Text
              style={[
                typography.labelLg,
                {
                  color: canPublish ? '#ffffff' : colors.onSurfaceVariant,
                  fontWeight: '700',
                  textAlign: 'center',
                },
              ]}
            >
              Publish Vote to Room Chat
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ModalSheet>
  );
};

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    fontSize: 14,
  },
  typeRow: {
    flexDirection: 'row',
  },
  typeOption: {
    flex: 1,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  removeBtn: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addOptionBtn: {
    borderWidth: 1,
    borderStyle: 'dashed',
    alignItems: 'center',
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  publishBtn: {},
});
