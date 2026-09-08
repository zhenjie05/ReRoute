export interface QuizOption {
  id: string;
  text: string;
  is_correct: boolean;
}

export interface QuizQuestion {
  id: string;
  prompt: string;
  pronunciation?: string;
  options: QuizOption[];
}

export interface LanguageLesson {
  id: string;
  destination: string;
  language_name: string;
  category: 'food' | 'transit' | 'stay' | 'emergency' | 'greetings' | 'checkin';
  title: string;
  description: string;
  icon: string;
  lesson_content: {
    phrase: string;
    translation: string;
    romanization?: string;
    audio_sample?: string;
  }[];
  quiz_questions: QuizQuestion[];
  is_completed?: boolean;
  xp_reward: number;
}

// ---- View Model Types ----

export type LessonStatus = 'not_started' | 'in_progress' | 'completed';

export interface LessonProgressState {
  lessonId: string;
  status: LessonStatus;
  progressPercent: number;
  currentQuestionIndex: number;
  correctCount: number;
  answeredCount: number;
  startedAt?: number;
  completedAt?: number;
}

export interface TranslatorRequest {
  sourceLanguage: string;
  targetLanguage: string;
  text: string;
}

export interface TranslatorResult {
  translatedText: string;
  romanization?: string;
}
