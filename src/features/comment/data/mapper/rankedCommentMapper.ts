import { CommentResponseDto } from '@/features/comment/data/dto/commentResponseDto';
import { RankedCommentEntity } from '@/features/comment/data/entities/rankedCommentEntities';

export function toDto(comment: RankedCommentEntity): CommentResponseDto {
  return {
    id: comment.id,
    postId: comment.postId,
    content: comment.content,
    createdAt: comment.createdAt,
    updatedAt: comment.updatedAt,
    likeCount: comment.likeCount,
    userId: comment.userId,
    user: {
      nickname: comment.user.nickname,
      deletedAt: comment.user.deletedAt,
      registeredAt: comment.user.registeredAt,
      profileImageUrl: comment.user.profileImageUrl,
    },
  };
}
