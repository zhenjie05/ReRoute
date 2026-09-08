import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '@/core/theme';
import { LessonStatus } from '@/models/language';

interface LessonCategoryCardProps {
  title: string;
  subtitle: string;
  icon: string;
  status: LessonStatus;
  progressPercent?: number;
  onPress: () => void;
}

export function LessonCategoryCard({ title, subtitle, icon, status, progressPercent = 0, onPress }: LessonCategoryCardProps) {
  const { colors, typography, rounded } = useTheme();

  const isCompleted = status === 'completed';
  const isInProgress = status === 'in_progress';
  
  // Highlight active lesson with an orange tint and border
  const bgStyle = isInProgress
    ? { backgroundColor: '#fef8f4', borderColor: '#fed7aa', borderWidth: 1 }
    : { backgroundColor: colors.card, borderColor: colors.cardBorder, borderWidth: 1 };

  return (
    <TouchableOpacity
      style={[styles.card, bgStyle, { borderRadius: rounded['2xl'] }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.leftContent}>
        <View style={[styles.iconBox, { backgroundColor: isInProgress ? '#ff8f06' : '#ffedd5' }]}>
          <Text style={{ fontSize: 20 }}>{icon}</Text>
        </View>
        <View style={styles.textContent}>
          <Text style={[typography.labelLg, { color: colors.onSurface, fontWeight: 'bold' }]}>
            {title}
          </Text>
          <Text style={[typography.utilityTiny, { color: colors.onSurfaceVariant }]}>
            {subtitle}
          </Text>
        </View>
      </View>

      <View style={styles.rightContent}>
        {isCompleted ? (
          <View style={[styles.checkCircle, { backgroundColor: '#ff8f06' }]}>
            <Text style={{ color: '#fff', fontSize: 12, fontWeight: 'bold' }}>✓</Text>
          </View>
        ) : isInProgress ? (
          <View style={styles.progressCircle}>
            {/* Simple representation of a progress ring */}
            <View style={[styles.progressRing, { borderColor: '#ff8f06' }]} />
            <Text style={{ fontSize: 10, fontWeight: 'bold', color: colors.onSurface }}>{progressPercent}%</Text>
          </View>
        ) : (
          <View style={styles.emptyCircle} />
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
    marginBottom: 12,
  },
  leftContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  textContent: {
    flex: 1,
  },
  rightContent: {
    paddingLeft: 12,
  },
  checkCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#dde3e7',
  },
  progressCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  progressRing: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 16,
    borderWidth: 3,
    borderTopColor: 'transparent',
    borderRightColor: 'transparent',
    transform: [{ rotate: '45deg' }],
  },
});
