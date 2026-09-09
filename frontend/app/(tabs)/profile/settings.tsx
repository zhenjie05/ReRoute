import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/core/theme';
import { useAuth } from '@/lib/hooks/useAuth';
import { EditProfileModal } from '@/features/profile/presentation/components/EditProfileModal';

export default function SettingsScreen() {
  const { colors, typography, spacing } = useTheme();
  const router = useRouter();

  const { user: authUser, updateProfile } = useAuth();
  const prefs = authUser?.preferences || {};

  const [safetyAlerts, setSafetyAlerts] = useState(prefs.safetyAlerts ?? true);
  const [decisionCards, setDecisionCards] = useState(prefs.decisionCards ?? true);
  const [mascotNotifications, setMascotNotifications] = useState(prefs.mascotNotifications ?? true);
  const [sosAlerts, setSosAlerts] = useState(prefs.sosAlerts ?? true);

  const [isEditModalVisible, setIsEditModalVisible] = useState(false);

  const handleTogglePref = async (key: keyof typeof prefs, value: boolean) => {
    switch (key) {
      case 'safetyAlerts': setSafetyAlerts(value); break;
      case 'decisionCards': setDecisionCards(value); break;
      case 'mascotNotifications': setMascotNotifications(value); break;
      case 'sosAlerts': setSosAlerts(value); break;
    }
    const updatedPrefs = { ...prefs, [key]: value };
    await updateProfile({ preferences: updatedPrefs });
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: colors.surfaceContainerHigh }]}>
        <TouchableOpacity onPress={() => router.back()} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <Text style={{ fontSize: 24, color: colors.onSurface }}>←</Text>
        </TouchableOpacity>
        <Text style={[typography.headlineSm, { color: colors.onSurface, fontWeight: 'bold' }]}>
          Settings
        </Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={{ padding: spacing.lg }}>
        <Text style={[typography.labelLg, { color: colors.onSurfaceVariant, marginBottom: spacing.md, marginTop: spacing.md }]}>
          NOTIFICATIONS
        </Text>
        
        <View style={[styles.section, { backgroundColor: colors.surfaceContainerLow, borderRadius: 12 }]}>
          <View style={[styles.row, { borderBottomColor: colors.surfaceContainerHigh, borderBottomWidth: 1 }]}>
            <Text style={[typography.bodyLg, { color: colors.onSurface }]}>Safety & Weather Alerts</Text>
            <Switch
              value={safetyAlerts}
              onValueChange={(val) => handleTogglePref('safetyAlerts', val)}
              trackColor={{ false: colors.surfaceContainerHigh, true: colors.primary }}
              thumbColor="#ffffff"
            />
          </View>
          <View style={[styles.row, { borderBottomColor: colors.surfaceContainerHigh, borderBottomWidth: 1 }]}>
            <Text style={[typography.bodyLg, { color: colors.onSurface }]}>Decision Cards</Text>
            <Switch
              value={decisionCards}
              onValueChange={(val) => handleTogglePref('decisionCards', val)}
              trackColor={{ false: colors.surfaceContainerHigh, true: colors.primary }}
              thumbColor="#ffffff"
            />
          </View>
          <View style={[styles.row, { borderBottomColor: colors.surfaceContainerHigh, borderBottomWidth: 1 }]}>
            <Text style={[typography.bodyLg, { color: colors.onSurface }]}>Mascot-delivered Notifications</Text>
            <Switch
              value={mascotNotifications}
              onValueChange={(val) => handleTogglePref('mascotNotifications', val)}
              trackColor={{ false: colors.surfaceContainerHigh, true: colors.primary }}
              thumbColor="#ffffff"
            />
          </View>
          <View style={styles.row}>
            <Text style={[typography.bodyLg, { color: colors.onSurface }]}>SOS Alerts</Text>
            <Switch
              value={sosAlerts}
              onValueChange={(val) => handleTogglePref('sosAlerts', val)}
              trackColor={{ false: colors.surfaceContainerHigh, true: colors.error }}
              thumbColor="#ffffff"
            />
          </View>
        </View>

        <Text style={[typography.labelLg, { color: colors.onSurfaceVariant, marginBottom: spacing.md, marginTop: spacing.xl }]}>
          ACCOUNT
        </Text>
        
        <View style={[styles.section, { backgroundColor: colors.surfaceContainerLow, borderRadius: 12 }]}>
          <TouchableOpacity 
            style={[styles.row, { borderBottomColor: colors.surfaceContainerHigh, borderBottomWidth: 1 }]}
            onPress={() => setIsEditModalVisible(true)}
          >
            <Text style={[typography.bodyLg, { color: colors.onSurface }]}>Edit Profile</Text>
            <Text style={{ color: colors.onSurfaceVariant }}>→</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.row}>
            <Text style={[typography.bodyLg, { color: colors.error }]}>Delete Account</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <EditProfileModal
        visible={isEditModalVisible}
        onClose={() => setIsEditModalVisible(false)}
        initialName={authUser?.name || ''}
        initialAvatar={authUser?.avatar || undefined}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  section: {
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
});
