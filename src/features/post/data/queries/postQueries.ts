import { PostNotFoundError } from '@/features/post/data/errors/postNotFoundError';
import { supabase } from '@/lib/supabase';
import 'server-only';

export async function fetchPosts() {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function fetchPost(postId: string) {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('id', postId)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  if (!data) {
    throw new PostNotFoundError(postId);
  }

  return data;
}

export async function createPost({
  title,
  content,
  tags,
  passwordHash,
  userId,
  guestId,
}: {
  title: string;
  content: string;
  tags: string[];
  passwordHash: string | null;
  userId: string | null;
  guestId: string | null;
}) {
  const { data, error } = await supabase
    .from('posts')
    .insert({
      title,
      content,
      tags,
      password_hash: passwordHash,
      user_id: userId,
      guest_id: guestId,
    })
    .select('id, title, content, tags, created_at, updated_at')
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function deletePost(postId: string) {
  const { error } = await supabase.from('posts').delete().eq('id', postId);

  if (error) {
    throw new Error(error.message);
  }
}
