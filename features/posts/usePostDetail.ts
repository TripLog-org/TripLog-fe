import { useQuery } from '@tanstack/react-query';
import { postsApi } from '@/services/api/posts';

export function usePostDetail(postId: string) {
  return useQuery({
    queryKey: ['posts', postId],
    queryFn: () => postsApi.getDetail(postId),
    enabled: !!postId,
  });
}
