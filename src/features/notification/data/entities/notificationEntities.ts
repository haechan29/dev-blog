import * as NotificationQueries from '@/features/notification/data/queries/notificationQueries';

export type NotificationEntity = Awaited<
  ReturnType<typeof NotificationQueries.fetchNotifications>
>[number];
