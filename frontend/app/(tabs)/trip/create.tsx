import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/core/theme';
import { Button, Card } from '@/shared/components';

export default function CreateTripScreen() {
  const { colors, typography, spacing, rounded } = useTheme();
  const router = useRouter();

  const [name, setName] = useState('Tokyo Autumn Escape 🍁');
  const [destination, setDestination] = useState('Tokyo, Japan');
  const [startDate, setStartDate] = useState('2026-10-10');
  const [endDate, setEndDate] = useState('2026-10-16');

  const handleNext = () => {
    // Navigate to Setup (Preferences + Modular Suggestions)
    router.push('/(tabs)/trip/setup/room-new-123' as any);
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={[styles.header, { paddingHorizontal: spacing.lg, paddingVertical: spacing.md }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={{ fontSize: 20 }}>←</Text>
        </TouchableOpacity>
        <Text style={[typography.headlineSm, { color: colors.onSurface }]}>New Trip Room</Text>
        <View style={{ width: 32 }} />
      </View>

      <ScrollView contentContainerStyle={{ padding: spacing.lg }}>
        <Card style={{ marginBottom: spacing.lg }}>
          <Text style={[typography.headlineSm, { color: colors.onSurface, marginBottom: spacing.md }]}>
            Trip Basics
          </Text>

          <Text style={[typography.labelSm, { color: colors.onSurface, marginBottom: spacing.xs }]}>
            Trip Name
          </Text>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="e.g. Tokyo Autumn Escape"
            placeholderTextColor={colors.outline}
            style={[
              styles.input,
              {
                borderColor: colors.outlineVariant,
                borderRadius: rounded.lg,
                backgroundColor: colors.surfaceContainerLow,
                padding: spacing.md,
                color: colors.onSurface,
                marginBottom: spacing.md,
              },
            ]}
          />

          <Text style={[typography.labelSm, { color: colors.onSurface, marginBottom: spacing.xs }]}>
            Destination
          </Text>
          <TextInput
            value={destination}
            onChangeText={setDestination}
            placeholder="e.g. Tokyo, Japan"
            placeholderTextColor={colors.outline}
            style={[
              styles.input,
              {
                borderColor: colors.outlineVariant,
                borderRadius: rounded.lg,
                backgroundColor: colors.surfaceContainerLow,
                padding: spacing.md,
                color: colors.onSurface,
                marginBottom: spacing.md,
              },
            ]}
          />

          <View style={{ flexDirection: 'row', gap: spacing.md, marginBottom: spacing.xl }}>
            <View style={{ flex: 1 }}>
              <Text style={[typography.labelSm, { color: colors.onSurface, marginBottom: spacing.xs }]}>
                Start Date
              </Text>
              <TextInput
                value={startDate}
                onChangeText={setStartDate}
                placeholder="YYYY-MM-DD"
                placeholderTextColor={colors.outline}
                style={[
                  styles.input,
                  {
                    borderColor: colors.outlineVariant,
                    borderRadius: rounded.lg,
                    backgroundColor: colors.surfaceContainerLow,
                    padding: spacing.md,
                    color: colors.onSurface,
                  },
                ]}
              />
            </View>

            <View style={{ flex: 1 }}>
              <Text style={[typography.labelSm, { color: colors.onSurface, marginBottom: spacing.xs }]}>
                End Date
              </Text>
              <TextInput
                value={endDate}
                onChangeText={setEndDate}
                placeholder="YYYY-MM-DD"
                placeholderTextColor={colors.outline}
                style={[
                  styles.input,
                  {
                    borderColor: colors.outlineVariant,
                    borderRadius: rounded.lg,
                    backgroundColor: colors.surfaceContainerLow,
                    padding: spacing.md,
                    color: colors.onSurface,
                  },
                ]}
              />
            </View>
          </View>

          <Button
            title="Next: Set Group Preferences →"
            onPress={handleNext}
            variant="primary"
            size="lg"
          />
        </Card>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#edf1f5',
  },
  backBtn: {
    padding: 6,
  },
  input: {
    borderWidth: 1,
    fontSize: 15,
  },
});
