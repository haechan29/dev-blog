import * as SubscriptionQueries from '@/features/subscription/data/queries/subscriptionQueries';
import 'server-only';

export async function getSubscriptionInfo(userId: string) {
  return SubscriptionQueries.getSubscriptionInfo(userId);
}
