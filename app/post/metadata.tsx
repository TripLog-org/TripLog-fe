import { useState, useRef, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  Image,
  Pressable,
  FlatList,
  useWindowDimensions,
  Alert,
  Platform,
  ScrollView,
} from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import DateTimePicker, {
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import { useCreatePostStore } from '@/features/posts/useCreatePostStore';
import { useCreatePost } from '@/features/posts/usePosts';
import * as Location from 'expo-location';
import { useAuthStore } from '@/features/auth/useAuthStore';
import { compressImage } from '@/shared/utils/compressImage';

export default function MetadataScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const { images, content, tags, visibility, updateImageMeta, reset } =
    useCreatePostStore();
  const createPost = useCreatePost();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [tempDate, setTempDate] = useState<Date>(new Date());
  const [locationLabel, setLocationLabel] = useState('');
  const flatListRef = useRef<FlatList>(null);

  const current = images[currentIndex];
  const imageWidth = width - 40;

  const parseDateSafe = (val?: string): Date => {
    if (!val) return new Date();
    const normalized = val.replace(/^(\d{4}):(\d{2}):(\d{2})/, '$1-$2-$3');
    const d = new Date(normalized);
    return isNaN(d.getTime()) ? new Date() : d;
  };

  const formatDate = (val?: string) => {
    if (!val) return '사진에 시간 데이터가 없습니다.';
    const d = parseDateSafe(val);
    return d.toLocaleString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const reverseGeocode = useCallback(async (lat: number, lng: number) => {
    try {
      const results = await Location.reverseGeocodeAsync({ latitude: lat, longitude: lng });
      if (results.length > 0) {
        const r = results[0];
        const parts = [r.city, r.street].filter(Boolean);
        return parts.join(' ') || `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
      }
    } catch { /* fallback */ }
    return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
  }, []);

  useEffect(() => {
    if (!current) return;
    if (current.locationName) {
      setLocationLabel(current.locationName);
      return;
    }
    if (current.latitude && current.longitude) {
      setLocationLabel('주소를 불러오는 중...');
      reverseGeocode(current.latitude, current.longitude).then((name) => {
        setLocationLabel(name);
        updateImageMeta(currentIndex, { locationName: name });
      });
      return;
    }
    setLocationLabel('사진에 장소 데이터가 없습니다.');
  }, [currentIndex, current?.locationName, current?.latitude, current?.longitude]);

  const openDatePicker = () => {
    setTempDate(parseDateSafe(current.capturedAt));
    setShowDatePicker(true);
  };

  const handleDateChange = (_: DateTimePickerEvent, date?: Date) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
      if (date) updateImageMeta(currentIndex, { capturedAt: date.toISOString() });
      return;
    }
    if (date) setTempDate(date);
  };

  const confirmDate = () => {
    updateImageMeta(currentIndex, { capturedAt: tempDate.toISOString() });
    setShowDatePicker(false);
  };

  const cancelDate = () => {
    setShowDatePicker(false);
  };

  const handleSubmit = async () => {
    const { isAuthenticated } = useAuthStore.getState();

    if (!isAuthenticated) {
      Alert.alert('안내', '로그인 후 이용해주세요.', [
        { text: '취소', style: 'cancel' },
        { text: '로그인', onPress: () => router.replace('/(auth)/login') },
      ]);
      return;
    }

    try {
      const compressedUris = await Promise.all(
        images.map((img) => compressImage(img.uri)),
      );

      const formData = new FormData();
      formData.append('content', content);
      formData.append('tags', tags.join(','));
      formData.append('visibility', visibility);

      const imageMeta = images.map((img) => ({
        latitude: img.latitude,
        longitude: img.longitude,
        locationName: img.locationName,
        capturedAt: img.capturedAt,
      }));
      formData.append('imageMeta', JSON.stringify(imageMeta));

      compressedUris.forEach((uri, i) => {
        formData.append('images', {
          uri,
          type: 'image/jpeg',
          name: images[i].fileName.replace(/\.\w+$/, '.jpg'),
        } as unknown as Blob);
      });

      createPost.mutate(formData, {
        onSuccess: () => {
          reset();
          router.dismissAll();
          router.replace('/(tabs)/map');
        },
        onError: (error) => {
          console.log(error);
          Alert.alert('오류', '게시물 작성에 실패했습니다.');
        },
      });
    } catch {
      Alert.alert('오류', '이미지 압축에 실패했습니다.');
    }
  };

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: Array<{ index: number | null }> }) => {
      if (viewableItems.length > 0 && viewableItems[0].index != null) {
        setCurrentIndex(viewableItems[0].index);
      }
    },
  ).current;

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
        <ScrollView className="flex-1 pt-4" showsVerticalScrollIndicator={false}>
          {/* 이미지 슬라이더 */}
          <FlatList
            ref={flatListRef}
            data={images}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onViewableItemsChanged={onViewableItemsChanged}
            viewabilityConfig={{ viewAreaCoveragePercentThreshold: 50 }}
            keyExtractor={(_, i) => String(i)}
            contentContainerStyle={{ paddingHorizontal: 20 }}
            snapToInterval={imageWidth + 12}
            decelerationRate="fast"
            renderItem={({ item }) => (
              <View style={{ width: imageWidth, marginRight: 12 }}>
                <Image
                  source={{ uri: item.uri }}
                  style={{ width: imageWidth, height: imageWidth }}
                  className="rounded-2xl"
                  resizeMode="cover"
                />
              </View>
            )}
            ListHeaderComponent={<View style={{ height: 16 }} />}
          />

          {/* 페이지 인디케이터 */}
          {images.length > 1 && (
            <View className="my-3 flex-row items-center justify-center gap-1.5">
              {images.map((_, i) => (
                <View
                  key={i}
                  className={`h-1.5 rounded-full ${
                    i === currentIndex ? 'w-4 bg-primary' : 'w-1.5 bg-gray-300'
                  }`}
                />
              ))}
            </View>
          )}

          {/* 메타데이터 섹션 */}
          <View className="flex-1 px-5 pt-4">
            {/* 장소 */}
            <View className="flex-row items-center justify-between">
              <Text className="text-base font-bold text-text">사진의 장소</Text>
              <Pressable
                onPress={() =>
                  router.push({
                    pathname: '/post/locationPicker',
                    params: { imageIndex: currentIndex },
                  })
                }
                className="flex-row items-center gap-1"
              >
                <Ionicons name="create-outline" size={14} color="#8FC8F1" />
                <Text className="text-sm text-primary">변경</Text>
              </Pressable>
            </View>
            <View className="mt-2 rounded-xl border border-border bg-white px-4 py-3">
              <Text className="text-sm text-text-secondary">
                {locationLabel}
              </Text>
            </View>

            {/* 시간 */}
            <View className="mt-5 flex-row items-center justify-between">
              <Text className="text-base font-bold text-text">사진의 시간</Text>
              <Pressable
                onPress={openDatePicker}
                className="flex-row items-center gap-1"
              >
                <Ionicons name="create-outline" size={14} color="#8FC8F1" />
                <Text className="text-sm text-primary">변경</Text>
              </Pressable>
            </View>
            <View className="mt-2 rounded-xl border border-border bg-white px-4 py-3">
              <Text className="text-sm text-text-secondary">
                {formatDate(current.capturedAt)}
              </Text>
            </View>
          </View>
        </ScrollView>

        {/* 등록 버튼 */}
        <View className="px-5 pb-4 pt-2">
          <Pressable
            onPress={handleSubmit}
            disabled={createPost.isPending}
            className="items-center rounded-full bg-primary py-4"
          >
            <Text className="text-base font-semibold text-white">
              {createPost.isPending ? '등록 중...' : '등록'}
            </Text>
          </Pressable>
        </View>

        {/* DateTimePicker 모달 */}
        {showDatePicker && (
          <View className="w-full absolute bottom-0 z-10000" style={{ backgroundColor: '#F0F0F0' }}>
            {Platform.OS === 'ios' && (
              <View className="flex-row items-center justify-between px-5 py-2">
                <Pressable onPress={cancelDate}>
                  <Text className="text-sm font-bold text-text-secondary">취소</Text>
                </Pressable>
                <Pressable onPress={confirmDate}>
                  <Text className="text-sm font-bold text-primary">완료</Text>
                </Pressable>
              </View>
            )}
            <DateTimePicker
              value={tempDate}
              mode="datetime"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={handleDateChange}
              locale="ko-KR"
              style={{ width: '100%', alignSelf: 'center' }}
            />
          </View>
        )}
      </SafeAreaView>
    </>
  );
}
