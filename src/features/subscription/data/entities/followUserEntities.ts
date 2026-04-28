import type * as SubscriptionQueries from '@/features/subscription/data/queries/subscriptionQueries';

export type FollowUserEntity = Awaited<
  ReturnType<typeof SubscriptionQueries.getFollowers>
>[number];
