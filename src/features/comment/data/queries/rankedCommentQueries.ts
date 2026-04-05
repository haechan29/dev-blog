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

  return data as RankedCommentEntity[];
}
