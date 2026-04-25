import { RankedCommentEntity } from '@/features/comment/data/entities/rankedCommentEntities';
import { supabase } from '@/lib/supabase';
import 'server-only';

export async function fetchRankedComments({
  postId,
  userId,
  timestamp,
  limit,
  cursorScore,
  cursorId,
}: {
  postId: string;
  userId?: string;
  timestamp?: string;
  limit: number;
  cursorScore?: number;
  cursorId?: number;
}) {
  const { data, error } = await supabase.rpc('get_ranked_comments', {
    p_post_id: postId,
    p_user_id: userId ?? null,
    p_timestamp: timestamp ?? new Date().toISOString(),
    p_cursor_score: cursorScore ?? null,
    p_cursor_id: cursorId ?? null,
    p_limit: limit,
  });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []).map(comment => ({
    id: comment.id,
    postId: comment.post_id,
    content: comment.content,
    createdAt: comment.created_at,
    updatedAt: comment.updated_at,
    likeCount: comment.like_count,
    userId: comment.user_id,
    nickname: comment.nickname,
    deletedAt: comment.deleted_at,
    registeredAt: comment.registered_at,
    profileImageUrl: comment.profile_image_url,
    score: comment.score,
  })) as RankedCommentEntity[];
}
