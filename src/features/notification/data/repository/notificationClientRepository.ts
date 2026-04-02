import { NotificationDto } from '@/features/notification/data/dto/notificationDto';
import { NotificationCursor } from '@/features/notification/domain/types/notificationCursor';
import { api } from '@/lib/api';

export async function getUnreadNotificationCount(): Promise<{
  unreadCount: number;
}> {
  const response = await api.get('/api/notifications/unread-count');
  return response.data;
}

export async function getNotifications(
  cursor: NotificationCursor | null
): Promise<{
  notifications: NotificationDto[];
  nextCursor: NotificationCursor | null;
}> {
  const params = new URLSearchParams();
  if (cursor) {
    params.set('cursorUpdatedAt', cursor.updatedAt);
    params.set('cursorId', cursor.id);
  }
  const qs = params.toString();
  const url = qs ? `/api/notifications?${qs}` : '/api/notifications';
  const response = await api.get(url);
  return response.data;
}
