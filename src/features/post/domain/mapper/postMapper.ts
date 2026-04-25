import { PostDto } from '@/features/post/data/dto/postDto';
import Post from '@/features/post/domain/model/post';

export function toDomain(dto: PostDto): Post {
  return new Post(
    dto.id,
    dto.title,
    dto.createdAt,
    dto.updatedAt,
    dto.contentJson,
    dto.preview,
    dto.tags,
    dto.userId,
    dto.user.nickname,
    dto.user.bio,
    dto.user.profileImageUrl,
    dto.seriesId,
    dto.seriesOrder,
    dto.series?.title ?? null,
    dto.postStat.likeCount,
    dto.postStat.viewCount,
    dto.postStat.commentCount,
    dto.visibility
  );
}
