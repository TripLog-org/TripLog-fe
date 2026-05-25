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
import { normalizeRemoteImageUri } from '@/shared/utils/imageUrl';

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
const REGIONS = [
  '서울',
  '인천',
  '대전',
  '대구',
  '광주',
  '부산',
  '울산',
  '세종',
  '경기',
  '강원',
  '충북',
  '충남',
  '전북',
  '전남',
  '경북',
  '경남',
  '제주',
] as const;
type RegionOption = (typeof REGIONS)[number];

const CARD_GAP = 12;
const HORIZONTAL_PADDING = 20;

export default function RecommendScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const [selectedCategory, setSelectedCategory] = useState('관광지');
  const [selectedRegion, setSelectedRegion] = useState<RegionOption>('서울');
  const [showRegionMenu, setShowRegionMenu] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>('제목순');
  const [showSortMenu, setShowSortMenu] = useState(false);

  const params = {
    category: selectedCategory,
    ...selectedRegion ? { region: selectedRegion } : {},
    usePublicApi: true,
  };
  const { data, isLoading, fetchNextPage, hasNextPage } = useRecommendations(params);
  const toggleBookmark = useToggleBookmark();

  const items = data?.pages.flatMap((page) => page.data) ?? [];
  const cardWidth = (width - HORIZONTAL_PADDING * 2 - CARD_GAP) / 2;

  const renderItem = ({ item, index }: { item: Recommendation; index: number }) => {
    const coverUri = normalizeRemoteImageUri(item.coverImage);

    return (
    <Pressable
      onPress={() => router.push(`/recommend/${item.id}`)}
      style={{
        width: cardWidth,
        marginLeft: index % 2 === 0 ? 0 : CARD_GAP,
      }}
      className="mb-3 overflow-hidden rounded-xl bg-white shadow-sm"
    >
      {coverUri ? (
        <Image
          source={{ uri: coverUri }}
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
  };

  const closeMenus = () => {
    setShowRegionMenu(false);
    setShowSortMenu(false);
  };

  const isMenuOpen = showRegionMenu || showSortMenu;

  if (isLoading) return <LoadingSpinner />;

  return (
    <View className="flex-1 bg-surface">
      {/* 필터·드롭다운: FlatList 밖 고정 (헤더 안 absolute는 리스트에 가려짐) */}
      <View
        style={{ zIndex: 20, elevation: 20, overflow: 'visible' }}
        className="relative px-5 pt-3"
      >
        <View className="flex-row items-center justify-between pb-3">
          <Pressable
            onPress={() => {
              setShowRegionMenu((prev) => !prev);
              setShowSortMenu(false);
            }}
            className="flex-row items-center rounded-full border border-border bg-white px-3 py-1.5"
          >
            <Ionicons name="location" size={14} color="#4A90D9" />
            <Text className="ml-1 text-sm text-text">
              {selectedRegion ? selectedRegion : '지역 선택'}
            </Text>
          </Pressable>

          <Pressable
            onPress={() => {
              setShowSortMenu((prev) => !prev);
              setShowRegionMenu(false);
            }}
            className="flex-row items-center gap-1"
          >
            <Ionicons name="filter-outline" size={16} color="#6B7280" />
            <Text className="text-sm text-text-secondary">{sortBy}</Text>
          </Pressable>
        </View>

        {showRegionMenu && (
          <View
            style={{ elevation: 24, zIndex: 24 }}
            className="absolute left-5 top-12 max-h-[268px] w-40 rounded-lg border border-border bg-white shadow-md"
          >
            <ScrollView showsVerticalScrollIndicator>
              {REGIONS.map((region) => (
                <Pressable
                  key={region}
                  onPress={() => {
                    setSelectedRegion(region);
                    setShowRegionMenu(false);
                  }}
                  className="border-b border-border px-3 py-2.5 last:border-b-0"
                >
                  <Text
                    className={`text-sm ${
                      selectedRegion === region ? 'font-semibold text-primary' : 'text-text'
                    }`}
                  >
                    {region}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>
        )}

        {showSortMenu && (
          <View
            style={{ elevation: 24, zIndex: 24 }}
            className="absolute right-5 top-10 rounded-lg border border-border bg-white shadow-md"
          >
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

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 12, gap: 8 }}
        >
          <Pressable
            onPress={() => {
              closeMenus();
              setSelectedCategory('bookmark');
            }}
            className={`rounded-full border px-3.5 py-1.5 ${
              selectedCategory === 'bookmark'
                ? 'border-primary bg-primary'
                : 'border-border bg-white'
            }`}
          >
            <Ionicons
              name="bookmark-outline"
              size={16}
              color={selectedCategory === 'bookmark' ? '#FFFFFF' : '#6B7280'}
            />
          </Pressable>
          {CATEGORIES.map((cat) => (
            <Pressable
              key={cat}
              onPress={() => {
                closeMenus();
                setSelectedCategory(cat);
              }}
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

      <View className="relative flex-1">
        {isMenuOpen && (
          <Pressable
            onPress={closeMenus}
            className="absolute inset-0 z-10 bg-black/20"
          />
        )}

        <FlatList
          data={items}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          numColumns={2}
          onEndReached={() => hasNextPage && fetchNextPage()}
          onEndReachedThreshold={0.5}
          contentContainerStyle={{
            paddingHorizontal: HORIZONTAL_PADDING,
            paddingBottom: 20,
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
    </View>
  );
}
