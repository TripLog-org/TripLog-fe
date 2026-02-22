export interface PostImage {
  _id: string;
  id: string;
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

export interface PostAuthor {
  _id: string;
  email: string;
}

export interface Post {
  _id: string;
  id: string;
  author: PostAuthor | null;
  content: string;
  images: PostImage[];
  tags: string[];
  visibility: 'public' | 'private';
  likeCount: number;
  commentCount: number;
  viewCount: number;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  __v: number;
  isLiked: boolean;
  isBookmarked: boolean;
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
  success: boolean;
  data: Post[];
  totalPages: number;
  currentPage: string;
  total: number;
}
