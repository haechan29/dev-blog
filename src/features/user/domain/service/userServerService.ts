import * as UserServerRepository from '@/features/user/data/repository/userServerRepository';
import { toDomain } from '@/features/user/domain/mapper/userMapper';
import 'server-only';

export async function fetchUserById(userId: string) {
  const user = await UserServerRepository.fetchUserById(userId);
  return user ? toDomain(user) : null;
}

export async function fetchUserByAuthId(userId: string) {
  const user = await UserServerRepository.fetchUserByAuthId(userId);
  return user ? toDomain(user) : null;
}

export async function createUser(): Promise<string> {
  return await UserServerRepository.createUser();
}
