import { PostDto } from '@/features/post/data/dto/postDto';
import Post from '@/features/post/domain/model/post';

export function toDomain(dto: PostDto): Post {
  return new Post(
    dto.id,
    dto.title,
    dto.createdAt,
    dto.updatedAt,
    dto.content,
    dto.tags,
    dto.userId,
    dto.guestId,
    dto.authorName,
    dto.isDeleted,
    dto.isGuest,
    dto.seriesId,
    dto.seriesOrder
  );
}
