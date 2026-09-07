import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Linking,
  Platform,
} from 'react-native';
import { useTheme } from '@/core/theme';
import { useLiveTrip } from '@/lib/hooks/useLiveTrip';

export type SOSReason = 'Medical' | 'Accident' | 'Lost' | 'Security';

interface SOSConfirmationModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: (reason: SOSReason) => void;
}

export const SOSConfirmationModal: React.FC<SOSConfirmationModalProps> = ({
  visible,
  onClose,
  onConfirm,
}) => {
  const { colors, typography, spacing, rounded, shadows } = useTheme();
  const { liveTrip } = useLiveTrip();
  const [selectedReason, setSelectedReason] = useState<SOSReason>('Accident');

  const reasons: { key: SOSReason; icon: string; label: string }[] = [
    { key: 'Medical', icon: '🧰', label: 'Medical' },
    { key: 'Accident', icon: '🚗', label: 'Accident' },
    { key: 'Lost', icon: '📍', label: 'Lost' },
    { key: 'Security', icon: '🛡️', label: 'Security' },
  ];

  const handleCallHotline = (number: string = '0570-000-911') => {
    const cleanNumber = number.replace(/[^0-9]/g, '');
    const url = Platform.OS === 'ios' ? `telprompt:${cleanNumber}` : `tel:${cleanNumber}`;
    Linking.openURL(url).catch(() => {});
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.backdrop}>
        <TouchableOpacity style={styles.scrim} activeOpacity={1} onPress={onClose} />
        <View
          style={[
            styles.sheet,
            {
              backgroundColor: colors.surface,
              borderTopLeftRadius: rounded.cardLarge,
              borderTopRightRadius: rounded.cardLarge,
              paddingTop: spacing.md,
              ...shadows.medium,
            },
          ]}
        >
          {/* Top Drag Handle */}
          <View style={[styles.handle, { backgroundColor: colors.outlineVariant, borderRadius: rounded.full }]} />

          {/* Top Header Bar */}
          <View style={[styles.headerBar, { paddingHorizontal: spacing.lg }]}>
            <TouchableOpacity onPress={onClose} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <Text style={{ fontSize: 18, color: colors.onSurface }}>←</Text>
            </TouchableOpacity>

            <View style={styles.headerTitleCol}>
              <Text style={[typography.utilityTiny, { color: colors.primary, fontWeight: '800', textTransform: 'uppercase' }]}>
                {liveTrip?.name || 'TOKYO SAKURA EXPLORER'}
              </Text>
              <Text style={[typography.labelMd, { color: colors.onSurface, fontWeight: '800' }]}>
                Safety & Emergency
              </Text>
            </View>

            <View style={[styles.liveAlertBadge, { backgroundColor: '#fee2e2', borderRadius: rounded.full }]}>
              <Text style={[typography.utilityTiny, { color: colors.error, fontWeight: '800' }]}>
                • Live Alert
              </Text>
            </View>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: spacing.lg, paddingBottom: spacing['2xl'] }}
          >
            {/* Protocol Sub-Header */}
            <View style={[styles.protocolRow, { marginVertical: spacing.sm }]}>
              <Text style={[typography.utilityTiny, { color: colors.outline, fontWeight: '600' }]}>
                🛡️ Emergency Assistance Protocol
              </Text>
              <Text style={[typography.utilityTiny, { color: colors.outline }]}>
                GPS Accuracy: ±4m
              </Text>
            </View>

            {/* Master Action Card */}
            <View
              style={[
                styles.masterCard,
                {
                  backgroundColor: colors.card,
                  borderRadius: rounded['2xl'],
                  padding: spacing.lg,
                  ...shadows.soft,
                },
              ]}
            >
              {/* Title Header */}
              <View style={styles.cardTitleRow}>
                <View style={[styles.asteriskBox, { backgroundColor: colors.error, borderRadius: rounded.xl }]}>
                  <Text style={{ color: '#ffffff', fontSize: 20, fontWeight: '900' }}>✱</Text>
                </View>
                <View style={{ marginLeft: spacing.sm, flex: 1 }}>
                  <Text style={[typography.headlineSm, { color: colors.onSurface, fontWeight: '800' }]}>
                    SOS Confirmation
                  </Text>
                  <Text style={[typography.utilityTiny, { color: colors.onSurfaceVariant }]}>
                    High-priority broadcast to trip room squad
                  </Text>
                </View>
              </View>

              {/* Warning Notice Box */}
              <View
                style={[
                  styles.warningNoticeBox,
                  {
                    backgroundColor: '#fff7ed',
                    borderColor: '#ffedd5',
                    borderRadius: rounded.lg,
                    padding: spacing.md,
                    marginVertical: spacing.md,
                  },
                ]}
              >
                <Text style={[typography.utilityTiny, { color: '#9a3412', lineHeight: 16 }]}>
                  ⚠️ Triggering this confirmation immediately shares your real-time GPS coordinate and an alert banner with all 5 trip members.
                </Text>
                <View style={styles.gpsRow}>
                  <Text style={[typography.utilityTiny, { color: colors.onSurface, fontWeight: '700' }]}>
                    📍 Shinjuku Station, East Gate
                  </Text>
                  <Text style={[typography.utilityTiny, { color: colors.error, fontWeight: '800' }]}>
                    Live Pinned
                  </Text>
                </View>
              </View>

              {/* Reason Selector */}
              <View style={styles.sectionHeaderRow}>
                <Text style={[typography.labelSm, { color: colors.onSurface, fontWeight: '800' }]}>
                  SELECT REASON
                </Text>
                <Text style={[typography.utilityTiny, { color: colors.outline }]}>
                  Optional categorization
                </Text>
              </View>

              <View style={styles.reasonsGrid}>
                {reasons.map((r) => {
                  const isSelected = selectedReason === r.key;
                  return (
                    <TouchableOpacity
                      key={r.key}
                      activeOpacity={0.8}
                      onPress={() => setSelectedReason(r.key)}
                      style={[
                        styles.reasonChip,
                        {
                          backgroundColor: isSelected ? colors.error : colors.surfaceContainerLow,
                          borderRadius: rounded.full,
                          borderColor: isSelected ? colors.error : colors.surfaceContainerHigh,
                        },
                      ]}
                    >
                      <Text style={{ fontSize: 13 }}>{r.icon}</Text>
                      <Text
                        style={[
                          typography.labelSm,
                          {
                            color: isSelected ? '#ffffff' : colors.onSurface,
                            fontWeight: isSelected ? '800' : '600',
                          },
                        ]}
                      >
                        {r.label} {isSelected ? '✓' : ''}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* Squad Recipients */}
              <View style={[styles.recipientsRow, { backgroundColor: colors.surfaceContainerLow, borderRadius: rounded.lg, padding: spacing.sm, marginVertical: spacing.md }]}>
                <Text style={[typography.utilityTiny, { color: colors.onSurfaceVariant, fontWeight: '600' }]}>
                  Squad Recipients
                </Text>
                <View style={styles.avatarStack}>
                  <View style={[styles.squadAvatar, { backgroundColor: '#fdba74' }]}><Text style={styles.avatarText}>AL</Text></View>
                  <View style={[styles.squadAvatar, { backgroundColor: '#86efac', marginLeft: -6 }]}><Text style={styles.avatarText}>SK</Text></View>
                  <View style={[styles.squadAvatar, { backgroundColor: '#f9a8d4', marginLeft: -6 }]}><Text style={styles.avatarText}>MK</Text></View>
                  <View style={[styles.squadAvatar, { backgroundColor: '#c7d2fe', marginLeft: -6 }]}><Text style={styles.avatarText}>+2</Text></View>
                </View>
              </View>

              {/* Confirm CTA */}
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={() => onConfirm(selectedReason)}
                style={[
                  styles.confirmBtn,
                  {
                    backgroundColor: colors.error,
                    borderRadius: rounded.xl,
                    paddingVertical: spacing.md,
                    ...shadows.medium,
                  },
                ]}
              >
                <Text style={[typography.labelLg, { color: '#ffffff', fontWeight: '800', textAlign: 'center' }]}>
                  📞 Confirm & Broadcast SOS
                </Text>
              </TouchableOpacity>

              {/* Cancel Link */}
              <TouchableOpacity onPress={onClose} style={{ marginTop: spacing.md, alignSelf: 'center' }}>
                <Text style={[typography.labelSm, { color: colors.outline, fontWeight: '600' }]}>
                  Cancel request • False Alarm
                </Text>
              </TouchableOpacity>
            </View>

            {/* Tourist Safety Hotline */}
            <View
              style={[
                styles.hotlineCard,
                {
                  backgroundColor: colors.card,
                  borderRadius: rounded.xl,
                  padding: spacing.md,
                  marginTop: spacing.md,
                  ...shadows.soft,
                },
              ]}
            >
              <View style={styles.hotlineLeft}>
                <Text style={{ fontSize: 22 }}>📇</Text>
                <View style={{ marginLeft: spacing.sm }}>
                  <Text style={[typography.labelSm, { color: colors.onSurface, fontWeight: '700' }]}>
                    Tourist Safety Hotline
                  </Text>
                  <Text style={[typography.utilityTiny, { color: colors.outline }]}>
                    English / JP translation available
                  </Text>
                </View>
              </View>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => handleCallHotline('0570-000-911')}
                style={[
                  styles.hotlineBtn,
                  {
                    borderColor: colors.primaryContainer,
                    borderRadius: rounded.lg,
                  },
                ]}
              >
                <Text style={[typography.labelSm, { color: colors.primaryContainer, fontWeight: '800' }]}>
                  0570-000-911
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(10, 15, 17, 0.6)',
    justifyContent: 'flex-end',
  },
  scrim: {
    flex: 1,
  },
  sheet: {
    maxHeight: '92%',
    width: '100%',
  },
  handle: {
    width: 40,
    height: 5,
    alignSelf: 'center',
    marginBottom: 8,
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  headerTitleCol: {
    alignItems: 'center',
  },
  liveAlertBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  protocolRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  masterCard: {
    width: '100%',
  },
  cardTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  asteriskBox: {
    width: 38,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
  },
  warningNoticeBox: {
    borderWidth: 1,
  },
  gpsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: '#fed7aa',
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  reasonsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  reasonChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderWidth: 1,
    gap: 6,
  },
  recipientsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  avatarStack: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  squadAvatar: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#ffffff',
  },
  avatarText: {
    fontSize: 8,
    fontWeight: '800',
    color: '#1f2937',
  },
  confirmBtn: {
    width: '100%',
  },
  hotlineCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  hotlineLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  hotlineBtn: {
    borderWidth: 1.5,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
});
