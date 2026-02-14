import { Stack } from 'expo-router';

export default function RecommendLayout() {
  return (
    <Stack
      screenOptions={{
        headerBackTitle: '뒤로',
        headerStyle: { backgroundColor: '#FFFFFF' },
        headerTitleStyle: { fontWeight: '600' },
      }}
    />
  );
}
