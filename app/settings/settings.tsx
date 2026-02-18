import { View, Text, Pressable, Alert, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '@/features/auth/useAuthStore';
import { Ionicons } from '@expo/vector-icons';

const APP_VERSION = '1.0';

export default function SettingsScreen() {
  const router = useRouter();
  const { logout, withdraw } = useAuthStore();

  const handleLogout = () => {
    Alert.alert('로그아웃', '정말 로그아웃하시겠습니까?', [
      { text: '취소', style: 'cancel' },
      { text: '로그아웃', onPress: logout, style: 'destructive' },
    ]);
  };

  const handleWithdraw = () => {
    Alert.alert(
      '회원 탈퇴',
      '탈퇴하면 모든 데이터가 삭제됩니다. 정말 탈퇴하시겠습니까?',
      [
        { text: '취소', style: 'cancel' },
        { text: '탈퇴', onPress: withdraw, style: 'destructive' },
      ],
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-surface" edges={['bottom']}>
      <ScrollView className="flex-1 px-5" showsVerticalScrollIndicator={false}>
        <View className="pt-4">
          {/* ── 일반 메뉴 ── */}
          <View className="gap-4">
            <MenuItem label="개인 정보 처리 방침" onPress={() => {}} />
            <MenuItem label="서비스 이용 약관" onPress={() => {}} />
            <MenuItem label="EULA 최종 사용자 라이센스 계약" onPress={() => {}} />
            <MenuItem label={`버전 정보 - v${APP_VERSION}`} disabled />
          </View>

          {/* ── 계정 액션 ── */}
          <View className="mt-4 gap-4">
            <Pressable
              onPress={handleLogout}
              className="flex-row rounded-xl bg-red-50 px-4 py-4 border border-red-200"
            >
              <Ionicons name="log-out-outline" size={18} color="#EF4444" />
              <Text className="ml-2 text-sm font-medium text-error">로그아웃</Text>
            </Pressable>

            <Pressable
              onPress={handleWithdraw}
              className="flex-row rounded-xl bg-red-50 px-4 py-4 border border-red-200"
            >
              <Ionicons name="person-remove-outline" size={18} color="#EF4444" />
              <Text className="ml-2 text-sm font-medium text-error">회원 탈퇴</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function MenuItem({
  label,
  onPress,
  disabled = false,
}: {
  label: string;
  onPress?: () => void;
  disabled?: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      className="rounded-xl border border-border bg-white px-4 py-4"
    >
      <Text className="text-sm text-text">{label}</Text>
    </Pressable>
  );
}
