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
import { SOSReason } from './SOSConfirmationModal';

interface SOSQuickDialModalProps {
  visible: boolean;
  onClose: () => void;
  reason?: SOSReason;
  initialLocationDenied?: boolean;
}

export const SOSQuickDialModal: React.FC<SOSQuickDialModalProps> = ({
  visible,
  onClose,
  reason = 'Accident',
  initialLocationDenied = false,
}) => {
  const { colors, typography, spacing, rounded, shadows } = useTheme();
  const { liveTrip } = useLiveTrip();
  const [locationDenied, setLocationDenied] = useState(initialLocationDenied);

  const handleCallEmergency = (number: string) => {
    const cleanNumber = number.replace(/[^0-9]/g, '');
    const url = Platform.OS === 'ios' ? `telprompt:${cleanNumber}` : `tel:${cleanNumber}`;
    Linking.openURL(url).catch(() => {});
  };

  const squadMembers = [
    { id: '1', name: 'Alice L.', role: 'Leader', status: 'Delivered', avatar: 'AL', bg: '#fdba74' },
    { id: '2', name: 'Shun K.', role: 'Member', status: 'Delivered', avatar: 'SK', bg: '#86efac' },
    { id: '3', name: 'Maya K.', role: 'Member', status: 'Delivered', avatar: 'MK', bg: '#f9a8d4' },
    { id: '4', name: 'Liam T.', role: 'Member', status: 'Sent', avatar: 'LT', bg: '#c7d2fe' },
    { id: '5', name: 'Sophie B.', role: 'Member', status: 'Sent', avatar: 'SB', bg: '#fed7aa' },
  ];

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

          {/* Header Bar */}
          <View style={[styles.headerBar, { paddingHorizontal: spacing.lg }]}>
            <TouchableOpacity onPress={onClose} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <Text style={{ fontSize: 18, color: colors.onSurface }}>←</Text>
            </TouchableOpacity>

            <View style={styles.headerTitleCol}>
              <Text style={[typography.utilityTiny, { color: colors.primary, fontWeight: '800', textTransform: 'uppercase' }]}>
                {liveTrip?.name || 'TOKYO SAKURA EXPLORER'}
              </Text>
              <Text style={[typography.labelMd, { color: colors.onSurface, fontWeight: '800' }]}>
                Emergency Broadcast Active
              </Text>
            </View>

            <View style={[styles.dispatchedBadge, { backgroundColor: '#dcfce7', borderRadius: rounded.full }]}>
              <Text style={[typography.utilityTiny, { color: '#15803d', fontWeight: '800' }]}>
                ✓ Dispatched
              </Text>
            </View>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: spacing.lg, paddingBottom: spacing['2xl'] }}
          >
            {/* Status Notification Banner */}
            <View
              style={[
                styles.broadcastBanner,
                {
                  backgroundColor: '#fee2e2',
                  borderColor: '#fca5a5',
                  borderRadius: rounded.xl,
                  padding: spacing.md,
                  marginVertical: spacing.sm,
                },
              ]}
            >
              <View style={styles.broadcastBannerHeader}>
                <Text style={{ fontSize: 20 }}>🚨</Text>
                <View style={{ marginLeft: spacing.sm, flex: 1 }}>
                  <Text style={[typography.labelSm, { color: colors.error, fontWeight: '800' }]}>
                    SOS Broadcast Sent ({reason})
                  </Text>
                  <Text style={[typography.utilityTiny, { color: colors.onSurfaceVariant, marginTop: 2 }]}>
                    Alert banner, audio chime & high-priority push delivered to all trip room members.
                  </Text>
                </View>
              </View>
            </View>

            {/* Location Status Card (Active GPS vs Location Denied) */}
            {locationDenied ? (
              <View
                style={[
                  styles.locationCard,
                  {
                    backgroundColor: '#fff7ed',
                    borderColor: '#fed7aa',
                    borderRadius: rounded.xl,
                    padding: spacing.md,
                    marginVertical: spacing.xs,
                  },
                ]}
              >
                <View style={styles.locationHeaderRow}>
                  <Text style={{ fontSize: 18 }}>⚠️</Text>
                  <View style={{ marginLeft: spacing.sm, flex: 1 }}>
                    <Text style={[typography.labelSm, { color: '#9a3412', fontWeight: '800' }]}>
                      Location Services Unavailable
                    </Text>
                    <Text style={[typography.utilityTiny, { color: '#9a3412', marginTop: 2, lineHeight: 15 }]}>
                      Emergency contacts notified without exact GPS coordinates. Enable location permissions in Settings to share live coordinates.
                    </Text>
                  </View>
                </View>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => setLocationDenied(false)}
                  style={[styles.retryLocationBtn, { backgroundColor: '#ffedd5', borderRadius: rounded.md }]}
                >
                  <Text style={[typography.utilityTiny, { color: '#9a3412', fontWeight: '700' }]}>
                    🔄 Retry GPS Access / Simulate GPS Available
                  </Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View
                style={[
                  styles.locationCard,
                  {
                    backgroundColor: colors.surfaceContainerLow,
                    borderColor: colors.surfaceContainerHigh,
                    borderRadius: rounded.xl,
                    padding: spacing.md,
                    marginVertical: spacing.xs,
                  },
                ]}
              >
                <View style={styles.locationHeaderRow}>
                  <Text style={{ fontSize: 18 }}>📍</Text>
                  <View style={{ marginLeft: spacing.sm, flex: 1 }}>
                    <View style={styles.gpsTitleRow}>
                      <Text style={[typography.labelSm, { color: colors.onSurface, fontWeight: '800' }]}>
                        Live GPS Coordinates Shared
                      </Text>
                      <Text style={[typography.utilityTiny, { color: '#15803d', fontWeight: '800' }]}>
                        • Live (±4m)
                      </Text>
                    </View>
                    <Text style={[typography.utilityTiny, { color: colors.onSurfaceVariant, marginTop: 2 }]}>
                      Shinjuku Station, East Gate • Tokyo, Japan (35.6912° N, 139.7032° E)
                    </Text>
                  </View>
                </View>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => setLocationDenied(true)}
                  style={[styles.retryLocationBtn, { backgroundColor: colors.surfaceContainer, borderRadius: rounded.md }]}
                >
                  <Text style={[typography.utilityTiny, { color: colors.outline, fontWeight: '600' }]}>
                    Simulate Location Services Denied
                  </Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Direct Emergency Quick-Dial Actions */}
            <View style={{ marginVertical: spacing.md }}>
              <Text style={[typography.labelSm, { color: colors.onSurface, fontWeight: '800', marginBottom: spacing.xs }]}>
                LOCAL EMERGENCY QUICK-DIAL
              </Text>
              <Text style={[typography.utilityTiny, { color: colors.outline, marginBottom: spacing.sm }]}>
                Auto-detected for Japan (Tokyo Metro Region)
              </Text>

              {/* Police Button */}
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={() => handleCallEmergency('110')}
                style={[
                  styles.dialBtn,
                  {
                    backgroundColor: colors.error,
                    borderRadius: rounded.xl,
                    padding: spacing.md,
                    marginBottom: spacing.sm,
                    ...shadows.soft,
                  },
                ]}
              >
                <View style={styles.dialBtnLeft}>
                  <Text style={{ fontSize: 24, color: '#ffffff' }}>👮</Text>
                  <View style={{ marginLeft: spacing.md }}>
                    <Text style={[typography.labelLg, { color: '#ffffff', fontWeight: '900' }]}>
                      Call Police (110)
                    </Text>
                    <Text style={[typography.utilityTiny, { color: 'rgba(255, 255, 255, 0.85)' }]}>
                      Immediate police dispatch & traffic assistance
                    </Text>
                  </View>
                </View>
                <Text style={{ color: '#ffffff', fontSize: 20, fontWeight: '900' }}>📞</Text>
              </TouchableOpacity>

              {/* Fire & Ambulance Button */}
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={() => handleCallEmergency('119')}
                style={[
                  styles.dialBtn,
                  {
                    backgroundColor: '#ea580c',
                    borderRadius: rounded.xl,
                    padding: spacing.md,
                    marginBottom: spacing.sm,
                    ...shadows.soft,
                  },
                ]}
              >
                <View style={styles.dialBtnLeft}>
                  <Text style={{ fontSize: 24, color: '#ffffff' }}>🚑</Text>
                  <View style={{ marginLeft: spacing.md }}>
                    <Text style={[typography.labelLg, { color: '#ffffff', fontWeight: '900' }]}>
                      Call Ambulance / Fire (119)
                    </Text>
                    <Text style={[typography.utilityTiny, { color: 'rgba(255, 255, 255, 0.85)' }]}>
                      Emergency medical assistance & fire rescue
                    </Text>
                  </View>
                </View>
                <Text style={{ color: '#ffffff', fontSize: 20, fontWeight: '900' }}>📞</Text>
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
                  marginBottom: spacing.md,
                  borderWidth: 1,
                  borderColor: colors.surfaceContainerHigh,
                  ...shadows.soft,
                },
              ]}
            >
              <View style={styles.hotlineLeft}>
                <Text style={{ fontSize: 22 }}>📇</Text>
                <View style={{ marginLeft: spacing.sm, flex: 1 }}>
                  <Text style={[typography.labelSm, { color: colors.onSurface, fontWeight: '700' }]}>
                    Tourist Safety Hotline
                  </Text>
                  <Text style={[typography.utilityTiny, { color: colors.outline }]}>
                    24/7 Multilingual support (English, Japanese, Chinese)
                  </Text>
                </View>
              </View>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => handleCallEmergency('0570-000-911')}
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

            {/* Squad Members Delivery Status */}
            <View
              style={[
                styles.squadStatusCard,
                {
                  backgroundColor: colors.card,
                  borderRadius: rounded.xl,
                  padding: spacing.md,
                  ...shadows.soft,
                },
              ]}
            >
              <View style={styles.squadStatusHeader}>
                <Text style={[typography.labelSm, { color: colors.onSurface, fontWeight: '800' }]}>
                  SQUAD DELIVERY STATUS ({squadMembers.length})
                </Text>
                <Text style={[typography.utilityTiny, { color: '#15803d', fontWeight: '700' }]}>
                  All Notified
                </Text>
              </View>

              {squadMembers.map((member) => (
                <View key={member.id} style={styles.memberRow}>
                  <View style={[styles.memberAvatar, { backgroundColor: member.bg }]}>
                    <Text style={styles.memberAvatarText}>{member.avatar}</Text>
                  </View>
                  <View style={{ marginLeft: spacing.sm, flex: 1 }}>
                    <Text style={[typography.labelSm, { color: colors.onSurface, fontWeight: '700' }]}>
                      {member.name}
                    </Text>
                    <Text style={[typography.utilityTiny, { color: colors.outline }]}>
                      {member.role}
                    </Text>
                  </View>
                  <View style={[styles.memberStatusBadge, { backgroundColor: member.status === 'Delivered' ? '#dcfce7' : '#f3f4f6' }]}>
                    <Text style={[typography.utilityTiny, { color: member.status === 'Delivered' ? '#15803d' : '#6b7280', fontWeight: '700' }]}>
                      {member.status === 'Delivered' ? '✓ Delivered' : '• Sent'}
                    </Text>
                  </View>
                </View>
              ))}
            </View>

            {/* Dismiss CTA */}
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={onClose}
              style={[
                styles.dismissBtn,
                {
                  backgroundColor: colors.surfaceContainerHigh,
                  borderRadius: rounded.xl,
                  paddingVertical: spacing.md,
                  marginTop: spacing.lg,
                },
              ]}
            >
              <Text style={[typography.labelMd, { color: colors.onSurface, fontWeight: '700', textAlign: 'center' }]}>
                Close Quick-Dial Screen
              </Text>
            </TouchableOpacity>
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
  dispatchedBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  broadcastBanner: {
    borderWidth: 1,
  },
  broadcastBannerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationCard: {
    borderWidth: 1,
  },
  locationHeaderRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  gpsTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  retryLocationBtn: {
    marginTop: 8,
    paddingVertical: 6,
    paddingHorizontal: 10,
    alignItems: 'center',
  },
  dialBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dialBtnLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  hotlineCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  hotlineLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  hotlineBtn: {
    borderWidth: 1.5,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  squadStatusCard: {
    width: '100%',
  },
  squadStatusHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    paddingBottom: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  memberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
  },
  memberAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  memberAvatarText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#1f2937',
  },
  memberStatusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  dismissBtn: {
    width: '100%',
  },
});
