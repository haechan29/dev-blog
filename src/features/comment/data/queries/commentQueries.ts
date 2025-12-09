import { CommentEntity } from '@/features/comment/data/entities/commentEntities';
import { CommentNotFoundError } from '@/features/comment/data/errors/commentErrors';
import { toDto } from '@/features/comment/data/mapper/commentMapper';
import { PostNotFoundError } from '@/features/post/data/errors/postErrors';
import { supabase } from '@/lib/supabase';
import 'server-only';

export async function fetchComment(commentId: number) {
  const { data, error } = await supabase
    .from('comments')
    .select('user_id, password_hash')
    .eq('id', commentId)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  if (!data) {
    throw new CommentNotFoundError('댓글을 찾을 수 없습니다');
  }

  return data as Pick<CommentEntity, 'user_id' | 'password_hash'>;
}

export async function fetchComments(postId: string) {
  const { data, error } = await supabase
    .from('comments')
    .select(
      'id, post_id, content, created_at, updated_at, like_count, user_id, users:user_id(nickname, deleted_at)'
    )
    .eq('post_id', postId)
    .order('created_at', { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  if (!data) {
    throw new PostNotFoundError(`게시물을 찾을 수 없습니다 (${postId})`);
  }

  return (data as unknown as CommentEntity[]).map(toDto);
}

export async function createComments(
  postId: string,
  content: string,
  passwordHash: string | null,
  userId: string | null
) {
  const { data, error } = await supabase
    .from('comments')
    .insert({
      post_id: postId,
      content,
      password_hash: passwordHash,
      user_id: userId,
    })
    .select(
      'id, post_id, content, created_at, updated_at, like_count, user_id, users:user_id(nickname, deleted_at)'
    )
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return toDto(data as unknown as CommentEntity);
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
      'id, post_id, content, created_at, updated_at, like_count, user_id, users:user_id(nickname, deleted_at)'
    )
    .single();

  if (error) throw new Error(error.message);

  return toDto(data as unknown as CommentEntity);
}

export async function deleteComment(commentId: number) {
  const { error } = await supabase
    .from('comments')
    .delete()
    .eq('id', commentId);

  if (error) throw new Error(error.message);
}
