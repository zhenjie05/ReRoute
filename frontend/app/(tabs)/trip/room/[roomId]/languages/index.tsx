import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTheme } from '@/core/theme';
import { LanguageSubTabs, LanguageTab } from '@/features/trip-room/presentation/components/language/LanguageSubTabs';
import { AiTranslatorPanel } from '@/features/trip-room/presentation/components/language/AiTranslatorPanel';
import { LessonStreakCard } from '@/features/trip-room/presentation/components/language/LessonStreakCard';
import { LessonCategoryCard } from '@/features/trip-room/presentation/components/language/LessonCategoryCard';
import { mockLanguageLessons, useLanguageProgress } from '@/features/language/data/mock-language';

export default function LanguagesHubScreen() {
  const { roomId } = useLocalSearchParams<{ roomId: string }>();
  const { colors, typography, spacing, rounded } = useTheme();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<LanguageTab>('lessons');
  const { progressState, streakData } = useLanguageProgress();

  // Assuming all mock lessons are for the same destination in this demo
  const destinationLanguage = mockLanguageLessons[0]?.language_name || 'Japanese';

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView contentContainerStyle={{ paddingVertical: spacing.md, paddingBottom: 100 }}>
        
        <LanguageSubTabs activeTab={activeTab} onTabChange={setActiveTab} />

        {activeTab === 'translator' ? (
          <AiTranslatorPanel />
        ) : (
          <>
            <LessonStreakCard
              days={streakData.days}
              subtext="Keep it up! You're ready for Tokyo."
            />

            <View style={{ alignItems: 'center', marginBottom: spacing.lg }}>
              <View style={[styles.destPill, { backgroundColor: colors.surfaceContainer }]}>
                <Text style={[typography.utilityTiny, { color: colors.outline, fontWeight: 'bold' }]}>
                  🌐 Destination Language
                </Text>
              </View>
              <Text style={[typography.headlineMd, { color: colors.onSurface, fontWeight: 'bold' }]}>
                {destinationLanguage}
              </Text>
            </View>

            <View style={{ paddingHorizontal: spacing.lg }}>
              {mockLanguageLessons.map((lesson) => {
                const state = progressState[lesson.id];
                const status = state ? state.status : 'not_started';
                const progressPercent = state ? state.progressPercent : 0;

                return (
                  <LessonCategoryCard
                    key={lesson.id}
                    title={lesson.title}
                    subtitle={lesson.description}
                    icon={lesson.icon}
                    status={status}
                    progressPercent={progressPercent}
                    onPress={() => router.push(`/(tabs)/trip/room/${roomId}/languages/lesson/${lesson.id}` as any)}
                  />
                );
              })}
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  destPill: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 99,
    marginBottom: 4,
  },
});

