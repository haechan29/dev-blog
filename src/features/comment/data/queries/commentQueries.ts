import { CommentNotFoundError } from '@/features/comment/data/errors/commentErrors';
import { PostNotFoundError } from '@/features/post/data/errors/postErrors';
import { supabase } from '@/lib/supabase';
import 'server-only';

export async function fetchComment(commentId: number) {
  const { data, error } = await supabase
    .from('comments')
    .select('user_id, guest_id, password_hash')
    .eq('id', commentId)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  if (!data) {
    throw new CommentNotFoundError('댓글을 찾을 수 없습니다');
  }

  return data;
}

export async function fetchComments(postId: string) {
  const { data, error } = await supabase
    .from('comments')
    .select(
      `
        *,
        users:user_id (nickname)
      `
    )
    .eq('post_id', postId)
    .order('created_at', { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  if (!data) {
    throw new PostNotFoundError(`게시물을 찾을 수 없습니다 (${postId})`);
  }

  return data.map(comment => ({
    ...comment,
    author_name: comment.users?.nickname || comment.guest_id || '익명',
    is_deleted: !!comment.user_id && !comment.users,
    is_guest: !comment.user_id,
  }));
}

export async function createComments(
  postId: string,
  content: string,
  passwordHash: string | null,
  userId: string | null,
  guestId: string | null
) {
  const { data, error } = await supabase
    .from('comments')
    .insert({
      post_id: postId,
      content,
      password_hash: passwordHash,
      user_id: userId,
      guest_id: guestId,
    })
    .select(
      `
      *,
      users:user_id (nickname)
    `
    )
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return {
    ...data,
    author_name: data.users?.nickname || data.guest_id || '익명',
    is_deleted: !!data.user_id && !data.users,
    is_guest: !data.user_id,
  };
}

export async function updateComment(commentId: number, content: string) {
  const { data, error } = await supabase
    .from('comments')
    .update({
      content,
      updated_at: new Date().toISOString(),
    })
    .eq('id', commentId)
    .select(
      `
      *,
      users:user_id (nickname)
    `
    )
    .single();

  if (error) throw new Error(error.message);

  return {
    ...data,
    author_name: data.users?.nickname || data.guest_id || '익명',
    is_deleted: !!data.user_id && !data.users,
    is_guest: !data.user_id,
  };
}

export async function deleteComment(commentId: number) {
  const { error } = await supabase
    .from('comments')
    .delete()
    .eq('id', commentId);

  if (error) throw new Error(error.message);
}
