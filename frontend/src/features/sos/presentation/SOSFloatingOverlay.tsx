import React, { useState } from 'react';
import { TouchableOpacity, Image, StyleSheet, Animated, PanResponder } from 'react-native';
import { useLiveTrip } from '@/lib/hooks/useLiveTrip';
import { SOSConfirmationModal, SOSReason } from './SOSConfirmationModal';
import { SOSQuickDialModal } from './SOSQuickDialModal';

interface SOSFloatingOverlayProps {
  /** Optional override to force display in mock/demo environments */
  forceVisible?: boolean;
}

export const SOSFloatingOverlay: React.FC<SOSFloatingOverlayProps> = ({ forceVisible = false }) => {
  const { hasLiveTrip } = useLiveTrip();

  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [quickDialVisible, setQuickDialVisible] = useState(false);
  const [selectedReason, setSelectedReason] = useState<SOSReason>('Accident');

  const [pan] = useState(() => new Animated.ValueXY());

  const [panResponder] = useState(() =>
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return Math.abs(gestureState.dx) > 2 || Math.abs(gestureState.dy) > 2;
      },
      onPanResponderMove: Animated.event(
        [null, { dx: pan.x, dy: pan.y }],
        { useNativeDriver: false }
      ),
      onPanResponderRelease: () => {
        pan.extractOffset();
      },
    })
  );

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
      <Animated.View 
        {...panResponder.panHandlers}
        style={[
          styles.fabContainer,
          { transform: pan.getTranslateTransform() }
        ]} 
        pointerEvents="box-none"
      >
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={handleOpenConfirm}
          accessibilityLabel="Emergency SOS Button"
          accessibilityRole="button"
          style={styles.fab}
        >
          <Image 
            source={require('../../../../assets/icons/sos-icon.png')} 
            style={{ width: '100%', height: '100%' }} 
            resizeMode="contain" 
          />
        </TouchableOpacity>
      </Animated.View>

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
    bottom: 100,
    right: 20,
    zIndex: 9999,
  },
  fab: {
    width: 60,
    height: 60,
    borderRadius: 30,
    overflow: 'hidden',
    backgroundColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
