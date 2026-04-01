import * as SubscriptionQueries from '@/features/subscription/data/queries/subscriptionQueries';
import 'server-only';

export async function getSubscriptionInfo({
  followerUserId,
  followingUserId,
}: {
  followerUserId?: string;
  followingUserId: string;
}) {
  return SubscriptionQueries.getSubscriptionInfo({
    followerUserId,
    followingUserId,
  });
}
