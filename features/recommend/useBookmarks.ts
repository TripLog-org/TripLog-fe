import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { bookmarksApi } from '@/services/api/bookmarks';

const BOOKMARKS_KEY = ['bookmarks'];

/** 북마크 목록 */
export function useBookmarks(page = 1, pageSize = 20) {
  return useQuery({
    queryKey: [...BOOKMARKS_KEY, page, pageSize],
    queryFn: () => bookmarksApi.getList(page, pageSize),
  });
}

/** 북마크 토글 */
export function useToggleBookmark() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (recommendationId: string) => bookmarksApi.toggle(recommendationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BOOKMARKS_KEY });
      queryClient.invalidateQueries({ queryKey: ['recommendations'] });
    },
  });
}

/** 특정 항목 북마크 여부 확인 */
export function useBookmarkCheck(id: string) {
  return useQuery({
    queryKey: [...BOOKMARKS_KEY, 'check', id],
    queryFn: () => bookmarksApi.check(id),
    enabled: !!id,
  });
}
