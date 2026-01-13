import { FeedPostEntity } from '@/features/post/data/entities/feedPostEntities';
import { supabase } from '@/lib/supabase';
import 'server-only';

export async function fetchFeedPosts({
  limit,
  excludeIds = [],
  excludeUserId,
  cursor,
}: {
  limit: number;
  excludeIds?: string[];
  excludeUserId?: string;
  cursor: string | null;
}) {
  let query = supabase
    .from('posts')
    .select(
      `
        id,
        title,
        content,
        tags,
        created_at,
        updated_at,
        user_id,
        series_id,
        series_order,
        is_private,
        users:user_id(nickname, deleted_at, registered_at),
        series:series_id(title),
        post_stats!inner(like_count, view_count, popularity)
      `
    )
    .eq('is_private', false);

  if (excludeIds.length > 0) {
    query = query.not('id', 'in', `(${excludeIds.join(',')})`);
  }

  if (excludeUserId) {
    query = query.neq('user_id', excludeUserId);
  }

  if (cursor) {
    query = query.lt('post_stats.popularity', cursor);
  }

  query = query
    .order('post_stats(popularity)', { ascending: false })
    .limit(limit);

  const { data, error } = await query;

  if (error) {
    throw new Error(error.message);
  }

  return data as unknown as FeedPostEntity[];
}
