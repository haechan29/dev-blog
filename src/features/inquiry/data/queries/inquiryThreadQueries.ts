import { InquiryThreadEntity } from '@/features/inquiry/data/entities/inquiryThreadEntities';
import { supabase } from '@/lib/supabase';
import 'server-only';

const INQUIRY_THREAD_SELECT_FIELDS = `
  id,
  user_id,
  status,
  last_message_preview,
  created_at,
  updated_at
`;

function applyQuotedLiteral(value: string) {
  return `"${value.replace(/\\/g, '\\\\').replace(/"/g, '""')}"`;
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
