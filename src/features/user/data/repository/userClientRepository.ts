import { UserResponseDto } from '@/features/user/data/dto/userResponseDto';
import { api } from '@/lib/api';

export async function fetchUser(): Promise<UserResponseDto | null> {
  const response = await api.get('/api/user');
  return response.data;
}

export async function updateUser({
  nickname,
}: {
  nickname: string;
}): Promise<void> {
  await api.patch('/api/user', { nickname });
}

export async function deleteUser(): Promise<void> {
  await api.delete('/api/user');
}
