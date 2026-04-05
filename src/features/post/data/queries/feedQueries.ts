import { FeedPostEntity } from '@/features/post/data/entities/feedPostEntities';
import { supabase } from '@/lib/supabase';
import 'server-only';

export async function fetchFeedPosts({
  limit,
  excludeIds = [],
  excludeUserId,
  cursor,
  tag,
}: {
  limit: number;
  excludeIds?: string[];
  excludeUserId?: string;
  cursor: string | null;
  tag?: string;
}) {
  let query = supabase
    .from('posts')
    .select(
      `
        id,
        title,
        content_json,
        preview,
        tags,
        created_at,
        updated_at,
        user_id,
        series_id,
        series_order,
        visibility,
        users:user_id(nickname, deleted_at, registered_at, bio, profile_image_url),
        series:series_id(title),
        post_stats!inner(like_count, view_count, comment_count, popularity)
      `
    )
    .eq('visibility', 'public');

  if (excludeIds.length > 0) {
    query = query.not('id', 'in', `(${excludeIds.join(',')})`);
  }

  if (excludeUserId) {
    query = query.neq('user_id', excludeUserId);
  }

  if (cursor) {
    query = query.lt('post_stats.popularity', cursor);
  }

  if (tag) {
    query = query.contains('tags', [tag]);
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
