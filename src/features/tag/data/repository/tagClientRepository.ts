import { api } from '@/lib/api';

export async function getTagNames({
  query,
}: {
  query: string;
}): Promise<string[]> {
  const response = await api.get(`/api/tags?q=${query}`);
  return response.data;
}
