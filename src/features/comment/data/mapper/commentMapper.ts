import { CommentResponseDto } from '@/features/comment/data/dto/commentResponseDto';
import {
  CommentEntity,
  CommentEntityFlat,
} from '@/features/comment/data/entities/commentEntities';

export function toDto(comment: CommentEntity): CommentResponseDto {
  return {
    id: comment.id,
    postId: comment.post_id,
    authorName:
      comment.users.nickname ??
      `Guest#${comment.user_id?.slice(0, 4) ?? '0000'}`,
    content: comment.content,
    createdAt: comment.created_at,
    updatedAt: comment.updated_at,
    likeCount: comment.like_count,
    userId: comment.user_id,
    deletedAt: comment.users.deleted_at,
    registeredAt: comment.users.registered_at,
  };
}

export function flatToDto(comment: CommentEntityFlat): CommentResponseDto {
  return {
    id: comment.id,
    postId: comment.post_id,
    authorName:
      comment.nickname ?? `Guest#${comment.user_id?.slice(0, 4) ?? '0000'}`,
    content: comment.content,
    createdAt: comment.created_at,
    updatedAt: comment.updated_at,
    likeCount: comment.like_count,
    userId: comment.user_id,
    deletedAt: comment.deleted_at,
    registeredAt: comment.registered_at,
  };
}
