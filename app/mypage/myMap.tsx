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

export default function MyMapScreen() {
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

      {/* 북마크 버튼 */}
      <Pressable
        onPress={() => {}}
        className="absolute right-3 h-16 w-16 items-center justify-center rounded-full bg-white shadow-sm"
        style={{ bottom: insets.bottom + 72 }}
      >
        <Ionicons name="bookmark-outline" size={20} color="#555555" />
      </Pressable>
    </View>
  );
}
