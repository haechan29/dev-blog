import { NotificationType } from '@/features/notification/domain/types/notificationType';

export interface NotificationDto {
  id: string;
  userId: string;
  type: NotificationType;
  isRead: boolean;
  inquiryThreadId: string | null;
  postId: string | null;
  commentId: string | null;
  commentCount: number | null;
  representativeUserId: string | null;
  representativeCommentId: string | null;
  milestoneValue: number | null;
  createdAt: string;
  updatedAt: string;
  post: {
    title: string;
  } | null;
  representativeUser: {
    nickname: string | null;
    profileImageUrl: string | null;
  } | null;
  representativeComment: {
    content: string | null;
  } | null;
  comment: {
    content: string | null;
  } | null;
  inquiryThread: {
    firstMessagePreview: string | null;
  } | null;
}
