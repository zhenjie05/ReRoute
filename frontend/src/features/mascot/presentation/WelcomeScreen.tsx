import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Animated,
  AccessibilityInfo,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useTheme } from '@/core/theme';
import { useAuth } from '@/lib/hooks/useAuth';
import { Button } from '@/shared/components/Button';
import { RotiMascotSvg } from './RotiMascotSvg';
import { MascotSpeechBubble } from './MascotSpeechBubble';
import { IntroGuide } from './IntroGuide';

interface WelcomeScreenProps {
  isFirstTime?: boolean;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ isFirstTime = false }) => {
  const { colors, typography, spacing, rounded } = useTheme();
  const router = useRouter();
  const { user } = useAuth();

  // Animation values using React Native built-in Animated API
  const [mascotScale] = useState(() => new Animated.Value(0.75));
  const [mascotOpacity] = useState(() => new Animated.Value(0));
  const [speechOpacity] = useState(() => new Animated.Value(0));

  const [step, setStep] = useState<'greeting' | 'guide'>('greeting');
  const [reduceMotion, setReduceMotion] = useState(false);
  const autoAdvanceTimer = useRef<NodeJS.Timeout | null>(null);

  const displayName = user?.name ? user.name.split(' ')[0] : 'Traveler';

  const handleFinish = useCallback(() => {
    if (autoAdvanceTimer.current) {
      clearTimeout(autoAdvanceTimer.current);
    }
    router.replace('/(tabs)/home');
  }, [router]);

  // Check OS reduce motion setting
  useEffect(() => {
    let isMounted = true;

    AccessibilityInfo.isReduceMotionEnabled().then((enabled) => {
      if (isMounted) {
        setReduceMotion(enabled);
        if (enabled) {
          mascotScale.setValue(1);
          mascotOpacity.setValue(1);
          speechOpacity.setValue(1);
        }
      }
    });

    const listener = AccessibilityInfo.addEventListener('reduceMotionChanged', (enabled) => {
      setReduceMotion(enabled);
      if (enabled) {
        mascotScale.setValue(1);
        mascotOpacity.setValue(1);
        speechOpacity.setValue(1);
      }
    });

    return () => {
      isMounted = false;
      listener?.remove?.();
    };
  }, [mascotScale, mascotOpacity, speechOpacity]);

  // Run entrance animation if reduceMotion is false
  useEffect(() => {
    if (reduceMotion) return;

    Animated.sequence([
      Animated.parallel([
        Animated.timing(mascotOpacity, {
          toValue: 1,
          duration: 450,
          useNativeDriver: true,
        }),
        Animated.spring(mascotScale, {
          toValue: 1,
          friction: 6,
          tension: 40,
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(speechOpacity, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();
  }, [reduceMotion, mascotOpacity, mascotScale, speechOpacity]);

  // For returning users, optionally auto-advance after a few seconds
  useEffect(() => {
    if (!isFirstTime && step === 'greeting') {
      autoAdvanceTimer.current = setTimeout(() => {
        handleFinish();
      }, 4800);
    }

    return () => {
      if (autoAdvanceTimer.current) {
        clearTimeout(autoAdvanceTimer.current);
      }
    };
  }, [isFirstTime, step, handleFinish]);

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      {/* Top Header Bar with App Title & Persistent Skip Action */}
      <View style={[styles.headerBar, { paddingHorizontal: spacing.lg, paddingVertical: spacing.sm }]}>
        <View style={styles.brandRow}>
          <Text style={[typography.headlineSm, { color: colors.primary, fontWeight: '900' }]}>
            ReRoute
          </Text>
        </View>

        <TouchableOpacity
          activeOpacity={0.75}
          onPress={handleFinish}
          accessibilityRole="button"
          accessibilityLabel="Skip to Home Screen"
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          style={[
            styles.skipBtn,
            {
              backgroundColor: colors.surfaceContainerLow,
              borderColor: colors.surfaceContainerHigh,
              borderRadius: rounded.full,
            },
          ]}
        >
          <Text style={[typography.labelSm, { color: colors.onSurfaceVariant, fontWeight: '700' }]}>
            Skip ✕
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingHorizontal: spacing.lg }]}
        showsVerticalScrollIndicator={false}
      >
        {step === 'greeting' ? (
          <View style={styles.greetingContainer}>
            {/* Animated Mascot Entrance */}
            <Animated.View
              style={[
                styles.mascotWrapper,
                {
                  opacity: mascotOpacity,
                  transform: [{ scale: mascotScale }],
                },
              ]}
            >
              <RotiMascotSvg
                width={190}
                height={230}
                accessibilityLabel="Roti the Corgi Mascot"
              />
            </Animated.View>

            {/* Mascot Speech Bubble */}
            <MascotSpeechBubble
              userName={displayName}
              isFirstTime={isFirstTime}
              opacity={speechOpacity}
            />

            {/* Action Buttons */}
            <View style={[styles.ctaSection, { marginTop: spacing.md }]}>
              {isFirstTime ? (
                <Button
                  title="Explore Features →"
                  onPress={() => setStep('guide')}
                  variant="primary"
                  size="lg"
                  style={{ width: '100%', maxWidth: 360 }}
                />
              ) : (
                <Button
                  title="Continue to Home →"
                  onPress={handleFinish}
                  variant="primary"
                  size="lg"
                  style={{ width: '100%', maxWidth: 360 }}
                />
              )}
            </View>
          </View>
        ) : (
          /* First-Time User App Guide Walkthrough */
          <View style={styles.guideContainer}>
            <View style={styles.guideMascotMini}>
              <RotiMascotSvg width={80} height={100} />
            </View>
            <IntroGuide onComplete={handleFinish} onSkip={handleFinish} />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 10,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  skipBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: Platform.OS === 'ios' ? 16 : 24,
  },
  greetingContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mascotWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  ctaSection: {
    width: '100%',
    alignItems: 'center',
  },
  guideContainer: {
    width: '100%',
    alignItems: 'center',
  },
  guideMascotMini: {
    marginBottom: 4,
  },
});
