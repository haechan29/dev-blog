import { UserStatus } from '@/features/user/domain/model/user';

export interface CommentItemProps {
  id: number;
  postId: string;
  authorName: string;
  profileImageUrl: string | null;
  content: string;
  createdAt: string;
  isUpdated: boolean;
  likeCount: number;
  userId: string;
  userStatus: UserStatus;
}
