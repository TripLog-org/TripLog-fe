import { View, Text, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
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
  const { data, isLoading } = usePosts();

  const posts = data?.pages.flatMap((page) => page.data) ?? [];

  // 위치 정보가 있는 게시물만 마커로 표시
  const markers = posts.filter((post) => {
    const coords = post.images?.[0]?.location?.coordinates;
    return coords?.latitude && coords?.longitude;
  });

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

      {/* 게시물 작성 FAB */}
      <Pressable
        onPress={() => router.push('/post/create')}
        className="absolute bottom-6 right-6 h-14 w-14 items-center justify-center rounded-full bg-primary shadow-lg"
      >
        <Ionicons name="add" size={28} color="#FFFFFF" />
      </Pressable>
    </View>
  );
}
