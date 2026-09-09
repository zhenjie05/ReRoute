import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTheme } from '@/core/theme';
import { getRoomLanguageLessons, useLanguageProgress } from '@/features/language/data/mock-language';
import { LessonPhraseCard } from '@/features/trip-room/presentation/components/language/LessonPhraseCard';
import { LessonQuizOptions } from '@/features/trip-room/presentation/components/language/LessonQuizOptions';
import { LessonProgress } from '@/features/trip-room/presentation/components/language/LessonProgress';
import { LessonCompletionCard } from '@/features/trip-room/presentation/components/language/LessonCompletionCard';

export default function LessonDetailScreen() {
  const { lessonId, roomId } = useLocalSearchParams<{ lessonId: string; roomId: string }>();
  const { colors, typography, rounded } = useTheme();
  const router = useRouter();

  const lesson = getRoomLanguageLessons(roomId).find((l) => l.id === lessonId);
  const { updateProgress, markLessonComplete } = useLanguageProgress();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isLessonComplete, setIsLessonComplete] = useState(false);
  const [correctAnswersCount, setCorrectAnswersCount] = useState(0);
  const [timeSpentMs, setTimeSpentMs] = useState(0);

  const startTimeRef = React.useRef<number | null>(null);
  React.useEffect(() => {
    startTimeRef.current = Date.now();
  }, [lessonId]);

  if (!lesson) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Lesson not found.</Text>
      </View>
    );
  }

  const questions = lesson.quiz_questions || [];
  const totalQuestions = questions.length;
  const currentQuestion = questions[currentIndex];
  // Match the phrase based on index
  const currentContent = lesson.lesson_content[currentIndex] || lesson.lesson_content[0];

  const handleSelectOption = (optionId: string, isCorrect: boolean) => {
    setSelectedOptionId(optionId);
    setIsAnswered(true);
    
    let newCorrectCount = correctAnswersCount;
    if (isCorrect) {
      newCorrectCount += 1;
      setCorrectAnswersCount(newCorrectCount);
    }

    updateProgress(lesson.id, {
      status: 'in_progress',
      currentQuestionIndex: currentIndex,
      answeredCount: currentIndex + 1,
      correctCount: newCorrectCount,
      progressPercent: Math.round(((currentIndex + 1) / totalQuestions) * 100),
    });
  };

  const handleNext = () => {
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedOptionId(null);
      setIsAnswered(false);
    } else {
      setTimeSpentMs(Date.now() - (startTimeRef.current || Date.now()));
      setIsLessonComplete(true);
      markLessonComplete(lesson.id);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setSelectedOptionId(null);
      setIsAnswered(false);
    }
  };

  if (isLessonComplete) {
    const minutes = Math.floor(timeSpentMs / 60000);
    const seconds = Math.floor((timeSpentMs % 60000) / 1000);
    const timeSpentStr = minutes > 0 ? `${minutes}m ${seconds}s` : `${seconds}s`;
    
    // Cap at 100% just in case
    const accuracy = totalQuestions > 0 ? Math.round((correctAnswersCount / totalQuestions) * 100) : 100;

    return (
      <ScrollView contentContainerStyle={{ flexGrow: 1, backgroundColor: colors.background, paddingBottom: 100 }}>
        <LessonCompletionCard
          subtitle={`You've mastered ${totalQuestions} new phrases today.`}
          timeSpentStr={timeSpentStr}
          accuracyPercent={accuracy}
        />

        <View style={{ paddingHorizontal: 16 }}>
          <TouchableOpacity
            style={[styles.primaryBtn, { backgroundColor: '#ff8f06', borderRadius: rounded['2xl'] }]}
            onPress={() => router.back()}
          >
            <Text style={[typography.labelLg, { color: '#fff', fontWeight: 'bold' }]}>
              Continue to Next Lesson →
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{ padding: 16, alignItems: 'center' }}
            onPress={() => router.navigate(`/(tabs)/trip/room/${roomId}/languages` as any)}
          >
            <Text style={[typography.labelSm, { color: colors.outline, fontWeight: 'bold' }]}>
              Back to Trip Rooms
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1, backgroundColor: colors.background, paddingBottom: 100 }}>
      <LessonProgress current={currentIndex + (isAnswered ? 1 : 0)} total={totalQuestions} />

      <LessonPhraseCard
        phrase={currentContent.phrase}
        romanization={currentContent.romanization}
        onAudioPress={() => {
          // Mock audio playback
        }}
      />

      <Text style={[typography.labelLg, { color: colors.onSurface, textAlign: 'center', marginBottom: 16, fontWeight: 'bold' }]}>
        {currentQuestion.prompt}
      </Text>

      <LessonQuizOptions
        options={currentQuestion.options}
        selectedOptionId={selectedOptionId}
        isAnswered={isAnswered}
        onSelectOption={handleSelectOption}
      />

      <View style={styles.navBar}>
        <TouchableOpacity 
          style={[styles.navBtn, { backgroundColor: colors.surfaceContainerLow }]}
          onPress={handlePrev}
          disabled={currentIndex === 0}
        >
          <Text style={{ fontSize: 18, color: currentIndex === 0 ? colors.onSurfaceVariant : colors.onSurface }}>←</Text>
        </TouchableOpacity>

        <Text style={[typography.utilityTiny, { color: colors.outline, fontWeight: 'bold' }]}>
          Phrase {currentIndex + 1}
        </Text>

        <TouchableOpacity 
          style={[
            styles.navBtn, 
            { backgroundColor: isAnswered ? '#ff8f06' : colors.surfaceContainerHighest }
          ]}
          onPress={handleNext}
          disabled={!isAnswered}
        >
          <Text style={{ fontSize: 18, color: isAnswered ? '#fff' : colors.onSurfaceVariant }}>→</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    marginTop: 'auto',
  },
  navBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryBtn: {
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
