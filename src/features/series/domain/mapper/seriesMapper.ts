import { SeriesDto } from '@/features/series/data/dto/seriesDto';
import { Series } from '@/features/series/domain/model/series';

export function toDomain(dto: SeriesDto): Series {
  return {
    id: dto.id,
    title: dto.title,
    description: dto.description,
    createdAt: dto.createdAt,
    updatedAt: dto.updatedAt,
    userId: dto.userId,
    authorName: dto.authorName,
    profileImageUrl: dto.profileImageUrl,
    posts: dto.posts.map(post => ({
      id: post.id,
      title: post.title,
      createdAt: post.createdAt,
      seriesId: post.seriesId,
      seriesOrder: post.seriesOrder,
      likeCount: post.postStat.likeCount,
      viewCount: post.postStat.viewCount,
      commentCount: post.postStat.commentCount,
      visibility: post.visibility,
    })),
    postCount: dto.postCount,
  };
}
