import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { recommendationsApi } from '@/services/api/recommendations';
import { RecommendationSearchParams } from '@/entities/recommendation';

/** 추천 여행 목록 (무한 스크롤) */
export function useRecommendations(params: Omit<RecommendationSearchParams, 'page'> = {}) {
  return useInfiniteQuery({
    queryKey: ['recommendations', params],
    queryFn: ({ pageParam = 1 }) =>
      recommendationsApi.getList({ ...params, page: pageParam }),
    getNextPageParam: (lastPage) => {
      const { page, totalPages } = lastPage.pagination;
      return page < totalPages ? page + 1 : undefined;
    },
    initialPageParam: 1,
  });
}

/** 추천 여행 상세 */
export function useRecommendationDetail(id: string) {
  return useQuery({
    queryKey: ['recommendations', id],
    queryFn: () => recommendationsApi.getDetail(id),
    enabled: !!id,
  });
}

/** 관광정보 검색 */
export function useRecommendationSearch(params: RecommendationSearchParams) {
  return useInfiniteQuery({
    queryKey: ['recommendations', 'search', params],
    queryFn: ({ pageParam = 1 }) =>
      recommendationsApi.search({ ...params, page: pageParam }),
    getNextPageParam: (lastPage) => {
      const { page, totalPages } = lastPage.pagination;
      return page < totalPages ? page + 1 : undefined;
    },
    initialPageParam: 1,
    enabled: !!params.keyword,
  });
}
