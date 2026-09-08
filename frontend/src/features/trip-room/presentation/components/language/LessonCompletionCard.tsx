import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/core/theme';

interface LessonCompletionCardProps {
  title?: string;
  subtitle: string;
  timeSpentStr: string;
  accuracyPercent: number;
  isSession?: boolean;
}

export function LessonCompletionCard({
  title = 'Lesson Complete!',
  subtitle,
  timeSpentStr,
  accuracyPercent,
  isSession = false,
}: LessonCompletionCardProps) {
  const { colors, typography, rounded, shadows } = useTheme();

  return (
    <View style={[styles.card, { backgroundColor: colors.card, borderRadius: rounded['3xl'], ...shadows.soft }]}>
      <View style={[styles.trophyIcon, { backgroundColor: '#ff8f06' }]}>
        <Text style={{ fontSize: 40, color: '#fff' }}>🏆</Text>
      </View>

      <Text style={[typography.headlineMd, { color: colors.onSurface, fontWeight: 'bold', marginBottom: 8, textAlign: 'center' }]}>
        {title}
      </Text>
      
      <Text style={[typography.labelSm, { color: colors.onSurfaceVariant, textAlign: 'center', marginBottom: 24 }]}>
        {subtitle}
      </Text>

      {!isSession && (
        <View style={styles.statsGrid}>
          <View style={[styles.statBox, { backgroundColor: colors.surfaceContainerLowest, borderColor: colors.surfaceContainer, borderRadius: rounded['xl'] }]}>
            <Text style={[typography.utilityTiny, { color: colors.outline, fontWeight: 'bold', marginBottom: 4 }]}>
              TIME SPENT
            </Text>
            <Text style={[typography.headlineSm, { color: colors.onSurface, fontWeight: 'bold' }]}>
              {timeSpentStr}
            </Text>
          </View>

          <View style={[styles.statBox, { backgroundColor: colors.surfaceContainerLowest, borderColor: colors.surfaceContainer, borderRadius: rounded['xl'] }]}>
            <Text style={[typography.utilityTiny, { color: colors.outline, fontWeight: 'bold', marginBottom: 4 }]}>
              ACCURACY
            </Text>
            <Text style={[typography.headlineSm, { color: colors.onSurface, fontWeight: 'bold' }]}>
              {accuracyPercent}%
            </Text>
          </View>
        </View>
      )}
      
      {isSession && (
        <View style={styles.statsGrid}>
          <View style={[styles.statBox, { backgroundColor: colors.surfaceContainerLowest, borderColor: colors.surfaceContainer, borderRadius: rounded['xl'] }]}>
            <Text style={[typography.utilityTiny, { color: colors.outline, fontWeight: 'bold', marginBottom: 4 }]}>
              TIME SPENT
            </Text>
            <Text style={[typography.headlineSm, { color: colors.primary, fontWeight: 'bold' }]}>
              {timeSpentStr}
            </Text>
          </View>

          <View style={[styles.statBox, { backgroundColor: colors.surfaceContainerLowest, borderColor: colors.surfaceContainer, borderRadius: rounded['xl'] }]}>
            <Text style={[typography.utilityTiny, { color: colors.outline, fontWeight: 'bold', marginBottom: 4 }]}>
              ACCURACY
            </Text>
            <Text style={[typography.headlineSm, { color: colors.primary, fontWeight: 'bold' }]}>
              {accuracyPercent}%
            </Text>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 24,
    marginHorizontal: 16,
    marginVertical: 24,
    alignItems: 'center',
  },
  trophyIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  statBox: {
    flex: 1,
    borderWidth: 1,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
