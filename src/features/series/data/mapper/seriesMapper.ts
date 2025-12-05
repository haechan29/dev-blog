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
    authorName: entity.users?.nickname ?? '익명',
    posts:
      entity.posts?.map(post => ({
        id: post.id,
        title: post.title,
        createdAt: post.created_at,
        seriesId: post.series_id,
        seriesOrder: post.series_order,
      })) ?? [],
    postCount: entity.postCounts?.[0]?.count ?? entity.posts?.length ?? 0,
  };
}
