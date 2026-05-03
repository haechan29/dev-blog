export interface CommentItemProps {
  id: string;
  postId: string;
  authorName: string;
  profileImageUrl: string | null;
  content: string;
  createdAt: string;
  isUpdated: boolean;
  likeCount: number;
  userId: string;
}
