import * as UserClientRepository from '@/features/user/data/repository/userClientRepository';

export async function createUser({
  nickname,
}: {
  nickname: string;
}): Promise<void> {
  await UserClientRepository.createUser({ nickname });
}

export async function deleteUser(): Promise<void> {
  await UserClientRepository.deleteUser();
}
