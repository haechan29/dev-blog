import { UserStatus } from '@/features/user/domain/model/user';

export type CommentItemProps = {
  id: number;
  postId: string;
  authorName: string;
  content: string;
  createdAt: string;
  isUpdated: boolean;
  likeCount: number;
  userId: string;
  userStatus: UserStatus;
};
