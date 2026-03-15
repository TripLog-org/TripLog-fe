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
  nickname: string;
  profileImage?: string;
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

/* ── 지도 마커용 ── */

export interface MapPhoto {
  url: string;
  thumbnail: string;
  location: {
    name?: string;
    coordinates: {
      latitude: number;
      longitude: number;
    };
    address?: string;
  };
  capturedAt?: string;
  description?: string;
}

export interface MapPost {
  postId: string;
  photo: MapPhoto;
  author: {
    _id: string;
    username: string;
    profileImage?: string;
  } | null;
  createdAt: string;
  isBookmarked: boolean;
}

export interface MapPostsResponse {
  success: boolean;
  data: MapPost[];
  total: number;
}

export interface MapPostsParams {
  latitude: number;
  longitude: number;
  zoomLevel: number;
  tag?: string;
  limit?: number;
}

export interface PostListResponse {
  success: boolean;
  data: Post[];
  totalPages: number;
  currentPage: string;
  total: number;
}