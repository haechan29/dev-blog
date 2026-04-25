import { CommentResponseDto } from '@/features/comment/data/dto/commentResponseDto';
import { RankedCommentEntity } from '@/features/comment/data/entities/rankedCommentEntities';

export function toDto(comment: RankedCommentEntity): CommentResponseDto {
  return {
    id: comment.id,
    postId: comment.postId,
    authorName: comment.nickname,
    content: comment.content,
    createdAt: comment.createdAt,
    updatedAt: comment.updatedAt,
    likeCount: comment.likeCount,
    userId: comment.userId,
    deletedAt: comment.deletedAt,
    registeredAt: comment.registeredAt,
    profileImageUrl: comment.profileImageUrl,
  };
}
