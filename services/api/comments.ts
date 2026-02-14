import { Comment } from '@/entities/comment';
import { apiClient } from './client';

export const commentsApi = {
  /** 댓글 목록 */
  async getList(postId: string): Promise<Comment[]> {
    const { data } = await apiClient.get<{ data: Comment[] }>(
      `/api/posts/${postId}/comments`,
    );
    return data.data;
  },

  /** 댓글 작성 */
  async create(postId: string, content: string): Promise<Comment> {
    const { data } = await apiClient.post<{ data: Comment }>(
      `/api/posts/${postId}/comments`,
      { content },
    );
    return data.data;
  },

  /** 댓글 수정 */
  async update(commentId: string, content: string): Promise<Comment> {
    const { data } = await apiClient.put<{ data: Comment }>(
      `/api/comments/${commentId}`,
      { content },
    );
    return data.data;
  },

  /** 댓글 삭제 */
  async remove(commentId: string): Promise<void> {
    await apiClient.delete(`/api/comments/${commentId}`);
  },

  /** 댓글 좋아요 토글 */
  async toggleLike(commentId: string): Promise<{ isLiked: boolean; likeCount: number }> {
    const { data } = await apiClient.post(`/api/comments/${commentId}/like`);
    return data;
  },
};
