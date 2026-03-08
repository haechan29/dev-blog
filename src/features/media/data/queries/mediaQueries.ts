import { supabase } from '@/lib/supabase';
import 'server-only';

export async function getMediaListByPostId(postId: string) {
  const { data, error } = await supabase
    .from('media')
    .select('id, url')
    .eq('post_id', postId);

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function getUsageSince(
  userId: string,
  since: Date
): Promise<number> {
  const { data, error } = await supabase
    .from('media')
    .select('size_bytes')
    .eq('user_id', userId)
    .gte('created_at', since.toISOString());

  if (error) {
    throw new Error(error.message);
  }

  return data.reduce((sum, row) => sum + (row.size_bytes || 0), 0);
}

export async function getOrphanMediaList() {
  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

  const { data, error } = await supabase
    .from('media')
    .select('id, url')
    .is('post_id', null)
    .is('profile_user_id', null)
    .lt('created_at', oneDayAgo);

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function createMedia({
  url,
  sizeBytes,
  userId,
  type,
  profileUserId,
}: {
  url: string;
  sizeBytes: number;
  userId: string;
  type: 'image' | 'audio';
  profileUserId?: string;
}) {
  const { data, error } = await supabase
    .from('media')
    .insert({
      url,
      size_bytes: sizeBytes,
      user_id: userId,
      type,
      profile_user_id: profileUserId ?? null,
    })
    .select('id')
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data.id;
}

export async function linkMediaListToPost(postId: string, urls: string[]) {
  if (urls.length === 0) return;

  const { error } = await supabase
    .from('media')
    .update({ post_id: postId })
    .in('url', urls);

  if (error) {
    throw new Error(error.message);
  }
}

export async function unlinkMediaListFromPost(postId: string, urls?: string[]) {
  let query = supabase
    .from('media')
    .update({ post_id: null })
    .eq('post_id', postId);

  if (urls && urls.length > 0) {
    query = query.in('url', urls);
  }

  const { error } = await query;

  if (error) {
    throw new Error(error.message);
  }
}

export async function deleteMediaListByIds(ids: string[]) {
  if (ids.length === 0) return;

  const { error } = await supabase.from('media').delete().in('id', ids);

  if (error) {
    throw new Error(error.message);
  }
}
