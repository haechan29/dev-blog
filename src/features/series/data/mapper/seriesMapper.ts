import { SeriesDto } from '@/features/series/data/dto/seriesDto';
import { SeriesEntity } from '@/features/series/data/entities/seriesEntities';

export function toDto(entity: SeriesEntity): SeriesDto {
  return {
    id: entity.id,
    title: entity.title,
    description: entity.description,
    createdAt: entity.created_at,
    updatedAt: entity.updated_at,
    userId: entity.user_id,
    authorName:
      entity.users.nickname ?? `Guest#${entity.user_id?.slice(0, 4) ?? '0000'}`,
    posts: entity.posts.map(post => ({
      id: post.id,
      title: post.title,
      createdAt: post.created_at,
      seriesId: post.series_id,
      seriesOrder: post.series_order,
      likeCount: post.post_stats?.like_count ?? 0,
      viewCount: post.post_stats?.view_count ?? 0,
    })),
    postCount: entity.posts.length,
  };
}
