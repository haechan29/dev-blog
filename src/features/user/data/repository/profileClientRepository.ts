import { api } from '@/lib/api';

export async function updateProfile({ bio }: { bio?: string }): Promise<void> {
  await api.patch('/api/user/profile', { bio });
}

export async function updateProfileImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await api.put('/api/user/profile/image', formData);
  return response.data.url;
}
