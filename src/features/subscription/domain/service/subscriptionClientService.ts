import * as SubscriptionClientRepository from '@/features/subscription/data/repository/subscriptionClientRepository';

export async function checkSubscription(userId: string): Promise<boolean> {
  const dto = await SubscriptionClientRepository.checkSubscription(userId);
  return dto.isSubscribed;
}
