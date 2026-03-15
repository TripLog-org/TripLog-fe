import { useState, useCallback, useRef, useEffect } from 'react';
import { View, Text, TextInput, Pressable, Image, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MapView, { Marker, PROVIDER_GOOGLE, Region } from 'react-native-maps';
import { useMapPosts } from '@/features/posts/usePosts';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';

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

  useEffect(() => {
    Location.requestForegroundPermissionsAsync();
  }, []);

  const mapParams = {
    latitude: region.latitude,
    longitude: region.longitude,
    zoomLevel: deltaToZoom(region.latitudeDelta),
    ...(searchText.trim() ? { tag: searchText.trim() } : {}),
  };

  const { data } = useMapPosts(mapParams);
  const markers = data?.data ?? [];

  console.log('markers', markers);

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
        mapPadding={Platform.OS === 'android' ? { top: insets.top + 40, bottom: insets.bottom + 0, left: 0, right: 0 } : { top: 0, bottom: 0, left: 0, right: 0 }}
      >
        {markers.map((item, index) => (
          <Marker
            key={`${item.postId}-${index}`}
            coordinate={{
              latitude: item.photo.location.coordinates.latitude,
              longitude: item.photo.location.coordinates.longitude,
            }}
            anchor={{ x: 0.5, y: 0.5 }}
            onPress={() => router.push(`/post/${item.postId}`)}
          >
            <Image
              source={{ uri: item.photo.thumbnail }}
              style={{
                width: MARKER_SIZE,
                height: MARKER_SIZE,
                borderRadius: MARKER_SIZE / 2,
                borderWidth: 2,
                borderColor: '#fff',
              }}
              resizeMode="cover"
              fadeDuration={0}
            />
          </Marker>
        ))}
      </MapView>

      {/* 오버레이 컨테이너 - box-none으로 빈 영역은 지도로 터치 전달 */}
      <View
        pointerEvents="box-none"
        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, elevation: 5 }}
      >
        {/* 검색 바 + 여행 추가 버튼 */}
        <View
          className="absolute left-0 right-0 flex-row items-center px-3 gap-2"
          style={{ top: insets.top + 4 }}
        >
          <View className={`flex-1 flex-row items-center rounded-full bg-white px-4 shadow-sm ${Platform.OS === 'ios' ? 'py-2.5' : ''}`}>
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
          style={Platform.OS === 'ios' ? { bottom: insets.bottom + 36 } : { bottom: 16 }}
        >
          <Ionicons name="bookmark-outline" size={20} color="#555555" />
        </Pressable>
      </View>
    </View>
  );
}
