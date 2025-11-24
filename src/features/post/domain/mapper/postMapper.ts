import { PostResponseDto } from '@/features/post/data/dto/postResponseDto';
import Post from '@/features/post/domain/model/post';

export function toDomain(dto: PostResponseDto): Post {
  return new Post(
    dto.id,
    dto.authorName,
    dto.title,
    dto.createdAt,
    dto.updatedAt,
    dto.content,
    dto.tags,
    dto.authorId
  );
}
