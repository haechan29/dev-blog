import { CommentResponseDto } from '@/features/comment/data/dto/commentResponseDto';
import { CommentEntity } from '@/features/comment/data/entities/commentEntities';

export function toDto(comment: CommentEntity): CommentResponseDto {
  return {
    id: comment.id,
    postId: comment.postId,
    authorName: comment.user.nickname,
    content: comment.content,
    createdAt: comment.createdAt,
    updatedAt: comment.updatedAt,
    likeCount: comment.likeCount,
    userId: comment.userId,
    deletedAt: comment.user.deletedAt,
    registeredAt: comment.user.registeredAt,
    profileImageUrl: comment.user.profileImageUrl,
  };
}
