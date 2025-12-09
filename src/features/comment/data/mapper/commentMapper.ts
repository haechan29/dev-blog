import { CommentResponseDto } from '@/features/comment/data/dto/commentResponseDto';
import { CommentEntity } from '@/features/comment/data/entities/commentEntities';

export function toDto(comment: CommentEntity): CommentResponseDto {
  return {
    id: comment.id,
    postId: comment.post_id,
    authorName:
      comment.users?.nickname ??
      `Guest#${comment.user_id?.slice(0, 4) ?? '0000'}`,
    content: comment.content,
    createdAt: comment.created_at,
    updatedAt: comment.updated_at,
    likeCount: comment.like_count,
    userId: comment.user_id,
    isDeleted: !!comment.users.deleted_at,
  };
}
