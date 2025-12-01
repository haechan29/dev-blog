import * as UserServerRepository from '@/features/user/data/repository/userServerRepository';
import { toDomain } from '@/features/user/domain/mapper/userMapper';
import 'server-only';

export async function fetchUserById(userId: string) {
  const user = await UserServerRepository.fetchUserById(userId);
  return user ? toDomain(user) : null;
}
