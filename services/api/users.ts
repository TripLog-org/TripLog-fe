import { User } from '@/entities/user';
import { apiClient } from './client';

export const usersApi = {
  /** 내 정보 조회 */
  async getMe(): Promise<User> {
    const { data } = await apiClient.get<User>('/api/users/me');
    return data;
  },

  /** 내 정보 수정 */
  async updateMe(payload: { name?: string; profileImage?: string }): Promise<User> {
    const { data } = await apiClient.put<{ data: User }>('/api/users/me', payload);
    return data.data;
  },
};
