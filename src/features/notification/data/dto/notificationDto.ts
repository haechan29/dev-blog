import { NotificationType } from '@/features/notification/data/entities/notificationEntities';

export interface NotificationDto {
  id: string;
  userId: string;
  type: NotificationType;
  isRead: boolean;
  postId: string | null;
  commentId: number | null;
  commentCount: number | null;
  representativeUserId: string | null;
  representativeCommentId: number | null;
  milestoneValue: number | null;
  createdAt: string;
  updatedAt: string;
  postTitle: string | null;
  representativeUserNickname: string | null;
  representativeUserProfileImageUrl: string | null;
  commentContent: string | null;
  representativeCommentContent: string | null;
}
