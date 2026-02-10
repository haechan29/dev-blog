import { UserResponseDto } from '@/features/user/data/dto/userResponseDto';
import { api } from '@/lib/api';

export async function fetchUserById(userId: string): Promise<UserResponseDto | null> {
  const response = await api.get(`/api/user?id=${userId}`);
  return response.data;
}

export async function updateProfile({ bio }: { bio?: string }): Promise<void> {
  await api.patch('/api/user/profile', { bio });
}

export async function updateProfileImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await api.put('/api/user/profile/image', formData);
  return response.data.url;
}
