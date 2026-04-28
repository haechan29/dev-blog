import { db } from '@/db/index';
import { subscriptions, users } from '@/db/schema';
import { UnauthorizedError, ValidationError } from '@/errors/errors';
import { isUniqueViolation } from '@/errors/lib';
import { getUserId } from '@/lib/user';
import { and, eq, isNull } from 'drizzle-orm';
import 'server-only';

export async function getSubscriptionInfo({
  followerUserId,
  followingUserId,
}: {
  followerUserId?: string;
  followingUserId: string;
}) {
  if (!followerUserId) {
    return { isSubscribed: false };
  }

  const entity = await db
    .select({ followerId: subscriptions.followerId })
    .from(subscriptions)
    .where(
      and(
        eq(subscriptions.followerId, followerUserId),
        eq(subscriptions.followingId, followingUserId)
      )
    )
    .limit(1);

  return { isSubscribed: entity.length > 0 };
}

export async function getFollowers(userId: string) {
  return await db
    .select({
      id: users.id,
      nickname: users.nickname,
      profileImageUrl: users.profileImageUrl,
    })
    .from(subscriptions)
    .innerJoin(users, eq(subscriptions.followerId, users.id))
    .where(and(eq(subscriptions.followingId, userId), isNull(users.deletedAt)));
}

export async function getFollowing(userId: string) {
  return await db
    .select({
      id: users.id,
      nickname: users.nickname,
      profileImageUrl: users.profileImageUrl,
    })
    .from(subscriptions)
    .innerJoin(users, eq(subscriptions.followingId, users.id))
    .where(and(eq(subscriptions.followerId, userId), isNull(users.deletedAt)));
}

export async function getFollowingIds(userId: string) {
  const entities = await db
    .select({ followingId: subscriptions.followingId })
    .from(subscriptions)
    .where(eq(subscriptions.followerId, userId));

  return entities.map(entity => entity.followingId);
}

export async function createSubscription(
  followingId: string,
  followerId: string
) {
  if (followerId === followingId) {
    throw new ValidationError('자기 자신을 구독할 수 없습니다');
  }

  try {
    await db.insert(subscriptions).values({
      followerId,
      followingId,
    });
  } catch (error) {
    if (isUniqueViolation(error)) {
      throw new ValidationError('이미 구독한 사용자입니다');
    }
    throw error;
  }
}

export async function deleteSubscription(followingId: string) {
  const followerId = await getUserId();
  if (!followerId) {
    throw new UnauthorizedError('인증되지 않은 요청입니다');
  }

  if (followerId === followingId) {
    throw new ValidationError('자기 자신을 구독취소할 수 없습니다');
  }

  return await db
    .delete(subscriptions)
    .where(
      and(
        eq(subscriptions.followerId, followerId),
        eq(subscriptions.followingId, followingId)
      )
    )
    .returning({ followerId: subscriptions.followerId });
}
