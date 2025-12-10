import { SeriesDto } from '@/features/series/data/dto/seriesDto';
import { api } from '@/lib/api';

export async function fetchSeries(
  userId: string,
  seriesId: string
): Promise<SeriesDto> {
  const response = await api.get(`/api/user/${userId}/series/${seriesId}`);
  return response.data;
}

export async function fetchSeriesByUserId(
  userId: string
): Promise<SeriesDto[]> {
  const response = await api.get(`/api/user/${userId}/series`);
  return response.data;
}

export async function createSeries({
  userId,
  title,
  description,
}: {
  userId: string;
  title: string;
  description: string | null;
}): Promise<void> {
  await api.post(`/api/user/${userId}/series`, { title, description });
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
}): Promise<SeriesDto> {
  const response = await api.patch(`/api/user/${userId}/series/${seriesId}`, {
    title,
    description,
  });
  return response.data;
}

export async function deleteSeries({
  userId,
  seriesId,
}: {
  userId: string;
  seriesId: string;
}): Promise<void> {
  await api.delete(`/api/user/${userId}/series/${seriesId}`);
}
