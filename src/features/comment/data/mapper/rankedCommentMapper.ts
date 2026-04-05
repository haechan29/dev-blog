import { CommentResponseDto } from '@/features/comment/data/dto/commentResponseDto';
import { RankedCommentEntity } from '@/features/comment/data/entities/rankedCommentEntities';

export function toDto(comment: RankedCommentEntity): CommentResponseDto {
  return {
    id: comment.id,
    postId: comment.post_id,
    authorName: comment.nickname,
    content: comment.content,
    createdAt: comment.created_at,
    updatedAt: comment.updated_at,
    likeCount: comment.like_count,
    userId: comment.user_id,
    deletedAt: comment.deleted_at,
    registeredAt: comment.registered_at,
    profileImageUrl: comment.profile_image_url,
  };
}
