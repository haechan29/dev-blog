import { supabase } from '@/lib/supabase';
import 'server-only';

export async function createPostStat(postId: string) {
  const { error } = await supabase.from('post_stats').insert({
    post_id: postId,
    view_count: 0,
    like_count: 0,
  });

  if (error) {
    throw new Error(error.message);
  }
}
