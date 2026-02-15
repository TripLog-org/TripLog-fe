import { Post, PostListResponse } from '@/entities/post';
import { apiClient } from './client';

export const postsApi = {
  /** 게시물 목록 조회 (페이징) */
  async getList(page = 1, pageSize = 20): Promise<PostListResponse> {
    const { data } = await apiClient.get<PostListResponse>('/api/posts', {
      params: { page, pageSize },
    });

    console.log('GET Posts', data);

    return data;
  },

  /** 게시물 상세 조회 */
  async getDetail(postId: string): Promise<Post> {
    const { data } = await apiClient.get<{ data: Post }>(`/api/posts/${postId}`);
    return data.data;
  },

  /** 게시물 생성 (multipart/form-data) */
  async create(formData: FormData): Promise<Post> {
    const { data } = await apiClient.post<{ data: Post }>('/api/posts', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data.data;
  },

  /** 게시물 수정 */
  async update(postId: string, payload: { content?: string; tags?: string[]; visibility?: string }): Promise<Post> {
    const { data } = await apiClient.put<{ data: Post }>(`/api/posts/${postId}`, payload);
    return data.data;
  },

  /** 게시물 삭제 */
  async remove(postId: string): Promise<void> {
    await apiClient.delete(`/api/posts/${postId}`);
  },

  /** 게시물 좋아요 토글 */
  async toggleLike(postId: string): Promise<{ isLiked: boolean; likeCount: number }> {
    const { data } = await apiClient.post(`/api/posts/${postId}/like`);
    return data;
  },
};
