import Constants from 'expo-constants';

interface AppConfig {
  apiBaseUrlDevelopment: string;
  apiBaseUrlProduction: string;
}

const extra = Constants.expoConfig?.extra as Partial<AppConfig> | undefined;

console.log('extra', extra);

export const appConfig: AppConfig = {
  apiBaseUrlDevelopment: extra?.apiBaseUrlDevelopment ?? '',
  apiBaseUrlProduction: extra?.apiBaseUrlProduction ?? '',
};
