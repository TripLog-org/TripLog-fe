import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { commentsApi } from '@/services/api/comments';

const commentKey = (postId: string) => ['comments', postId];

/** 댓글 목록 */
export function useComments(postId: string) {
  return useQuery({
    queryKey: commentKey(postId),
    queryFn: () => commentsApi.getList(postId),
    enabled: !!postId,
  });
}

/** 댓글 작성 */
export function useCreateComment(postId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (content: string) => commentsApi.create(postId, content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: commentKey(postId) });
    },
  });
}

/** 댓글 수정 */
export function useUpdateComment(postId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ commentId, content }: { commentId: string; content: string }) =>
      commentsApi.update(commentId, content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: commentKey(postId) });
    },
  });
}

/** 댓글 삭제 */
export function useDeleteComment(postId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (commentId: string) => commentsApi.remove(commentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: commentKey(postId) });
    },
  });
}

/** 댓글 좋아요 토글 */
export function useToggleCommentLike(postId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (commentId: string) => commentsApi.toggleLike(commentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: commentKey(postId) });
    },
  });
}
