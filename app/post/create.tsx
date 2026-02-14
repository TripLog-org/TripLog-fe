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
          title: '새 게시물',
          headerRight: () => (
            <Pressable onPress={handleSubmit} disabled={createPost.isPending}>
              <Text className="text-base font-semibold text-primary">
                {createPost.isPending ? '게시 중...' : '게시'}
              </Text>
            </Pressable>
          ),
        }}
      />

      <SafeAreaView className="flex-1 bg-white" edges={['bottom']}>
        <ScrollView className="flex-1 p-4">
          {/* 내용 입력 */}
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

          {/* 이미지 선택 */}
          <View className="mt-4 border-t border-border pt-4">
            <View className="flex-row items-center justify-between">
              <Text className="text-sm font-semibold text-text">
                사진 ({images.length}/{MAX_IMAGES})
              </Text>
              <Pressable onPress={pickImages} className="flex-row items-center gap-1">
                <Ionicons name="camera-outline" size={20} color="#4A90D9" />
                <Text className="text-sm text-primary">추가</Text>
              </Pressable>
            </View>

            {images.length > 0 && (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                className="mt-3"
              >
                {images.map((img, index) => (
                  <View key={img.uri} className="relative mr-2">
                    <Image
                      source={{ uri: img.uri }}
                      className="h-24 w-24 rounded-lg"
                      resizeMode="cover"
                    />
                    <Pressable
                      onPress={() => removeImage(index)}
                      className="absolute -right-1 -top-1 h-5 w-5 items-center justify-center rounded-full bg-error"
                    >
                      <Ionicons name="close" size={12} color="#FFFFFF" />
                    </Pressable>
                  </View>
                ))}
              </ScrollView>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}
