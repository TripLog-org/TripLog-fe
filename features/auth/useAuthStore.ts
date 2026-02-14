import { create } from 'zustand';
import { User } from '@/entities/user';
import { tokenManager } from '@/services/auth/tokenManager';
import { authApi } from '@/services/api/auth';
import { usersApi } from '@/services/api/users';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  /** 앱 시작 시 토큰 확인 → 유저 정보 로드 */
  initialize: () => Promise<void>;

  /** 애플 로그인 */
  loginWithApple: (idToken: string, authorizationCode?: string) => Promise<void>;

  /** 구글 로그인 */
  loginWithGoogle: (idToken: string) => Promise<void>;

  /** 로그아웃 */
  logout: () => Promise<void>;

  /** 회원 탈퇴 */
  withdraw: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,

  initialize: async () => {
    try {
      const token = await tokenManager.getAccessToken();
      if (!token) {
        set({ isAuthenticated: false, isLoading: false });
        return;
      }
      const user = await usersApi.getMe();
      set({ user, isAuthenticated: true, isLoading: false });
    } catch {
      await tokenManager.clearTokens();
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },

  loginWithApple: async (idToken, authorizationCode) => {
    const res = await authApi.loginWithApple(idToken, authorizationCode);
    await tokenManager.setTokens(res.accessToken, res.refreshToken);
    set({ user: res.user, isAuthenticated: true });
  },

  loginWithGoogle: async (idToken) => {
    const res = await authApi.loginWithGoogle(idToken);
    await tokenManager.setTokens(res.accessToken, res.refreshToken);
    set({ user: res.user, isAuthenticated: true });
  },

  logout: async () => {
    try {
      await authApi.logout();
    } finally {
      await tokenManager.clearTokens();
      set({ user: null, isAuthenticated: false });
    }
  },

  withdraw: async () => {
    try {
      await authApi.withdraw();
    } finally {
      await tokenManager.clearTokens();
      set({ user: null, isAuthenticated: false });
    }
  },
}));
