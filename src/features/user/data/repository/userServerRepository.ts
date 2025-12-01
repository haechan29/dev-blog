import * as UserQueries from '@/features/user/data/queries/userQueries';
import 'server-only';

export async function fetchUserById(userId: string) {
  return await UserQueries.fetchUserById(userId);
}
