import { ExpoConfig, ConfigContext } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'ReRoute',
  slug: 'reroute',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/icon.png',
  scheme: 'reroute',
  userInterfaceStyle: 'automatic',
  newArchEnabled: true,
  splash: {
    image: './assets/splash-icon.png',
    resizeMode: 'contain',
    backgroundColor: '#f3f7fa',
  },
  ios: {
    supportsTablet: true,
    bundleIdentifier: 'com.reroute.app',
    infoPlist: {
      NSLocationWhenInUseUsageDescription: 'ReRoute uses your location for trip routing, live group coordination, and local emergency SOS.',
      NSLocationAlwaysAndWhenInUseUsageDescription: 'ReRoute uses your location to keep your group updated during active trips.',
      NSCameraUsageDescription: 'ReRoute uses your camera to scan receipts and upload landmark/album photos.',
      NSPhotoLibraryUsageDescription: 'ReRoute accesses your photos to add memories to the group trip album.',
    },
  },
  android: {
    adaptiveIcon: {
      foregroundImage: './assets/adaptive-icon.png',
      backgroundColor: '#f3f7fa',
    },
    package: 'com.reroute.app',
    permissions: [
      'ACCESS_COARSE_LOCATION',
      'ACCESS_FINE_LOCATION',
      'CAMERA',
      'READ_EXTERNAL_STORAGE',
      'WRITE_EXTERNAL_STORAGE',
    ],
    config: {
      googleMaps: {
        apiKey: process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY || '',
      },
    },
  },
  plugins: [
    'expo-router',
    'expo-asset',
    [
      'expo-location',
      {
        locationWhenInUsePermission: 'Show your current location on trip maps and dispatch emergency SOS alerts.',
      },
    ],
    [
      'expo-image-picker',
      {
        photosPermission: 'Upload photos to your group album and scan receipts.',
      },
    ],
  ],
  extra: {
    eas: {
      projectId: 'reroute-codenection-2026',
    },
  },
});
