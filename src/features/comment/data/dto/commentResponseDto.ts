export interface CommentResponseDto {
  id: number;
  postId: string;
  authorName: string | null;
  content: string;
  createdAt: string;
  updatedAt: string;
  likeCount: number;
  userId: string;
  deletedAt: string | null;
  registeredAt: string | null;
  profileImageUrl: string | null;
}
