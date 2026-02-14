import { useEffect, useState } from 'react';
import { View, Text, TextInput, Pressable, ScrollView, Alert } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { usePostDetail } from '@/features/posts/usePostDetail';
import { useUpdatePost } from '@/features/posts/usePosts';
import { LoadingSpinner } from '@/shared/components/LoadingSpinner';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function PostEditScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { data: post, isLoading } = usePostDetail(id);
  const updatePost = useUpdatePost();

  const [content, setContent] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);

  useEffect(() => {
    if (post) {
      setContent(post.content);
      setTags(post.tags);
    }
  }, [post]);

  const addTag = () => {
    const trimmed = tagInput.trim().replace(/^#/, '');
    if (trimmed && !tags.includes(trimmed)) {
      setTags((prev) => [...prev, trimmed]);
    }
    setTagInput('');
  };

  const removeTag = (tag: string) => {
    setTags((prev) => prev.filter((t) => t !== tag));
  };

  const handleSubmit = () => {
    if (!content.trim()) {
      Alert.alert('안내', '내용을 입력해주세요.');
      return;
    }

    updatePost.mutate(
      { postId: id, payload: { content: content.trim(), tags } },
      {
        onSuccess: () => router.back(),
        onError: () => Alert.alert('오류', '수정에 실패했습니다.'),
      },
    );
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <>
      <Stack.Screen
        options={{
          title: '게시물 수정',
          headerRight: () => (
            <Pressable onPress={handleSubmit} disabled={updatePost.isPending}>
              <Text className="text-base font-semibold text-primary">
                {updatePost.isPending ? '저장 중...' : '저장'}
              </Text>
            </Pressable>
          ),
        }}
      />

      <SafeAreaView className="flex-1 bg-white" edges={['bottom']}>
        <ScrollView className="flex-1 p-4">
          <TextInput
            value={content}
            onChangeText={setContent}
            placeholder="여행 이야기를 들려주세요..."
            multiline
            className="min-h-[120px] text-base leading-6 text-text"
            placeholderTextColor="#9CA3AF"
            textAlignVertical="top"
          />

          {/* 해시태그 */}
          <View className="mt-4 border-t border-border pt-4">
            <Text className="mb-2 text-sm font-semibold text-text">해시태그</Text>
            <View className="flex-row items-center gap-2">
              <TextInput
                value={tagInput}
                onChangeText={setTagInput}
                onSubmitEditing={addTag}
                placeholder="#태그 입력"
                className="flex-1 rounded-lg bg-surface px-3 py-2 text-sm text-text"
                placeholderTextColor="#9CA3AF"
                returnKeyType="done"
              />
              <Pressable onPress={addTag} className="rounded-lg bg-primary px-3 py-2">
                <Text className="text-sm font-medium text-white">추가</Text>
              </Pressable>
            </View>
            {tags.length > 0 && (
              <View className="mt-2 flex-row flex-wrap gap-1">
                {tags.map((tag) => (
                  <Pressable
                    key={tag}
                    onPress={() => removeTag(tag)}
                    className="flex-row items-center rounded-full bg-primary/10 px-2.5 py-1"
                  >
                    <Text className="text-xs text-primary">#{tag}</Text>
                    <Ionicons name="close" size={12} color="#4A90D9" className="ml-1" />
                  </Pressable>
                ))}
              </View>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}
