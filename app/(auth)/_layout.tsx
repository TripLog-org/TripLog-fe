import { Ionicons } from '@expo/vector-icons';
import { router, Stack } from 'expo-router';
import { Pressable } from 'react-native';

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerTitleAlign: 'center',
        headerLeft: () => (
          <Pressable onPress={() => router.replace('/(tabs)/map')} hitSlop={8}>
            <Ionicons name="chevron-back" size={24} color="#1A1A1A" />
          </Pressable>
        ),
        headerStyle: { backgroundColor: '#FFFFFF' },
        headerTitleStyle: { fontWeight: '600' },
      }}
    >
      <Stack.Screen
        name="login"
        options={{
          headerTitle: '로그인',
        }}
      />
    </Stack>
  );
}
