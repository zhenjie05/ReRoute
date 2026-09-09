import React, { useState, useEffect } from 'react';
import { View, Text, Modal, Image, TouchableOpacity, StyleSheet, Dimensions, SafeAreaView, Linking } from 'react-native';
import { useTheme } from '@/core/theme';
import { AlbumPhoto } from '@/models/album';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface AlbumLightboxProps {
  visible: boolean;
  photos: AlbumPhoto[];
  initialPhotoId: string | null;
  isArchived?: boolean;
  onClose: () => void;
  onShare: (photo: AlbumPhoto) => void;
}

export const AlbumLightbox: React.FC<AlbumLightboxProps> = ({
  visible,
  photos,
  initialPhotoId,
  isArchived = false,
  onClose,
  onShare,
}) => {
  const { typography } = useTheme();
  
  // Find initial index based on passed photoId
  const initialIndex = Math.max(0, photos.findIndex(p => p.id === initialPhotoId));
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  // Update index when visible or initialPhotoId changes
  useEffect(() => {
    if (visible && initialPhotoId) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCurrentIndex(Math.max(0, photos.findIndex(p => p.id === initialPhotoId)));
    }
  }, [visible, initialPhotoId, photos]);

  if (!visible || photos.length === 0) return null;

  const currentPhoto = photos[currentIndex];

  const handlePrev = () => {
    if (currentIndex > 0) setCurrentIndex(prev => prev - 1);
  };

  const handleNext = () => {
    if (currentIndex < photos.length - 1) setCurrentIndex(prev => prev + 1);
  };

  // Simple relative time mock
  const getRelativeTime = (isoString: string) => {
    const diffHours = Math.round((new Date().getTime() - new Date(isoString).getTime()) / (1000 * 60 * 60));
    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours} hours ago`;
    return `${Math.round(diffHours / 24)} days ago`;
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.container}>
        <SafeAreaView style={styles.safeArea}>
          
          {/* Top Row: Close */}
          <View style={styles.topRow}>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Text style={{ color: '#ffffff', fontSize: 18, fontWeight: '700' }}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Center Area: Photo + Arrows */}
          <View style={styles.centerArea}>
             {/* Left Arrow */}
             {currentIndex > 0 ? (
               <TouchableOpacity onPress={handlePrev} style={[styles.arrowBtn, { left: 16 }]}>
                 <Text style={styles.arrowText}>‹</Text>
               </TouchableOpacity>
             ) : <View style={[styles.arrowBtn, { left: 16 }]} />}

             {/* Main Image */}
             <Image
               source={{ uri: currentPhoto?.url }}
               style={styles.image}
               resizeMode="contain"
             />

             {/* Right Arrow */}
             {currentIndex < photos.length - 1 ? (
               <TouchableOpacity onPress={handleNext} style={[styles.arrowBtn, { right: 16 }]}>
                 <Text style={styles.arrowText}>›</Text>
               </TouchableOpacity>
             ) : <View style={[styles.arrowBtn, { right: 16 }]} />}
          </View>

          {/* Bottom Info Bar */}
          <View style={styles.bottomBar}>
            <View style={styles.bottomInfo}>
               <Text style={[typography.labelLg, { color: '#ffffff', fontWeight: '800' }]}>
                 {currentPhoto?.uploader_name || 'Member'}
               </Text>
               <Text style={[typography.utilityTiny, { color: 'rgba(255,255,255,0.7)', marginTop: 2 }]}>
                 {getRelativeTime(currentPhoto?.taken_at || new Date().toISOString())}
               </Text>
            </View>

            {currentPhoto?.caption && <Text style={{ color: '#fff', fontSize: 11, flex: 1 }}>{currentPhoto.caption}</Text>}
            {currentPhoto?.source_url && <TouchableOpacity accessibilityRole="link" onPress={() => Linking.openURL(currentPhoto.source_url!)}><Text style={{ color: '#fff', padding: 8 }}>Photo source ↗</Text></TouchableOpacity>}
            {/* Actions: Share only, hidden if archived */}
            {!isArchived && (
              <View style={styles.bottomActions}>
                <TouchableOpacity onPress={() => onShare(currentPhoto)} style={styles.actionBtn}>
                  {/* Mocking share icon with emoji */}
                  <Text style={{ fontSize: 24, color: '#ffffff' }}>↗️</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

        </SafeAreaView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  safeArea: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  topRow: {
    alignItems: 'flex-end',
    padding: 16,
  },
  closeBtn: {
    backgroundColor: 'rgba(0,0,0,0.6)',
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerArea: {
    flex: 1,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: SCREEN_WIDTH,
    height: '100%',
  },
  arrowBtn: {
    position: 'absolute',
    top: '50%',
    marginTop: -20,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 20,
  },
  arrowText: {
    color: '#ffffff',
    fontSize: 28,
    lineHeight: 32,
    fontWeight: '300',
  },
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingBottom: 24,
    paddingTop: 16,
  },
  bottomInfo: {
    flex: 1,
  },
  bottomActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionBtn: {
    padding: 8,
    marginLeft: 16,
  }
});
