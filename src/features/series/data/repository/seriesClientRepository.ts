import { SeriesDto } from '@/features/series/data/dto/seriesDto';
import { api } from '@/lib/api';

export async function fetchSeriesByUserId(
  userId: string
): Promise<SeriesDto[]> {
  const response = await api.get(`/api/user/${userId}/series`);
  return response.data;
}
