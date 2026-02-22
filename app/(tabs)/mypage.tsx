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
import { usePosts } from '@/features/posts/usePosts';
import { appConfig } from '@/shared/config';
import { Ionicons } from '@expo/vector-icons';

const GRID_GAP = 2;
const COLUMNS = 3;

export default function MyPageScreen() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const { data } = usePosts();
  const { width } = useWindowDimensions();

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

  const allImages = useMemo(
    () =>
      posts.flatMap((post) =>
        post.images.map((img) => ({
          postId: post._id,
          uri: img.url.startsWith('http')
            ? img.url
            : `${appConfig.apiBaseUrl}${img.url}`,
        })),
      ),
    [posts],
  );

  return (
    <ScrollView className="flex-1 bg-white">
      {/* ── 프로필 헤더 ── */}
      <View className="flex-row items-center justify-between px-5 pb-4 pt-4">
        <View className="flex-row items-center rounded-full border border-border px-3 py-1.5">
          <Ionicons name="person-circle-outline" size={18} color="#1A1A1A" />
          <Text className="ml-1.5 text-sm font-semibold text-text">
            {user?.name ?? '사용자'} 님
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
      {allImages.length > 0 ? (
        <View
          className="flex-row flex-wrap"
          style={{ gap: GRID_GAP }}
        >
          {allImages.map((img, index) => (
            <Pressable
              key={`${img.postId}-${index}`}
              onPress={() => router.push(`/post/${img.postId}`)}
            >
              <Image
                source={{ uri: img.uri }}
                style={{ width: imageSize, height: imageSize }}
                resizeMode="cover"
              />
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
