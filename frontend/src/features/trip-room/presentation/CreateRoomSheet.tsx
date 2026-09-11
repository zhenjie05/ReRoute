import React, { useState } from 'react';
import { Image, KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Circle, Path } from 'react-native-svg';
import { useRouter } from 'expo-router';
import { useTheme } from '@/core/theme';
import { mockTripRooms } from '@/features/trip-room/data/mock-trip-room';
import * as ImagePicker from 'expo-image-picker';
import { Feather } from '@expo/vector-icons';

export type RoomSheetMode = 'create' | 'join';
type IconName = 'compass' | 'plus' | 'key' | 'sparkles' | 'pin' | 'spring' | 'sun' | 'calendar' | 'stage' | 'bulb' | 'arrow' | 'close';
const paths: Record<IconName, string> = {
  compass: 'm16 8-3 5-5 3 3-5 5-3Z',
  plus: 'M12 8v8M8 12h8',
  key: 'M10 12h11m-3 0v3m-3-3v3',
  sparkles: 'm9 2 2 6 6 2-6 2-2 6-2-6-6-2 6-2 2-6Zm10 13 1 3 3 1-3 1-1 3-1-3-3-1 3-1 1-3Z',
  pin: 'M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0Z M15 10a3 3 0 1 1-6 0 3 3 0 0 1 6 0',
  spring: 'M12 21v-8M12 18c-6 0-8-4-8-7 5 0 8 2 8 7Zm0-3c6 0 8-4 8-7-5 0-8 2-8 7ZM12 12c-5-3-5-7 0-10 5 3 5 7 0 10Z',
  sun: 'M12 1v2m0 18v2M1 12h2m18 0h2M4 4l2 2m12 12 2 2M4 20l2-2M18 6l2-2',
  calendar: 'M5 5h14v16H5V5Zm3-3v5m8-5v5M5 10h14M8 14h2m4 0h2m-8 3h2m4 0h2',
  stage: 'M4 5v14M9 5v5m0 4v5m5-14v8m0 4v2m3-8 3 3-5 5-3 1 1-3 4-6Z',
  bulb: 'M9 19h6m-5 3h4M8 14a6 6 0 1 1 8 0l-1 2H9l-1-2ZM12 1v1M2 8h1m18 0h1M4 2l1 1m14 0 1-1',
  arrow: 'M4 12h16m-6-6 6 6-6 6',
  close: 'm6 6 12 12M18 6 6 18',
};
function Icon({ name, color, size = 18 }: { name: IconName; color: string; size?: number }) {
  return <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round">
    {(name === 'compass' || name === 'plus') && <Circle cx={12} cy={12} r={9} />}
    {name === 'sun' && <Circle cx={12} cy={12} r={5} />}
    {name === 'key' && <Circle cx={6} cy={12} r={4} />}
    <Path d={paths[name]} />
  </Svg>;
}

function validDate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T12:00:00Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

/** Creation UI uses the existing prototype setup flow; persistence belongs to the room service. */
export function CreateRoomSheet({ mode: initialMode, onClose }: { mode: RoomSheetMode; onClose: () => void }) {
  const { colors, typography } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [mode, setMode] = useState(initialMode);
  const [name, setName] = useState('');
  const [destination, setDestination] = useState('');
  const [timing, setTiming] = useState<'spring' | 'summer' | 'custom'>('spring');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const [avatar, setAvatar] = useState<string | null>(null);
  const [error, setError] = useState('');
  const today = new Date();
  // Offer the next available season instead of stale screenshot dates.
  const springYear = today.getFullYear() + (today.getMonth() > 4 ? 1 : 0);
  const summerYear = today.getFullYear() + (today.getMonth() > 7 ? 1 : 0);
  const label = [typography.labelMd, { color: colors.onSurface }];
  const field = [styles.field, { backgroundColor: colors.surfaceContainerLow }];
  const input = [typography.bodyMd, styles.input, { color: colors.onSurface }];

  const handlePickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      setError('Camera roll permissions are required to upload an avatar.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setAvatar(result.assets[0].uri);
      setError('');
    }
  };

  const submit = () => {
    if (mode === 'join') {
      const room = mockTripRooms.find((item) => item.invite_code === inviteCode.trim().toUpperCase());
      if (!room) { setError('Room code not found. Check the code and try again.'); return; }
      onClose();
      router.push(`/(tabs)/trip/room/${room.id}/chat` as any);
      return;
    }
    if (!name.trim() || !destination.trim()) { setError('Please enter a trip room name and destination.'); return; }
    if (timing === 'custom' && (!validDate(startDate) || !validDate(endDate) || endDate < startDate)) {
      setError('Enter valid dates as YYYY-MM-DD. End date must be on or after start date.'); return;
    }
    setError('');
    onClose();
    router.push({ pathname: '/(tabs)/trip/setup/[roomId]', params: {
      roomId: 'room-new-123', name: name.trim(), destination: destination.trim(), timing,
      seasonYear: String(timing === 'spring' ? springYear : summerYear),
      startDate: timing === 'custom' ? startDate : '', endDate: timing === 'custom' ? endDate : '',
      avatar: avatar || '',
    } } as any);
  };

  return <Modal transparent visible animationType="slide" onRequestClose={onClose} statusBarTranslucent>
    <KeyboardAvoidingView style={styles.overlay} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <Pressable accessibilityRole="button" accessibilityLabel="Close room form" onPress={onClose} style={StyleSheet.absoluteFill} />
      <View accessibilityViewIsModal style={[styles.sheet, { backgroundColor: colors.card, paddingBottom: Math.max(insets.bottom, 20), maxHeight: '92%' }]}>
        <View style={[styles.handle, { backgroundColor: colors.surfaceDim }]} />
        <View style={styles.header}>
          <View style={styles.title}><Icon name="compass" color={colors.primary} /><Text accessibilityRole="header" style={[typography.headlineMd, { color: colors.onSurface }]}>Start an Escape</Text></View>
          <Pressable accessibilityRole="button" accessibilityLabel="Close room form" onPress={onClose} style={[styles.close, { backgroundColor: colors.surfaceContainerHigh }]}><Icon name="close" color={colors.onSurfaceVariant} /></Pressable>
        </View>
        <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
          <Text style={[typography.bodyMd, { color: colors.onSurfaceVariant }]}>Create a collaborative trip room or join your travel group.</Text>
          <View style={[styles.tabs, { backgroundColor: colors.surfaceContainer }]}>
            {(['create', 'join'] as const).map((tab) => <Pressable key={tab} accessibilityRole="tab" accessibilityState={{ selected: mode === tab }} onPress={() => { setMode(tab); setError(''); }} style={[styles.tab, mode === tab && { backgroundColor: colors.card }]}>
              <Icon name={tab === 'create' ? 'plus' : 'key'} color={mode === tab ? colors.primary : colors.onSurfaceVariant} size={17} />
              <Text style={[typography.labelMd, { color: mode === tab ? colors.primary : colors.onSurfaceVariant }]}>{tab === 'create' ? 'Create Trip' : 'Join with Code'}</Text>
            </Pressable>)}
          </View>
          {mode === 'create' ? <>
            <View style={[styles.group, { alignItems: 'center', marginTop: 8 }]}>
              <Pressable onPress={handlePickImage} style={{ alignItems: 'center', justifyContent: 'center', width: 72, height: 72, borderRadius: 36, backgroundColor: colors.surfaceContainerHigh, overflow: 'hidden' }}>
                {avatar ? (
                  <Image source={{ uri: avatar }} style={{ width: '100%', height: '100%' }} />
                ) : (
                  <Feather name="camera" size={24} color={colors.onSurfaceVariant} />
                )}
              </Pressable>
              <Text style={[typography.utilityTiny, { color: colors.onSurfaceVariant, marginTop: 8 }]}>Add Room Photo (Optional)</Text>
            </View>
            <View style={styles.group}>
              <Text style={label}>Trip Room Name <Text style={{ color: colors.primary }}>*</Text></Text>
              <View style={field}><Icon name="sparkles" color={colors.primary} size={21} /><TextInput accessibilityLabel="Trip Room Name" value={name} onChangeText={setName} placeholder="e.g., Kyoto Spring Blossoms" placeholderTextColor={colors.outlineVariant} maxLength={80} style={input} /></View>
            </View>
            <View style={styles.group}>
              <View style={styles.between}><Text style={label}>Destination <Text style={{ color: colors.primary }}>*</Text></Text><Text style={[typography.utilityTiny, { color: colors.secondary }]}>☷ Seasonal Engine</Text></View>
              <View style={field}><Icon name="pin" color={colors.onSurfaceVariant} size={21} /><TextInput accessibilityLabel="Destination" value={destination} onChangeText={setDestination} placeholder="Kyoto, Japan" placeholderTextColor={colors.outlineVariant} maxLength={120} style={input} /></View>
              <Text style={[typography.utilityTiny, { color: colors.onSurfaceVariant }]}><Text style={{ color: colors.primary }}>ϟ </Text>Powers local AI routes, language cues & seasonal maps.</Text>
            </View>
            <View style={styles.group}>
              <Text style={label}>Target Season & Timing</Text>
              <View style={styles.timingRow}>
                {([{ id: 'spring', icon: 'spring', title: `Spring ’${String(springYear).slice(-2)}`, subtitle: 'Mar-May' }, { id: 'summer', icon: 'sun', title: `Summer ’${String(summerYear).slice(-2)}`, subtitle: 'Jun-Aug' }, { id: 'custom', icon: 'calendar', title: 'Pick Dates', subtitle: 'Custom' }] as const).map((option) => {
                  const active = timing === option.id;
                  const color = active ? colors.onSecondaryContainer : colors.onSurfaceVariant;
                  return <Pressable key={option.id} accessibilityRole="radio" accessibilityLabel={`${option.title}, ${option.subtitle}`} accessibilityState={{ checked: active }} onPress={() => { setTiming(option.id); setError(''); }} style={[styles.timing, { backgroundColor: active ? colors.secondaryContainer : colors.surfaceContainerLow }]}>
                    <Icon name={option.icon} color={color} /><Text style={[typography.labelSm, { color, fontWeight: active ? '700' : '500' }]}>{option.title}</Text><Text style={[typography.utilityTiny, { color }]}>{option.subtitle}</Text>
                  </Pressable>;
                })}
              </View>
              {timing === 'custom' && <View style={styles.timingRow}>
                {([{ title: 'Start Date', value: startDate, setter: setStartDate }, { title: 'End Date', value: endDate, setter: setEndDate }]).map((date) => <View key={date.title} style={[styles.group, { flex: 1 }]}>
                  <Text style={label}>{date.title}</Text><View style={field}><TextInput accessibilityLabel={date.title} value={date.value} onChangeText={date.setter} placeholder="YYYY-MM-DD" placeholderTextColor={colors.outlineVariant} autoCapitalize="none" maxLength={10} style={input} /></View>
                </View>)}
              </View>}
            </View>
            <View style={[styles.stage, { backgroundColor: colors.surfaceContainerLow }]}>
              <View style={[styles.stageIcon, { backgroundColor: '#fff0e6' }]}><Icon name="stage" color="#8b4b00" /></View>
              <View style={{ flex: 1, gap: 4 }}><Text style={label}>Initial Stage</Text><Text style={[typography.utilityTiny, { color: colors.onSurfaceVariant }]}>Starts automatically in Planning</Text></View>
              <Text style={[typography.utilityTiny, styles.badge, { backgroundColor: '#fff0e6', color: '#8b4b00', borderColor: '#fed7aa', borderWidth: 1 }]}>PLANNING</Text>
            </View>
          </> : <View style={[styles.group, { paddingVertical: 8 }]}>
            <Text style={label}>Room Invite Code <Text style={{ color: colors.primary }}>*</Text></Text>
            <View style={field}><Icon name="key" color={colors.primary} /><TextInput accessibilityLabel="Room Invite Code" value={inviteCode} onChangeText={(value) => { setInviteCode(value.toUpperCase()); setError(''); }} placeholder="e.g., TOK26A" placeholderTextColor={colors.outlineVariant} autoCapitalize="characters" autoCorrect={false} maxLength={6} style={[input, { letterSpacing: 2 }]} /></View>
            <Text style={[typography.bodySm, { color: colors.onSurfaceVariant }]}>Enter the 6-character code shared by your room owner.</Text>
          </View>}
          <View style={[styles.perks, { backgroundColor: colors.surfaceContainerLow }]}>
            <View style={styles.title}><Icon name="bulb" color={colors.primary} size={16} /><Text style={[typography.labelSm, { color: colors.primary, fontWeight: '700' }]}>Room Feature Perks</Text></View>
            <Text style={[typography.utilityTiny, { color: colors.onSurfaceVariant, lineHeight: 15 }]}>Plan your itinerary together, split budgets, and vote on decision cards in your trip room.</Text>
          </View>
          {!!error && <Text accessibilityRole="alert" accessibilityLiveRegion="polite" style={[typography.bodySm, { color: colors.error }]}>{error}</Text>}
        </ScrollView>
        <Pressable accessibilityRole="button" onPress={submit} style={({ pressed }) => [styles.submit, { backgroundColor: colors.primaryContainer, opacity: pressed ? 0.8 : 1 }]}>
          <Text style={[typography.bodyLg, { fontWeight: '700', color: colors.onPrimaryContainer }]}>{mode === 'create' ? 'Create Trip Room' : 'Join Trip Room'}</Text><Icon name="arrow" color={colors.onPrimaryContainer} size={21} />
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  </Modal>;
}

const styles = StyleSheet.create({
  overlay: { flex: 1, justifyContent: 'flex-end', alignItems: 'center', backgroundColor: 'rgba(10,15,17,0.42)' },
  sheet: { width: '100%', maxWidth: 448, borderTopLeftRadius: 32, borderTopRightRadius: 32, paddingHorizontal: 16, paddingTop: 12, flexShrink: 1 },
  handle: { width: 48, height: 5, borderRadius: 3, alignSelf: 'center', marginBottom: 12 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  title: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  close: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  content: { gap: 18, paddingBottom: 16 },
  tabs: { flexDirection: 'row', padding: 4, borderRadius: 17 },
  tab: { flex: 1, minHeight: 36, borderRadius: 13, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 5 },
  group: { gap: 6 },
  field: { flexDirection: 'row', alignItems: 'center', minHeight: 46, borderRadius: 17, paddingHorizontal: 12, gap: 8 },
  input: { flex: 1, minWidth: 0, paddingVertical: 12 },
  between: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  timingRow: { flexDirection: 'row', gap: 5 },
  timing: { flex: 1, minHeight: 66, borderRadius: 17, alignItems: 'center', justifyContent: 'center', padding: 8, gap: 2 },
  stage: { flexDirection: 'row', alignItems: 'center', gap: 8, padding: 12, borderRadius: 18 },
  stageIcon: { width: 34, height: 34, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  badge: { borderRadius: 12, paddingHorizontal: 8, paddingVertical: 5, fontWeight: '700', letterSpacing: 0.4 },
  perks: { borderRadius: 18, padding: 12, gap: 4, marginTop: 6 },
  submit: { minHeight: 48, borderRadius: 17, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 5 },
});
