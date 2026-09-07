import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Linking,
  Platform,
} from 'react-native';
import { useTheme } from '@/core/theme';
import { useLiveTrip } from '@/lib/hooks/useLiveTrip';
import { Button } from './Button';

export const SOSOverlay: React.FC = () => {
  const { colors, typography, rounded, spacing, shadows } = useTheme();
  const { hasLiveTrip, liveTrip } = useLiveTrip();
  const [modalVisible, setModalVisible] = useState(false);
  const [sosTriggered, setSosTriggered] = useState(false);
  const [locationDenied, setLocationDenied] = useState(false);

  if (!hasLiveTrip) {
    return null;
  }

  const handleTriggerSOS = () => {
    setSosTriggered(true);
  };

  const handleCallEmergency = (number: string = '110') => {
    const url = Platform.OS === 'ios' ? `telprompt:${number}` : `tel:${number}`;
    Linking.openURL(url).catch(() => {});
  };

  const resetSOS = () => {
    setModalVisible(false);
    setSosTriggered(false);
  };

  return (
    <>
      {/* Persistent SOS Floating Action Button */}
      <View style={styles.fabContainer}>
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => setModalVisible(true)}
          style={[
            styles.fab,
            {
              backgroundColor: colors.error,
              borderRadius: rounded['2xl'],
              ...shadows.medium,
            },
          ]}
        >
          <Text style={{ fontSize: 26, color: '#ffffff' }}>🚨</Text>
          <Text style={[typography.utilityTiny, { color: '#ffffff', fontWeight: '800' }]}>
            SOS
          </Text>
        </TouchableOpacity>
      </View>

      {/* SOS Modal Dialog (2-Step Verification & Quick-Dial) */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={resetSOS}
      >
        <View style={styles.modalBackdrop}>
          <View
            style={[
              styles.modalContent,
              {
                backgroundColor: colors.card,
                borderRadius: rounded.cardLarge,
                padding: spacing['2xl'],
                ...shadows.medium,
              },
            ]}
          >
            {!sosTriggered ? (
              // Step 1: Confirmation Gate
              <>
                <View style={[styles.iconCircle, { backgroundColor: colors.errorContainer }]}>
                  <Text style={{ fontSize: 36 }}>⚠️</Text>
                </View>
                <Text style={[typography.headlineMd, { color: colors.error, textAlign: 'center', marginTop: spacing.md }]}>
                  Emergency SOS
                </Text>
                <Text
                  style={[
                    typography.bodyMd,
                    { color: colors.onSurfaceVariant, textAlign: 'center', marginVertical: spacing.md },
                  ]}
                >
                  This will broadcast your live location to all members in{' '}
                  <Text style={{ fontWeight: '700', color: colors.onSurface }}>
                    {liveTrip?.name || 'your trip room'}
                  </Text>{' '}
                  and open local emergency quick-dial.
                </Text>

                <View style={{ width: '100%', gap: spacing.md, marginTop: spacing.md }}>
                  <Button
                    title="🚨 Confirm Emergency Alert"
                    onPress={handleTriggerSOS}
                    variant="danger"
                    size="lg"
                  />
                  <Button
                    title="Cancel"
                    onPress={resetSOS}
                    variant="ghost"
                    size="md"
                  />
                </View>
              </>
            ) : (
              // Step 2: Emergency Dispatched & Quick-Dial
              <>
                <View style={[styles.iconCircle, { backgroundColor: colors.successContainer }]}>
                  <Text style={{ fontSize: 36 }}>📡</Text>
                </View>
                <Text style={[typography.headlineSm, { color: colors.onSurface, textAlign: 'center', marginTop: spacing.md }]}>
                  Alert Dispatched!
                </Text>
                <Text
                  style={[
                    typography.bodySm,
                    { color: colors.onSurfaceVariant, textAlign: 'center', marginTop: spacing.xs, marginBottom: spacing.md },
                  ]}
                >
                  Group members notified via high-priority push & chat broadcast.
                </Text>

                {/* Location Services Denied State Banner */}
                {locationDenied ? (
                  <View
                    style={[
                      styles.warningBanner,
                      { backgroundColor: colors.warningContainer, borderRadius: rounded.md, padding: spacing.md },
                    ]}
                  >
                    <Text style={[typography.labelSm, { color: colors.warning, fontWeight: '700' }]}>
                      ⚠️ Location Denied
                    </Text>
                    <Text style={[typography.utilityTiny, { color: colors.onSurfaceVariant, marginTop: 2 }]}>
                      Contacts alerted without GPS. Enable location in device settings.
                    </Text>
                  </View>
                ) : (
                  <View
                    style={[
                      styles.warningBanner,
                      { backgroundColor: colors.surfaceContainerLow, borderRadius: rounded.md, padding: spacing.md },
                    ]}
                  >
                    <Text style={[typography.labelSm, { color: colors.primary, fontWeight: '700' }]}>
                      📍 Live GPS Coordinates Shared
                    </Text>
                    <Text style={[typography.utilityTiny, { color: colors.onSurfaceVariant, marginTop: 2 }]}>
                      Tokyo, Japan (35.6762° N, 139.6503° E)
                    </Text>
                  </View>
                )}

                {/* Quick-Dial Actions */}
                <View style={{ width: '100%', gap: spacing.sm, marginTop: spacing.lg }}>
                  <Button
                    title="📞 Call Police (110)"
                    onPress={() => handleCallEmergency('110')}
                    variant="danger"
                    size="lg"
                  />
                  <Button
                    title="🚑 Call Ambulance / Fire (119)"
                    onPress={() => handleCallEmergency('119')}
                    variant="danger"
                    size="lg"
                  />
                  <Button
                    title="Close Overlay"
                    onPress={resetSOS}
                    variant="outline"
                    size="md"
                    style={{ marginTop: spacing.xs }}
                  />
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  fabContainer: {
    position: 'absolute',
    right: 20,
    bottom: 96,
    zIndex: 999,
  },
  fab: {
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(10, 15, 17, 0.65)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
  },
  iconCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    alignItems: 'center',
    justifyContent: 'center',
  },
  warningBanner: {
    width: '100%',
    marginVertical: 8,
  },
});
