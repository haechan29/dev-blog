import { CommentResponseDto } from '@/features/comment/data/dto/commentResponseDto';
import { Comment } from '@/features/comment/domain/model/comment';
import { getUserStatus } from '@/features/user/domain/mapper/userMapper';

export function toDomain(dto: CommentResponseDto): Comment {
  return new Comment(
    dto.id,
    dto.postId,
    dto.authorName,
    dto.content,
    dto.createdAt,
    dto.updatedAt,
    dto.likeCount,
    dto.userId,
    getUserStatus(dto)
  );
}
