import { supabase } from '@/lib/supabase';
import 'server-only';

export async function fetchPostLike(userId: string, postId: string) {
  const { count, error } = await supabase
    .from('post_likes')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('post_id', postId);

  if (error) {
    throw new Error(error.message);
  }

  return count !== null && count > 0;
}

export async function createPostLike(userId: string, postId: string) {
  const { error } = await supabase
    .from('post_likes')
    .insert({ user_id: userId, post_id: postId });

  if (error) {
    throw new Error(error.message);
  }
}

export async function deletePostLike(userId: string, postId: string) {
  const { error } = await supabase
    .from('post_likes')
    .delete()
    .eq('user_id', userId)
    .eq('post_id', postId);

  if (error) {
    throw new Error(error.message);
  }
}
