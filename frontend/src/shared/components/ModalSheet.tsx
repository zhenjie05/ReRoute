import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  ScrollView,
} from 'react-native';
import { useTheme } from '@/core/theme';

interface ModalSheetProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  style?: ViewStyle;
}

export const ModalSheet: React.FC<ModalSheetProps> = ({
  visible,
  onClose,
  title,
  children,
  style,
}) => {
  const { colors, typography, rounded, spacing, shadows } = useTheme();

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
              backgroundColor: colors.card,
              borderTopLeftRadius: rounded.cardLarge,
              borderTopRightRadius: rounded.cardLarge,
              padding: spacing.xl,
              ...shadows.medium,
            },
            style,
          ]}
        >
          {/* Grab handle indicator */}
          <View
            style={[
              styles.handle,
              { backgroundColor: colors.outlineVariant, borderRadius: rounded.full },
            ]}
          />

          {/* Header */}
          {title ? (
            <View style={[styles.header, { marginBottom: spacing.lg }]}>
              <Text style={[typography.headlineSm, { color: colors.onSurface }]}>
                {title}
              </Text>
              <TouchableOpacity onPress={onClose} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                <Text style={{ fontSize: 18, color: colors.onSurfaceVariant }}>✕</Text>
              </TouchableOpacity>
            </View>
          ) : null}

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: spacing['2xl'] }}>
            {children}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(10, 15, 17, 0.45)',
    justifyContent: 'flex-end',
  },
  scrim: {
    flex: 1,
  },
  sheet: {
    maxHeight: '88%',
    width: '100%',
  },
  handle: {
    width: 40,
    height: 5,
    alignSelf: 'center',
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
