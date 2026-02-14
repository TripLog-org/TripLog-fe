import { Redirect } from 'expo-router';
import { useAuthStore } from '@/features/auth/useAuthStore';

export default function Index() {
  // const { isAuthenticated } = useAuthStore();

  // if (isAuthenticated) {
  //   return <Redirect href="/(tabs)/map" />;
  // }

  // return <Redirect href="/(auth)/login" />;

  return <Redirect href="/(tabs)/map" />;
}
