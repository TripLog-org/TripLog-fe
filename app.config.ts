import 'dotenv/config';
import { ExpoConfig, ConfigContext } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'TripLog',
  slug: 'TripLog-fe',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/icon.png',
  userInterfaceStyle: 'light',
  newArchEnabled: true,
  scheme: 'triplog',
  splash: {
    image: './assets/splash-icon.png',
    resizeMode: 'contain',
    backgroundColor: '#ffffff',
  },
  ios: {
    supportsTablet: true,
    bundleIdentifier: 'org.triplog.app',
    config: {
      googleMapsApiKey: process.env.IOS_GOOGLE_MAPS_API_KEY,
    },
    usesAppleSignIn: true,
  },
  android: {
    adaptiveIcon: {
      foregroundImage: './assets/adaptive-icon.png',
      backgroundColor: '#ffffff',
    },
    edgeToEdgeEnabled: true,
    package: 'org.triplog.app',
    config: {
      googleMaps: {
        apiKey: process.env.ANDROID_GOOGLE_MAPS_API_KEY,
      },
    },
  },
  web: {
    favicon: './assets/favicon.png',
  },
  plugins: [
    'expo-router',
    'expo-secure-store',
    'expo-apple-authentication',
    [
      'expo-image-picker',
      {
        photosPermission:
          '앨범에서 여행 사진을 선택하기 위해 접근 권한이 필요합니다.',
        cameraPermission:
          '여행 사진을 촬영하기 위해 카메라 접근 권한이 필요합니다.',
      },
    ],
    [
      '@react-native-google-signin/google-signin',
      {
        iosUrlScheme: 'com.googleusercontent.apps.YOUR_IOS_CLIENT_ID',
      },
    ],
  ],
  extra: {
    apiBaseUrl: process.env.API_BASE_URL,
    iosGoogleMapsApiKey: process.env.IOS_GOOGLE_MAPS_API_KEY,
    androidGoogleMapsApiKey: process.env.ANDROID_GOOGLE_MAPS_API_KEY,
  },
});
