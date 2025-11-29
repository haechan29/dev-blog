import { DuplicateNicknameError } from '@/features/user/data/errors/userErrors';
import { api, ApiError } from '@/lib/api';

export async function createUser({
  nickname,
}: {
  nickname: string;
}): Promise<void> {
  try {
    await api.post('/api/user', { nickname });
  } catch (error) {
    if (error instanceof ApiError && error.code === 'DUPLICATE_NICKNAME') {
      throw new DuplicateNicknameError(nickname);
    }
    throw error;
  }
}
