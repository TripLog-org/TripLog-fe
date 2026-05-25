export interface Recommendation {
  id: string;
  title: string;
  description?: string;
  category: string;
  region?: string;
  coverImage?: string;
  address?: string;
  tags?: string[];
  telephone?: string;
  isBookmarked?: boolean;
  source?: string;
}

export interface RecommendationListResponse {
  source: 'database' | 'publicApi';
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
  count: number;
  category?: string;
  data: Recommendation[];
}

export interface RecommendationSearchParams {
  keyword?: string;
  category?: string;
  region?: string;
  usePublicApi?: boolean;
  page?: number;
  pageSize?: number;
}
