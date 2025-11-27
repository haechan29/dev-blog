import { CommentResponseDto } from '@/features/comment/data/dto/commentResponseDto';
import { Comment } from '@/features/comment/domain/types/comment';

export function toData(comment: Comment): CommentResponseDto {
  return {
    id: comment.id,
    postId: comment.post_id,
    authorName: comment.author_name,
    content: comment.content,
    createdAt: comment.created_at,
    updatedAt: comment.updated_at,
    likeCount: comment.like_count,
    userId: comment.user_id,
    guestId: comment.guest_id,
    isDeleted: comment.is_deleted,
    isGuest: comment.is_guest,
  };
}
