import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTheme } from '@/core/theme';
import { Card, Badge, Button } from '@/shared/components';
import { mockLanguageLessons } from '@/features/language/data/mock-language';

export default function LanguagesHubScreen() {
  const { roomId } = useLocalSearchParams<{ roomId: string }>();
  const { colors, typography, spacing, rounded } = useTheme();
  const router = useRouter();

  // Quick Translator State (FR-5-4)
  const [sourceText, setSourceText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);

  const handleTranslate = () => {
    if (!sourceText.trim()) return;
    setIsTranslating(true);
    setTimeout(() => {
      setIsTranslating(false);
      if (sourceText.toLowerCase().includes('water')) {
        setTranslatedText('水をお願いします (Mizu o onegaishimasu)');
      } else if (sourceText.toLowerCase().includes('train') || sourceText.toLowerCase().includes('station')) {
        setTranslatedText('駅はどこですか？ (Eki wa doko desu ka?)');
      } else {
        setTranslatedText(`「${sourceText}」の日本語訳です (Translation complete)`);
      }
    }, 600);
  };

  return (
    <ScrollView contentContainerStyle={{ padding: spacing.lg, paddingBottom: 100 }}>
      {/* Real-time Translator Quick Tool (FR-5-4) */}
      <Card variant="season" style={{ marginBottom: spacing.lg }}>
        <Text style={[typography.headlineSm, { color: colors.season.text, marginBottom: spacing.xs }]}>
          ⚡ Real-Time Travel Translator
        </Text>
        <Text style={[typography.bodySm, { color: colors.onSurfaceVariant, marginBottom: spacing.md }]}>
          English ⇄ Japanese
        </Text>

        <TextInput
          value={sourceText}
          onChangeText={setSourceText}
          placeholder="Type English phrase (e.g. Where is the train?)..."
          placeholderTextColor={colors.outline}
          style={[
            styles.input,
            {
              backgroundColor: '#ffffff',
              borderColor: colors.season.main,
              borderRadius: rounded.md,
              padding: spacing.md,
              color: colors.onSurface,
            },
          ]}
        />

        <Button
          title={isTranslating ? 'Translating...' : 'Translate Now 🌐'}
          onPress={handleTranslate}
          loading={isTranslating}
          variant="primary"
          size="sm"
          style={{ marginTop: spacing.sm }}
        />

        {translatedText ? (
          <View
            style={[
              styles.translationResult,
              { backgroundColor: '#ffffff', borderRadius: rounded.md, padding: spacing.md, marginTop: spacing.md },
            ]}
          >
            <Text style={[typography.labelSm, { color: colors.primary, fontWeight: '700' }]}>
              Japanese Output:
            </Text>
            <Text style={[typography.headlineSm, { color: colors.onSurface, marginTop: 4 }]}>
              {translatedText}
            </Text>
          </View>
        ) : null}
      </Card>

      {/* Gamified Destination Mini-Lessons (FR-5-1, FR-5-2) */}
      <Text style={[typography.headlineSm, { color: colors.onSurface, marginBottom: spacing.sm }]}>
        Survival Japanese Lessons 🇯🇵
      </Text>
      <Text style={[typography.bodySm, { color: colors.onSurfaceVariant, marginBottom: spacing.md }]}>
        Complete quick quizzes to unlock badges and travel effortlessly.
      </Text>

      <View style={{ gap: spacing.md }}>
        {mockLanguageLessons.map((lesson) => (
          <Card
            key={lesson.id}
            variant="outlined"
            onPress={() => router.push(`/(tabs)/trip/room/${roomId}/languages/lesson/${lesson.id}` as any)}
          >
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Badge
                label={lesson.is_completed ? '✅ Completed' : '🎯 Mini-Quiz'}
                variant={lesson.is_completed ? 'success' : 'season'}
              />
              <Text style={[typography.labelSm, { color: colors.primary, fontWeight: '700' }]}>
                +{lesson.xp_reward} XP
              </Text>
            </View>

            <Text style={[typography.headlineSm, { color: colors.onSurface, marginTop: spacing.xs }]}>
              {lesson.title}
            </Text>
            <Text style={[typography.bodySm, { color: colors.onSurfaceVariant, marginTop: 2 }]}>
              {lesson.description}
            </Text>
            <Text style={[typography.labelSm, { color: colors.primary, marginTop: spacing.sm, fontWeight: '700' }]}>
              Start Practice Quiz →
            </Text>
          </Card>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    fontSize: 14,
  },
  translationResult: {
    borderLeftWidth: 4,
    borderLeftColor: '#ff8f06',
  },
});
