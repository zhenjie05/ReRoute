import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { useTheme } from '@/core/theme';
import { AuthCard } from '@/features/auth/presentation/AuthCard';

/**
 * Screen 01: Register Screen (Feature 0 — Auth)
 * Conforms to SCREEN_SPEC.md §5.2 and UI_REQUIREMENTS.md §3.1
 * Lives outside the main tab shell with zero Global Widgets.
 */
export default function RegisterScreen() {
  const { colors, spacing } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingHorizontal: spacing.lg, paddingVertical: spacing.xl },
        ]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <AuthCard initialMode="register" />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
