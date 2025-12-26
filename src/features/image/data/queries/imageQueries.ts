import { supabase } from '@/lib/supabase';
import 'server-only';

export async function getImagesByPostId(postId: string) {
  const { data, error } = await supabase
    .from('images')
    .select('id, url')
    .eq('post_id', postId);

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

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

export async function unlinkImagesFromPost(postId: string) {
  const { error } = await supabase
    .from('images')
    .update({ post_id: null })
    .eq('post_id', postId);

  if (error) {
    throw new Error(error.message);
  }
}
