import { InquiryMessageEntity } from '@/features/inquiry/data/entities/inquiryMessageEntities';
import { supabase } from '@/lib/supabase';
import 'server-only';

const INQUIRY_MESSAGE_SELECT_FIELDS = `
  id,
  thread_id,
  sender_type,
  sender_id,
  content,
  images,
  is_deleted,
  created_at
`;

export async function fetchInquiryMessageForAuth(
  threadId: string,
  messageId: string
) {
  const { data, error } = await supabase
    .from('inquiry_messages')
    .select('id, thread_id, sender_id, sender_type, is_deleted')
    .eq('thread_id', threadId)
    .eq('id', messageId)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data as unknown as Pick<
    InquiryMessageEntity,
    'id' | 'thread_id' | 'sender_id' | 'sender_type' | 'is_deleted'
  > | null;
}

export async function fetchInquiryMessagesByThreadId(threadId: string) {
  const { data, error } = await supabase
    .from('inquiry_messages')
    .select(INQUIRY_MESSAGE_SELECT_FIELDS)
    .eq('thread_id', threadId)
    .order('created_at', { ascending: true })
    .order('id', { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []) as unknown as InquiryMessageEntity[];
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
