import { Ionicons } from '@expo/vector-icons';
import { router, Stack } from 'expo-router';
import { Pressable } from 'react-native';

export default function RecommendLayout() {
  return (
    <Stack
      screenOptions={{
        headerTitle: '설정',
        headerTitleAlign: 'center',
        headerLeft: () => (
          <Pressable onPress={() => router.back()} hitSlop={8}>
            <Ionicons name="chevron-back" size={24} color="#1A1A1A" />
          </Pressable>
        ),
        headerStyle: { backgroundColor: '#FFFFFF' },
        headerTitleStyle: { fontWeight: '600' },
      }}
    />
  );
}