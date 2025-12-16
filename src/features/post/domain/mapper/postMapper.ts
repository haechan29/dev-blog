import { PostDto } from '@/features/post/data/dto/postDto';
import Post from '@/features/post/domain/model/post';
import { getUserStatus } from '@/features/user/domain/mapper/userMapper';

export function toDomain(dto: PostDto): Post {
  return new Post(
    dto.id,
    dto.title,
    dto.createdAt,
    dto.updatedAt,
    dto.content,
    dto.tags,
    dto.userId,
    dto.authorName,
    getUserStatus(dto),
    dto.seriesId,
    dto.seriesOrder,
    dto.seriesTitle,
    dto.likeCount,
    dto.viewCount
  );
}
