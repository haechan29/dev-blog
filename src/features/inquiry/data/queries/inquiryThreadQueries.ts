import { db } from '@/db/index';
import { inquiryThreads } from '@/db/schema';
import { InquiryThreadStatus } from '@/features/inquiry/domain/types/inquiryThreadStatus';
import { supabase } from '@/lib/supabase';
import { and, desc, eq, lt, or } from 'drizzle-orm';
import 'server-only';

const INQUIRY_THREAD_SELECT_FIELDS = {
  id: inquiryThreads.id,
  userId: inquiryThreads.userId,
  status: inquiryThreads.status,
  firstMessagePreview: inquiryThreads.firstMessagePreview,
  firstMessageId: inquiryThreads.firstMessageId,
  lastMessagePreview: inquiryThreads.lastMessagePreview,
  lastMessageId: inquiryThreads.lastMessageId,
  userUnreadCount: inquiryThreads.userUnreadCount,
  adminUnreadCount: inquiryThreads.adminUnreadCount,
  createdAt: inquiryThreads.createdAt,
  updatedAt: inquiryThreads.updatedAt,
  isDeleted: inquiryThreads.isDeleted,
} as const;

export async function fetchInquiryThreadForAuth(threadId: string) {
  const data = await db
    .select({
      id: inquiryThreads.id,
      userId: inquiryThreads.userId,
      isDeleted: inquiryThreads.isDeleted,
    })
    .from(inquiryThreads)
    .where(eq(inquiryThreads.id, threadId))
    .limit(1);

  return data[0] ?? null;
}

export async function fetchMyInquiryThreads({
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
          lt(inquiryThreads.updatedAt, cursorUpdatedAt),
          and(
            eq(inquiryThreads.updatedAt, cursorUpdatedAt),
            lt(inquiryThreads.id, cursorId)
          )
        )
      : undefined;

  return db
    .select(INQUIRY_THREAD_SELECT_FIELDS)
    .from(inquiryThreads)
    .where(
      and(
        eq(inquiryThreads.userId, userId),
        eq(inquiryThreads.isDeleted, false),
        cursorCondition
      )
    )
    .orderBy(desc(inquiryThreads.updatedAt), desc(inquiryThreads.id))
    .limit(limit);
}

export async function fetchInquiryThreads({
  limit,
  cursorUpdatedAt,
  cursorId,
  status,
}: {
  limit: number;
  cursorUpdatedAt?: string;
  cursorId?: string;
  status?: InquiryThreadStatus;
}) {
  const cursorCondition =
    cursorUpdatedAt != null && cursorId != null
      ? or(
          lt(inquiryThreads.updatedAt, cursorUpdatedAt),
          and(
            eq(inquiryThreads.updatedAt, cursorUpdatedAt),
            lt(inquiryThreads.id, cursorId)
          )
        )
      : undefined;

  const statusCondition =
    status != null ? eq(inquiryThreads.status, status) : undefined;

  return db
    .select(INQUIRY_THREAD_SELECT_FIELDS)
    .from(inquiryThreads)
    .where(
      and(
        eq(inquiryThreads.isDeleted, false),
        statusCondition,
        cursorCondition
      )
    )
    .orderBy(desc(inquiryThreads.updatedAt), desc(inquiryThreads.id))
    .limit(limit);
}

export async function createInquiryThread({
  userId,
  content,
  images,
  messagePreview,
}: {
  userId: string;
  content: string;
  images: string[];
  messagePreview: string;
}) {
  const { data, error } = await supabase.rpc('create_inquiry', {
    p_user_id: userId,
    p_content: content,
    p_images: images,
    p_message_preview: messagePreview,
  });

  if (error) {
    throw new Error(error.message);
  }

  if (data == null || typeof data !== 'string') {
    throw new Error('스레드 생성 응답이 올바르지 않습니다');
  }

  return data;
}

export async function softDeleteInquiryThread({
  threadId,
  userId,
}: {
  threadId: string;
  userId: string;
}) {
  await db
    .update(inquiryThreads)
    .set({
      isDeleted: true,
      deletedAt: new Date().toISOString(),
    })
    .where(
      and(
        eq(inquiryThreads.id, threadId),
        eq(inquiryThreads.userId, userId),
        eq(inquiryThreads.isDeleted, false)
      )
    );
}
