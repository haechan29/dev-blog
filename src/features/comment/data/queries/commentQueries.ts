import {
  CommentEntity,
  CommentEntityFlat,
} from '@/features/comment/data/entities/commentEntities';
import { CommentNotFoundError } from '@/features/comment/data/errors/commentErrors';
import { flatToDto, toDto } from '@/features/comment/data/mapper/commentMapper';
import { supabase } from '@/lib/supabase';
import 'server-only';

const COMMENT_LIMIT = 20;

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

export async function fetchComments(
  postId: string,
  userId?: string,
  timestamp?: string,
  cursorScore?: number,
  cursorId?: number
) {
  const { data, error } = await supabase.rpc('get_ranked_comments', {
    p_post_id: postId,
    p_user_id: userId ?? null,
    p_timestamp: timestamp ?? new Date().toISOString(),
    p_cursor_score: cursorScore ?? null,
    p_cursor_id: cursorId ?? null,
    p_limit: COMMENT_LIMIT,
  });

  if (error) {
    throw new Error(error.message);
  }

  return (data as CommentEntityFlat[]).map(flatToDto);
}

export async function createComments(
  postId: string,
  content: string,
  passwordHash: string | null,
  userId: string
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
      `
        id, 
        post_id, 
        content, 
        created_at, 
        updated_at, 
        like_count, 
        user_id, 
        users:user_id(nickname, deleted_at, registered_at)
      `
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
      `
        id, 
        post_id, 
        content, 
        created_at, 
        updated_at, 
        like_count, 
        user_id, 
        users:user_id(nickname, deleted_at, registered_at)
      `
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
