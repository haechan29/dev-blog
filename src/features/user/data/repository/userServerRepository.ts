import { toData } from '@/features/user/data/mapper/userMapper';
import * as UserQueries from '@/features/user/data/queries/userQueries';
import { User } from '@/features/user/domain/types/user';
import 'server-only';

export async function getUserById(userId: string) {
  const user: User | null = await UserQueries.getUserById(userId);
  return user ? toData(user) : null;
}
