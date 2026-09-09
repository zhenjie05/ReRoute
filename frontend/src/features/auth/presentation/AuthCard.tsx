import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import Svg, { Path } from 'react-native-svg';
import { useTheme } from '@/core/theme';
import { useAuth } from '@/lib/hooks/useAuth';

export type AuthMode = 'login' | 'register';

interface AuthCardProps {
  initialMode?: AuthMode;
  onSuccess?: () => void;
}

/**
 * Google Colorful 'G' Logo (SVG)
 */
const GoogleIcon: React.FC<{ size?: number }> = ({ size = 18 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Path
      fill="#4285F4"
      d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
    />
    <Path
      fill="#34A853"
      d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.26v3.15C3.25 21.37 7.33 24 12 24z"
    />
    <Path
      fill="#FBBC05"
      d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.26C.46 8.16 0 9.94 0 12s.46 3.84 1.26 5.42l4.02-3.15z"
    />
    <Path
      fill="#EA4335"
      d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.25 2.63 1.26 6.58l4.02 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
    />
  </Svg>
);

export const AuthCard: React.FC<AuthCardProps> = ({
  initialMode = 'login',
  onSuccess,
}) => {
  const { colors, typography, spacing, rounded, shadows } = useTheme();
  const router = useRouter();
  const { signIn, signUp, signInWithGoogle, isLoading, demoSignIn } = useAuth();

  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [email, setEmail] = useState('alex@example.com');
  const [password, setPassword] = useState('password123');
  const [confirmPassword, setConfirmPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const isLogin = mode === 'login';

  const validate = (): boolean => {
    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setErrorMsg('Please enter your email address.');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      setErrorMsg('Please enter a valid email address.');
      return false;
    }

    if (!password) {
      setErrorMsg('Please enter your password.');
      return false;
    }

    if (password.length < 8) {
      setErrorMsg('Password must be at least 8 characters.');
      return false;
    }

    if (!isLogin && password !== confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    setErrorMsg(null);
    if (!validate()) return;

    if (isLogin) {
      const res = await signIn(email, password);
      if (res.error) {
        setErrorMsg(res.error);
      } else if (onSuccess) {
        onSuccess();
      }
    } else {
      const res = await signUp(email, password);
      if (res.error) {
        setErrorMsg(res.error);
      } else if (onSuccess) {
        onSuccess();
      }
    }
  };

  const handleGoogleAuth = async () => {
    setErrorMsg(null);
    const res = await signInWithGoogle();
    if (res.error) {
      setErrorMsg(res.error);
    } else if (onSuccess) {
      onSuccess();
    }
  };

  const handleDemoSignIn = () => {
    if (demoSignIn) {
      demoSignIn();
      if (onSuccess) onSuccess();
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.keyboardContainer}
    >
      <View
        style={[
          styles.card,
          {
            backgroundColor: '#ffffff',
            borderRadius: rounded['3xl'] || 24,
            padding: spacing.xl,
            ...shadows.medium,
          },
        ]}
      >
        {/* App Brand Title (§5.2) */}
        <View style={styles.header}>
          <Text style={{ fontSize: 32, textAlign: 'center', marginBottom: 4 }}>🧭</Text>
          <Text
            style={[
              typography.headlineLg,
              {
                color: colors.primary, // #8b4b00
                fontWeight: '900',
                textAlign: 'center',
                letterSpacing: -0.5,
              },
            ]}
          >
            ReRoute
          </Text>
          <Text
            style={[
              typography.bodySm,
              {
                color: colors.onSurfaceVariant,
                textAlign: 'center',
                marginTop: 2,
                marginBottom: spacing.lg,
              },
            ]}
          >
            Plan your next escape together
          </Text>
        </View>

        {/* Auth Mode Segmented Pill (§5.2) */}
        <View
          style={[
            styles.segmentedContainer,
            {
              backgroundColor: colors.surfaceContainerLow, // #edf1f5
              borderRadius: rounded.xl,
              padding: 4,
              marginBottom: spacing.lg,
            },
          ]}
        >
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => {
              setMode('login');
              setErrorMsg(null);
            }}
            style={[
              styles.segmentedTab,
              isLogin && {
                backgroundColor: colors.primaryContainer, // #ff8f06
                borderRadius: rounded.lg,
                ...shadows.soft,
              },
            ]}
          >
            <Text
              style={[
                typography.labelSm,
                {
                  color: isLogin ? '#ffffff' : colors.onSurfaceVariant,
                  fontWeight: isLogin ? '800' : '600',
                  textAlign: 'center',
                },
              ]}
            >
              Log In
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => {
              setMode('register');
              setErrorMsg(null);
            }}
            style={[
              styles.segmentedTab,
              !isLogin && {
                backgroundColor: colors.primaryContainer, // #ff8f06
                borderRadius: rounded.lg,
                ...shadows.soft,
              },
            ]}
          >
            <Text
              style={[
                typography.labelSm,
                {
                  color: !isLogin ? '#ffffff' : colors.onSurfaceVariant,
                  fontWeight: !isLogin ? '800' : '600',
                  textAlign: 'center',
                },
              ]}
            >
              Sign Up
            </Text>
          </TouchableOpacity>
        </View>

        {/* Email Field Group (§5.2) */}
        <View style={styles.inputGroup}>
          <Text style={[typography.labelSm, { color: colors.onSurface, fontWeight: '700', marginBottom: 6 }]}>
            Email
          </Text>
          <TextInput
            value={email}
            onChangeText={(val) => {
              setEmail(val);
              if (errorMsg) setErrorMsg(null);
            }}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            placeholder="hello@reroute.com"
            placeholderTextColor={colors.outline}
            editable={!isLoading}
            style={[
              styles.textInput,
              {
                backgroundColor: colors.surfaceContainerLowest, // #ffffff
                borderColor: errorMsg?.toLowerCase().includes('email') ? colors.error : colors.outlineVariant,
                borderRadius: rounded.xl,
                color: colors.onSurface,
                paddingHorizontal: spacing.md,
                paddingVertical: spacing.md - 2,
              },
            ]}
          />
        </View>

        {/* Password Field Group (§5.2) */}
        <View style={[styles.inputGroup, { marginTop: spacing.md }]}>
          <Text style={[typography.labelSm, { color: colors.onSurface, fontWeight: '700', marginBottom: 6 }]}>
            Password
          </Text>
          <View style={styles.passwordContainer}>
            <TextInput
              value={password}
              onChangeText={(val) => {
                setPassword(val);
                if (errorMsg) setErrorMsg(null);
              }}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              autoCorrect={false}
              placeholder="••••••••"
              placeholderTextColor={colors.outline}
              editable={!isLoading}
              style={[
                styles.textInput,
                styles.passwordInput,
                {
                  backgroundColor: colors.surfaceContainerLowest,
                  borderColor: errorMsg?.toLowerCase().includes('password') ? colors.error : colors.outlineVariant,
                  borderRadius: rounded.xl,
                  color: colors.onSurface,
                  paddingHorizontal: spacing.md,
                  paddingVertical: spacing.md - 2,
                },
              ]}
            />
            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              style={styles.eyeButton}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Text style={{ fontSize: 16 }}>{showPassword ? '👁️' : '🙈'}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Confirm Password Field Group (Register Mode Only) */}
        {!isLogin ? (
          <View style={[styles.inputGroup, { marginTop: spacing.md }]}>
            <Text style={[typography.labelSm, { color: colors.onSurface, fontWeight: '700', marginBottom: 6 }]}>
              Confirm Password
            </Text>
            <TextInput
              value={confirmPassword}
              onChangeText={(val) => {
                setConfirmPassword(val);
                if (errorMsg) setErrorMsg(null);
              }}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              autoCorrect={false}
              placeholder="••••••••"
              placeholderTextColor={colors.outline}
              editable={!isLoading}
              style={[
                styles.textInput,
                {
                  backgroundColor: colors.surfaceContainerLowest,
                  borderColor: errorMsg?.toLowerCase().includes('match') ? colors.error : colors.outlineVariant,
                  borderRadius: rounded.xl,
                  color: colors.onSurface,
                  paddingHorizontal: spacing.md,
                  paddingVertical: spacing.md - 2,
                },
              ]}
            />
          </View>
        ) : null}

        {/* Error Alert Pill Badge (Figma §5.2) */}
        {errorMsg ? (
          <View
            style={[
              styles.errorBadge,
              {
                backgroundColor: colors.errorContainer, // #f95630 / #ffefec
                borderRadius: rounded.md,
                marginTop: spacing.sm,
              },
            ]}
          >
            <Text style={[typography.utilityTiny, { color: colors.onErrorContainer, fontWeight: '800' }]}>
              ⚠️ {errorMsg}
            </Text>
          </View>
        ) : null}

        {/* Forgot Password Link (§5.2, Login Mode Only) */}
        {isLogin ? (
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => router.push('/(auth)/forgot-password')}
            style={styles.forgotPasswordButton}
          >
            <Text
              style={[
                typography.utilityTiny,
                {
                  color: colors.primary, // #8b4b00
                  fontWeight: '700',
                  textAlign: 'right',
                },
              ]}
            >
              Forgot password?
            </Text>
          </TouchableOpacity>
        ) : null}

        {/* Social Divider ("OR CONTINUE WITH") (§5.2) */}
        <View style={[styles.dividerRow, { marginVertical: spacing.lg }]}>
          <View style={[styles.dividerLine, { backgroundColor: colors.outlineVariant }]} />
          <Text
            style={[
              typography.utilityTiny,
              {
                color: colors.outline,
                fontWeight: '800',
                marginHorizontal: spacing.sm,
                letterSpacing: 0.8,
              },
            ]}
          >
            OR CONTINUE WITH
          </Text>
          <View style={[styles.dividerLine, { backgroundColor: colors.outlineVariant }]} />
        </View>

        {/* Google OAuth Button (§5.2) */}
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={handleGoogleAuth}
          disabled={isLoading}
          style={[
            styles.googleButton,
            {
              backgroundColor: '#cfebbe', // light green per spec §5.2
              borderRadius: rounded.xl,
              paddingVertical: spacing.md - 2,
            },
          ]}
        >
          <GoogleIcon size={18} />
          <Text
            style={[
              typography.labelSm,
              {
                color: '#2e4525', // on-secondary-container
                fontWeight: '700',
                marginLeft: spacing.xs,
              },
            ]}
          >
            Continue with Google
          </Text>
        </TouchableOpacity>

        {/* Primary Submit Button (§5.2) */}
        <TouchableOpacity
          activeOpacity={0.88}
          onPress={handleSubmit}
          disabled={isLoading}
          style={[
            styles.primaryButton,
            {
              backgroundColor: colors.primaryDim || '#7a4100', // #7a4100 per spec §5.2
              borderRadius: rounded.xl,
              paddingVertical: spacing.md,
              marginTop: spacing.md,
              ...shadows.medium,
            },
          ]}
        >
          {isLoading ? (
            <ActivityIndicator color="#ffffff" size="small" />
          ) : (
            <Text
              style={[
                typography.labelMd,
                {
                  color: '#ffffff',
                  fontWeight: '800',
                  textAlign: 'center',
                },
              ]}
            >
              {isLogin ? 'Log In' : 'Sign Up'}
            </Text>
          )}
        </TouchableOpacity>

        {/* Quick Demo Sign In Shortcut */}
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={handleDemoSignIn}
          style={[styles.demoShortcut, { marginTop: spacing.md }]}
        >
          <Text
            style={[
              typography.utilityTiny,
              {
                color: colors.onSurfaceVariant,
                textAlign: 'center',
                textDecorationLine: 'underline',
              },
            ]}
          >
            ⚡ Quick Demo Sign In (Dev Preview)
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  keyboardContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    width: '100%',
    maxWidth: 390,
  },
  header: {
    alignItems: 'center',
  },
  segmentedContainer: {
    flexDirection: 'row',
  },
  segmentedTab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputGroup: {
    width: '100%',
  },
  textInput: {
    borderWidth: 1,
    fontSize: 14,
  },
  passwordContainer: {
    position: 'relative',
    width: '100%',
    justifyContent: 'center',
  },
  passwordInput: {
    paddingRight: 42,
  },
  eyeButton: {
    position: 'absolute',
    right: 12,
    alignSelf: 'center',
  },
  errorBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    alignSelf: 'flex-start',
  },
  forgotPasswordButton: {
    marginTop: 8,
    alignSelf: 'flex-end',
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  primaryButton: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  demoShortcut: {
    alignItems: 'center',
    paddingVertical: 4,
  },
});
