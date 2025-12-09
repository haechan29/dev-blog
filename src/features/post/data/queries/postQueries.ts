import { PostEntity } from '@/features/post/data/entities/postEntities';
import { PostNotFoundError } from '@/features/post/data/errors/postErrors';
import { toDto } from '@/features/post/data/mapper/postMapper';
import Post from '@/features/post/domain/model/post';
import { ValidationError } from '@/features/user/data/errors/userErrors';
import { supabase } from '@/lib/supabase';
import { getUserId } from '@/lib/user';
import 'server-only';

export async function fetchPosts() {
  const userId = await getUserId();

  if (!userId) {
    throw new ValidationError('사용자를 찾을 수 없습니다');
  }

  const { data, error } = await supabase
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
      users:user_id(nickname, deleted_at)
    `
    )
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return (data as unknown as PostEntity[]).map(toDto);
}

export async function fetchPostsByUserId(userId: string) {
  const { data, error } = await supabase
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
      users:user_id(nickname, deleted_at)
    `
    )
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return (data as unknown as PostEntity[]).map(toDto);
}

export async function fetchPostsOwnership(postIds: string[]) {
  const { data, error } = await supabase
    .from('posts')
    .select('id, user_id')
    .in('id', postIds);

  if (error) {
    throw new Error(error.message);
  }

  return data as { id: string; user_id: string | null }[];
}

export async function fetchPost(postId: string) {
  const { data, error } = await supabase
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
        users:user_id(nickname, deleted_at)
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

  return toDto(data as unknown as PostEntity);
}

export async function fetchPostForAuth(postId: string) {
  const { data, error } = await supabase
    .from('posts')
    .select('user_id, password_hash')
    .eq('id', postId)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  if (!data) {
    throw new PostNotFoundError(`게시물을 찾을 수 없습니다 (${postId})`);
  }

  return data as Pick<PostEntity, 'user_id' | 'password_hash'>;
}

export async function createPost({
  title,
  content,
  tags,
  passwordHash,
  userId,
}: {
  title: string;
  content: string;
  tags: string[];
  passwordHash: string | null;
  userId: string;
}) {
  const { data, error } = await supabase
    .from('posts')
    .insert({
      title,
      content,
      tags,
      password_hash: passwordHash,
      user_id: userId,
    })
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
        users:user_id(nickname, deleted_at)
      `
    )
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return toDto(data as unknown as PostEntity);
}

export async function updatePost({
  postId,
  title,
  content,
  tags,
  seriesId,
  seriesOrder,
}: {
  postId: string;
  title?: string;
  content?: string;
  tags?: string[];
  seriesId?: string | null;
  seriesOrder?: number | null;
}) {
  const updates: Partial<PostEntity> = {
    updated_at: new Date().toISOString(),
    ...(title !== undefined && { title }),
    ...(content !== undefined && { content }),
    ...(tags !== undefined && { tags }),
    ...(seriesId !== undefined && { series_id: seriesId }),
    ...(seriesOrder !== undefined && { series_order: seriesOrder }),
  };

  const { data, error } = await supabase
    .from('posts')
    .update(updates)
    .eq('id', postId)
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
        users:user_id(nickname, deleted_at)
      `
    )
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return toDto(data as unknown as PostEntity);
}

export async function updatePostsInSeries(
  posts: Pick<Post, 'id' | 'seriesId' | 'seriesOrder'>[]
) {
  const promises = posts.map(({ id, seriesId, seriesOrder }) =>
    supabase
      .from('posts')
      .update({ series_id: seriesId, series_order: seriesOrder })
      .eq('id', id)
  );

  const results = await Promise.all(promises);

  const error = results.find(r => r.error)?.error;
  if (error) {
    throw new Error(error.message);
  }
}

export async function deletePost(postId: string) {
  const { error } = await supabase.from('posts').delete().eq('id', postId);

  if (error) {
    throw new Error(error.message);
  }
}
