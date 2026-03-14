import { useEffect, useMemo } from 'react';
import {
  View,
  Text,
  Pressable,
  Image,
  ScrollView,
  useWindowDimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '@/features/auth/useAuthStore';
import { useMyPosts } from '@/features/posts/usePosts';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRefreshOnFocus } from '@/shared/hooks/useRefreshOnFocus';

const GRID_GAP = 0;
const COLUMNS = 3;

export default function MyPageScreen() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const { data, refetch } = useMyPosts();
  const { width } = useWindowDimensions();

  useRefreshOnFocus(refetch);

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/(auth)/login');
    }
  }, [isAuthenticated, router]);

  const imageSize = (width - GRID_GAP * (COLUMNS - 1)) / COLUMNS;

  const posts = data?.pages.flatMap((page) => page.data) ?? [];

  const totalLikes = useMemo(
    () => posts.reduce((sum, post) => sum + post.likeCount, 0),
    [posts],
  );

  return (
    <ScrollView className="flex-1 bg-white">
      {/* ── 프로필 헤더 ── */}
      <View className="flex-row items-center justify-between px-5 pb-4 pt-4">
        <View className="flex-row items-center rounded-full border border-border px-3 py-1.5">
          {user?.profileImage ? (
            <Image
              source={{ uri: user.profileImage }}
              style={{ width: 18, height: 18 }}
              className="rounded-full"
            />
          ) : (
            <Ionicons name="person-circle-outline" size={18} color="#1A1A1A" />
          )}
          <Text className="ml-1.5 text-sm font-semibold text-text">
            {user?.nickname ?? '사용자'} 님
          </Text>
        </View>

        <Pressable
          onPress={() => router.push('/mypage/settings')}
          className="flex-row items-center gap-1"
        >
          <Ionicons name="settings-outline" size={18} color="#6B7280" />
          <Text className="text-sm text-text-secondary">설정</Text>
        </Pressable>
      </View>

      {/* ── 통계 + 여행 지도 보기 ── */}
      <View className="flex-row items-center px-5 pb-4">
        <View className="flex-row items-center gap-4">
          <View className="flex-row items-center gap-1">
            <Text className="text-sm text-text-secondary">게시물</Text>
            <Text className="text-sm font-bold text-text">{posts.length}</Text>
          </View>
          <View className="flex-row items-center gap-1">
            <Text className="text-sm text-text-secondary">좋아요</Text>
            <Text className="text-sm font-bold text-text">{totalLikes}</Text>
          </View>
        </View>

        <View className="flex-1" />

        <Pressable
          onPress={() => router.push('/mypage/myMap')}
          className="rounded-full border border-primary px-4 py-1.5"
        >
          <Text className="text-sm font-semibold text-primary">여행 지도 보기</Text>
        </Pressable>
      </View>

      {/* ── 사진 그리드 / 빈 상태 ── */}
      {posts.length > 0 ? (
        <View
          className="flex-row flex-wrap"
          style={{ gap: GRID_GAP }}
        >
          {posts.map((post, index) => (
            <Pressable
              key={`${post._id}-${index}`}
              onPress={() => router.push(`/post/${post._id}`)}
              style={{ width: imageSize, height: imageSize }}
            >
              {post.images.length > 0 ? (
                <Image
                  source={{ uri: post.images[0].url }}
                  style={{ width: imageSize, height: imageSize }}
                    resizeMode="cover"
                  />
                ) : (
                  <View
                    style={{ width: imageSize, height: imageSize }}
                    className="items-center justify-center bg-surface"
                  >
                    <Ionicons name="image-outline" size={32} color="#9CA3AF" />
                  </View>
                )}

                {post.images && post.images.length > 1 && (
                  <View className="absolute right-1.5 top-1.5">
                    <MaterialCommunityIcons name="image-multiple" size={20} color="white" />
                  </View>
                )}
              </Pressable>
          ))}
        </View>
      ) : (
        <View className="flex-1 items-center justify-center py-48">
          <Ionicons name="images-outline" size={64} color="#D1D5DB" />
          <Text className="mt-4 text-base text-text-tertiary">게시물이 없어요.</Text>
        </View>
      )}
    </ScrollView>
  );
}
