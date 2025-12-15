import { supabase } from '@/lib/supabase';
import 'server-only';

export async function fetchViewedPosts(userId: string) {
  const { data, error } = await supabase
    .from('post_views')
    .select('post_id, posts(series_id)')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(1000);

  if (error) {
    throw new Error(error.message);
  }

  return data;
}
