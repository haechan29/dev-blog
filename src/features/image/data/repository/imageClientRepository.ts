import { api } from '@/lib/api';

export async function uploadImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await api.post('/api/images', formData);
  return response.data.url;
}
