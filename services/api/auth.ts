import { AuthResponse } from '@/entities/user';
import { apiClient } from './client';
import { tokenManager } from '../auth/tokenManager';

export const authApi = {
  /** 애플 로그인 */
  async loginWithApple(idToken: string, authorizationCode?: string): Promise<AuthResponse> {
    const { data } = await apiClient.post<AuthResponse>('/api/auth/apple', {
      idToken,
      authorizationCode,
    });
    return data;
  },

  /** 구글 로그인 */
  async loginWithGoogle(idToken: string): Promise<AuthResponse> {
    const { data } = await apiClient.post<AuthResponse>('/api/auth/google', {
      idToken,
    });
    return data;
  },

  /** 구글 로그인 - iOS */
  async loginWithGoogleNative(idToken: string): Promise<AuthResponse> {
    const { data } = await apiClient.post<AuthResponse>('/api/auth/google/native', {
      idToken,
    });
    tokenManager.setTokens(data.accessToken, data.refreshToken);
    return data;
  },

  /** 로그아웃 */
  async logout(): Promise<void> {
    await apiClient.post('/api/auth/logout');
  },

  /** 회원 탈퇴 */
  async withdraw(): Promise<void> {
    await apiClient.delete('/api/auth/withdraw');
  },
};
