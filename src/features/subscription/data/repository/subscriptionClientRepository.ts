import { api } from '@/lib/api';

export async function subscribe(userId: string): Promise<void> {
  await api.post(`/api/subscriptions/${userId}`);
}

export async function unsubscribe(userId: string): Promise<void> {
  await api.delete(`/api/subscriptions/${userId}`);
}

export async function checkSubscription(
  userId: string
): Promise<{ isSubscribed: boolean }> {
  const response = await api.get(`/api/subscriptions/${userId}`);
  return response.data;
}
