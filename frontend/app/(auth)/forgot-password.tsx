import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/core/theme';
import { Button, Card } from '@/shared/components';

export default function ForgotPasswordScreen() {
  const { colors, typography, spacing, rounded } = useTheme();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (email.trim()) {
      setSubmitted(true);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1, backgroundColor: colors.background }}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.headerArea}>
          <Text style={{ fontSize: 40, marginBottom: spacing.xs }}>🔒</Text>
          <Text style={[typography.headlineLg, { color: colors.onSurface, fontWeight: '800' }]}>
            Reset Password
          </Text>
          <Text style={[typography.bodyMd, { color: colors.onSurfaceVariant, marginTop: spacing.xs }]}>
            Enter your email to receive recovery instructions
          </Text>
        </View>

        <Card style={{ marginHorizontal: spacing.lg, marginTop: spacing.xl }}>
          {submitted ? (
            <View style={{ alignItems: 'center', paddingVertical: spacing.lg }}>
              <Text style={{ fontSize: 36, marginBottom: spacing.md }}>✉️</Text>
              <Text style={[typography.headlineSm, { color: colors.onSurface, textAlign: 'center' }]}>
                Check your inbox
              </Text>
              <Text
                style={[
                  typography.bodyMd,
                  { color: colors.onSurfaceVariant, textAlign: 'center', marginTop: spacing.xs, marginBottom: spacing.xl },
                ]}
              >
                We have sent password reset instructions to{' '}
                <Text style={{ fontWeight: '700', color: colors.onSurface }}>{email}</Text>
              </Text>
              <Button
                title="Back to Login"
                onPress={() => router.replace('/(auth)/login')}
                variant="primary"
                size="md"
              />
            </View>
          ) : (
            <>
              <Text style={[typography.labelSm, { color: colors.onSurface, marginBottom: spacing.xs }]}>
                Registered Email
              </Text>
              <TextInput
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                placeholder="alex@example.com"
                placeholderTextColor={colors.outline}
                style={[
                  styles.input,
                  {
                    borderColor: colors.outlineVariant,
                    borderRadius: rounded.lg,
                    color: colors.onSurface,
                    backgroundColor: colors.surfaceContainerLow,
                    padding: spacing.md,
                    marginBottom: spacing.xl,
                  },
                ]}
              />

              <Button
                title="Send Reset Link"
                onPress={handleSubmit}
                variant="primary"
                size="lg"
              />

              <TouchableOpacity
                onPress={() => router.back()}
                style={{ marginTop: spacing.lg, alignItems: 'center' }}
              >
                <Text style={[typography.labelSm, { color: colors.onSurfaceVariant }]}>
                  Cancel and return
                </Text>
              </TouchableOpacity>
            </>
          )}
        </Card>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingVertical: 36,
  },
  headerArea: {
    alignItems: 'center',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    fontSize: 15,
  },
});
