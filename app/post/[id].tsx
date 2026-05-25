import { View, Text, ScrollView, Image, Pressable, Alert, FlatList, TextInput, useWindowDimensions, NativeSyntheticEvent, NativeScrollEvent } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { usePostDetail } from '@/features/posts/usePostDetail';
import { useTogglePostLike, useDeletePost } from '@/features/posts/usePosts';
import { useComments, useCreateComment } from '@/features/comments/useComments';
import { LoadingSpinner } from '@/shared/components/LoadingSpinner';
import { timeAgo } from '@/shared/utils/formatDate';
import { useAuthStore } from '@/features/auth/useAuthStore';
import { Ionicons } from '@expo/vector-icons';
import { useState, useCallback } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useToggleBookmark } from '@/features/recommend/useBookmarks';
import { useRefreshOnFocus } from '@/shared/hooks/useRefreshOnFocus';

export default function PostDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const { data: post, isLoading, refetch } = usePostDetail(id);
  const toggleLike = useTogglePostLike();
  const deletePost = useDeletePost();
  const toggleBookmark = useToggleBookmark();
  const { data: comments } = useComments(id);
  const createComment = useCreateComment(id);
  const [commentText, setCommentText] = useState('');
  const { width } = useWindowDimensions();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  console.log('post id', id);
  useRefreshOnFocus(refetch);

  const onScroll = useCallback((e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const idx = Math.round(e.nativeEvent.contentOffset.x / width);
    setCurrentImageIndex(idx);
  }, [width]);

  const currentImage = post?.images?.[currentImageIndex];

  const formatCapturedAt = (val?: string) => {
    if (!val) return '';
    const d = new Date(val.replace(/^(\d{4}):(\d{2}):(\d{2})/, '$1-$2-$3'));
    if (isNaN(d.getTime())) return '';
    return d.toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' })
      + ' ' + d.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', hour12: false });
  };

  const getLocationText = (img?: typeof currentImage) => {
    if (!img?.location) return '';
    return img.location.address || img.location.name || '';
  };

  const isAuthor = user && user._id === post?.author?._id;

  const handleBookmark = () => {
    if (!isAuthenticated) {
      Alert.alert('안내', '로그인 후 이용해주세요.', [
        { text: '취소', style: 'cancel' },
        { text: '로그인', onPress: () => router.replace('/(auth)/login') },
      ]);
      return;
    } else {
      toggleBookmark.mutate(id);
    }
  };

  const handleDelete = () => {
    Alert.alert('게시물 삭제', '정말 삭제하시겠습니까?', [
      { text: '취소', style: 'cancel' },
      {
        text: '삭제',
        style: 'destructive',
        onPress: () => {
          deletePost.mutate(id, { onSuccess: () => router.back() });
        },
      },
    ]);
  };

  const handleReport = () => {
    if (!isAuthenticated) {
      Alert.alert('안내', '로그인 후 이용해주세요.', [
        { text: '취소', style: 'cancel' },
        { text: '로그인', onPress: () => router.replace('/(auth)/login') },
      ]);
      return;
    } else {
      Alert.alert('신고', '이 게시물을 신고하시겠습니까?', [
        { text: '취소', style: 'cancel' },
        { text: '신고', onPress: () => Alert.alert('완료', '신고가 접수되었습니다.') },
      ]);
    }
  };

  const handleSubmitComment = () => {
    if (!isAuthenticated) {
      Alert.alert('안내', '로그인 후 이용해주세요.', [
        { text: '취소', style: 'cancel' },
        { text: '로그인', onPress: () => router.replace('/(auth)/login') },
      ]);
      return;
    } else {
      if (!commentText.trim()) return;
      createComment.mutate(commentText.trim(), {
        onSuccess: () => setCommentText(''),
      });
    }
  };

  if (isLoading || !post) return <LoadingSpinner />;

  return (
    <>
      <Stack.Screen
        options={{
          title: '',
          headerLeft: () => (
            <Pressable onPress={() => router.back()} hitSlop={8}>
              <Ionicons name="chevron-back" size={24} color="#1A1A1A" />
            </Pressable>
          ),
          headerRight: () =>
            isAuthor ? (
              <View className="flex-row gap-4">
                <Pressable onPress={handleBookmark}>
                  <Ionicons
                    name={post.isBookmarked ? 'bookmark' : 'bookmark-outline'}
                    size={22}
                    color={post.isBookmarked ? '#4A90D9' : '#1A1A1A'}
                  />
                </Pressable>
                <Pressable onPress={() => router.push(`/post/edit/${id}`)}>
                  <Ionicons name="create-outline" size={22} color="#1A1A1A" />
                </Pressable>
                <Pressable onPress={handleDelete}>
                  <Ionicons name="trash-outline" size={22} color="#EF4444" />
                </Pressable>
              </View>
            ) : (
              <View className="flex-row gap-4">
                <Pressable onPress={handleBookmark}>
                  <Ionicons
                    name={post.isBookmarked ? 'bookmark' : 'bookmark-outline'}
                    size={22}
                    color={post.isBookmarked ? '#4A90D9' : '#1A1A1A'}
                  />
                </Pressable>
                <Pressable onPress={handleReport}>
                  <Ionicons name="flag-outline" size={22} color="#1A1A1A" />
                </Pressable>
              </View>
            ),
        }}
      />

      <SafeAreaView className="flex-1 bg-white" edges={['bottom']}>
        <ScrollView className="flex-1">
          {/* 이미지 슬라이더 */}
          {post.images.length > 0 && (
            <View>
              <FlatList
                data={post.images}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onScroll={onScroll}
                scrollEventThrottle={16}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => (
                  <Image
                    source={{ uri: item.url }}
                    style={{ width, height: width }}
                    resizeMode="cover"
                  />
                )}
              />

              {/* 위치 + 날짜 오버레이 */}
              {(getLocationText(currentImage) || formatCapturedAt(currentImage?.capturedAt)) && (
                <View className="flex-row items-center justify-between bg-gray-100 px-4 py-2.5">
                  {getLocationText(currentImage) ? (
                    <View className="flex-1 flex-row items-center gap-1.5">
                      <Ionicons name="location-sharp" size={14} color="#555" />
                      <Text className="text-xs text-text-secondary" numberOfLines={1}>
                        {getLocationText(currentImage)}
                      </Text>
                    </View>
                  ) : <View className="flex-1" />}
                  {formatCapturedAt(currentImage?.capturedAt) ? (
                    <Text className="text-xs text-text-tertiary ml-3">
                      {formatCapturedAt(currentImage?.capturedAt)}
                    </Text>
                  ) : null}
                </View>
              )}

              {/* 페이지 인디케이터 */}
              {post.images.length > 1 && (
                <View className="flex-row items-center justify-center gap-1.5 py-3">
                  {post.images.map((_, i) => (
                    <View
                      key={i}
                      className={`h-1.5 rounded-full ${
                        i === currentImageIndex ? 'w-4 bg-primary' : 'w-1.5 bg-gray-300'
                      }`}
                    />
                  ))}
                </View>
              )}
            </View>
          )}

          {/* 본문 */}
          <View className="p-4">
            <View className="flex-row items-center gap-2">
              {post.author?.profileImage ? (
                <Image
                  source={{ uri: post.author.profileImage }}
                  style={{ width: 24, height: 24 }}
                  className="rounded-full"
                />
              ) : (
                <View className="h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                  <Ionicons name="person" size={16} color="#4A90D9" />
                </View>
              )}
              <Text className="text-sm font-semibold text-text">{post.author?.nickname || 'Unknown User'}</Text>
              <Text className="text-xs text-text-tertiary">{timeAgo(post.createdAt)}</Text>
            </View>

            <Text className="mt-3 text-base leading-6 text-text">{post.content}</Text>

            {/* 해시태그 */}
            {post.tags.length > 0 && (
              <View className="mt-3 flex-row flex-wrap gap-1">
                {post.tags.map((tag) => (
                  <View key={tag} className="rounded-full bg-primary/10 px-2.5 py-1">
                    <Text className="text-xs text-primary">#{tag}</Text>
                  </View>
                ))}
              </View>
            )}

            {/* 조회수 / 좋아요 / 댓글 */}
            <View className="mt-4 flex-row items-center gap-4 border-t border-border pt-3">
              <View className="flex-row items-center gap-1">
                <Ionicons name="eye-outline" size={20} color="#9CA3AF" />
                <Text className="text-sm text-text-secondary">{post.viewCount}</Text>
              </View>

              <Pressable
                onPress={() => toggleLike.mutate(id)}
                className="flex-row items-center gap-1"
              >
                <Ionicons
                  name={post.isLiked ? 'heart' : 'heart-outline'}
                  size={22}
                  color={post.isLiked ? '#EF4444' : '#9CA3AF'}
                />
                <Text className="text-sm text-text-secondary">{post.likeCount}</Text>
              </Pressable>

              <View className="flex-row items-center gap-1">
                <Ionicons name="chatbubble-outline" size={20} color="#9CA3AF" />
                <Text className="text-sm text-text-secondary">{post.commentCount}</Text>
              </View>
            </View>
          </View>

          {/* 댓글 목록 */}
          <View className="border-t border-border px-4 py-3">
            <Text className="mb-3 text-sm font-semibold text-text">
              댓글 {comments?.length ?? 0}
            </Text>
            {comments?.map((comment) => (
              <View key={comment._id} className="mb-3 flex-row gap-2">
                <View className="h-7 w-7 items-center justify-center rounded-full bg-surface">
                  <Ionicons name="person" size={14} color="#9CA3AF" />
                </View>
                <View className="flex-1">
                  <View className="flex-row items-center gap-2">
                    <Text className="text-xs font-semibold text-text">
                      {comment.author?.nickname || 'Unknown User'}
                    </Text>
                    <Text className="text-xs text-text-tertiary">
                      {timeAgo(comment.createdAt)}
                    </Text>
                  </View>
                  <Text className="mt-0.5 text-sm text-text">{comment.content}</Text>
                </View>
              </View>
            ))}
          </View>
        </ScrollView>

        {/* 댓글 입력 */}
        <View className="flex-row items-center gap-2 border-t border-border bg-white px-4 py-3">
          <TextInput
            value={commentText}
            onChangeText={setCommentText}
            placeholder="댓글을 입력하세요..."
            className="flex-1 rounded-full bg-surface px-4 py-2 text-sm text-text"
            placeholderTextColor="#9CA3AF"
          />
          <Pressable onPress={handleSubmitComment}>
            <Ionicons name="send" size={24} color="#4A90D9" />
          </Pressable>
        </View>
      </SafeAreaView>
    </>
  );
}
