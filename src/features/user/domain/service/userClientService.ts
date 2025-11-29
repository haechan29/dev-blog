import * as UserClientRepository from '@/features/user/data/repository/userClientRepository';

export async function fetchUser() {
  return await UserClientRepository.fetchUser();
}

export async function createUser({ nickname }: { nickname: string }) {
  await UserClientRepository.createUser({ nickname });
}

export async function deleteUser() {
  await UserClientRepository.deleteUser();
}
