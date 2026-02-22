import { useState, useCallback } from 'react';
import { View, Text, Pressable } from 'react-native';
import { useRouter, Stack, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import MapView, { Marker, PROVIDER_GOOGLE, MapPressEvent } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { useCreatePostStore } from '@/features/posts/useCreatePostStore';

const DEFAULT_REGION = {
  latitude: 37.5665,
  longitude: 126.978,
  latitudeDelta: 5,
  longitudeDelta: 5,
};

export default function LocationPickerScreen() {
  const router = useRouter();
  const { imageIndex } = useLocalSearchParams<{ imageIndex: string }>();
  const idx = Number(imageIndex ?? 0);

  const { images, updateImageMeta } = useCreatePostStore();
  const current = images[idx];

  const [pin, setPin] = useState<{ latitude: number; longitude: number } | null>(
    current?.latitude && current?.longitude
      ? { latitude: current.latitude, longitude: current.longitude }
      : null,
  );

  const initialRegion = pin
    ? { ...pin, latitudeDelta: 0.05, longitudeDelta: 0.05 }
    : DEFAULT_REGION;

  const handleMapPress = (e: MapPressEvent) => {
    setPin(e.nativeEvent.coordinate);
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

  const handleConfirm = async () => {
    if (pin) {
      const name = await reverseGeocode(pin.latitude, pin.longitude);
      updateImageMeta(idx, {
        latitude: pin.latitude,
        longitude: pin.longitude,
        locationName: name,
      });
    }
    router.back();
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: '장소 변경',
          headerTitleAlign: 'center',
          headerLeft: () => (
            <Pressable onPress={() => router.back()} hitSlop={8}>
              <Ionicons name="chevron-back" size={24} color="#1A1A1A" />
            </Pressable>
          ),
        }}
      />

      <SafeAreaView className="flex-1 bg-white" edges={['bottom']}>
        {/* 안내 텍스트 */}
        <View className="flex-row items-center gap-1.5 px-5 py-3">
          <Ionicons name="location" size={14} color="#4A90D9" />
          <Text className="text-sm text-text-secondary">
            지도에서 장소를 pin 해주세요.
          </Text>
        </View>

        {/* 지도 */}
        <MapView
          provider={PROVIDER_GOOGLE}
          style={{ flex: 1 }}
          initialRegion={initialRegion}
          onPress={handleMapPress}
          showsUserLocation
          showsMyLocationButton
        >
          {pin && (
            <Marker coordinate={pin}>
              <Ionicons name="location" size={36} color="#EF4444" />
            </Marker>
          )}
        </MapView>

        {/* 변경 버튼 */}
        <View className="px-5 pb-4 pt-3">
          <Pressable
            onPress={handleConfirm}
            disabled={!pin}
            className={`items-center rounded-full py-4 ${
              pin ? 'bg-primary' : 'bg-primary/30'
            }`}
          >
            <Text
              className={`text-base font-semibold ${
                pin ? 'text-white' : 'text-white/60'
              }`}
            >
              변경
            </Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </>
  );
}
