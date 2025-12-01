import { PostEntity } from '@/features/post/data/entities/postEntities';
import { PostNotFoundError } from '@/features/post/data/errors/postErrors';
import { toDto } from '@/features/post/data/mapper/postMapper';
import { supabase } from '@/lib/supabase';
import 'server-only';

export async function fetchPosts() {
  const { data, error } = await supabase
    .from('posts')
    .select(
      'id, title, content, tags, created_at, updated_at, user_id, guest_id, users:user_id(nickname, deleted_at)'
    )
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return (data as unknown as PostEntity[]).map(toDto);
}

export async function fetchPost(postId: string) {
  const { data, error } = await supabase
    .from('posts')
    .select(
      'id, title, content, tags, created_at, updated_at, user_id, guest_id, users:user_id(nickname, deleted_at)'
    )
    .eq('id', postId)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  if (!data) {
    throw new PostNotFoundError(`게시물을 찾을 수 없습니다 (${postId})`);
  }

  return toDto(data as unknown as PostEntity);
}

export async function fetchPostsByUserId(userId: string) {
  const { data, error } = await supabase
    .from('posts')
    .select(
      'id, title, content, tags, created_at, updated_at, user_id, guest_id, users:user_id(nickname, deleted_at)'
    )
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return (data as unknown as PostEntity[]).map(toDto);
}

export async function fetchPostForAuth(postId: string) {
  const { data, error } = await supabase
    .from('posts')
    .select('user_id, guest_id, password_hash')
    .eq('id', postId)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  if (!data) {
    throw new PostNotFoundError(`게시물을 찾을 수 없습니다 (${postId})`);
  }

  return data as Pick<PostEntity, 'user_id' | 'guest_id' | 'password_hash'>;
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
      'id, title, content, tags, created_at, updated_at, user_id, guest_id, users:user_id(nickname, deleted_at)'
    )
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return toDto(data as unknown as PostEntity);
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
  const updates: Partial<PostEntity> = {
    updated_at: new Date().toISOString(),
    ...(title !== undefined && { title }),
    ...(content !== undefined && { content }),
    ...(tags !== undefined && { tags }),
  };

  const { data, error } = await supabase
    .from('posts')
    .update(updates)
    .eq('id', postId)
    .select(
      'id, title, content, tags, created_at, updated_at, user_id, guest_id, users:user_id(nickname, deleted_at)'
    )
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return toDto(data as unknown as PostEntity);
}

export async function deletePost(postId: string) {
  const { error } = await supabase.from('posts').delete().eq('id', postId);

  if (error) {
    throw new Error(error.message);
  }
}
