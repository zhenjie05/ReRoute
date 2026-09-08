import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '@/core/theme';

interface CitySearchBarProps {
  placeholder?: string;
  onSearch?: (query: string) => void;
  disabled?: boolean;
}

/**
 * City/destination search bar for the Planning-stage itinerary.
 * Matches the screenshot: search icon + text input + filter icon.
 */
export const CitySearchBar: React.FC<CitySearchBarProps> = ({
  placeholder = 'Search Japan cities...',
  onSearch,
  disabled = false,
}) => {
  const { colors, typography, spacing, rounded, shadows } = useTheme();
  const [query, setQuery] = useState('');

  const handleChange = (text: string) => {
    setQuery(text);
    onSearch?.(text);
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: '#ffffff',
          borderRadius: rounded.xl,
          paddingHorizontal: spacing.lg,
          paddingVertical: spacing.md,
          marginHorizontal: spacing.lg,
          marginBottom: spacing.md,
          borderWidth: 1,
          borderColor: colors.cardBorder,
          ...shadows.soft,
        },
      ]}
    >
      <View style={styles.searchIcon}>
        <View
          style={{
            width: 18,
            height: 18,
            borderRadius: 9,
            borderWidth: 2,
            borderColor: colors.outline,
          }}
        />
      </View>

      <TextInput
        value={query}
        onChangeText={handleChange}
        placeholder={placeholder}
        placeholderTextColor={colors.outline}
        editable={!disabled}
        style={[
          styles.input,
          {
            ...typography.bodyMd,
            color: colors.onSurface,
            flex: 1,
            marginLeft: spacing.sm,
          },
        ]}
      />

      <TouchableOpacity style={styles.filterBtn} disabled={disabled}>
        <View style={{ alignItems: 'center' }}>
          <View
            style={{
              width: 16,
              height: 2,
              backgroundColor: colors.onSurfaceVariant,
              borderRadius: 1,
              marginBottom: 3,
            }}
          />
          <View
            style={{
              width: 10,
              height: 2,
              backgroundColor: colors.onSurfaceVariant,
              borderRadius: 1,
              marginBottom: 3,
            }}
          />
          <View
            style={{
              width: 6,
              height: 2,
              backgroundColor: colors.onSurfaceVariant,
              borderRadius: 1,
            }}
          />
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchIcon: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    paddingVertical: 0,
  },
  filterBtn: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
