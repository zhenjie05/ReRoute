import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/core/theme';

interface LessonStreakCardProps {
  days: number;
  subtext: string;
}

export function LessonStreakCard({ days, subtext }: LessonStreakCardProps) {
  const { typography, rounded, shadows } = useTheme();

  return (
    <View style={[styles.card, { borderRadius: rounded['3xl'], ...shadows.medium }]}>
      <View style={styles.content}>
        <Text style={[typography.headlineSm, { color: '#ffffff', fontWeight: 'bold' }]}>
          {days}-day streak 🔥
        </Text>
        <Text style={[typography.utilityTiny, { color: 'rgba(255,255,255,0.9)', marginTop: 4 }]}>
          {subtext}
        </Text>
      </View>
      <View style={styles.badge}>
        <Text style={{ fontSize: 20 }}>🔥</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ff8f06',
    padding: 20,
    marginHorizontal: 16,
    marginBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  content: {
    flex: 1,
  },
  badge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 99,
    padding: 12,
  },
});
