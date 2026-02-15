import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  Image,
  ScrollView,
  Alert,
} from 'react-native';
import { useRouter, Stack } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { useCreatePost } from '@/features/posts/usePosts';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

const MAX_IMAGES = 10;

interface SelectedImage {
  uri: string;
  type: string;
  fileName: string;
}

export default function PostCreateScreen() {
  const router = useRouter();
  const createPost = useCreatePost();

  const [content, setContent] = useState('');
  const [images, setImages] = useState<SelectedImage[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);

  const isFormValid = images.length > 0;

  const pickImages = async () => {
    const remaining = MAX_IMAGES - images.length;
    if (remaining <= 0) {
      Alert.alert('안내', `최대 ${MAX_IMAGES}장까지 업로드 가능합니다.`);
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsMultipleSelection: true,
      selectionLimit: remaining,
      quality: 0.8,
    });

    if (!result.canceled) {
      const newImages: SelectedImage[] = result.assets.map((asset) => ({
        uri: asset.uri,
        type: asset.mimeType ?? 'image/jpeg',
        fileName: asset.fileName ?? `photo_${Date.now()}.jpg`,
      }));
      setImages((prev) => [...prev, ...newImages]);
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

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

  const handleSubmit = async () => {
    if (!content.trim()) {
      Alert.alert('안내', '내용을 입력해주세요.');
      return;
    }

    const formData = new FormData();
    formData.append('content', content.trim());

    if (tags.length > 0) {
      formData.append('tags', tags.join(','));
    }

    images.forEach((img) => {
      formData.append('images', {
        uri: img.uri,
        type: img.type,
        name: img.fileName,
      } as unknown as Blob);
    });

    createPost.mutate(formData, {
      onSuccess: () => {
        router.back();
      },
      onError: () => {
        Alert.alert('오류', '게시물 작성에 실패했습니다.');
      },
    });
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: '여행 추가 하기',
          headerTitleAlign: 'center',
          headerLeft: () => (
            <Pressable onPress={() => router.back()} hitSlop={8}>
              <Ionicons name="chevron-back" size={24} color="#1A1A1A" />
            </Pressable>
          ),
        }}
      />

      <SafeAreaView className="flex-1 bg-surface" edges={['bottom']}>
        <ScrollView className="flex-1 px-5 pt-4" showsVerticalScrollIndicator={false}>
          {/* ── 사진 섹션 ── */}
          <Text className="mb-3 text-base font-bold text-text">사진</Text>

          {/* 추가 버튼 */}
          <Pressable
            onPress={pickImages}
            className="mb-3 h-[88px] w-[88px] items-center justify-center rounded-xl border border-border bg-white"
          >
            <View className="h-8 w-8 items-center justify-center rounded-full bg-primary">
              <Text className="text-lg font-bold leading-5 text-white">+</Text>
            </View>
          </Pressable>

          {/* 선택된 이미지 목록 */}
          {images.length > 0 && (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ gap: 8 }}
              className="mb-2"
            >
              {images.map((img, index) => (
                <View key={img.uri} className="relative">
                  <Image
                    source={{ uri: img.uri }}
                    className="h-[140px] w-[140px] rounded-xl"
                    resizeMode="cover"
                  />
                  <Pressable
                    onPress={() => removeImage(index)}
                    className="absolute right-1.5 top-1.5"
                  >
                    <Ionicons name="close-circle" size={24} color="#ebebeb" />
                  </Pressable>
                </View>
              ))}
            </ScrollView>
          )}

          {/* ── 텍스트 입력 섹션 ── */}
          <Text className="mb-3 mt-6 text-base font-bold text-text">텍스트 입력</Text>
          <View className="rounded-xl border border-border bg-white p-4">
            <TextInput
              value={content}
              onChangeText={setContent}
              placeholder="내용을 입력해주세요"
              multiline
              className="min-h-[120px] text-sm leading-5 text-text"
              placeholderTextColor="#9CA3AF"
              textAlignVertical="top"
            />
          </View>

          {/* ── 해시태그 섹션 ── */}
          <Text className="mb-3 mt-6 text-base font-bold text-text">해시태그 #</Text>
          <View className="flex-row items-center gap-2">
            <View className="flex-1 flex-row items-center rounded-xl border border-border bg-white px-4 py-2.5">
              <Text className="mr-1 text-sm text-text-tertiary">#</Text>
              <TextInput
                value={tagInput}
                onChangeText={setTagInput}
                onSubmitEditing={addTag}
                placeholder="키워드를 입력해주세요."
                className="flex-1 text-sm text-text"
                placeholderTextColor="#9CA3AF"
                returnKeyType="done"
              />
            </View>
            <Pressable
              onPress={addTag}
              className="rounded-xl px-4 py-2.5 bg-primary"
            >
              <Text className="text-sm font-semibold text-white">추가</Text>
            </Pressable>
          </View>

          {tags.length > 0 && (
            <View className="mt-3 flex-row flex-wrap gap-2">
              {tags.map((tag) => (
                <Pressable
                  key={tag}
                  onPress={() => removeTag(tag)}
                  className="rounded-full bg-[#DDEEFA] px-4 py-1.5"
                >
                  <Text className="text-sm font-semibold text-primary">#{tag}</Text>
                </Pressable>
              ))}
            </View>
          )}

          {/* 하단 여백 확보 */}
          <View className="h-6" />
        </ScrollView>

        {/* ── 하단 다음 버튼 ── */}
        <View className="px-5 pb-4 pt-2">
          <Pressable
            onPress={handleSubmit}
            disabled={!isFormValid || createPost.isPending}
            className={`items-center rounded-full py-4 ${
              isFormValid ? 'bg-primary' : 'bg-primary/30'
            }`}
          >
            <Text
              className={`text-base font-semibold ${
                isFormValid ? 'text-white' : 'text-white/60'
              }`}
            >
              {createPost.isPending ? '게시 중...' : '다음'}
            </Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </>
  );
}
