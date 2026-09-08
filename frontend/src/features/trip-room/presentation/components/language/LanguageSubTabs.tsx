import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '@/core/theme';

export type LanguageTab = 'translator' | 'lessons';

interface LanguageSubTabsProps {
  activeTab: LanguageTab;
  onTabChange: (tab: LanguageTab) => void;
}

export function LanguageSubTabs({ activeTab, onTabChange }: LanguageSubTabsProps) {
  const { colors, typography, rounded } = useTheme();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.surfaceContainerLow,
          borderRadius: rounded['2xl'],
        },
      ]}
    >
      <TouchableOpacity
        style={[
          styles.tabButton,
          activeTab === 'translator' && {
            backgroundColor: '#ffffff',
            borderRadius: rounded.xl,
            ...styles.activeShadow,
          },
        ]}
        onPress={() => onTabChange('translator')}
      >
        <Text
          style={[
            typography.labelSm,
            {
              color: activeTab === 'translator' ? colors.onSurface : colors.onSurfaceVariant,
              fontWeight: activeTab === 'translator' ? 'bold' : '600',
            },
          ]}
        >
          ⚡ AI Translator
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.tabButton,
          activeTab === 'lessons' && {
            backgroundColor: '#ffffff',
            borderRadius: rounded.xl,
            ...styles.activeShadow,
          },
        ]}
        onPress={() => onTabChange('lessons')}
      >
        <Text
          style={[
            typography.labelSm,
            {
              color: activeTab === 'lessons' ? colors.onSurface : colors.onSurfaceVariant,
              fontWeight: activeTab === 'lessons' ? 'bold' : '600',
            },
          ]}
        >
          📖 Lessons
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 4,
    marginHorizontal: 16,
    marginBottom: 16,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeShadow: {
    shadowColor: '#0a0f11',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
});
