import * as NotificationClientRepository from '@/features/notification/data/repository/notificationClientRepository';
import { NotificationCursor } from '@/features/notification/domain/types/notificationCursor';
import { toProps } from '@/features/notification/ui/mapper/notificationMapper';
import { NotificationProps } from '@/features/notification/ui/model/notificationProps';

export async function getNotifications(params: {
  cursor: NotificationCursor | null;
}): Promise<{
  notifications: NotificationProps[];
  nextCursor: NotificationCursor | null;
}> {
  const { notifications, nextCursor } =
    await NotificationClientRepository.getNotifications(params.cursor);
  return {
    notifications: notifications.map(toProps),
    nextCursor,
  };
}
