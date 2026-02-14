export interface Recommendation {
  _id: string;
  title: string;
  description?: string;
  category: string;
  region?: string;
  imageUrl?: string;
  address?: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  isBookmarked?: boolean;
  createdAt?: string;
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
