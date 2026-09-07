import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '@/core/theme';
import { useLiveTrip } from '@/lib/hooks/useLiveTrip';
import { SOSConfirmationModal, SOSReason } from './SOSConfirmationModal';
import { SOSQuickDialModal } from './SOSQuickDialModal';

interface SOSFloatingOverlayProps {
  /** Optional override to force display in mock/demo environments */
  forceVisible?: boolean;
}

export const SOSFloatingOverlay: React.FC<SOSFloatingOverlayProps> = ({ forceVisible = false }) => {
  const { colors, typography, rounded, shadows } = useTheme();
  const { hasLiveTrip } = useLiveTrip();

  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [quickDialVisible, setQuickDialVisible] = useState(false);
  const [selectedReason, setSelectedReason] = useState<SOSReason>('Accident');

  // Per specification: Only render while the user has a live trip
  if (!hasLiveTrip && !forceVisible) {
    return null;
  }

  const handleOpenConfirm = () => {
    setConfirmModalVisible(true);
  };

  const handleConfirmSOS = (reason: SOSReason) => {
    setSelectedReason(reason);
    setConfirmModalVisible(false);
    // Transition to Step 2: Emergency Broadcast & Quick Dial
    setQuickDialVisible(true);
  };

  const handleCloseConfirm = () => {
    setConfirmModalVisible(false);
  };

  const handleCloseQuickDial = () => {
    setQuickDialVisible(false);
  };

  return (
    <>
      {/* Persistent SOS Floating Action Button (Squircle above Bottom Nav Bar) */}
      <View style={styles.fabContainer} pointerEvents="box-none">
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={handleOpenConfirm}
          accessibilityLabel="Emergency SOS Button"
          accessibilityRole="button"
          style={[
            styles.fab,
            {
              backgroundColor: colors.error,
              borderRadius: rounded['2xl'],
              ...shadows.medium,
            },
          ]}
        >
          <Text style={styles.fabIcon}>🚨</Text>
          <Text style={[typography.utilityTiny, styles.fabText]}>
            SOS
          </Text>
        </TouchableOpacity>
      </View>

      {/* Step 1: SOS Confirmation & Reason Selector Modal */}
      <SOSConfirmationModal
        visible={confirmModalVisible}
        onClose={handleCloseConfirm}
        onConfirm={handleConfirmSOS}
      />

      {/* Step 2: Emergency Broadcast Status & Local Quick-Dial Screen */}
      <SOSQuickDialModal
        visible={quickDialVisible}
        onClose={handleCloseQuickDial}
        reason={selectedReason}
      />
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
    width: 62,
    height: 62,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fabIcon: {
    fontSize: 24,
    color: '#ffffff',
  },
  fabText: {
    color: '#ffffff',
    fontWeight: '900',
    marginTop: -2,
    letterSpacing: 0.5,
  },
});
