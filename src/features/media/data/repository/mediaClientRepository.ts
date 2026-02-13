import { api } from '@/lib/api';

export async function uploadPostImage(file: File): Promise<{
  small: string;
  medium: string;
  original: string;
}> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await api.post('/api/media/post-image', formData);
  return response.data;
}

export async function uploadAvatarImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await api.post('/api/media/avatar-image', formData);
  return response.data;
}

export async function uploadAudio(file: File): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await api.post('/api/media/audio', formData);
  return response.data.url;
}
