import { InquiryEntity } from '@/features/inquiry/data/entities/inquiryEntities';
import { supabase } from '@/lib/supabase';
import 'server-only';

export async function getInquiries() {
  const { data, error } = await supabase
    .from('inquiries')
    .select('id, user_id, content, created_at, users(nickname)')
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data as unknown as InquiryEntity[];
}

export async function createInquiry({
  userId,
  content,
}: {
  userId: string;
  content: string;
}) {
  const { error } = await supabase.from('inquiries').insert({
    user_id: userId,
    content,
  });

  if (error) {
    throw new Error(error.message);
  }
}
