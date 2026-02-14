export interface PostImage {
  _id: string;
  url: string;
  thumbnail: string;
  order: number;
  location?: {
    name?: string;
    address?: string;
    coordinates?: {
      latitude: number;
      longitude: number;
    };
  };
  capturedAt?: string;
  description?: string;
}

export interface Post {
  _id: string;
  author: {
    _id: string;
    name: string;
    profileImage?: string;
  };
  content: string;
  images: PostImage[];
  tags: string[];
  visibility: 'public' | 'private';
  likeCount: number;
  commentCount: number;
  isLiked?: boolean;
  isBookmarked?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PostCreatePayload {
  content: string;
  tags?: string[];
  visibility?: 'public' | 'private';
  images: {
    uri: string;
    type: string;
    name: string;
  }[];
  imageMeta?: ImageMeta[];
}

export interface ImageMeta {
  latitude?: number;
  longitude?: number;
  locationName?: string;
  address?: string;
  capturedAt?: string;
  description?: string;
}

export interface PostListResponse {
  pagination: Pagination;
  count: number;
  data: Post[];
}

export interface Pagination {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}
