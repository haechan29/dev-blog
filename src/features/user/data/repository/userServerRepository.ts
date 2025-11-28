import * as UserQueries from '@/features/user/data/queries/userQueries';
import 'server-only';

export async function getUserById(userId: string) {
  return await UserQueries.getUserById(userId);
}
