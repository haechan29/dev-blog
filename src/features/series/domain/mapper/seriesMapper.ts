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
  };
}
