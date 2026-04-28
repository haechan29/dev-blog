import { toDto } from '@/features/notification/data/mapper/notificationMapper';
import * as MilestoneThresholdQueries from '@/features/notification/data/queries/milestoneThresholdQueries';
import * as NotificationQueries from '@/features/notification/data/queries/notificationQueries';
import * as PostQueries from '@/features/post/data/queries/postQueries';

const NOTIFICATION_LIMIT = 10;

export async function getUnreadNotificationCount({
  userId,
}: {
  userId?: string;
}) {
  if (!userId) {
    return { unreadCount: 0 };
  }

  const unreadCount = await NotificationQueries.countUnreadNotifications({
    userId,
  });

  return { unreadCount };
}

export async function getNotifications({
  userId,
  cursorUpdatedAt,
  cursorId,
}: {
  userId?: string;
  cursorUpdatedAt: string | null;
  cursorId: string | null;
}) {
  if (!userId) {
    return {
      notifications: [],
      nextCursor: null,
    };
  }
  const isFirstPage = cursorUpdatedAt == null && cursorId == null;

  const notifications = await NotificationQueries.fetchNotifications({
    userId,
    limit: NOTIFICATION_LIMIT + 1,
    cursorUpdatedAt: cursorUpdatedAt ?? undefined,
    cursorId: cursorId ?? undefined,
  });

  if (isFirstPage) {
    await NotificationQueries.markAllUnreadNotificationsAsRead({ userId });
  }

  const isLastPage = notifications.length <= NOTIFICATION_LIMIT;
  const sliced = notifications.slice(0, NOTIFICATION_LIMIT);
  const last = sliced.at(-1);

  return {
    notifications: sliced.map(toDto),
    nextCursor:
      isLastPage || !last ? null : { updatedAt: last.updatedAt, id: last.id },
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

  await NotificationQueries.insertMilestoneNotification({
    userId: authorId,
    type: 'post_view_milestone',
    postId,
    commentId: null,
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
  const authorId = post.userId;

  if (authorId === userId) {
    return;
  }

  const thresholds =
    await MilestoneThresholdQueries.fetchMilestoneThresholds('post_like');

  if (!thresholds.includes(milestoneValue)) {
    return;
  }

  await NotificationQueries.insertMilestoneNotification({
    userId: authorId,
    type: 'post_like_milestone',
    postId,
    commentId: null,
    milestoneValue,
  });
}

export async function insertCommentLikeMilestoneNotification({
  postId,
  likeUserId,
  commentUserId,
  commentId,
  milestoneValue,
}: {
  postId: string;
  likeUserId: string;
  commentUserId: string;
  commentId: number;
  milestoneValue: number;
}) {
  if (commentUserId === likeUserId) {
    return;
  }

  const thresholds =
    await MilestoneThresholdQueries.fetchMilestoneThresholds('comment_like');

  if (!thresholds.includes(milestoneValue)) {
    return;
  }

  await NotificationQueries.insertMilestoneNotification({
    userId: commentUserId,
    type: 'comment_like_milestone',
    postId,
    commentId,
    milestoneValue,
  });
}

export async function insertSubscriberMilestoneNotification({
  followingUserId,
  followerUserId,
  milestoneValue,
}: {
  followingUserId: string;
  followerUserId: string;
  milestoneValue: number;
}) {
  if (followerUserId === followingUserId) {
    return;
  }

  const thresholds =
    await MilestoneThresholdQueries.fetchMilestoneThresholds('subscriber');

  if (!thresholds.includes(milestoneValue)) {
    return;
  }

  await NotificationQueries.insertMilestoneNotification({
    userId: followingUserId,
    type: 'subscriber_milestone',
    postId: null,
    commentId: null,
    milestoneValue,
  });
}
