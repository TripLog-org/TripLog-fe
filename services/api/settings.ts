import { apiClient } from './client';

export interface AppSettings {
  notifications?: boolean;
  theme?: 'light' | 'dark' | 'system';
  [key: string]: unknown;
}

export const settingsApi = {
  /** 설정 조회 */
  async get(): Promise<AppSettings> {
    const { data } = await apiClient.get<{ data: AppSettings }>('/api/settings');
    return data.data;
  },

  /** 설정 수정 */
  async update(payload: Partial<AppSettings>): Promise<AppSettings> {
    const { data } = await apiClient.put<{ data: AppSettings }>('/api/settings', payload);
    return data.data;
  },
};
