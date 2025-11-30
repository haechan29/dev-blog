export interface CommentResponseDto {
  id: number;
  postId: string;
  authorName: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  likeCount: number;
  userId: string | null;
  guestId: string | null;
  isDeleted: boolean;
  isGuest: boolean;
}
