import { ValidationError } from '@/errors/errors';
import * as UserQueries from '@/features/user/data/queries/userQueries';
import { AdapterUser } from 'next-auth/adapters';
import { cookies } from 'next/headers';
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

export async function mergeAnonymousUser(
  user: AdapterUser,
  onCreateUser: (user: AdapterUser) => Promise<AdapterUser>
) {
  const cookieStore = await cookies();
  const userIdFromCookie = cookieStore.get('userId')?.value;
  if (!userIdFromCookie) {
    return await onCreateUser(user);
  }

  const authInfo = await UserQueries.fetchUserAuthInfo(userIdFromCookie);
  if (!authInfo) {
    return await onCreateUser(user);
  } else if (authInfo.email || authInfo.emailVerified) {
    throw new Error('이미 인증된 사용자입니다');
  }

  await UserQueries.updateUser({
    userId: userIdFromCookie,
    name: user.name,
    email: user.email,
    emailVerified: user.emailVerified?.toISOString() ?? null,
  });

  cookieStore.delete('userId');

  return {
    id: userIdFromCookie,
    name: user.name,
    email: user.email,
    emailVerified: user.emailVerified,
  };
}
