import { api } from '@/lib/api';

export async function fetchSeriesByUserId(userId: string) {
  const response = await api.get(`/api/users/${userId}/series`);
  return response.data;
}
