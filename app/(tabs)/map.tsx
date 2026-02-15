import { useState } from 'react';
import { View, Text, TextInput, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { usePosts } from '@/features/posts/usePosts';
import { LoadingSpinner } from '@/shared/components/LoadingSpinner';
import { Ionicons } from '@expo/vector-icons';

const INITIAL_REGION = {
  latitude: 37.5665,
  longitude: 126.978,
  latitudeDelta: 5,
  longitudeDelta: 5,
};

export default function MapScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { data, isLoading } = usePosts();
  const [searchText, setSearchText] = useState('');

  const posts = data?.pages.flatMap((page) => page.data) ?? [];

  // 위치 정보가 있는 게시물만 마커로 표시
  const markers = posts.filter((post) => {
    const coords = post.images?.[0]?.location?.coordinates;
    return coords?.latitude && coords?.longitude;
  });

  console.log('markers', markers);

  if (isLoading) return <LoadingSpinner />;

  return (
    <View className="flex-1">
      <MapView
        provider={PROVIDER_GOOGLE}
        style={{ flex: 1 }}
        initialRegion={INITIAL_REGION}
        showsUserLocation
        showsMyLocationButton
      >
        {markers.map((post) => {
          const coords = post.images[0].location!.coordinates!;
          return (
            <Marker
              key={post._id}
              coordinate={{
                latitude: coords.latitude,
                longitude: coords.longitude,
              }}
              title={post.content.slice(0, 30)}
              onCalloutPress={() => router.push(`/post/${post._id}`)}
            />
          );
        })}
      </MapView>

      {/* 검색 바 + 여행 추가 버튼 오버레이 */}
      <View
        className="absolute left-0 right-0 flex-row items-center px-3 gap-2"
        style={{ top: insets.top + 4 }}
      >
        {/* 해시태그 검색 */}
        <View className="flex-1 flex-row items-center rounded-full bg-white px-4 py-2.5 shadow-sm">
          <Ionicons name="search" size={18} color="#9CA3AF" />
          <TextInput
            className="ml-2 flex-1 text-sm text-text"
            placeholder="해시태그 검색"
            placeholderTextColor="#9CA3AF"
            value={searchText}
            onChangeText={setSearchText}
            returnKeyType="search"
          />
          {searchText.length > 0 && (
            <Pressable onPress={() => setSearchText('')} hitSlop={8}>
              <Ionicons name="close-circle" size={18} color="#9CA3AF" />
            </Pressable>
          )}
        </View>

        {/* 여행 추가 하기 */}
        <Pressable
          onPress={() => router.push('/post/create')}
          className="flex-row items-center rounded-full bg-primary px-4 py-3 shadow-sm"
        >
          <Text className="text-sm font-semibold text-white">여행 추가 하기</Text>
        </Pressable>
      </View>
    </View>
  );
}
