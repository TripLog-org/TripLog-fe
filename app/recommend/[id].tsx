import { View, Text, ScrollView, Image, Pressable } from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import { useRecommendationDetail } from '@/features/recommend/useRecommendations';
import { useToggleBookmark, useBookmarkCheck } from '@/features/recommend/useBookmarks';
import { LoadingSpinner } from '@/shared/components/LoadingSpinner';
import { Ionicons } from '@expo/vector-icons';

export default function RecommendDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: item, isLoading } = useRecommendationDetail(id);
  const { data: bookmarkStatus } = useBookmarkCheck(id);
  const toggleBookmark = useToggleBookmark();

  if (isLoading || !item) return <LoadingSpinner />;

  const isBookmarked = bookmarkStatus?.isBookmarked ?? item.isBookmarked;

  return (
    <>
      <Stack.Screen
        options={{
          title: item.title,
          headerRight: () => (
            <Pressable onPress={() => toggleBookmark.mutate(id)}>
              <Ionicons
                name={isBookmarked ? 'bookmark' : 'bookmark-outline'}
                size={22}
                color={isBookmarked ? '#4A90D9' : '#9CA3AF'}
              />
            </Pressable>
          ),
        }}
      />

      <ScrollView className="flex-1 bg-white">
        {item.imageUrl && (
          <Image
            source={{ uri: item.imageUrl }}
            className="h-64 w-full"
            resizeMode="cover"
          />
        )}

        <View className="p-4">
          <Text className="text-xl font-bold text-text">{item.title}</Text>

          <View className="mt-2 self-start rounded-full bg-primary/10 px-3 py-1">
            <Text className="text-sm text-primary">{item.category}</Text>
          </View>

          {item.address && (
            <View className="mt-3 flex-row items-center gap-1">
              <Ionicons name="location-outline" size={16} color="#6B7280" />
              <Text className="text-sm text-text-secondary">{item.address}</Text>
            </View>
          )}

          {item.description && (
            <Text className="mt-4 text-base leading-6 text-text">
              {item.description}
            </Text>
          )}
        </View>
      </ScrollView>
    </>
  );
}
