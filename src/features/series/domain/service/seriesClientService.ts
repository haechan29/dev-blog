import * as SeriesClientRepository from '@/features/series/data/repository/seriesClientRepository';
import { toDomain } from '@/features/series/domain/mapper/seriesMapper';

export async function fetchSeriesByUserId(userId: string) {
  const dtos = await SeriesClientRepository.fetchSeriesByUserId(userId);
  return dtos.map(toDomain);
}

export async function createSeries({
  userId,
  title,
  description,
}: {
  userId: string;
  title: string;
  description: string | null;
}) {
  await SeriesClientRepository.createSeries({ userId, title, description });
}
