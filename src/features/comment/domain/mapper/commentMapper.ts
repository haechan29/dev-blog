import { Comment } from '@/features/comment/domain/model/comment';
import { CommentResponseDto } from '@/features/comment/data/dto/commentResponseDto';

export function toDomain(dto: CommentResponseDto): Comment {
  return new Comment(
    dto.id,
    dto.postId,
    dto.authorName,
    dto.content,
    dto.createdAt,
    dto.updatedAt
  );
}
