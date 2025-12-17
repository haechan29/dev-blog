import { FeedPostEntity } from '@/features/post/data/entities/feedPostEntities';
import { supabase } from '@/lib/supabase';
import 'server-only';

export async function fetchFeedPosts({
  limit,
  excludeIds = [],
  cursor,
}: {
  limit: number;
  excludeIds?: string[];
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
        users:user_id(nickname, deleted_at, registered_at),
        series:series_id(title),
        post_stats!inner(like_count, view_count, popularity)
      `
    )
    .order('post_stats(popularity)', { ascending: false })
    .limit(limit);

  if (excludeIds.length > 0) {
    query = query.not('id', 'in', `(${excludeIds.join(',')})`);
  }

  if (cursor) {
    query = query.lt('post_stats.popularity', cursor);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(error.message);
  }

  return data as unknown as FeedPostEntity[];
}
