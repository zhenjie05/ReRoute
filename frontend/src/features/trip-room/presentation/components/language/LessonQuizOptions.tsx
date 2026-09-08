import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '@/core/theme';
import { QuizOption } from '@/models/language';

interface LessonQuizOptionsProps {
  options: QuizOption[];
  selectedOptionId: string | null;
  isAnswered: boolean;
  onSelectOption: (optionId: string, isCorrect: boolean) => void;
}

export function LessonQuizOptions({ options, selectedOptionId, isAnswered, onSelectOption }: LessonQuizOptionsProps) {
  const { colors, typography, rounded } = useTheme();

  return (
    <View style={styles.container}>
      {options.map((opt) => {
        const isSelected = selectedOptionId === opt.id;
        
        let bgColor = colors.card;
        let borderColor = colors.surfaceContainer;
        let textColor = colors.onSurface;

        if (isAnswered) {
          if (isSelected) {
            if (opt.is_correct) {
              bgColor = colors.successContainer;
              borderColor = colors.success;
              textColor = colors.success;
            } else {
              bgColor = colors.errorContainer;
              borderColor = colors.error;
              textColor = colors.error;
            }
          } else if (opt.is_correct) {
            // Show the correct answer even if they didn't select it
            borderColor = colors.success;
            textColor = colors.success;
          } else {
            // Dim other options
            textColor = colors.onSurfaceVariant;
          }
        }

        return (
          <TouchableOpacity
            key={opt.id}
            onPress={() => onSelectOption(opt.id, opt.is_correct)}
            disabled={isAnswered}
            style={[
              styles.optionBtn,
              {
                backgroundColor: bgColor,
                borderColor: borderColor,
                borderRadius: rounded['2xl'],
              },
            ]}
          >
            <Text
              style={[
                typography.labelSm,
                {
                  color: textColor,
                  fontWeight: '600',
                  textAlign: 'center',
                },
              ]}
            >
              {opt.text}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    gap: 10,
    marginBottom: 24,
  },
  optionBtn: {
    borderWidth: 1,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
