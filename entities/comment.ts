export interface Comment {
  _id: string;
  author: {
    _id: string;
    email: string;
  };
  content: string;
  likeCount: number;
  isLiked?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CommentCreatePayload {
  content: string;
}
