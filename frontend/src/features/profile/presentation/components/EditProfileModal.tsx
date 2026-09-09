import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, TextInput, Image } from 'react-native';
import { useTheme } from '@/core/theme';
import { ModalSheet } from '@/shared/components/ModalSheet';
import { Button } from '@/shared/components/Button';
import { mockStandardUsers } from '@/shared/data/standard-mock-data';
import * as ImagePicker from 'expo-image-picker';
import { Feather } from '@expo/vector-icons';
import { useAuth } from '@/lib/hooks/useAuth';

interface EditProfileModalProps {
  visible: boolean;
  onClose: () => void;
  initialName?: string;
  initialAvatar?: string;
}

const TRAVEL_COMPANIONS = ['Solo', 'Family', 'Couple', 'Friends'];
const TRAVEL_STYLES = ['Cultural', 'Classic', 'Nature', 'Cityscape'];
const TRAVEL_PACES = ['Ambitious', 'Moderate', 'Relaxed'];

export const EditProfileModal: React.FC<EditProfileModalProps> = ({ visible, onClose, initialName = '', initialAvatar }) => {
  const { colors, typography, spacing, rounded } = useTheme();
  const { user, updateProfile, updateLocalProfile } = useAuth();
  
  const prefs = user?.preferences || {};
  
  const [editName, setEditName] = useState(initialName);
  const [editAvatar, setEditAvatar] = useState<string | undefined>(initialAvatar);
  
  const [editCompanions, setEditCompanions] = useState(prefs.travelCompanions || 'Friends');
  const [editStyle, setEditStyle] = useState(prefs.travelStyle || 'Cultural');
  const [editPace, setEditPace] = useState(prefs.travelPace || 'Moderate');

  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (visible) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setEditName(initialName);
      setEditAvatar(initialAvatar);
      setEditCompanions(prefs.travelCompanions || 'Friends');
      setEditStyle(prefs.travelStyle || 'Cultural');
      setEditPace(prefs.travelPace || 'Moderate');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, initialName, initialAvatar]);

  const handlePickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Sorry, we need camera roll permissions to make this work!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const selectedUri = result.assets[0].uri;
      setEditAvatar(selectedUri);
      updateLocalProfile({ avatar: selectedUri });
    }
  };

  const handleSaveProfile = async () => {
    setIsSaving(true);
    await updateProfile({ 
      name: editName, 
      avatar: editAvatar,
      preferences: {
        ...prefs,
        travelCompanions: editCompanions,
        travelStyle: editStyle,
        travelPace: editPace,
      }
    });
    setIsSaving(false);
    onClose();
  };

  return (
    <ModalSheet
      visible={visible}
      onClose={onClose}
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
                styles.uploadButton,
                { backgroundColor: colors.surfaceContainerHighest, borderColor: colors.outlineVariant }
              ]}
            >
              <Feather name="camera" size={24} color={colors.onSurfaceVariant} />
              <Text style={[typography.labelSm, { color: colors.onSurface, fontWeight: '700' }]}>Upload from Gallery</Text>
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
            {mockStandardUsers.filter((u): u is typeof u & { avatar: string } => Boolean(u.avatar)).slice(0, 5).map(u => (
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

        {/* Travel Preferences */}
        <View style={{ gap: spacing.md }}>
          <Text style={[typography.labelSm, { color: colors.onSurfaceVariant }]}>TRAVEL PREFERENCES</Text>
          
          <View>
            <Text style={[typography.labelSm, { color: colors.onSurface, marginBottom: spacing.xs }]}>Travel Companions</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm }}>
              {TRAVEL_COMPANIONS.map(comp => (
                <TouchableOpacity
                  key={comp}
                  onPress={() => setEditCompanions(comp)}
                  style={[
                    styles.chip,
                    editCompanions === comp ? { borderColor: colors.primary, borderWidth: 2 } : { backgroundColor: colors.surfaceContainerLow }
                  ]}
                >
                  <Text style={[typography.labelSm, editCompanions === comp ? { color: colors.primary, fontWeight: 'bold' } : { color: colors.onSurface }]}>{comp}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View>
            <Text style={[typography.labelSm, { color: colors.onSurface, marginBottom: spacing.xs }]}>Travel Style</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm }}>
              {TRAVEL_STYLES.map(style => (
                <TouchableOpacity
                  key={style}
                  onPress={() => setEditStyle(style)}
                  style={[
                    styles.chip,
                    editStyle === style ? { borderColor: colors.primary, borderWidth: 2 } : { backgroundColor: colors.surfaceContainerLow }
                  ]}
                >
                  <Text style={[typography.labelSm, editStyle === style ? { color: colors.primary, fontWeight: 'bold' } : { color: colors.onSurface }]}>{style}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View>
            <Text style={[typography.labelSm, { color: colors.onSurface, marginBottom: spacing.xs }]}>Travel Pace</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm }}>
              {TRAVEL_PACES.map(pace => (
                <TouchableOpacity
                  key={pace}
                  onPress={() => setEditPace(pace)}
                  style={[
                    styles.chip,
                    editPace === pace ? { borderColor: colors.primary, borderWidth: 2 } : { backgroundColor: colors.surfaceContainerLow }
                  ]}
                >
                  <Text style={[typography.labelSm, editPace === pace ? { color: colors.primary, fontWeight: 'bold' } : { color: colors.onSurface }]}>{pace}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
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
            onPress={onClose} 
            disabled={isSaving}
          />
        </View>
      </View>
    </ModalSheet>
  );
};

const styles = StyleSheet.create({
  avatarOption: {
    width: 70,
    height: 70,
    borderRadius: 35,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: 'transparent',
  },
  uploadButton: {
    minHeight: 70,
    paddingHorizontal: 18,
    borderRadius: 18,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  inputField: {
    borderWidth: 1,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: 'transparent',
  },
});
