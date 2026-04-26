import { db } from '@/db/index';
import { inquiryMessages, inquiryThreads, notifications } from '@/db/schema';
import { and, asc, eq, sql } from 'drizzle-orm';
import 'server-only';

const INQUIRY_MESSAGE_SELECT_FIELDS = {
  id: inquiryMessages.id,
  threadId: inquiryMessages.threadId,
  senderType: inquiryMessages.senderType,
  senderId: inquiryMessages.senderId,
  content: inquiryMessages.content,
  images: inquiryMessages.images,
  isDeleted: inquiryMessages.isDeleted,
  createdAt: inquiryMessages.createdAt,
} as const;

export async function fetchInquiryMessageForAuth(
  threadId: string,
  messageId: string
) {
  const data = await db
    .select({
      id: inquiryMessages.id,
      threadId: inquiryMessages.threadId,
      senderId: inquiryMessages.senderId,
      senderType: inquiryMessages.senderType,
      isDeleted: inquiryMessages.isDeleted,
    })
    .from(inquiryMessages)
    .where(
      and(
        eq(inquiryMessages.threadId, threadId),
        eq(inquiryMessages.id, messageId)
      )
    )
    .limit(1);

  return data[0] ?? null;
}

export async function fetchInquiryMessagesByThreadId(threadId: string) {
  return db
    .select(INQUIRY_MESSAGE_SELECT_FIELDS)
    .from(inquiryMessages)
    .where(eq(inquiryMessages.threadId, threadId))
    .orderBy(asc(inquiryMessages.createdAt), asc(inquiryMessages.id));
}

export async function resetInquiryThreadUserUnreadCount(threadId: string) {
  await db
    .update(inquiryThreads)
    .set({ userUnreadCount: 0 })
    .where(eq(inquiryThreads.id, threadId));
}

export async function resetInquiryThreadAdminUnreadCount(threadId: string) {
  await db
    .update(inquiryThreads)
    .set({ adminUnreadCount: 0 })
    .where(eq(inquiryThreads.id, threadId));
}

export async function createInquiryMessage({
  threadId,
  userId,
  content,
  images,
  lastMessagePreview,
}: {
  threadId: string;
  userId: string;
  content: string;
  images: string[];
  lastMessagePreview: string;
}) {
  const now = new Date().toISOString();

  return db.transaction(async tx => {
    const [message] = await tx
      .insert(inquiryMessages)
      .values({
        threadId,
        senderType: 'USER',
        senderId: userId,
        content,
        images,
      })
      .returning({ id: inquiryMessages.id });

    await tx
      .update(inquiryThreads)
      .set({
        status: 'AWAITING_REPLY',
        statusChangedAt: now,
        lastMessagePreview,
        lastMessageId: message.id,
        updatedAt: now,
        adminUnreadCount: sql`${inquiryThreads.adminUnreadCount} + 1`,
      })
      .where(eq(inquiryThreads.id, threadId));

    return message.id;
  });
}

export async function createAdminInquiryMessage({
  threadId,
  adminId,
  content,
  images,
  lastMessagePreview,
}: {
  threadId: string;
  adminId: string;
  content: string;
  images: string[];
  lastMessagePreview: string;
}) {
  const now = new Date().toISOString();

  return db.transaction(async tx => {
    const [message] = await tx
      .insert(inquiryMessages)
      .values({
        threadId,
        senderType: 'ADMIN',
        senderId: adminId,
        content,
        images,
      })
      .returning({ id: inquiryMessages.id });

    const [thread] = await tx
      .update(inquiryThreads)
      .set({
        status: 'ANSWERED',
        statusChangedAt: now,
        lastMessagePreview,
        lastMessageId: message.id,
        updatedAt: now,
        userUnreadCount: sql`${inquiryThreads.userUnreadCount} + 1`,
      })
      .where(eq(inquiryThreads.id, threadId))
      .returning({ userId: inquiryThreads.userId });

    await tx
      .insert(notifications)
      .values({
        userId: thread.userId,
        type: 'inquiry_reply',
        inquiryThreadId: threadId,
      })
      .onConflictDoUpdate({
        target: [notifications.inquiryThreadId, notifications.type],
        targetWhere: and(
          eq(notifications.type, 'inquiry_reply'),
          eq(notifications.isRead, false)
        ),
        set: { updatedAt: now },
      });

    return message.id;
  });
}

export async function deleteInquiryMessage({
  threadId,
  messageId,
  deletedPreview,
}: {
  threadId: string;
  messageId: string;
  deletedPreview: string;
}) {
  const now = new Date().toISOString();

  await db.transaction(async tx => {
    await tx
      .update(inquiryMessages)
      .set({
        isDeleted: true,
        deletedAt: now,
      })
      .where(
        and(
          eq(inquiryMessages.id, messageId),
          eq(inquiryMessages.threadId, threadId),
          eq(inquiryMessages.isDeleted, false)
        )
      );

    await tx
      .update(inquiryThreads)
      .set({
        lastMessagePreview: deletedPreview,
        updatedAt: now,
      })
      .where(
        and(
          eq(inquiryThreads.id, threadId),
          eq(inquiryThreads.lastMessageId, messageId)
        )
      );

    await tx
      .update(inquiryThreads)
      .set({
        firstMessagePreview: deletedPreview,
        updatedAt: now,
      })
      .where(
        and(
          eq(inquiryThreads.id, threadId),
          eq(inquiryThreads.firstMessageId, messageId)
        )
      );
  });
}
