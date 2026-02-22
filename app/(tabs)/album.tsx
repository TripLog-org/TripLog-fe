import { useMemo, useState } from 'react';
import {
  FlatList,
  Image,
  Pressable,
  Dimensions,
  View,
  Text,
  TextInput,
} from 'react-native';
import { useRouter } from 'expo-router';
import { usePosts } from '@/features/posts/usePosts';
import { LoadingSpinner } from '@/shared/components/LoadingSpinner';
import { Post } from '@/entities/post';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

const NUM_COLUMNS = 3;
const SCREEN_WIDTH = Dimensions.get('window').width;
const ITEM_SIZE = SCREEN_WIDTH / NUM_COLUMNS;

export default function AlbumScreen() {
  const router = useRouter();
  const { data, isLoading, fetchNextPage, hasNextPage } = usePosts();
  const [searchText, setSearchText] = useState('');

  const posts = data?.pages.flatMap((page) => page.data) ?? [];
  const filteredPosts = useMemo(() => {
    const query = searchText.trim().toLowerCase();
    if (!query) return posts;

    return posts.filter((post) => {
      const contentMatched = post.content?.toLowerCase().includes(query);
      const tagsMatched = post.tags?.some((tag) => tag.toLowerCase().includes(query));
      return contentMatched || tagsMatched;
    });
  }, [posts, searchText]);

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
    <SafeAreaView className="flex-1 bg-white">
      {/* 상단 헤더: 검색 + 북마크 */}
      <View className="px-3 pb-2 pt-2">
        <View className="flex-row items-center gap-2">
          <View className="flex-1 flex-row items-center rounded-full border border-primary/60 bg-white px-3 py-2">
            <Ionicons name="search" size={16} color="#8FC8F1" />
            <TextInput
              value={searchText}
              onChangeText={setSearchText}
              placeholder="해시태그 검색"
              placeholderTextColor="#9CA3AF"
              className="ml-2 flex-1 text-sm text-text"
              returnKeyType="search"
            />
          </View>

          <Pressable
            onPress={() => {}}
            className="h-9 w-9 items-center justify-center rounded-full border border-border bg-white"
          >
            <Ionicons name="bookmark-outline" size={16} color="#9CA3AF" />
          </Pressable>
        </View>
      </View>

      {filteredPosts.length > 0 ? (
        <FlatList
          data={filteredPosts}
          renderItem={renderItem}
          keyExtractor={(item) => item._id}
          numColumns={NUM_COLUMNS}
          onEndReached={() => hasNextPage && fetchNextPage()}
          onEndReachedThreshold={0.5}
        />
      ) : (
        <View className="flex-1 items-center justify-center">
          <Ionicons name="images-outline" size={64} color="#D1D5DB" />
          <Text className="mt-4 text-base text-text-tertiary">
            {searchText ? '검색 결과가 없어요.' : '게시물이 없어요.'}
          </Text>
        </View>
      )}

      {/* 게시물 작성 FAB */}
      <Pressable
        onPress={() => router.push('/post/create')}
        className="absolute bottom-6 right-6 h-14 w-14 items-center justify-center rounded-full bg-primary shadow-lg"
      >
        <Ionicons name="add" size={28} color="#FFFFFF" />
      </Pressable>
    </SafeAreaView>
  );
}
