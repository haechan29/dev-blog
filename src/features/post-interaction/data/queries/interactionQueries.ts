import { supabase } from '@/lib/supabase';
import 'server-only';

export async function insertLike(userId: string, postId: string) {
  const { error } = await supabase
    .from('post_likes')
    .insert({ user_id: userId, post_id: postId });

  if (error) {
    throw new Error(error.message);
  }
}

export async function deleteLike(userId: string, postId: string) {
  const { error } = await supabase
    .from('post_likes')
    .delete()
    .eq('user_id', userId)
    .eq('post_id', postId);

  if (error) {
    throw new Error(error.message);
  }
}
