import { toDto } from '@/features/notification/data/mapper/notificationMapper';
import * as NotificationQueries from '@/features/notification/data/queries/notificationQueries';

const NOTIFICATION_LIMIT = 10;

export async function getNotifications({
  userId,
  cursorUpdatedAt,
  cursorId,
}: {
  userId: string;
  cursorUpdatedAt: string | null;
  cursorId: string | null;
}) {
  const entities = await NotificationQueries.fetchNotifications({
    userId,
    limit: NOTIFICATION_LIMIT + 1,
    cursorUpdatedAt: cursorUpdatedAt ?? undefined,
    cursorId: cursorId ?? undefined,
  });

  const isLastPage = entities.length <= NOTIFICATION_LIMIT;
  const notifications = entities.slice(0, NOTIFICATION_LIMIT);
  const last = notifications.at(-1);

  return {
    notifications: notifications.map(toDto),
    nextCursor:
      isLastPage || !last ? null : { updatedAt: last.updated_at, id: last.id },
  };
}
