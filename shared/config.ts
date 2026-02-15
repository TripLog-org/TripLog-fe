import Constants from 'expo-constants';

interface AppConfig {
  apiBaseUrl: string;
  iosGoogleMapsApiKey: string;
  androidGoogleMapsApiKey: string;
}

const extra = Constants.expoConfig?.extra as Partial<AppConfig> | undefined;

console.log('extra', extra);

export const appConfig: AppConfig = {
  apiBaseUrl: extra?.apiBaseUrl ?? '',
  iosGoogleMapsApiKey: extra?.iosGoogleMapsApiKey ?? '',
  androidGoogleMapsApiKey: extra?.androidGoogleMapsApiKey ?? '',
};
