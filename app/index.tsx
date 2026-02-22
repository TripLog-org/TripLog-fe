import { Redirect } from 'expo-router';
import { useAuthStore } from '@/features/auth/useAuthStore';

export default function Index() {
  return <Redirect href="/(tabs)/map" />;
}
