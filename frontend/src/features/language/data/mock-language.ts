import { LanguageLesson } from '@/models/language';

export const mockLanguageLessons: LanguageLesson[] = [
  {
    id: 'lesson-jp-food',
    destination: 'Tokyo, Japan',
    language_name: 'Japanese',
    category: 'food',
    title: 'Ordering Delicious Ramen & Food',
    description: 'Learn essential phrases to order dishes and ask for the bill with confidence.',
    xp_reward: 50,
    is_completed: true,
    lesson_content: [
      {
        phrase: 'Kore o kudasai',
        translation: 'Please give me this one.',
        romanization: 'ko-reh oh koo-dah-sai',
      },
      {
        phrase: 'Okaikei o onegaishimasu',
        translation: 'The bill, please.',
        romanization: 'oh-kai-kay oh oh-neh-guy-she-mass',
      },
      {
        phrase: 'Oishii desu',
        translation: 'This is delicious!',
        romanization: 'oy-shee dess',
      },
    ],
    quiz_questions: [
      {
        id: 'q1',
        prompt: 'How do you politely ask for the bill in Japanese?',
        options: [
          { id: 'o1', text: 'Okaikei o onegaishimasu', is_correct: true },
          { id: 'o2', text: 'Arigato gozaimasu', is_correct: false },
          { id: 'o3', text: 'Sumimasen', is_correct: false },
        ],
      },
      {
        id: 'q2',
        prompt: 'What does "Kore o kudasai" mean?',
        options: [
          { id: 'o4', text: 'Where is the station?', is_correct: false },
          { id: 'o5', text: 'Please give me this one', is_correct: true },
          { id: 'o6', text: 'Excuse me', is_correct: false },
        ],
      },
    ],
  },
  {
    id: 'lesson-jp-transit',
    destination: 'Tokyo, Japan',
    language_name: 'Japanese',
    category: 'transit',
    title: 'Subway & Station Navigation',
    description: 'Master asking for directions, train platforms, and transfer gates.',
    xp_reward: 50,
    is_completed: false,
    lesson_content: [
      {
        phrase: 'Eki wa doko desu ka?',
        translation: 'Where is the train station?',
        romanization: 'eh-kee wah doh-koh dess kah',
      },
      {
        phrase: 'Kono densha wa Shibuya ni ikimasu ka?',
        translation: 'Does this train go to Shibuya?',
        romanization: 'koh-noh den-shah wah she-boo-yah nee ee-kee-mass kah',
      },
    ],
    quiz_questions: [
      {
        id: 'q3',
        prompt: 'How do you ask "Where is the station?"',
        options: [
          { id: 'o7', text: 'Eki wa doko desu ka?', is_correct: true },
          { id: 'o8', text: 'Koko wa doko desu ka?', is_correct: false },
        ],
      },
    ],
  },
];
