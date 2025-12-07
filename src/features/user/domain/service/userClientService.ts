import * as UserClientRepository from '@/features/user/data/repository/userClientRepository';
import { toDomain } from '@/features/user/domain/mapper/userMapper';

export async function fetchUser() {
  const user = await UserClientRepository.fetchUser();
  return user ? toDomain(user) : null;
}

export async function updateUser({ nickname }: { nickname: string }) {
  await UserClientRepository.updateUser({ nickname });
}

export async function deleteUser() {
  await UserClientRepository.deleteUser();
}
