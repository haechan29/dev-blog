import { toDto } from '@/features/notification/data/mapper/notificationMapper';
import * as MilestoneThresholdQueries from '@/features/notification/data/queries/milestoneThresholdQueries';
import * as NotificationQueries from '@/features/notification/data/queries/notificationQueries';
import * as PostQueries from '@/features/post/data/queries/postQueries';

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

export async function insertPostViewMilestoneNotification({
  postId,
  authorId,
  milestoneValue,
}: {
  postId: string;
  authorId: string;
  milestoneValue: number;
}) {
  const thresholds =
    await MilestoneThresholdQueries.fetchMilestoneThresholds('post_view');

  if (!thresholds.includes(milestoneValue)) {
    return;
  }

  await NotificationQueries.insertPostViewMilestoneNotification({
    postId,
    authorId,
    milestoneValue,
  });
}

export async function insertPostLikeMilestoneNotification({
  postId,
  userId,
  milestoneValue,
}: {
  postId: string;
  userId: string;
  milestoneValue: number;
}) {
  const post = await PostQueries.fetchPostForAuth(postId);
  const authorId = post.user_id;

  if (authorId === userId) {
    return;
  }

  const thresholds =
    await MilestoneThresholdQueries.fetchMilestoneThresholds('post_like');

  if (!thresholds.includes(milestoneValue)) {
    return;
  }

  await NotificationQueries.insertPostLikeMilestoneNotification({
    postId,
    authorId,
    milestoneValue,
  });
}
