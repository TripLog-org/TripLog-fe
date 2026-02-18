import {
  FlatList,
  View,
  Text,
  Image,
  Pressable,
  ScrollView,
  useWindowDimensions,
} from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { useRecommendations } from '@/features/recommend/useRecommendations';
import { useToggleBookmark } from '@/features/recommend/useBookmarks';
import { Recommendation } from '@/entities/recommendation';
import { LoadingSpinner } from '@/shared/components/LoadingSpinner';
import { Ionicons } from '@expo/vector-icons';

const CATEGORIES = [
  '관광지',
  '문화시설',
  '축제공연행사',
  '숙박',
  '레포츠',
  '쇼핑',
  '음식점',
  '여행코스',
];

const SORT_OPTIONS = ['제목순', '수정일순', '생성일순'] as const;
type SortOption = (typeof SORT_OPTIONS)[number];

const CARD_GAP = 12;
const HORIZONTAL_PADDING = 20;

export default function RecommendScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const [selectedCategory, setSelectedCategory] = useState('관광지');
  const [sortBy, setSortBy] = useState<SortOption>('제목순');
  const [showSortMenu, setShowSortMenu] = useState(false);

  const params = { category: selectedCategory };
  const { data, isLoading, fetchNextPage, hasNextPage } = useRecommendations(params);
  const toggleBookmark = useToggleBookmark();

  const items = data?.pages.flatMap((page) => page.data) ?? [];
  const cardWidth = (width - HORIZONTAL_PADDING * 2 - CARD_GAP) / 2;

  const renderItem = ({ item, index }: { item: Recommendation; index: number }) => (
    <Pressable
      onPress={() => router.push(`/recommend/${item._id}`)}
      style={{
        width: cardWidth,
        marginLeft: index % 2 === 0 ? 0 : CARD_GAP,
      }}
      className="mb-3 overflow-hidden rounded-xl bg-white shadow-sm"
    >
      {item.imageUrl ? (
        <Image
          source={{ uri: item.imageUrl }}
          style={{ width: cardWidth, height: cardWidth }}
          resizeMode="cover"
        />
      ) : (
        <View
          style={{ width: cardWidth, height: cardWidth }}
          className="items-center justify-center bg-gray-100"
        >
          <Ionicons name="image-outline" size={32} color="#D1D5DB" />
        </View>
      )}
      <View className="p-2.5">
        <Text className="text-sm font-semibold text-text" numberOfLines={1}>
          {item.title}
        </Text>
        {item.address && (
          <View className="mt-1 flex-row items-center">
            <Ionicons name="location-sharp" size={12} color="#EF4444" />
            <Text className="ml-0.5 flex-1 text-xs text-text-secondary" numberOfLines={1}>
              {item.address}
            </Text>
          </View>
        )}
      </View>
    </Pressable>
  );

  const ListHeader = () => (
    <View>
      {/* ── 지역 선택 + 정렬 ── */}
      <View className="flex-row items-center justify-between pb-3">
        <Pressable className="flex-row items-center rounded-full border border-border bg-white px-3 py-1.5">
          <Ionicons name="location" size={14} color="#4A90D9" />
          <Text className="ml-1 text-sm text-text">지역 선택</Text>
        </Pressable>

        <Pressable
          onPress={() => setShowSortMenu(!showSortMenu)}
          className="flex-row items-center gap-1"
        >
          <Ionicons name="filter-outline" size={16} color="#6B7280" />
          <Text className="text-sm text-text-secondary">{sortBy}</Text>
        </Pressable>
      </View>

      {/* 정렬 옵션 드롭다운 */}
      {showSortMenu && (
        <View className="absolute right-2 top-10 z-10 rounded-lg bg-white shadow-md">
          {SORT_OPTIONS.map((option) => (
            <Pressable
              key={option}
              onPress={() => {
                setSortBy(option);
                setShowSortMenu(false);
              }}
              className="border-b border-border px-4 py-2.5 last:border-b-0"
            >
              <Text
                className={`text-sm ${
                  sortBy === option ? 'font-semibold text-primary' : 'text-text'
                }`}
              >
                {option}
              </Text>
            </Pressable>
          ))}
        </View>
      )}

      {/* ── 카테고리 필터 ── */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 0, paddingBottom: 12, gap: 8 }}
      >
        <Pressable
          key={'bookmark'}
          onPress={() => setSelectedCategory('bookmark')}
          className={`rounded-full border px-3.5 py-1.5 ${
            selectedCategory === 'bookmark'
              ? 'border-primary bg-primary'
              : 'border-border bg-white'
          }`}
        >
          <Text
            className={`text-sm font-medium ${
              selectedCategory === 'bookmark' ? 'text-white' : 'text-text-secondary'
            }`}
          >
            <Ionicons name="bookmark-outline" size={16} color={selectedCategory === 'bookmark' ? 'text-white' : 'text-text-secondary'} />
          </Text>
        </Pressable>
        {CATEGORIES.map((cat) => (
          <Pressable
            key={cat}
            onPress={() => setSelectedCategory(cat)}
            className={`rounded-full border px-3.5 py-1.5 ${
              selectedCategory === cat
                ? 'border-primary bg-primary'
                : 'border-border bg-white'
            }`}
          >
            <Text
              className={`text-sm font-medium ${
                selectedCategory === cat ? 'text-white' : 'text-text-secondary'
              }`}
            >
              {cat}
            </Text>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );

  if (isLoading) return <LoadingSpinner />;

  return (
    <View className="flex-1 bg-surface">
      <FlatList
        data={items}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
        numColumns={2}
        ListHeaderComponent={ListHeader}
        onEndReached={() => hasNextPage && fetchNextPage()}
        onEndReachedThreshold={0.5}
        contentContainerStyle={{
          paddingHorizontal: HORIZONTAL_PADDING,
          paddingBottom: 20,
          paddingTop: 12,
        }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View className="items-center justify-center py-48">
            <Ionicons name="compass-outline" size={64} color="#D1D5DB" />
            <Text className="mt-4 text-base text-text-tertiary">추천 여행이 없어요.</Text>
          </View>
        }
      />
    </View>
  );
}
