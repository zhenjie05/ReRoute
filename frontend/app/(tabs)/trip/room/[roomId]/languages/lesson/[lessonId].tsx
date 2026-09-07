import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTheme } from '@/core/theme';
import { Card, Badge, Button } from '@/shared/components';
import { mockLanguageLessons } from '@/features/language/data/mock-language';

export default function LessonQuizScreen() {
  const { lessonId } = useLocalSearchParams<{ lessonId: string }>();
  const { colors, typography, spacing, rounded } = useTheme();
  const router = useRouter();

  const lesson = mockLanguageLessons.find((l) => l.id === lessonId) || mockLanguageLessons[0];
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const question = lesson.quiz_questions[0];

  const handleSelectOption = (optId: string, correct: boolean) => {
    if (isAnswered) return;
    setSelectedOptionId(optId);
    setIsAnswered(true);
    setIsCorrect(correct);
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Header */}
      <View style={[styles.header, { paddingHorizontal: spacing.lg, paddingVertical: spacing.md }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={{ fontSize: 20 }}>←</Text>
        </TouchableOpacity>
        <Text style={[typography.headlineSm, { color: colors.onSurface }]}>{lesson.title}</Text>
        <View style={{ width: 32 }} />
      </View>

      <ScrollView contentContainerStyle={{ padding: spacing.lg, paddingBottom: 100 }}>
        {/* Vocabulary Review Cards */}
        <Text style={[typography.headlineSm, { color: colors.onSurface, marginBottom: spacing.xs }]}>
          Essential Phrases
        </Text>
        <Text style={[typography.bodySm, { color: colors.onSurfaceVariant, marginBottom: spacing.md }]}>
          Review before testing your recall.
        </Text>

        <View style={{ gap: spacing.sm, marginBottom: spacing.xl }}>
          {lesson.lesson_content.map((item, idx) => (
            <Card key={idx} variant="season">
              <Text style={[typography.labelLg, { color: colors.season.text, fontWeight: '800' }]}>
                {item.phrase}
              </Text>
              <Text style={[typography.utilityTiny, { color: colors.onSurfaceVariant, marginTop: 2 }]}>
                🗣️ Pronounce: {item.romanization}
              </Text>
              <Text style={[typography.bodyMd, { color: colors.onSurface, marginTop: 4, fontWeight: '600' }]}>
                Meaning: {item.translation}
              </Text>
            </Card>
          ))}
        </View>

        {/* Interactive Quiz Section */}
        <Card variant="outlined" style={{ borderColor: colors.primary, borderWidth: 2 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.sm }}>
            <Badge label="🎯 Question 1 of 1" variant="season" />
            <Text style={[typography.labelSm, { color: colors.primary, fontWeight: '700' }]}>
              +{lesson.xp_reward} XP
            </Text>
          </View>

          <Text style={[typography.headlineSm, { color: colors.onSurface, marginBottom: spacing.md }]}>
            {question.prompt}
          </Text>

          <View style={{ gap: spacing.sm }}>
            {question.options.map((opt) => {
              const isSelected = selectedOptionId === opt.id;
              let btnBg = colors.surfaceContainerLow;
              if (isAnswered && isSelected) {
                btnBg = opt.is_correct ? colors.successContainer : colors.errorContainer;
              }

              return (
                <TouchableOpacity
                  key={opt.id}
                  onPress={() => handleSelectOption(opt.id, opt.is_correct)}
                  style={[
                    styles.optionBtn,
                    {
                      backgroundColor: btnBg,
                      borderRadius: rounded.md,
                      padding: spacing.md,
                    },
                  ]}
                >
                  <Text
                    style={[
                      typography.bodyMd,
                      {
                        color:
                          isAnswered && isSelected
                            ? opt.is_correct
                              ? colors.success
                              : colors.error
                            : colors.onSurface,
                        fontWeight: '700',
                      },
                    ]}
                  >
                    {opt.text}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {isAnswered ? (
            <View style={{ marginTop: spacing.md }}>
              <Text
                style={[
                  typography.labelLg,
                  {
                    color: isCorrect ? colors.success : colors.error,
                    fontWeight: '800',
                    textAlign: 'center',
                    marginBottom: spacing.md,
                  },
                ]}
              >
                {isCorrect ? '🎉 Correct! +50 XP Earned' : '❌ Try reviewing the phrase above!'}
              </Text>
              <Button
                title="Complete Lesson"
                onPress={() => router.back()}
                variant="primary"
                size="md"
              />
            </View>
          ) : null}
        </Card>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#edf1f5',
  },
  backBtn: {
    padding: 6,
  },
  optionBtn: {
    borderWidth: 1,
    borderColor: '#dde3e7',
  },
});
