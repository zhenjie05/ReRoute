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
import { useAuth } from '@/lib/hooks/useAuth';
import { Button, Card } from '@/shared/components';

export default function LoginScreen() {
  const { colors, typography, spacing, rounded } = useTheme();
  const router = useRouter();
  const { signIn, signInWithGoogle, isLoading } = useAuth();

  const [email, setEmail] = useState('alex@example.com');
  const [password, setPassword] = useState('password123');
  const [errorMsg, setErrorMsg] = useState('');

  const handleEmailLogin = async () => {
    setErrorMsg('');
    const res = await signIn(email, password);
    if (res.error) {
      setErrorMsg(res.error);
    } else {
      router.replace('/(tabs)/home');
    }
  };

  const handleGoogleLogin = async () => {
    setErrorMsg('');
    const res = await signInWithGoogle();
    if (res.error) {
      setErrorMsg(res.error);
    } else {
      router.replace('/(tabs)/home');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1, backgroundColor: colors.background }}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.headerArea}>
          <Text style={{ fontSize: 44, marginBottom: spacing.xs }}>🧭</Text>
          <Text style={[typography.headlineLg, { color: colors.onSurface, fontWeight: '800' }]}>
            ReRoute
          </Text>
          <Text style={[typography.bodyMd, { color: colors.onSurfaceVariant, marginTop: spacing.xs }]}>
            Plan your escape together, in real-time.
          </Text>
        </View>

        <Card style={{ marginHorizontal: spacing.lg, marginTop: spacing.xl }}>
          <Text style={[typography.headlineSm, { color: colors.onSurface, marginBottom: spacing.lg }]}>
            Sign In
          </Text>

          {errorMsg ? (
            <View
              style={[
                styles.errorBanner,
                { backgroundColor: colors.errorContainer, borderRadius: rounded.md, padding: spacing.md },
              ]}
            >
              <Text style={[typography.labelSm, { color: colors.onErrorContainer }]}>
                {errorMsg}
              </Text>
            </View>
          ) : null}

          {/* Email Input */}
          <Text style={[typography.labelSm, { color: colors.onSurface, marginBottom: spacing.xs }]}>
            Email Address
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
                marginBottom: spacing.md,
              },
            ]}
          />

          {/* Password Input */}
          <Text style={[typography.labelSm, { color: colors.onSurface, marginBottom: spacing.xs }]}>
            Password
          </Text>
          <TextInput
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            placeholder="••••••••"
            placeholderTextColor={colors.outline}
            style={[
              styles.input,
              {
                borderColor: colors.outlineVariant,
                borderRadius: rounded.lg,
                color: colors.onSurface,
                backgroundColor: colors.surfaceContainerLow,
                padding: spacing.md,
                marginBottom: spacing.lg,
              },
            ]}
          />

          <Button
            title="Sign In with Email"
            onPress={handleEmailLogin}
            loading={isLoading}
            variant="primary"
            size="lg"
          />

          <View style={styles.dividerRow}>
            <View style={[styles.line, { backgroundColor: colors.outlineVariant }]} />
            <Text style={[typography.labelSm, { color: colors.onSurfaceVariant, marginHorizontal: spacing.md }]}>
              or
            </Text>
            <View style={[styles.line, { backgroundColor: colors.outlineVariant }]} />
          </View>

          <Button
            title="Continue with Google"
            onPress={handleGoogleLogin}
            variant="outline"
            size="lg"
          />

          <View style={styles.footerRow}>
            <TouchableOpacity onPress={() => router.push('/(auth)/forgot-password')}>
              <Text style={[typography.labelSm, { color: colors.primary }]}>
                Forgot password?
              </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => router.push('/(auth)/register')}>
              <Text style={[typography.labelSm, { color: colors.primary, fontWeight: '700' }]}>
                Create account
              </Text>
            </TouchableOpacity>
          </View>
        </Card>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingVertical: 48,
  },
  headerArea: {
    alignItems: 'center',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    fontSize: 15,
  },
  errorBanner: {
    marginBottom: 16,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 18,
  },
  line: {
    flex: 1,
    height: 1,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
});
