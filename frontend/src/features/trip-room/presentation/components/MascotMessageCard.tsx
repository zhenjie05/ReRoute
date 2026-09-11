import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, Animated } from 'react-native';
import { useTheme } from '@/core/theme';
import { Message } from '@/models/chat';
import { mockTripRooms } from '../../data/mock-trip-room';
import { getRoomSeasonTheme, rotiPresentation } from '../../data/season-presentation';

export const MascotMessageCard: React.FC<{ message: Message }> = ({ message }) => {
  const { colors, spacing, shadows } = useTheme();
  const theme = getRoomSeasonTheme(mockTripRooms.find(room => room.id === message.room_id));
  const generating = message.payload?.generating === true;
  const [pulse] = useState(() => new Animated.Value(1));
  useEffect(() => {
    if (!generating) { pulse.setValue(1); return; }
    const animation = Animated.loop(Animated.sequence([
      Animated.timing(pulse, { toValue: 0.45, duration: 800, useNativeDriver: true }),
      Animated.timing(pulse, { toValue: 1, duration: 800, useNativeDriver: true }),
    ]));
    animation.start();
    return () => animation.stop();
  }, [generating, pulse]);
  return <View style={[s.card, shadows.soft, { backgroundColor: theme.background, borderColor: theme.border, marginHorizontal: spacing.lg }]}>
    <View style={s.header}>
      <Image source={rotiPresentation.image} accessibilityLabel={rotiPresentation.imageLabel} resizeMode="contain" style={s.mascot} />
      <Text style={[s.name, { color: theme.text }]}>{rotiPresentation.name}</Text>
      <View style={[s.badge, { backgroundColor: theme.badge }]}><Text style={[s.badgeText, { color: theme.text }]}>{rotiPresentation.badge}</Text></View>
    </View>
    <Animated.Text accessibilityLiveRegion="polite" style={[s.body, { color: colors.onSurface, opacity: pulse }]}>{generating ? rotiPresentation.generating : message.text}</Animated.Text>
  </View>;
};

const s = StyleSheet.create({
  card: { padding: 20, minHeight: 126, borderRadius: 22, borderWidth: 1, marginVertical: 8, gap: 10 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' },
  mascot: { width: 44, height: 44 },
  name: { fontSize: 16, fontWeight: '800' },
  badge: { borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4 },
  badgeText: { fontSize: 11, fontWeight: '700' },
  body: { fontSize: 16, lineHeight: 25 },
});
