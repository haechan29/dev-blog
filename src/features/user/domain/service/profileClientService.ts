import * as ProfileClientRepository from '@/features/user/data/repository/profileClientRepository';
import { toDomain } from '@/features/user/domain/mapper/userMapper';

export async function fetchUserById(userId: string) {
  const user = await ProfileClientRepository.fetchUserById(userId);
  return user ? toDomain(user) : null;
}
