import { InquiryThreadEntity } from '@/features/inquiry/data/entities/inquiryThreadEntities';
import { supabase } from '@/lib/supabase';
import 'server-only';

const INQUIRY_THREAD_SELECT_FIELDS = `
  id,
  user_id,
  status,
  first_message_preview,
  first_message_id,
  last_message_preview,
  last_message_id,
  created_at,
  updated_at,
  is_deleted
`;

function applyQuotedLiteral(value: string) {
  return `"${value.replace(/\\/g, '\\\\').replace(/"/g, '""')}"`;
}

export async function fetchInquiryThreadForAuth(threadId: string) {
  const { data, error } = await supabase
    .from('inquiry_threads')
    .select('id, user_id, is_deleted')
    .eq('id', threadId)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data as unknown as Pick<
    InquiryThreadEntity,
    'id' | 'user_id' | 'is_deleted'
  > | null;
}

export async function fetchInquiryThreads({
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
  let query = supabase
    .from('inquiry_threads')
    .select(INQUIRY_THREAD_SELECT_FIELDS)
    .eq('user_id', userId)
    .eq('is_deleted', false)
    .order('updated_at', { ascending: false })
    .order('id', { ascending: false })
    .limit(limit);

  if (cursorUpdatedAt != null && cursorId != null) {
    const t = applyQuotedLiteral(cursorUpdatedAt);
    const id = applyQuotedLiteral(cursorId);
    query = query.or(`updated_at.lt.${t},and(updated_at.eq.${t},id.lt.${id})`);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(error.message);
  }

  return data as unknown as InquiryThreadEntity[];
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
    throw new Error('문의 스레드 생성 응답이 올바르지 않습니다');
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
  const { error } = await supabase
    .from('inquiry_threads')
    .update({
      is_deleted: true,
      deleted_at: new Date().toISOString(),
    })
    .eq('id', threadId)
    .eq('user_id', userId)
    .eq('is_deleted', false);

  if (error) {
    throw new Error(error.message);
  }
}
