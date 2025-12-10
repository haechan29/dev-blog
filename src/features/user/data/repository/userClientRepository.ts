import { UserResponseDto } from '@/features/user/data/dto/userResponseDto';
import { DuplicateNicknameError } from '@/features/user/data/errors/userErrors';
import { api, ApiError } from '@/lib/api';

export async function fetchUser(): Promise<UserResponseDto | null> {
  const response = await api.get('/api/user');
  return response.data;
}

export async function updateUser({
  nickname,
}: {
  nickname: string;
}): Promise<void> {
  try {
    await api.patch('/api/user', { nickname });
  } catch (error) {
    if (error instanceof ApiError && error.code === 'DUPLICATE_NICKNAME') {
      throw new DuplicateNicknameError(nickname);
    }
    throw error;
  }
}

export async function deleteUser(): Promise<void> {
  await api.delete('/api/user');
}
