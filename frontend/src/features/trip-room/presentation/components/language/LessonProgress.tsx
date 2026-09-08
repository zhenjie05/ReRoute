import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/core/theme';

interface LessonProgressProps {
  current: number;
  total: number;
}

export function LessonProgress({ current, total }: LessonProgressProps) {
  const { colors, typography } = useTheme();

  // Prevent divide by zero and cap at 100%
  const safeTotal = total > 0 ? total : 1;
  const percent = Math.min(100, Math.round((current / safeTotal) * 100));

  return (
    <View style={styles.container}>
      <View style={styles.textRow}>
        <Text style={[typography.labelSm, { color: colors.onSurface, fontWeight: '500' }]}>
          {current} of {total} phrases mastered today
        </Text>
        <Text style={[typography.labelSm, { color: colors.primary, fontWeight: 'bold' }]}>
          {percent}%
        </Text>
      </View>
      
      <View style={[styles.barTrack, { backgroundColor: colors.surfaceContainer }]}>
        <View style={[styles.barFill, { backgroundColor: colors.primary, width: `${percent}%` }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    marginVertical: 8,
  },
  textRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  barTrack: {
    height: 8,
    borderRadius: 4,
    width: '100%',
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 4,
  },
});
