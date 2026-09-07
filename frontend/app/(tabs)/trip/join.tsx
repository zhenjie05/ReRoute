import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/core/theme';
import { Button, Card } from '@/shared/components';

export default function JoinTripScreen() {
  const { colors, typography, spacing, rounded } = useTheme();
  const router = useRouter();

  const [inviteCode, setInviteCode] = useState('');

  const handleJoin = () => {
    if (inviteCode.trim()) {
      router.replace('/(tabs)/trip/room/room-tokyo-2026/chat' as any);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={[styles.header, { paddingHorizontal: spacing.lg, paddingVertical: spacing.md }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={{ fontSize: 20 }}>←</Text>
        </TouchableOpacity>
        <Text style={[typography.headlineSm, { color: colors.onSurface }]}>Join a Trip</Text>
        <View style={{ width: 32 }} />
      </View>

      <View style={{ padding: spacing.lg }}>
        <Card>
          <Text style={[typography.headlineSm, { color: colors.onSurface, marginBottom: spacing.xs }]}>
            Enter Invite Code or Link 🔗
          </Text>
          <Text style={[typography.bodySm, { color: colors.onSurfaceVariant, marginBottom: spacing.lg }]}>
            Paste the 6-character room code or shared link provided by your group.
          </Text>

          <TextInput
            value={inviteCode}
            onChangeText={(text) => setInviteCode(text.toUpperCase())}
            placeholder="e.g. TOK26A"
            placeholderTextColor={colors.outline}
            maxLength={10}
            style={[
              styles.input,
              {
                borderColor: colors.outlineVariant,
                borderRadius: rounded.lg,
                backgroundColor: colors.surfaceContainerLow,
                padding: spacing.md,
                color: colors.onSurface,
                fontSize: 18,
                textAlign: 'center',
                letterSpacing: 2,
                fontWeight: '700',
                marginBottom: spacing.xl,
              },
            ]}
          />

          <Button
            title="Join Trip Room"
            onPress={handleJoin}
            variant="primary"
            size="lg"
          />
        </Card>
      </View>
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
  },
});
