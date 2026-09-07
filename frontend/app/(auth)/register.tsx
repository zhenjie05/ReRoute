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

export default function RegisterScreen() {
  const { colors, typography, spacing, rounded } = useTheme();
  const router = useRouter();
  const { signUp, isLoading } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [homeCountry, setHomeCountry] = useState('Singapore');
  const [errorMsg, setErrorMsg] = useState('');

  const handleRegister = async () => {
    if (!name.trim() || !email.trim() || !password.trim()) {
      setErrorMsg('Please fill in all required fields.');
      return;
    }
    setErrorMsg('');
    const res = await signUp(email, password, name);
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
          <Text style={{ fontSize: 40, marginBottom: spacing.xs }}>✈️</Text>
          <Text style={[typography.headlineLg, { color: colors.onSurface, fontWeight: '800' }]}>
            Join ReRoute
          </Text>
          <Text style={[typography.bodyMd, { color: colors.onSurfaceVariant, marginTop: spacing.xs }]}>
            Create your traveler profile
          </Text>
        </View>

        <Card style={{ marginHorizontal: spacing.lg, marginTop: spacing.lg }}>
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

          {/* Full Name */}
          <Text style={[typography.labelSm, { color: colors.onSurface, marginBottom: spacing.xs }]}>
            Display Name
          </Text>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="Alex Chen"
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

          {/* Email */}
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

          {/* Password */}
          <Text style={[typography.labelSm, { color: colors.onSurface, marginBottom: spacing.xs }]}>
            Password
          </Text>
          <TextInput
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            placeholder="At least 8 characters"
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

          {/* Home Country */}
          <Text style={[typography.labelSm, { color: colors.onSurface, marginBottom: spacing.xs }]}>
            Home Country / Region
          </Text>
          <TextInput
            value={homeCountry}
            onChangeText={setHomeCountry}
            placeholder="Singapore"
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
            title="Create Account & Start"
            onPress={handleRegister}
            loading={isLoading}
            variant="primary"
            size="lg"
          />

          <View style={styles.footerRow}>
            <Text style={[typography.bodySm, { color: colors.onSurfaceVariant }]}>
              Already have an account?
            </Text>
            <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
              <Text style={[typography.bodySm, { color: colors.primary, fontWeight: '700', marginLeft: spacing.xs }]}>
                Sign in
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
  errorBanner: {
    marginBottom: 16,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
});
