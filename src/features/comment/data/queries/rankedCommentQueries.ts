import { RankedCommentEntity } from '@/features/comment/data/entities/rankedCommentEntities';
import { toDto } from '@/features/comment/data/mapper/rankedCommentMapper';
import { supabase } from '@/lib/supabase';
import 'server-only';

const COMMENT_LIMIT = 5;

export async function fetchRankedComments({
  postId,
  userId,
  timestamp,
  cursorScore,
  cursorId,
}: {
  postId: string;
  userId?: string;
  timestamp?: string;
  cursorScore?: number;
  cursorId?: number;
}) {
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

  return (data as RankedCommentEntity[]).map(toDto);
}
