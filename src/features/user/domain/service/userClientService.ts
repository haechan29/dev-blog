import * as UserClientRepository from '@/features/user/data/repository/userClientRepository';
import { toDomain } from '@/features/user/domain/mapper/userMapper';

export async function fetchUser() {
  const user = await UserClientRepository.fetchUser();
  return user ? toDomain(user) : null;
}

export async function createUser({ nickname }: { nickname: string }) {
  await UserClientRepository.createUser({ nickname });
}

export async function deleteUser() {
  await UserClientRepository.deleteUser();
}
