import * as UserQueries from '@/features/user/data/queries/userQueries';
import 'server-only';

export async function fetchUserById(userId: string) {
  return await UserQueries.fetchUserById(userId);
}

export async function fetchUserByAuthId(userId: string) {
  return await UserQueries.fetchUserByAuthId(userId);
}

export async function createUser(): Promise<string> {
  return await UserQueries.createUser();
}
