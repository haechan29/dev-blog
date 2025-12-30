import { supabase } from '@/lib/supabase';
import 'server-only';

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
