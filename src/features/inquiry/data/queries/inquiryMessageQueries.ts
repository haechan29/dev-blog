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
