import { PostNotFoundError } from '@/features/post/data/errors/postErrors';
import { Post } from '@/features/post/domain/types/post';
import { supabase } from '@/lib/supabase';
import 'server-only';

export async function fetchPosts() {
  const { data, error } = await supabase
    .from('posts')
    .select(
      `
      *,
      users:user_id (nickname)
    `
    )
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data.map(post => ({
    ...post,
    author_name:
      post.users?.nickname ||
      `게스트#${post.guest_id?.slice(0, 4) ?? '0000'}` ||
      '익명',
    is_deleted: !!post.user_id && !post.users,
    is_guest: !post.user_id,
  }));
}

export async function fetchPost(postId: string) {
  const { data, error } = await supabase
    .from('posts')
    .select(
      `
      *,
      users:user_id (nickname)
    `
    )
    .eq('id', postId)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  if (!data) {
    throw new PostNotFoundError(`게시물을 찾을 수 없습니다 (${postId})`);
  }

  return {
    ...data,
    author_name:
      data.users?.nickname ||
      `게스트#${data.guest_id?.slice(0, 4) ?? '0000'}` ||
      '익명',
    is_deleted: !!data.user_id && !data.users,
    is_guest: !data.user_id,
  };
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
    .select(
      'id, title, content, tags, created_at, updated_at, user_id, guest_id'
    )
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function updatePost(
  postId: string,
  {
    title,
    content,
    tags,
  }: {
    title?: string;
    content?: string;
    tags?: string[];
  }
) {
  const updates: Partial<Post> = {
    updated_at: new Date().toISOString(),
    ...(title !== undefined && { title }),
    ...(content !== undefined && { content }),
    ...(tags !== undefined && { tags }),
  };

  const { data, error } = await supabase
    .from('posts')
    .update(updates)
    .eq('id', postId)
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
