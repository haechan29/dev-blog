import { PostResponseDto } from '@/features/post/data/dto/postResponseDto';
import Post from '@/features/post/domain/model/post';

export function toDomain(dto: PostResponseDto): Post {
  return new Post(
    dto.id,
    dto.title,
    dto.createdAt,
    dto.updatedAt,
    dto.content,
    dto.tags,
    dto.userId,
    dto.guestId,
    dto.authorName
  );
}
