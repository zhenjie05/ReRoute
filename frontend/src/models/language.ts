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
  category: 'food' | 'transit' | 'stay' | 'emergency';
  title: string;
  description: string;
  lesson_content: Array<{
    phrase: string;
    translation: string;
    romanization?: string;
    audio_sample?: string;
  }>;
  quiz_questions: QuizQuestion[];
  is_completed?: boolean;
  xp_reward: number;
}
