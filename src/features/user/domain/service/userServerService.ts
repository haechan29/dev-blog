import * as UserServerRepository from '@/features/user/data/repository/userServerRepository';
import { toDomain } from '@/features/user/domain/mapper/userMapper';
import 'server-only';

export async function getUserById(userId: string) {
  const user = await UserServerRepository.getUserById(userId);
  return user ? toDomain(user) : null;
}
