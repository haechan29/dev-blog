import { db } from '@/db/index';
import {
  comments,
  inquiryThreads,
  notifications,
  posts,
  users,
} from '@/db/schema';
import { isUniqueViolation } from '@/errors/lib';
import { and, desc, eq, lt, or, sql } from 'drizzle-orm';
import 'server-only';

const representativeComments = db
  .select({
    id: comments.id,
    content: comments.content,
  })
  .from(comments)
  .as('representative_comments');

const notificationComments = db
  .select({
    id: comments.id,
    content: comments.content,
  })
  .from(comments)
  .as('notification_comments');

const NOTIFICATION_SELECT_FIELDS = {
  id: notifications.id,
  userId: notifications.userId,
  type: notifications.type,
  isRead: notifications.isRead,
  inquiryThreadId: notifications.inquiryThreadId,
  postId: notifications.postId,
  commentId: notifications.commentId,
  commentCount: notifications.commentCount,
  representativeUserId: notifications.representativeUserId,
  representativeCommentId: notifications.representativeCommentId,
  milestoneValue: notifications.milestoneValue,
  createdAt: notifications.createdAt,
  updatedAt: notifications.updatedAt,
  post: {
    title: posts.title,
  },
  representativeUser: {
    nickname: users.nickname,
    profileImageUrl: users.profileImageUrl,
  },
  representativeComment: {
    content: representativeComments.content,
  },
  comment: {
    content: notificationComments.content,
  },
  inquiryThread: {
    firstMessagePreview: inquiryThreads.firstMessagePreview,
  },
} as const;

export async function fetchNotifications({
  userId,
  limit,
  cursorUpdatedAt,
  cursorId,
}: {
  userId: string;
  limit: number;
  cursorUpdatedAt?: string;
  cursorId?: string;
}) {
  const cursorCondition =
    cursorUpdatedAt != null && cursorId != null
      ? or(
          lt(notifications.updatedAt, cursorUpdatedAt),
          and(
            eq(notifications.updatedAt, cursorUpdatedAt),
            lt(notifications.id, cursorId)
          )
        )
      : undefined;

  return await db
    .select(NOTIFICATION_SELECT_FIELDS)
    .from(notifications)
    .leftJoin(posts, eq(notifications.postId, posts.id))
    .leftJoin(users, eq(notifications.representativeUserId, users.id))
    .leftJoin(
      representativeComments,
      eq(notifications.representativeCommentId, representativeComments.id)
    )
    .leftJoin(
      notificationComments,
      eq(notifications.commentId, notificationComments.id)
    )
    .leftJoin(
      inquiryThreads,
      eq(notifications.inquiryThreadId, inquiryThreads.id)
    )
    .where(and(eq(notifications.userId, userId), cursorCondition))
    .orderBy(desc(notifications.updatedAt), desc(notifications.id))
    .limit(limit);
}

export async function countUnreadNotifications({ userId }: { userId: string }) {
  const [data] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(notifications)
    .where(
      and(eq(notifications.userId, userId), eq(notifications.isRead, false))
    );

  return data?.count ?? 0;
}

export async function markAllUnreadNotificationsAsRead({
  userId,
}: {
  userId: string;
}) {
  await db
    .update(notifications)
    .set({ isRead: true })
    .where(
      and(eq(notifications.userId, userId), eq(notifications.isRead, false))
    );
}

export async function upsertUnreadCommentNotification({
  postId,
  authorId,
  commentUserId,
  representativeCommentId,
}: {
  postId: string;
  authorId: string;
  commentUserId: string;
  representativeCommentId: string;
}) {
  if (authorId === commentUserId) {
    return;
  }

  const now = new Date().toISOString();

  await db
    .insert(notifications)
    .values({
      userId: authorId,
      type: 'comment',
      isRead: false,
      postId,
      commentId: null,
      commentCount: 1,
      representativeUserId: commentUserId,
      representativeCommentId,
      milestoneValue: null,
      updatedAt: now,
    })
    .onConflictDoUpdate({
      target: [notifications.postId, notifications.type],
      targetWhere: and(
        eq(notifications.type, 'comment'),
        eq(notifications.isRead, false)
      ),
      set: {
        commentCount: sql`${notifications.commentCount} + 1`,
        updatedAt: now,
      },
    });
}

export async function insertMilestoneNotification({
  userId,
  type,
  postId,
  commentId,
  milestoneValue,
}: {
  userId: string;
  type:
    | 'post_view_milestone'
    | 'post_like_milestone'
    | 'comment_like_milestone'
    | 'subscriber_milestone';
  postId: string | null;
  commentId: string | null;
  milestoneValue: number;
}) {
  try {
    await db.insert(notifications).values({
      userId,
      type,
      isRead: false,
      postId,
      commentId,
      commentCount: null,
      representativeUserId: null,
      representativeCommentId: null,
      milestoneValue,
    });
  } catch (error) {
    if (!isUniqueViolation(error)) {
      throw error;
    }
  }
}
