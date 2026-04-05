import { NotificationDto } from '@/features/notification/data/dto/notificationDto';
import { NotificationEntity } from '@/features/notification/data/entities/notificationEntities';

export function toDto(entity: NotificationEntity): NotificationDto {
  return {
    id: entity.id,
    userId: entity.user_id,
    type: entity.type,
    isRead: entity.is_read,
    postId: entity.post_id,
    commentId: entity.comment_id,
    commentCount: entity.comment_count,
    representativeUserId: entity.representative_user_id,
    representativeCommentId: entity.representative_comment_id,
    milestoneValue: entity.milestone_value,
    createdAt: entity.created_at,
    updatedAt: entity.updated_at,
    postTitle: entity.post?.title ?? null,
    representativeUserNickname: entity.representative_user?.nickname ?? null,
    representativeUserProfileImageUrl:
      entity.representative_user?.profile_image_url ?? null,
    commentContent: entity.comment?.content ?? null,
    representativeCommentContent:
      entity.representative_comment?.content ?? null,
  };
}
