import { FlatList, Image, Pressable, Dimensions, View, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { usePosts } from '@/features/posts/usePosts';
import { LoadingSpinner } from '@/shared/components/LoadingSpinner';
import { Post } from '@/entities/post';
import { Ionicons } from '@expo/vector-icons';

const NUM_COLUMNS = 3;
const SCREEN_WIDTH = Dimensions.get('window').width;
const ITEM_SIZE = SCREEN_WIDTH / NUM_COLUMNS;

export default function AlbumScreen() {
  const router = useRouter();
  const { data, isLoading, fetchNextPage, hasNextPage } = usePosts();

  const posts = data?.pages.flatMap((page) => page.data) ?? [];

  console.log('posts', posts);

  const renderItem = ({ item }: { item: Post }) => {
    const thumbnail = item.images?.[0]?.thumbnail || item.images?.[0]?.url;
    return (
      <Pressable
        onPress={() => router.push(`/post/${item._id}`)}
        style={{ width: ITEM_SIZE, height: ITEM_SIZE }}
        className="border-[0.5px] border-white/20"
      >
        {thumbnail ? (
          <Image
            source={{ uri: thumbnail }}
            style={{ width: ITEM_SIZE, height: ITEM_SIZE }}
            resizeMode="cover"
          />
        ) : (
          <View
            style={{ width: ITEM_SIZE, height: ITEM_SIZE }}
            className="items-center justify-center bg-surface"
          >
            <Ionicons name="image-outline" size={32} color="#9CA3AF" />
          </View>
        )}
      </Pressable>
    );
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <View className="flex-1 bg-white">
      {posts.length > 0 ? (
        <FlatList
          data={posts}
          renderItem={renderItem}
          keyExtractor={(item) => item._id}
          numColumns={NUM_COLUMNS}
          onEndReached={() => hasNextPage && fetchNextPage()}
          onEndReachedThreshold={0.5}
        />
      ) : (
        <View className="flex-1 items-center justify-center">
          <Ionicons name="images-outline" size={64} color="#D1D5DB" />
          <Text className="mt-4 text-base text-text-tertiary">게시물이 없어요.</Text>
        </View>
      )}

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
