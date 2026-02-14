import { View, Text, Pressable, Platform, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as AppleAuthentication from 'expo-apple-authentication';
import { useAuthStore } from '@/features/auth/useAuthStore';

export default function LoginScreen() {
  const { loginWithApple, loginWithGoogle } = useAuthStore();

  const handleAppleLogin = async () => {
    try {
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });
      if (credential.identityToken) {
        await loginWithApple(credential.identityToken, credential.authorizationCode ?? undefined);
      }
    } catch (error: unknown) {
      const e = error as { code?: string };
      if (e.code !== 'ERR_REQUEST_CANCELED') {
        Alert.alert('로그인 실패', '애플 로그인에 실패했습니다.');
      }
    }
  };

  const handleGoogleLogin = async () => {
    try {
      // Google Sign-In 로직 (네이티브 모듈 초기화 필요)
      // TODO: GoogleSignin.configure() 후 signIn() → idToken 추출
      Alert.alert('안내', 'Google 로그인은 네이티브 빌드에서 사용 가능합니다.');
    } catch {
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
            <Text className="text-base font-semibold text-text">
              G  Google로 계속하기
            </Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}
