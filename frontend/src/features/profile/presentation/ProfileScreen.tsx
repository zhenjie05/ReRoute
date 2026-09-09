import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert, TextInput, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/core/theme';
import { Card } from '@/shared/components/Card';
import { Avatar } from '@/shared/components/Avatar';
import { Badge } from '@/shared/components/Badge';
import { ModalSheet } from '@/shared/components/ModalSheet';
import { Button } from '@/shared/components/Button';
import { DiscoverPostCard } from '@/features/discover/presentation/DiscoverPostCard';
import { toggleStarPost, cloneDiscoverItinerary } from '@/features/discover/data/mock-discover';
import { useProfileMockData } from '../data/useProfileMockData';
import { useAuth } from '@/lib/hooks/useAuth';
import { mockStandardUsers } from '@/shared/data/standard-mock-data';
import * as ImagePicker from 'expo-image-picker';
import { Feather } from '@expo/vector-icons';

export const ProfileScreen: React.FC = () => {
  const { colors, typography, spacing, rounded } = useTheme();
  const router = useRouter();
  
  // Use global auth state to keep header in sync
  const { user: authUser, updateProfile } = useAuth();

  const {
    user: mockUser,
    badges,
    userBadges,
    starredTrips,
    languageProgress,
    archivedTrips,
  } = useProfileMockData();

  // Combine auth user with mock user for standard fields
  const displayName = authUser?.name || mockUser.display_name;
  const avatarUrl = authUser?.avatar || mockUser.avatar_url || undefined;

  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editName, setEditName] = useState(displayName);
  const [editAvatar, setEditAvatar] = useState(avatarUrl);
  const [isSaving, setIsSaving] = useState(false);

  const handleEditProfile = () => {
    setEditName(displayName);
    setEditAvatar(avatarUrl);
    setIsEditModalVisible(true);
  };

  const handleSaveProfile = async () => {
    setIsSaving(true);
    await updateProfile({ name: editName, avatar: editAvatar });
    setIsSaving(false);
    setIsEditModalVisible(false);
  };

  const handlePickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Sorry, we need camera roll permissions to make this work!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setEditAvatar(result.assets[0].uri);
    }
  };

  const handleLogout = () => {
    Alert.alert('Logout', 'Logging out...');
    router.replace('/');
  };

  const handleSettings = () => {
    // Stub navigation target for settings
    router.push('/(tabs)/profile/settings' as any);
  };

  // Compute unlocked badges count
  const unlockedCount = userBadges.filter(ub => ub.unlocked_at !== null).length;
  
  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView contentContainerStyle={{ padding: spacing.lg, paddingBottom: spacing.safeBottom + 96 }}>
        
        {/* Profile Overview Card */}
        <View style={{ backgroundColor: colors.surfaceContainerLow, borderRadius: rounded.xl, padding: spacing.xl, alignItems: 'center', marginBottom: spacing.xl }}>
          <TouchableOpacity onPress={handleEditProfile} style={{ position: 'relative' }}>
            <Avatar 
              uri={avatarUrl} 
              size={96} 
              name={displayName} 
            />
            {/* Edit Badge overlay */}
            <View style={{ position: 'absolute', bottom: 0, right: 0, backgroundColor: colors.surface, borderRadius: 12, padding: 4, elevation: 2 }}>
               <Text style={{ fontSize: 12 }}>✏️</Text>
            </View>
          </TouchableOpacity>
          
          <Text style={[typography.headlineMd, { color: colors.onSurface, fontWeight: 'bold', marginTop: spacing.md }]}>
            {displayName}
          </Text>
          
          <Text style={[typography.bodySm, { color: colors.onSurfaceVariant, marginTop: spacing.xs }]}>
            Level 12 Traveller · {mockUser.trip_count} trips · {mockUser.country_count} countries
          </Text>
          
          <View style={{ flexDirection: 'row', gap: spacing.sm, marginTop: spacing.md }}>
            <View style={styles.statPill}>
              <Text style={styles.statPillText}>🔥 {languageProgress.streak_days}d Streak</Text>
            </View>
            <View style={styles.statPill}>
              <Text style={styles.statPillText}>📷 420 Photos</Text>
            </View>
          </View>
        </View>

        {/* Badges Section */}
        <View style={{ marginBottom: spacing.xl }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md }}>
            <Text style={[typography.headlineSm, { color: colors.onSurface, fontWeight: 'bold' }]}>
              Badges ({unlockedCount}/{badges.length} unlocked)
            </Text>
            <TouchableOpacity onPress={() => router.push('/(tabs)/profile/badges' as any)}>
              <Text style={[typography.labelSm, { color: colors.primary, fontWeight: 'bold' }]}>See All</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: spacing.md }}>
            {badges.slice(0, 4).map(badge => {
              const isUnlocked = userBadges.find(ub => ub.badge_id === badge.id)?.unlocked_at != null;
              return (
                <View key={badge.id} style={{ alignItems: 'center', width: 80 }}>
                  <View style={[
                    styles.badgeCircle, 
                    { 
                      backgroundColor: isUnlocked ? colors.primary : colors.surfaceContainerHighest,
                      borderRadius: 35,
                    }
                  ]}>
                    <Text style={{ fontSize: 24, opacity: isUnlocked ? 1 : 0.4 }}>{badge.icon}</Text>
                  </View>
                  <Text style={[typography.utilityTiny, { color: isUnlocked ? colors.onSurface : colors.onSurfaceVariant, marginTop: spacing.xs, textAlign: 'center' }]}>
                    {badge.label}
                  </Text>
                </View>
              );
            })}
          </ScrollView>
        </View>

        {/* Starred Trips Section */}
        <View style={{ marginBottom: spacing.xl }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md }}>
            <Text style={[typography.headlineSm, { color: colors.onSurface, fontWeight: 'bold' }]}>
              Starred Trips
            </Text>
            <Text style={[typography.bodySm, { color: colors.onSurfaceVariant }]}>
              {starredTrips.length} trips saved
            </Text>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: spacing.md }}>
            {starredTrips
              .filter((st): st is typeof st & { post: NonNullable<typeof st.post> } => Boolean(st.post))
              .map(st => (
                <View key={st.id} style={{ width: 280 }}>
                  <DiscoverPostCard 
                    post={st.post} 
                    onToggleStar={(id) => toggleStarPost(id)} 
                    onClone={(id) => {
                      const newRoom = cloneDiscoverItinerary(id);
                      Alert.alert('Itinerary Cloned! 🎉', `"${st.post.title}" has been cloned into your planning trips.`, [
                        {
                          text: 'View Itinerary 📅',
                          onPress: () => router.push(`/(tabs)/trip/room/${newRoom.id}/itinerary` as any),
                        },
                        { text: 'Stay Here', style: 'cancel' },
                      ]);
                    }}
                    sourceTab="profile"
                  />
                </View>
              ))}
          </ScrollView>
        </View>

        {/* Past Trips Section */}
        <View style={{ marginBottom: spacing.xl }}>
          <Text style={[typography.headlineSm, { color: colors.onSurface, fontWeight: 'bold', marginBottom: spacing.md }]}>
            Past Trips
          </Text>
          <View style={{ gap: spacing.sm }}>
            {archivedTrips.map(trip => (
              <Card 
                key={trip.id} 
                variant="outlined" 
                style={{ padding: spacing.md, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}
                onPress={() => router.push(`/(tabs)/trip/room/${trip.id}/chat` as any)}
              >
                <View>
                  <Text style={[typography.labelLg, { color: colors.onSurface, fontWeight: 'bold' }]}>
                    {trip.name}
                  </Text>
                  <Text style={[typography.bodySm, { color: colors.onSurfaceVariant, marginTop: 2 }]}>
                    {trip.dates}
                  </Text>
                </View>
                <Badge label="Archived" variant="season" style={{ backgroundColor: '#D4E8D4' }} />
              </Card>
            ))}
          </View>
        </View>

        {/* Language Progress Card */}
        <Card variant="season" style={{ backgroundColor: '#F9EAD3', marginBottom: spacing.xl, padding: spacing.lg }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <View>
              <Text style={[typography.labelLg, { color: '#8b4b00', fontWeight: 'bold' }]}>
                {languageProgress.language} Progress
              </Text>
              <Text style={[typography.bodySm, { color: '#8b4b00', marginTop: 2 }]}>
                {languageProgress.streak_days}-day streak 🔥
              </Text>
            </View>
            <Text style={{ fontSize: 28, color: '#8b4b00' }}>A文</Text>
          </View>
          
          <View style={{ height: 8, backgroundColor: '#EAD3B6', borderRadius: 4, marginTop: spacing.md, marginBottom: spacing.sm, overflow: 'hidden' }}>
            <View style={{ width: `${languageProgress.mastery_percent}%`, height: '100%', backgroundColor: '#8b4b00' }} />
          </View>
          
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={[typography.utilityTiny, { color: '#8b4b00' }]}>
              {languageProgress.mastery_percent}% Mastered
            </Text>
            <TouchableOpacity>
              <Text style={[typography.labelSm, { color: '#8b4b00', fontWeight: 'bold' }]}>
                Continue learning →
              </Text>
            </TouchableOpacity>
          </View>
        </Card>

        {/* Settings & Logout */}
        <View style={{ gap: spacing.md, marginTop: spacing.lg }}>
          <TouchableOpacity onPress={handleSettings} style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: spacing.sm }}>
            <Text style={{ fontSize: 20, marginRight: spacing.md }}>⚙️</Text>
            <Text style={[typography.labelLg, { color: colors.onSurface, fontWeight: 'bold' }]}>Settings</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleLogout} style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: spacing.sm }}>
            <Text style={{ fontSize: 20, marginRight: spacing.md }}>🚪</Text>
            <Text style={[typography.labelLg, { color: colors.error, fontWeight: 'bold' }]}>Logout</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>

      {/* Edit Profile Modal */}
      <ModalSheet
        visible={isEditModalVisible}
        onClose={() => setIsEditModalVisible(false)}
        title="Edit Profile"
      >
        <View style={{ gap: spacing.xl }}>
          {/* Avatar Picker */}
          <View>
            <Text style={[typography.labelSm, { color: colors.onSurface, marginBottom: spacing.sm }]}>Choose Avatar</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: spacing.md }}>
              <TouchableOpacity
                onPress={handlePickImage}
                style={[
                  styles.avatarOption,
                  { backgroundColor: colors.surfaceContainerHighest }
                ]}
              >
                <Feather name="camera" size={24} color={colors.onSurfaceVariant} />
              </TouchableOpacity>
              
              <TouchableOpacity
                onPress={() => setEditAvatar(undefined)}
                style={[
                  styles.avatarOption,
                  !editAvatar && { borderColor: colors.primary, borderWidth: 3 }
                ]}
              >
                <View style={{ width: 64, height: 64, borderRadius: 32, backgroundColor: colors.surfaceContainerHighest, alignItems: 'center', justifyContent: 'center' }}>
                  <Text style={{ color: colors.onSurfaceVariant, fontWeight: 'bold' }}>{editName?.slice(0, 2).toUpperCase() || 'U'}</Text>
                </View>
              </TouchableOpacity>
              {mockStandardUsers.slice(0, 5).map(u => (
                <TouchableOpacity
                  key={u.id}
                  onPress={() => setEditAvatar(u.avatar)}
                  style={[
                    styles.avatarOption,
                    editAvatar === u.avatar && { borderColor: colors.primary, borderWidth: 3 }
                  ]}
                >
                  <Image source={{ uri: u.avatar }} style={{ width: 64, height: 64, borderRadius: 32 }} />
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Name Input */}
          <View>
            <Text style={[typography.labelSm, { color: colors.onSurface, marginBottom: spacing.xs }]}>Display Name</Text>
            <TextInput
              style={[
                typography.bodyLg,
                styles.inputField,
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.outlineVariant,
                  color: colors.onSurface,
                  borderRadius: rounded.md,
                  padding: spacing.md,
                }
              ]}
              value={editName}
              onChangeText={setEditName}
              placeholder="Enter your name"
              placeholderTextColor={colors.onSurfaceVariant}
            />
          </View>

          {/* Action Buttons */}
          <View style={{ gap: spacing.sm, marginTop: spacing.md }}>
            <Button 
              title={isSaving ? "Saving..." : "Save Changes"}
              onPress={handleSaveProfile} 
              disabled={isSaving}
            />
            <Button 
              title="Cancel" 
              variant="outline" 
              onPress={() => setIsEditModalVisible(false)} 
              disabled={isSaving}
            />
          </View>
        </View>
      </ModalSheet>
    </View>
  );
};

const styles = StyleSheet.create({
  statPill: {
    backgroundColor: '#F0D4B2',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  statPillText: {
    color: '#8b4b00',
    fontSize: 12,
    fontWeight: 'bold',
  },
  badgeCircle: {
    width: 70,
    height: 70,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarOption: {
    width: 70,
    height: 70,
    borderRadius: 35,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: 'transparent',
  },
  inputField: {
    borderWidth: 1,
  },
});
