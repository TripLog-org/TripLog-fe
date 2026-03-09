import { View, Text, Pressable, Platform, Alert, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as AppleAuthentication from 'expo-apple-authentication';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import { useAuthStore } from '@/features/auth/useAuthStore';
import { appConfig } from '@/shared/config';
import { useEffect } from 'react';
import { router } from 'expo-router';

export default function LoginScreen() {
  const { loginWithApple, loginWithGoogle, loginWithGoogleNative  } = useAuthStore();

  useEffect(() => {
    GoogleSignin.configure({
      webClientId: appConfig.googleWebClientId,
      offlineAccess: true,
    });
  }, []);

  const handleAppleLogin = async () => {
    try {
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [],
      });
      if (credential.identityToken) {
        await loginWithApple(credential.identityToken, credential.authorizationCode ?? "");
        router.replace('/(tabs)/map')
      }
    } catch (error: unknown) {
      const e = error as { code?: string };
      console.log(e.code);
      if (e.code !== 'ERR_REQUEST_CANCELED') {
        Alert.alert('로그인 실패', '애플 로그인에 실패했습니다.');
      }
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
      const response = await GoogleSignin.signIn();
      const idToken = response.data?.idToken;

      if (!idToken) {
        Alert.alert('로그인 실패', 'ID 토큰을 가져올 수 없습니다.');
        return;
      }

      if (Platform.OS === 'ios') {
        await loginWithGoogleNative(idToken);
        router.replace('/(tabs)/map')
        return;
      }

      await loginWithGoogle(idToken);
      router.replace('/(tabs)/map')
    } catch (error: unknown) {
      const e = error as { code?: string };
      console.log(error);
      if (e.code === statusCodes.SIGN_IN_CANCELLED) return;
      if (e.code === statusCodes.IN_PROGRESS) return;
      if (e.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        Alert.alert('오류', 'Google Play 서비스를 사용할 수 없습니다.');
        return;
      }
      Alert.alert('로그인 실패', '구글 로그인에 실패했습니다.');
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 items-center justify-center px-6">
        {/* 로고 영역 */}
        <View className="mb-16 items-center">
          <Text className="text-4xl font-bold text-primary">TripLog</Text>
          <Text className="mt-2 text-base text-text-secondary">
            나만의 여행을 기록하세요
          </Text>
        </View>

        {/* 로그인 버튼 영역 */}
        <View className="w-full gap-3">
          {/* 애플 로그인 (iOS만) */}
          {Platform.OS === 'ios' && (
            <Pressable
              onPress={handleAppleLogin}
              className="h-14 flex-row items-center justify-center rounded-xl bg-black"
            >
              <Image source={require('@/assets/apple.png')} className="w-4 h-5 mr-3" />
              <Text className="text-base font-semibold text-white">
                 Apple로 계속하기
              </Text>
            </Pressable>
          )}

          {/* 구글 로그인 */}
          <Pressable
            onPress={handleGoogleLogin}
            className="h-14 flex-row items-center justify-center rounded-xl border border-border bg-white"
          >
            <Image source={require('@/assets/google.png')} className="w-5 h-5 mr-3" />
            <Text className="text-base font-semibold text-text">
              Google로 계속하기
            </Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}
