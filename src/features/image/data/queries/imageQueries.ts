import { supabase } from '@/lib/supabase';
import 'server-only';

export async function createImage({
  url,
  sizeBytes,
  userId,
}: {
  url: string;
  sizeBytes: number;
  userId: string;
}) {
  const { data, error } = await supabase
    .from('images')
    .insert({
      url,
      size_bytes: sizeBytes,
      user_id: userId,
    })
    .select('id')
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data.id;
}

export async function linkImagesToPost(postId: string, urls: string[]) {
  if (urls.length === 0) return;

  const { error } = await supabase
    .from('images')
    .update({ post_id: postId })
    .in('url', urls);

  if (error) {
    throw new Error(error.message);
  }
}
