import {
  Recommendation,
  RecommendationListResponse,
  RecommendationSearchParams,
} from '@/entities/recommendation';
import { apiClient } from './client';

export const recommendationsApi = {
  /** 추천 여행 목록 */
  async getList(params: RecommendationSearchParams = {}): Promise<RecommendationListResponse> {
    const { data } = await apiClient.get<RecommendationListResponse>(
      '/api/recommendations',
      { params },
    );
    return data;
  },

  /** 추천 여행 상세 */
  async getDetail(id: string): Promise<Recommendation> {
    const { data } = await apiClient.get<{ data: Recommendation }>(
      `/api/recommendations/${id}`,
    );
    return data.data;
  },

  /** 관광정보 검색 */
  async search(params: RecommendationSearchParams): Promise<RecommendationListResponse> {
    const { data } = await apiClient.get<RecommendationListResponse>(
      '/api/recommendations/search',
      { params },
    );
    return data;
  },
};
