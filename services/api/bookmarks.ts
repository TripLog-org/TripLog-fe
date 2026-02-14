import { apiClient } from './client';

export interface BookmarkToggleResponse {
  message: string;
  isBookmarked: boolean;
  bookmarkCount: number;
}

export interface BookmarkListResponse {
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
  count: number;
  data: string[];
}

export const bookmarksApi = {
  /** 북마크 토글 (추천 여행) */
  async toggle(recommendationId: string): Promise<BookmarkToggleResponse> {
    const { data } = await apiClient.post<BookmarkToggleResponse>(
      '/api/bookmarks/toggle',
      { recommendationId },
    );
    return data;
  },

  /** 북마크 목록 */
  async getList(page = 1, pageSize = 20): Promise<BookmarkListResponse> {
    const { data } = await apiClient.get<BookmarkListResponse>('/api/bookmarks', {
      params: { page, pageSize },
    });
    return data;
  },

  /** 북마크 상태 확인 */
  async check(id: string): Promise<{ isBookmarked: boolean }> {
    const { data } = await apiClient.get<{ isBookmarked: boolean }>(
      `/api/bookmarks/check/${id}`,
    );
    return data;
  },

  /** 모든 북마크 삭제 */
  async removeAll(): Promise<void> {
    await apiClient.delete('/api/bookmarks');
  },
};
