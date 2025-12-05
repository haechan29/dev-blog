import * as SeriesClientRepository from '@/features/series/data/repository/seriesClientRepository';
import { toDomain } from '@/features/series/domain/mapper/seriesMapper';

export async function fetchSeries(userId: string, seriesId: string) {
  const dto = await SeriesClientRepository.fetchSeries(userId, seriesId);
  return toDomain(dto);
}

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

export async function updateSeries({
  userId,
  seriesId,
  title,
  description,
}: {
  userId: string;
  seriesId: string;
  title: string;
  description: string | null;
}) {
  const dto = await SeriesClientRepository.updateSeries({
    userId,
    seriesId,
    title,
    description,
  });
  return toDomain(dto);
}

export async function deleteSeries({
  userId,
  seriesId,
}: {
  userId: string;
  seriesId: string;
}) {
  await SeriesClientRepository.deleteSeries({ userId, seriesId });
}
