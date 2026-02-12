import { OgDto } from '@/features/og/data/dto/ogDto';
import { api } from '@/lib/api';

export async function getOg(url: string): Promise<OgDto> {
  const response = await api.get(`/api/og?url=${encodeURIComponent(url)}`);
  return response.data;
}
