import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/core/theme';
import { useProfileMockData } from '@/features/profile/data/useProfileMockData';

export default function BadgesScreen() {
  const { colors, typography, spacing } = useTheme();
  const router = useRouter();
  
  const { badges, userBadges } = useProfileMockData();
  const unlockedCount = userBadges.filter(ub => ub.unlocked_at !== null).length;

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: colors.surfaceContainerHigh }]}>
        <TouchableOpacity onPress={() => router.navigate('/(tabs)/profile' as any)} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <Text style={{ fontSize: 24, color: colors.onSurface }}>←</Text>
        </TouchableOpacity>
        <Text style={[typography.headlineSm, { color: colors.onSurface, fontWeight: 'bold' }]}>
          Badges ({unlockedCount}/{badges.length} unlocked)
        </Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={{ padding: spacing.lg }}>
        <View style={styles.grid}>
          {badges.map(badge => {
            const isUnlocked = userBadges.find(ub => ub.badge_id === badge.id)?.unlocked_at != null;
            return (
              <View key={badge.id} style={styles.gridItem}>
                <View style={[
                  styles.badgeCircle, 
                  { 
                    backgroundColor: isUnlocked ? colors.primary : colors.surfaceContainerHighest,
                    borderRadius: 45,
                  }
                ]}>
                  <Text style={{ fontSize: 32, opacity: isUnlocked ? 1 : 0.4 }}>{badge.icon}</Text>
                </View>
                <Text style={[typography.labelSm, { color: isUnlocked ? colors.onSurface : colors.onSurfaceVariant, marginTop: spacing.sm, textAlign: 'center', fontWeight: 'bold' }]}>
                  {badge.label}
                </Text>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    gap: 24,
  },
  gridItem: {
    width: '28%',
    alignItems: 'center',
    marginBottom: 16,
  },
  badgeCircle: {
    width: 90,
    height: 90,
    justifyContent: 'center',
    alignItems: 'center',
  }
});
