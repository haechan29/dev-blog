import { api } from '@/lib/api';

export async function fetchUnreadNotificationCount(): Promise<{
  unreadCount: number;
}> {
  const response = await api.get('/api/notifications/unread-count');
  return response.data;
}
