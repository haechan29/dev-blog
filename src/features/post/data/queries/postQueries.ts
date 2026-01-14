import {
  PostEntity,
  PostEntityFlat,
} from '@/features/post/data/entities/postEntities';
import { PostNotFoundError } from '@/features/post/data/errors/postErrors';
import { toDto } from '@/features/post/data/mapper/postMapper';
import Post from '@/features/post/domain/model/post';
import { PostVisibility } from '@/features/post/domain/types/postVisibility';
import { supabase } from '@/lib/supabase';
import 'server-only';

export async function fetchPostsByUserId(
  userId: string,
  currentUserId?: string
) {
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
        visibility,
        users:user_id(nickname, deleted_at, registered_at),
        series:series_id(title),
        post_stats(like_count, view_count)
      `
    )
    .eq('user_id', userId);

  if (currentUserId !== userId) {
    query = query.eq('visibility', 'public');
  }

  query = query.order('created_at', { ascending: false });

  const { data, error } = await query;

  if (error) {
    throw new Error(error.message);
  }

  return data as unknown as PostEntity[];
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
        visibility,
        users:user_id(nickname, deleted_at, registered_at),
        series:series_id(title),
        post_stats(like_count, view_count)
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

  return data as unknown as PostEntity;
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

export async function searchPosts(
  query: string,
  limit: number,
  cursorScore?: number,
  cursorId?: string
) {
  const { data, error } = await supabase.rpc('search_posts', {
    search_query: query,
    result_limit: limit,
    cursor_score: cursorScore ?? null,
    cursor_id: cursorId ?? null,
  });

  if (error) {
    throw new Error(error.message);
  }

  return data as PostEntityFlat[];
}

export async function createPost({
  title,
  content,
  tags,
  passwordHash,
  visibility,
  userId,
}: {
  title: string;
  content: string;
  tags: string[];
  passwordHash: string | null;
  visibility: PostVisibility;
  userId: string;
}) {
  const { data, error } = await supabase
    .from('posts')
    .insert({
      title,
      content,
      tags,
      password_hash: passwordHash,
      visibility,
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
        visibility,
        users:user_id(nickname, deleted_at, registered_at),
        series:series_id(title),
        post_stats(like_count, view_count)
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
  visibility,
}: {
  postId: string;
  title?: string;
  content?: string;
  tags?: string[];
  seriesId?: string | null;
  seriesOrder?: number | null;
  visibility?: PostVisibility;
}) {
  const updates: Partial<PostEntity> = {
    updated_at: new Date().toISOString(),
    ...(title !== undefined && { title }),
    ...(content !== undefined && { content }),
    ...(tags !== undefined && { tags }),
    ...(seriesId !== undefined && { series_id: seriesId }),
    ...(seriesOrder !== undefined && { series_order: seriesOrder }),
    ...(visibility !== undefined && { visibility }),
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
        visibility,
        users:user_id(nickname, deleted_at, registered_at),
        series:series_id(title),
        post_stats(like_count, view_count)
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
