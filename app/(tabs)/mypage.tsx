import { View, Text, Pressable, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '@/features/auth/useAuthStore';
import { Ionicons } from '@expo/vector-icons';

export default function MyPageScreen() {
  const { user, logout, withdraw } = useAuthStore();

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
      {/* 프로필 */}
      <View className="items-center bg-white px-6 py-8">
        <View className="h-20 w-20 items-center justify-center rounded-full bg-primary/10">
          <Ionicons name="person" size={40} color="#4A90D9" />
        </View>
        <Text className="mt-3 text-xl font-bold text-text">{user?.name ?? '사용자'}</Text>
        <Text className="mt-1 text-sm text-text-secondary">{user?.email}</Text>
      </View>

      {/* 메뉴 */}
      <View className="mt-4 bg-white">
        <MenuItem icon="bookmark-outline" label="내 북마크" onPress={() => {}} />
        <MenuItem icon="settings-outline" label="설정" onPress={() => {}} />
        <MenuItem icon="information-circle-outline" label="앱 정보" onPress={() => {}} />
      </View>

      <View className="mt-4 bg-white">
        <MenuItem icon="log-out-outline" label="로그아웃" onPress={handleLogout} destructive />
        <MenuItem icon="trash-outline" label="회원 탈퇴" onPress={handleWithdraw} destructive />
      </View>
    </SafeAreaView>
  );
}

function MenuItem({
  icon,
  label,
  onPress,
  destructive = false,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress: () => void;
  destructive?: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      className="flex-row items-center justify-between border-b border-border px-6 py-4"
    >
      <View className="flex-row items-center gap-3">
        <Ionicons name={icon} size={22} color={destructive ? '#EF4444' : '#1A1A1A'} />
        <Text className={`text-base ${destructive ? 'text-error' : 'text-text'}`}>
          {label}
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
    </Pressable>
  );
}
