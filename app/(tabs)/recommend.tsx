import { FlatList, View, Text, Image, Pressable, TextInput } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { useRecommendations } from '@/features/recommend/useRecommendations';
import { useToggleBookmark } from '@/features/recommend/useBookmarks';
import { Recommendation } from '@/entities/recommendation';
import { LoadingSpinner } from '@/shared/components/LoadingSpinner';
import { Ionicons } from '@expo/vector-icons';

const CATEGORIES = ['전체', '관광지', '문화시설', '축제공연행사', '여행코스', '레포츠', '숙박', '쇼핑', '산', '바다', '도시'];

export default function RecommendScreen() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<string>('전체');
  const [searchText, setSearchText] = useState('');

  const params = selectedCategory === '전체' ? {} : { category: selectedCategory };
  const { data, isLoading, fetchNextPage, hasNextPage } = useRecommendations(params);
  const toggleBookmark = useToggleBookmark();

  const items = data?.pages.flatMap((page) => page.data) ?? [];

  const renderItem = ({ item }: { item: Recommendation }) => (
    <Pressable
      onPress={() => router.push(`/recommend/${item._id}`)}
      className="mb-3 mx-4 overflow-hidden rounded-xl bg-white shadow-sm"
    >
      {item.imageUrl && (
        <Image
          source={{ uri: item.imageUrl }}
          className="h-40 w-full"
          resizeMode="cover"
        />
      )}
      <View className="p-3">
        <View className="flex-row items-center justify-between">
          <Text className="flex-1 text-base font-semibold text-text" numberOfLines={1}>
            {item.title}
          </Text>
          <Pressable
            onPress={() => toggleBookmark.mutate(item._id)}
            className="ml-2 p-1"
          >
            <Ionicons
              name={item.isBookmarked ? 'bookmark' : 'bookmark-outline'}
              size={20}
              color={item.isBookmarked ? '#4A90D9' : '#9CA3AF'}
            />
          </Pressable>
        </View>
        {item.address && (
          <Text className="mt-1 text-sm text-text-secondary" numberOfLines={1}>
            {item.address}
          </Text>
        )}
        <View className="mt-1 self-start rounded-full bg-primary/10 px-2 py-0.5">
          <Text className="text-xs text-primary">{item.category}</Text>
        </View>
      </View>
    </Pressable>
  );

  if (isLoading) return <LoadingSpinner />;

  return (
    <View className="flex-1 bg-surface">
      {/* 검색 바 */}
      <View className="bg-white px-4 pb-2 pt-2">
        <View className="flex-row items-center rounded-lg bg-surface px-3 py-2">
          <Ionicons name="search" size={18} color="#9CA3AF" />
          <TextInput
            placeholder="관광지 검색..."
            value={searchText}
            onChangeText={setSearchText}
            className="ml-2 flex-1 text-sm text-text"
            placeholderTextColor="#9CA3AF"
          />
        </View>
      </View>

      {/* 카테고리 필터 */}
      <FlatList
        data={CATEGORIES}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 8 }}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => setSelectedCategory(item)}
            className={`mr-2 rounded-full px-4 py-1.5 ${
              selectedCategory === item ? 'bg-primary' : 'bg-white'
            }`}
          >
            <Text
              className={`text-sm font-medium ${
                selectedCategory === item ? 'text-white' : 'text-text-secondary'
              }`}
            >
              {item}
            </Text>
          </Pressable>
        )}
      />

      {/* 추천 목록 */}
      <FlatList
        data={items}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
        onEndReached={() => hasNextPage && fetchNextPage()}
        onEndReachedThreshold={0.5}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
}
