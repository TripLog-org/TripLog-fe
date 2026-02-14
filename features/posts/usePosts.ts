import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { postsApi } from '@/services/api/posts';

const POSTS_KEY = ['posts'];

/** 게시물 무한 스크롤 목록 */
export function usePosts(pageSize = 20) {
  return useInfiniteQuery({
    queryKey: POSTS_KEY,
    queryFn: ({ pageParam = 1 }) => postsApi.getList(pageParam, pageSize),
    getNextPageParam: (lastPage) => {
      const { page, totalPages } = lastPage.pagination;
      return page < totalPages ? page + 1 : undefined;
    },
    initialPageParam: 1,
  });
}

/** 게시물 생성 */
export function useCreatePost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (formData: FormData) => postsApi.create(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: POSTS_KEY });
    },
  });
}

/** 게시물 수정 */
export function useUpdatePost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ postId, payload }: { postId: string; payload: { content?: string; tags?: string[]; visibility?: string } }) =>
      postsApi.update(postId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: POSTS_KEY });
    },
  });
}

/** 게시물 삭제 */
export function useDeletePost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (postId: string) => postsApi.remove(postId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: POSTS_KEY });
    },
  });
}

/** 게시물 좋아요 토글 */
export function useTogglePostLike() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (postId: string) => postsApi.toggleLike(postId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: POSTS_KEY });
    },
  });
}
