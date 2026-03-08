import { PostDto } from '@/features/post/data/dto/postDto';
import Post from '@/features/post/domain/model/post';

export function toDomain(dto: PostDto): Post {
  return new Post(
    dto.id,
    dto.title,
    dto.createdAt,
    dto.updatedAt,
    dto.content,
    dto.contentJson,
    dto.tags,
    dto.userId,
    dto.authorName,
    dto.bio,
    dto.profileImageUrl,
    dto.seriesId,
    dto.seriesOrder,
    dto.seriesTitle,
    dto.likeCount,
    dto.viewCount,
    dto.visibility
  );
}
