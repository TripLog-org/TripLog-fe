import { useState, useCallback, useRef } from 'react';
import { View, Text, TextInput, Pressable, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MapView, { Marker, PROVIDER_GOOGLE, Region } from 'react-native-maps';
import { useMapPosts } from '@/features/posts/usePosts';
import { appConfig } from '@/shared/config';
import { Ionicons } from '@expo/vector-icons';

const INITIAL_REGION: Region = {
  latitude: 37.5665,
  longitude: 126.978,
  latitudeDelta: 5,
  longitudeDelta: 5,
};

const MARKER_SIZE = 48;

function deltaToZoom(latDelta: number): number {
  return Math.round(Math.log2(360 / latDelta));
}

export default function MapScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [searchText, setSearchText] = useState('');
  const [region, setRegion] = useState<Region>(INITIAL_REGION);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(null);

  const mapParams = {
    latitude: region.latitude,
    longitude: region.longitude,
    zoomLevel: deltaToZoom(region.latitudeDelta),
    ...(searchText.trim() ? { tag: searchText.trim() } : {}),
  };

  const { data } = useMapPosts(mapParams);
  const markers = data?.data ?? [];

  const handleRegionChange = useCallback((newRegion: Region) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => setRegion(newRegion), 400);
  }, []);

  return (
    <View className="flex-1">
      <MapView
        provider={PROVIDER_GOOGLE}
        style={{ flex: 1 }}
        initialRegion={INITIAL_REGION}
        onRegionChangeComplete={handleRegionChange}
        showsUserLocation
        showsMyLocationButton
      >
        {markers.map((item, index) => (
          <Marker
            key={`${item.postId}-${index}`}
            coordinate={{
              latitude: item.photo.location.coordinates.latitude,
              longitude: item.photo.location.coordinates.longitude,
            }}
            onPress={() => router.push(`/post/${item.postId}`)}
          >
            <View
              style={{ width: MARKER_SIZE, height: MARKER_SIZE, borderRadius: MARKER_SIZE, overflow: 'hidden', borderWidth: 2, borderColor: '#fff' }}
            >
              <Image
                source={{ uri: item.photo.thumbnail }}
                style={{ width: '100%', height: '100%' }}
                resizeMode="cover"
              />
            </View>
          </Marker>
        ))}
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

      {/* 북마크 버튼 */}
      <Pressable
        onPress={() => {}}
        className="absolute right-3 h-16 w-16 items-center justify-center rounded-full bg-white shadow-sm"
        style={{ bottom: insets.bottom + 36 }}
      >
        <Ionicons name="bookmark-outline" size={20} color="#555555" />
      </Pressable>
    </View>
  );
}
