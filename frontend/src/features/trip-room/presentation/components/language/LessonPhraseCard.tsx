import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '@/core/theme';

interface LessonPhraseCardProps {
  phrase: string;
  romanization?: string;
  onAudioPress?: () => void;
}

export function LessonPhraseCard({ phrase, romanization, onAudioPress }: LessonPhraseCardProps) {
  const { colors, typography, rounded, shadows } = useTheme();

  return (
    <View style={[styles.card, { backgroundColor: colors.card, borderRadius: rounded['3xl'], ...shadows.soft }]}>
      {/* Gradient-like effect for the background can be mocked with a soft tint if linear-gradient isn't available */}
      <View style={[styles.bgTint, { backgroundColor: '#fef8f4', borderRadius: rounded['3xl'] }]} />
      
      <View style={styles.content}>
        <Text style={[typography.displaySm, { color: colors.onSurface, textAlign: 'center', marginBottom: 12, fontWeight: 'bold' }]}>
          {phrase}
        </Text>
        
        {romanization && (
          <Text style={[typography.labelLg, { color: colors.onSurfaceVariant, textAlign: 'center', marginBottom: 24, fontWeight: 'bold' }]}>
            {romanization}
          </Text>
        )}
        
        <TouchableOpacity 
          style={[styles.audioBtn, { backgroundColor: '#cfebbe' }]}
          onPress={onAudioPress}
        >
          <Text style={{ fontSize: 24, color: '#2e4525' }}>🔊</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginVertical: 16,
    position: 'relative',
    overflow: 'hidden',
  },
  bgTint: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.5,
  },
  content: {
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 200,
  },
  audioBtn: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
});
