import { NotificationDto } from '@/features/notification/data/dto/notificationDto';
import { NotificationEntity } from '@/features/notification/data/entities/notificationEntities';
import { toNotificationType } from '@/features/notification/domain/types/notificationType';

export function toDto(entity: NotificationEntity): NotificationDto {
  return {
    id: entity.id,
    userId: entity.userId,
    type: toNotificationType(entity.type),
    isRead: entity.isRead,
    inquiryThreadId: entity.inquiryThreadId ?? null,
    postId: entity.postId,
    commentId: entity.commentId,
    commentCount: entity.commentCount,
    representativeUserId: entity.representativeUserId,
    representativeCommentId: entity.representativeCommentId,
    milestoneValue: entity.milestoneValue,
    createdAt: entity.createdAt,
    updatedAt: entity.updatedAt,
    post: entity.post,
    representativeUser: entity.representativeUser,
    comment: entity.comment,
    representativeComment: entity.representativeComment,
    inquiryThread: entity.inquiryThread,
  };
}
