import { useState, useCallback } from 'react';
import { LanguageLesson, LessonProgressState } from '@/models/language';
import { lessonsForDestination } from './destination-lessons';
import { mockTripRooms } from '@/features/trip-room/data/mock-trip-room';

export const mockLanguageLessons: LanguageLesson[] = ['Japan', 'France', 'Bali', 'China'].flatMap(lessonsForDestination);
export const getRoomLanguageLessons = (roomId: string) => lessonsForDestination(mockTripRooms.find(room => room.id === roomId)?.destination || '');

// Simulate backend progress persistence using React state for the session
const initialProgress: Record<string, LessonProgressState> = {};
mockLanguageLessons.forEach(lesson => {
  initialProgress[lesson.id] = {
    lessonId: lesson.id,
    status: lesson.is_completed ? 'completed' : 'not_started',
    progressPercent: lesson.is_completed ? 100 : 0,
    currentQuestionIndex: 0,
    correctCount: 0,
    answeredCount: 0,
  };
});

// A simple global state for the demo to persist across screen transitions
let globalProgressState = { ...initialProgress };

export function useLanguageProgress() {
  const [progressState, setProgressState] = useState<Record<string, LessonProgressState>>(globalProgressState);

  const updateProgress = useCallback((lessonId: string, updates: Partial<LessonProgressState>) => {
    setProgressState(prev => {
      const newState = {
        ...prev,
        [lessonId]: {
          ...prev[lessonId],
          ...updates,
        }
      };
      globalProgressState = newState;
      return newState;
    });
  }, []);

  const markLessonComplete = useCallback((lessonId: string) => {
    updateProgress(lessonId, {
      status: 'completed',
      progressPercent: 100,
      completedAt: Date.now()
    });
  }, [updateProgress]);

  const resetLesson = useCallback((lessonId: string) => {
    updateProgress(lessonId, {
      status: 'not_started',
      progressPercent: 0,
      currentQuestionIndex: 0,
      correctCount: 0,
      answeredCount: 0,
    });
  }, [updateProgress]);

  // UI-only mock streak data
  const streakData = {
    days: 23,
    isActive: true,
  };

  return {
    progressState,
    updateProgress,
    markLessonComplete,
    resetLesson,
    streakData
  };
}
