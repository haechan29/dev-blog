import * as NotificationClientRepository from '@/features/notification/data/repository/notificationClientRepository';
import { NotificationCursor } from '@/features/notification/domain/types/notificationCursor';
import { mapNotificationDtoToListItemUi } from '@/features/notification/ui/notificationListItemMapper';
import { NotificationListItemUi } from '@/features/notification/ui/notificationListItemUiModel';

export async function getNotificationsPage(params: {
  cursor: NotificationCursor | null;
}): Promise<{
  items: NotificationListItemUi[];
  nextCursor: NotificationCursor | null;
}> {
  const { notifications, nextCursor } =
    await NotificationClientRepository.fetchNotifications(params.cursor);
  return {
    items: notifications.map(mapNotificationDtoToListItemUi),
    nextCursor,
  };
}
