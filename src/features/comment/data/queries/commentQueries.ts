import { NotFoundError } from '@/errors/errors';
import { CommentEntity } from '@/features/comment/data/entities/commentEntities';
import { toDto } from '@/features/comment/data/mapper/commentMapper';
import { supabase } from '@/lib/supabase';
import 'server-only';

const COMMENT_LIMIT = 5;

const COMMENT_SELECT = `
  id,
  post_id,
  content,
  created_at,
  updated_at,
  like_count,
  user_id,
  users:user_id(nickname, deleted_at, registered_at, profile_image_url)
`;

export async function fetchComment(commentId: number) {
  const { data, error } = await supabase
    .from('comments')
    .select(COMMENT_SELECT)
    .eq('id', commentId)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  if (!data) {
    throw new NotFoundError('댓글이 존재하지 않습니다');
  }

  return data as unknown as CommentEntity;
}

export async function fetchCommentForAuth(commentId: number) {
  const { data, error } = await supabase
    .from('comments')
    .select('user_id, password_hash')
    .eq('id', commentId)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  if (!data) {
    throw new NotFoundError('댓글을 찾을 수 없습니다');
  }

  return data as Pick<CommentEntity, 'user_id' | 'password_hash'>;
}

export async function createComment(
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
    .select(COMMENT_SELECT)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return toDto(data as unknown as CommentEntity);
}

export async function updateComment({
  commentId,
  content,
  likeCount,
}: {
  commentId: number;
  content?: string;
  likeCount?: number;
}) {
  const { data, error } = await supabase
    .from('comments')
    .update({
      ...(content !== undefined && { content }),
      ...(likeCount !== undefined && { like_count: likeCount }),
      updated_at: new Date().toISOString(),
    })
    .eq('id', commentId)
    .select(COMMENT_SELECT)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return toDto(data as unknown as CommentEntity);
}

export async function deleteComment(commentId: number) {
  const { error } = await supabase
    .from('comments')
    .delete()
    .eq('id', commentId);

  if (error) throw new Error(error.message);
}
