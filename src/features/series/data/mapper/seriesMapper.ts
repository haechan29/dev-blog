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
    postCount: entity.posts?.[0]?.count ?? 0,
  };
}
