import { ValidationError } from '@/errors/errors';
import * as UserQueries from '@/features/user/data/queries/userQueries';
import 'server-only';

export async function incrementSubscriberCount(
  userId: string,
  subscriberCount: number
) {
  const nextCount = subscriberCount + 1;

  await UserQueries.updateUser({
    userId,
    subscriberCount: nextCount,
  });
}

export async function decrementSubscriberCount(userId: string) {
  const user = await UserQueries.fetchUser(userId);

  if (!user) {
    throw new ValidationError('사용자를 찾을 수 없습니다');
  }
  const nextCount = Math.max(0, user.subscriberCount - 1);

  await UserQueries.updateUser({
    userId,
    subscriberCount: nextCount,
  });
}

export async function softDeleteUser(userIdFromSession: string) {
  const now = new Date().toISOString();

  await UserQueries.updateUser({
    userId: userIdFromSession,
    nickname: null,
    deletedAt: now,
  });
}
