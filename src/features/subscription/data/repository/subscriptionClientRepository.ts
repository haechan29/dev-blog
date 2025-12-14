import { FollowUserDto } from '@/features/subscription/data/dto/followUserDto';
import { SubscriptionDto } from '@/features/subscription/data/dto/subscriptionDto';
import { api } from '@/lib/api';

export async function getSubscriptionInfo(
  userId: string
): Promise<SubscriptionDto> {
  const response = await api.get(`/api/subscriptions/${userId}`);
  return response.data;
}

export async function getFollowers(userId: string): Promise<FollowUserDto[]> {
  const response = await api.get(`/api/subscriptions/${userId}/followers`);
  return response.data;
}

export async function getFollowing(userId: string): Promise<FollowUserDto[]> {
  const response = await api.get(`/api/subscriptions/${userId}/following`);
  return response.data;
}

export async function subscribe(userId: string): Promise<void> {
  await api.post(`/api/subscriptions/${userId}`);
}

export async function unsubscribe(userId: string): Promise<void> {
  await api.delete(`/api/subscriptions/${userId}`);
}
