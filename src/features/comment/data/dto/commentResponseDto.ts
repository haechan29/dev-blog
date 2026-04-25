export interface CommentResponseDto {
  id: number;
  postId: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  likeCount: number;
  userId: string;
  user: {
    nickname: string | null;
    deletedAt: string | null;
    registeredAt: string | null;
    profileImageUrl: string | null;
  };
}
