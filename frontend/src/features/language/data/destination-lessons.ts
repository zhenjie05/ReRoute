import type { LanguageLesson } from '@/models/language';

export const languagePhrases = {
  France: { language: 'French', code: 'fr', phrases: [['Bonjour', 'Hello', 'bon-zhoor'], ['Merci', 'Thank you', 'mehr-see'], ['Où est la gare ?', 'Where is the station?', 'oo eh lah gar'], ['Un billet, s’il vous plaît.', 'One ticket, please.', 'uhn bee-yeh seel voo pleh'], ['L’addition, s’il vous plaît.', 'The bill, please.', 'lah-dee-syohn seel voo pleh'], ['De l’eau, s’il vous plaît.', 'Water, please.', 'duh loh seel voo pleh']] },
  Bali: { language: 'Indonesian', code: 'id', phrases: [['Halo', 'Hello', 'hah-loh'], ['Terima kasih', 'Thank you', 'tuh-ree-mah kah-see'], ['Di mana halte bus?', 'Where is the bus stop?', 'dee mah-nah hahl-teh boos'], ['Satu tiket, tolong.', 'One ticket, please.', 'sah-too tee-ket toh-long'], ['Minta tagihannya.', 'The bill, please.', 'meen-tah tah-gee-han-nyah'], ['Air putih, tolong.', 'Water, please.', 'ah-eer poo-teeh toh-long']] },
  China: { language: 'Mandarin Chinese', code: 'zh', phrases: [['你好', 'Hello', 'Nǐ hǎo'], ['谢谢', 'Thank you', 'Xièxie'], ['车站在哪里？', 'Where is the station?', 'Chēzhàn zài nǎlǐ?'], ['请给我一张票。', 'One ticket, please.', 'Qǐng gěi wǒ yì zhāng piào.'], ['请买单。', 'The bill, please.', 'Qǐng mǎidān.'], ['请给我水。', 'Water, please.', 'Qǐng gěi wǒ shuǐ.']] },
  Japan: { language: 'Japanese', code: 'ja', phrases: [['こんにちは', 'Hello', 'Konnichiwa'], ['ありがとう', 'Thank you', 'Arigatō'], ['駅はどこですか？', 'Where is the station?', 'Eki wa doko desu ka?'], ['切符を一枚ください。', 'One ticket, please.', 'Kippu o ichimai kudasai.'], ['お会計をお願いします。', 'The bill, please.', 'Okaikei o onegaishimasu.'], ['お水をください。', 'Water, please.', 'Omizu o kudasai.']] },
};
export type LessonDestination = keyof typeof languagePhrases;
export function lessonsForDestination(destination: string): LanguageLesson[] {
  const key = (Object.keys(languagePhrases) as LessonDestination[]).find(country => destination.includes(country));
  if (!key) return [];
  const data = languagePhrases[key];
  return (['greetings', 'transit', 'food'] as const).map((category, index) => {
    const content = data.phrases.slice(index * 2, index * 2 + 2).map(([phrase, translation, romanization]) => ({ phrase, translation, romanization }));
    return { id: `${data.code}-${category}`, destination: key, language_name: data.language, category, title: ['Everyday greetings', 'Getting around', 'At the restaurant'][index], description: `Practice two useful ${data.language} phrases.`, icon: ['👋', '🚉', '🍽️'][index], xp_reward: 20, lesson_content: content, quiz_questions: content.map((phrase, question) => ({ id: `${data.code}-${category}-${question}`, prompt: phrase.phrase, pronunciation: phrase.romanization, options: [phrase.translation, 'Good night', 'How much is it?'].map((text, option) => ({ id: `${data.code}-${category}-${question}-${option}`, text, is_correct: option === 0 })) })) };
  });
}
