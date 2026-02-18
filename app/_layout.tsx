import '../global.css';

import { useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAuthStore } from '@/features/auth/useAuthStore';
import { LoadingSpinner } from '@/shared/components/LoadingSpinner';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 1000 * 60 * 5, // 5분
    },
  },
});

function RootLayoutNav() {
  const { isAuthenticated, isLoading, initialize } = useAuthStore();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    initialize();
  }, [initialize]);

  // useEffect(() => {
  //   if (isLoading) return;

  //   const inAuthGroup = segments[0] === '(auth)';

  //   // if (!isAuthenticated && !inAuthGroup) {
  //   //   router.replace('/(auth)/login');
  //   // } else if (isAuthenticated && inAuthGroup) {
  //   //   router.replace('/(tabs)/map');
  //   // }

  //   router.replace('/(tabs)/map');

  // }, [isAuthenticated, isLoading, segments, router]);

  // if (isLoading) {
  //   return <LoadingSpinner />;
  // }

  return (
    <>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false }} />
    </>
  );
}

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <RootLayoutNav />
    </QueryClientProvider>
  );
}
