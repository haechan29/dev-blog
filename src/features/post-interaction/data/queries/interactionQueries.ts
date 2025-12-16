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

export async function insertView(
  userId: string,
  postId: string,
  readDuration: number
) {
  const { error } = await supabase
    .from('post_views')
    .upsert(
      { user_id: userId, post_id: postId, read_duration: readDuration },
      { onConflict: 'user_id,post_id', ignoreDuplicates: true }
    );

  if (error) {
    throw new Error(error.message);
  }
}

export async function incrementSkips(userId: string, postIds: string[]) {
  const { error } = await supabase.rpc('increment_skips', {
    p_user_id: userId,
    p_post_ids: postIds,
  });

  if (error) {
    throw new Error(error.message);
  }
}

export async function decrementSkip(userId: string, postId: string) {
  const { error } = await supabase.rpc('decrement_skip', {
    p_user_id: userId,
    p_post_id: postId,
  });

  if (error) {
    throw new Error(error.message);
  }
}
