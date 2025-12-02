import * as SeriesServerRepository from '@/features/series/data/repository/seriesServerRepository';
import { toDomain } from '@/features/series/domain/mapper/seriesMapper';
import 'server-only';

export async function fetchSeries(seriesId: string) {
  const dto = await SeriesServerRepository.fetchSeries(seriesId);
  return toDomain(dto);
}

export async function fetchSeriesByUserId(userId: string) {
  const dtos = await SeriesServerRepository.fetchSeriesByUserId(userId);
  return dtos.map(toDomain);
}
