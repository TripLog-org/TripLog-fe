import { Ionicons } from '@expo/vector-icons';
import { router, Stack } from 'expo-router';
import { Pressable } from 'react-native';

export default function RecommendLayout() {
  return (
    <Stack
      screenOptions={{
        headerTitleAlign: 'center',
        headerLeft: () => (
          <Pressable onPress={() => router.back()} hitSlop={8}>
            <Ionicons name="chevron-back" size={24} color="#1A1A1A" />
          </Pressable>
        ),
        headerStyle: { backgroundColor: '#FFFFFF' },
        headerTitleStyle: { fontWeight: '600' },
      }}
    >
      <Stack.Screen
        name="myMap"
        options={{
          headerTitle: '나의 여행 지도',
        }}
      />
      <Stack.Screen
        name="settings"
        options={{
          headerTitle: '설정',
        }}
      />
    </Stack>
  );
}