import { supabase } from '@/lib/supabase';
import 'server-only';

export async function fetchSkippedPosts(userId: string) {
  const { data, error } = await supabase
    .from('post_skips')
    .select('post_id, skip_count')
    .eq('user_id', userId)
    .order('updated_at', { ascending: false })
    .limit(1000);

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function incrementPostSkips(userId: string, postIds: string[]) {
  const { error } = await supabase.rpc('increment_skips', {
    p_user_id: userId,
    p_post_ids: postIds,
  });

  if (error) {
    throw new Error(error.message);
  }
}

export async function decrementPostSkip(userId: string, postId: string) {
  const { error } = await supabase.rpc('decrement_skip', {
    p_user_id: userId,
    p_post_id: postId,
  });

  if (error) {
    throw new Error(error.message);
  }
}
