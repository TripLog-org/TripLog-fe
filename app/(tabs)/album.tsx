import { useMemo, useState } from 'react';
import {
  FlatList,
  Image,
  Pressable,
  Dimensions,
  View,
  Text,
  TextInput,
  Platform,
  Keyboard,
} from 'react-native';
import { useRouter } from 'expo-router';
import { usePosts } from '@/features/posts/usePosts';
import { LoadingSpinner } from '@/shared/components/LoadingSpinner';
import { Post } from '@/entities/post';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRefreshOnFocus } from '@/shared/hooks/useRefreshOnFocus';

const NUM_COLUMNS = 3;
const SCREEN_WIDTH = Dimensions.get('window').width;
const ITEM_SIZE = SCREEN_WIDTH / NUM_COLUMNS;

export default function AlbumScreen() {
  const router = useRouter();
  const { data, isLoading, fetchNextPage, hasNextPage, refetch } = usePosts();
  const [searchText, setSearchText] = useState('');
  const [isBookmarked, setIsBookmarked] = useState(false);

  useRefreshOnFocus(refetch);

  const posts = useMemo(() => data?.pages.flatMap((page) => page.data) ?? [], [data]);
  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const query = searchText.trim().toLowerCase();
      const contentMatched = post.content?.toLowerCase().includes(query);
      const tagsMatched = post.tags?.some((tag) => tag.toLowerCase().includes(query));
      if (isBookmarked && query) {
        return (contentMatched || tagsMatched) && post.isBookmarked;
      } else if (query) {
        return contentMatched || tagsMatched;
      } else if (isBookmarked) {
        return post.isBookmarked;
      }
      return true;
    });
  }, [posts, searchText, isBookmarked]);

  const renderItem = ({ item }: { item: Post }) => {
    const thumbnail = item.images?.[0]?.thumbnail;
    return (
      <Pressable
        onPress={() => router.push(`/post/${item._id}`)}
        style={{ width: ITEM_SIZE, height: ITEM_SIZE }}
        className="border-[0.5px] border-white/20 relative"
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

        {item.images && item.images.length > 1 && (
          <View className="absolute right-1.5 top-1.5">
            <MaterialCommunityIcons name="image-multiple" size={20} color="white" />
          </View>
        )}
      </Pressable>
    );
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      {/* 상단 헤더: 검색 + 북마크 */}
      <View className="px-3 pb-2 pt-2 mb-2">
        <View className="flex-row items-center gap-3">
          <View className={`flex-1 flex-row items-center rounded-full border border-primary/60 bg-white px-3 ${Platform.OS === 'ios' ? 'py-2.5' : ''}`}>
            <Ionicons name="search" size={16} color="#8FC8F1" />
            <TextInput
              value={searchText}
              onChangeText={setSearchText}
              placeholder="해시태그 또는 내용 검색"
              placeholderTextColor="#9CA3AF"
              className="ml-2 flex-1 text-sm text-text"
              returnKeyType="search"
            />
            {searchText.length > 0 && (
              <Pressable onPress={() => setSearchText('')} hitSlop={8}>
                <Ionicons name="close-circle" size={18} color="#9CA3AF" />
              </Pressable>
            )}
          </View>

          <Pressable
            onPress={() => setIsBookmarked(!isBookmarked)}
            className={`h-12 w-12 items-center justify-center rounded-full border ${isBookmarked ? 'border-primary' : 'border-border'} bg-white`}
          >
            <Ionicons name={isBookmarked ? 'bookmark' : 'bookmark-outline'} size={20} color={isBookmarked ? '#4A90D9' : '#9CA3AF'} />
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
        <Pressable className="flex-1 items-center justify-center" onPress={() => Keyboard.dismiss()}>
          <Ionicons name="images-outline" size={64} color="#D1D5DB" />
          <Text className="mt-4 text-base text-text-tertiary">
            {searchText ? '검색 결과가 없어요.' : '게시물이 없어요.'}
          </Text>
        </Pressable>
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
