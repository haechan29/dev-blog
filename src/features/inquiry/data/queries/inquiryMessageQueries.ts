import { db } from '@/db/index';
import { inquiryMessages, inquiryThreads } from '@/db/schema';
import { supabase } from '@/lib/supabase';
import { and, asc, eq } from 'drizzle-orm';
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
  const { data, error } = await supabase.rpc('create_inquiry_message', {
    p_thread_id: threadId,
    p_user_id: userId,
    p_content: content,
    p_images: images,
    p_last_message_preview: lastMessagePreview,
  });

  if (error) {
    throw new Error(error.message);
  }

  if (data == null || typeof data !== 'string') {
    throw new Error('문의 메시지 생성 응답이 올바르지 않습니다');
  }

  return data;
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
  const { data, error } = await supabase.rpc('create_admin_inquiry_message', {
    p_thread_id: threadId,
    p_admin_id: adminId,
    p_content: content,
    p_images: images,
    p_last_message_preview: lastMessagePreview,
  });

  if (error) {
    throw new Error(error.message);
  }

  if (data == null || typeof data !== 'string') {
    throw new Error('문의 메시지 생성 응답이 올바르지 않습니다');
  }

  return data;
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
  const { error } = await supabase.rpc('delete_inquiry_message', {
    p_thread_id: threadId,
    p_message_id: messageId,
    p_deleted_preview: deletedPreview,
  });

  if (error) {
    throw new Error(error.message);
  }
}
