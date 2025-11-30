export type CommentItemProps = {
  id: number;
  postId: string;
  authorName: string;
  content: string;
  createdAt: string;
  isUpdated: boolean;
  likeCount: number;
  userId: string | null;
  guestId: string | null;
  isDeleted: boolean;
  isGuest: boolean;
};
