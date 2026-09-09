import { languagePhrases, LessonDestination } from '@/features/language/data/destination-lessons';
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { useTheme } from '@/core/theme';
import { TranslatorResult } from '@/models/language';
import { Feather } from '@expo/vector-icons';

export function AiTranslatorPanel({ destination = 'Japan' }: { destination?: string }) {
  const { colors, typography, spacing, rounded, shadows } = useTheme();

  const language = languagePhrases[destination as LessonDestination] || languagePhrases.Japan;
  const [sourceLang, setSourceLang] = useState('English (US)');
  const [targetLang, setTargetLang] = useState(language.language);
  const [inputText, setInputText] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);
  const [result, setResult] = useState<TranslatorResult | null>(null);

  const handleSwap = () => {
    setSourceLang(targetLang);
    setTargetLang(sourceLang);
    // Real app would likely clear or swap text too, but spec says "Typed text is preserved on swap"
  };

  const handleTranslate = () => {
    if (!inputText.trim()) return;

    setIsTranslating(true);
    setResult(null);

    // Mock API delay (< 2s per spec)
    setTimeout(() => {
      setIsTranslating(false);
      const reverse = targetLang === 'English (US)';
      const match = language.phrases.find(([phrase, translation]) => (reverse ? phrase : translation).toLowerCase() === inputText.trim().toLowerCase());
      setResult(match ? { translatedText: reverse ? match[1] : match[0], romanization: reverse ? undefined : match[2] } : { translatedText: 'Try a saved phrase such as Hello, Thank you or Water, please. This translator uses mock phrases.' });
    }, 1200);
  };

  const handleCopy = () => {
    Alert.alert('Copied', 'Translation copied to clipboard.');
  };

  const isTranslateDisabled = !inputText.trim() || isTranslating;

  return (
    <View style={[styles.card, { backgroundColor: colors.card, borderRadius: rounded['3xl'], ...shadows.soft }]}>
      <Text style={[typography.headlineSm, { color: colors.onSurface, marginBottom: spacing.md }]}>
        AI Live Translator
      </Text>

      {/* Language Swap Bar */}
      <View
        style={[
          styles.swapBar,
          { backgroundColor: colors.surfaceContainerLow, borderRadius: rounded['2xl'], padding: spacing.sm },
        ]}
      >
        <View style={[styles.langBox, { backgroundColor: colors.card, borderRadius: rounded.xl }]}>
          <Text style={[typography.labelSm, { color: colors.onSurface, fontWeight: 'bold' }]}>{sourceLang}</Text>
        </View>

        <TouchableOpacity
          onPress={handleSwap}
          style={[styles.swapBtn, { backgroundColor: colors.surfaceContainer }]}
        >
          <Text style={{ color: colors.primary }}>⇆</Text>
        </TouchableOpacity>

        <View style={[styles.langBox, { backgroundColor: colors.card, borderRadius: rounded.xl }]}>
          <Text style={[typography.labelSm, { color: colors.onSurface, fontWeight: 'bold' }]}>{targetLang}</Text>
        </View>
      </View>

      {/* Input Text Area */}
      <View
        style={[
          styles.inputArea,
          { backgroundColor: colors.surfaceContainerLow, borderRadius: rounded['2xl'], padding: spacing.md },
        ]}
      >
        <TextInput
          style={[typography.bodySm, { color: colors.onSurface, minHeight: 60 }]}
          placeholder="Where is the nearest subway entrance?"
          placeholderTextColor={colors.onSurfaceVariant}
          multiline
          maxLength={200}
          value={inputText}
          onChangeText={setInputText}
        />
        
        {/* Microphone Icon */}
        <TouchableOpacity style={[styles.micBtn, { backgroundColor: '#ffe0b2' }]}>
          <Feather name="mic" size={20} color="#333" />
        </TouchableOpacity>

        <View style={styles.inputFooter}>
          <Text style={[typography.utilityTiny, { color: colors.outline }]}>Detected: Travel &amp; Transit</Text>
          <Text style={[typography.utilityTiny, { color: inputText.length >= 200 ? colors.error : colors.outline }]}>
            {inputText.length}/200
          </Text>
        </View>
      </View>

      {/* Result Card */}
      {result && (
        <View
          style={[
            styles.resultCard,
            { backgroundColor: '#fef8f4', borderColor: '#fed7aa', borderRadius: rounded['2xl'], padding: spacing.md },
          ]}
        >
          <View style={styles.resultHeader}>
            <Text style={[typography.utilityTiny, { color: colors.primary, fontWeight: 'bold' }]}>
              ★ {targetLang.toUpperCase()} TRANSLATION
            </Text>
            <View style={{ flexDirection: 'row', gap: spacing.sm }}>
              <TouchableOpacity style={styles.iconBtn}>
                <Text>🔊</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconBtn} onPress={handleCopy}>
                <Text>📋</Text>
              </TouchableOpacity>
            </View>
          </View>

          <Text style={[typography.headlineSm, { color: colors.onSurface, marginVertical: spacing.sm }]}>
            {result.translatedText}
          </Text>

          {result.romanization && (
            <View style={[styles.romajiBox, { backgroundColor: colors.card, borderRadius: rounded.xl }]}>
              <Text style={{ fontSize: 11, color: colors.onSurfaceVariant, fontFamily: 'monospace' }}>
                PRONUNCIATION: {result.romanization}
              </Text>
            </View>
          )}
        </View>
      )}

      {/* Translate Button */}
      <TouchableOpacity
        style={[
          styles.translateBtn,
          {
            backgroundColor: isTranslateDisabled ? colors.surfaceContainerHighest : colors.primaryContainer,
            borderRadius: rounded['2xl'],
          },
        ]}
        onPress={handleTranslate}
        disabled={isTranslateDisabled}
      >
        {isTranslating ? (
          <ActivityIndicator color={colors.onPrimaryContainer} />
        ) : (
          <Text
            style={[
              typography.labelLg,
              { color: isTranslateDisabled ? colors.onSurfaceVariant : colors.onPrimaryContainer, fontWeight: 'bold' },
            ]}
          >
            Translate Now
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 20,
    marginHorizontal: 16,
    marginBottom: 16,
  },
  swapBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  langBox: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  swapBtn: {
    padding: 8,
    borderRadius: 99,
    marginHorizontal: 8,
  },
  inputArea: {
    position: 'relative',
    marginBottom: 16,
  },
  micBtn: {
    position: 'absolute',
    top: 12,
    right: 12,
    padding: 8,
    borderRadius: 99,
  },
  inputFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  resultCard: {
    borderWidth: 1,
    marginBottom: 16,
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  iconBtn: {
    padding: 4,
  },
  romajiBox: {
    padding: 10,
    marginTop: 8,
  },
  translateBtn: {
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
