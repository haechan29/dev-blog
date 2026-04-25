import { db } from '@/db/index';
import { postStats, posts, series, users } from '@/db/schema';
import { NotFoundError } from '@/errors/errors';
import { PostEntityFlat } from '@/features/post/data/entities/postEntities';
import Post from '@/features/post/domain/model/post';
import { PostVisibility } from '@/features/post/domain/types/postVisibility';
import { supabase } from '@/lib/supabase';
import { JSONContent } from '@tiptap/core';
import { InferInsertModel, and, desc, eq, inArray } from 'drizzle-orm';
import 'server-only';

const POST_SELECT_FIELDS = {
  id: posts.id,
  title: posts.title,
  contentJson: posts.contentJson,
  preview: posts.preview,
  tags: posts.tags,
  createdAt: posts.createdAt,
  updatedAt: posts.updatedAt,
  userId: posts.userId,
  seriesId: posts.seriesId,
  seriesOrder: posts.seriesOrder,
  visibility: posts.visibility,
  passwordHash: posts.passwordHash,
  nickname: users.nickname,
  deletedAt: users.deletedAt,
  registeredAt: users.registeredAt,
  bio: users.bio,
  profileImageUrl: users.profileImageUrl,
  seriesTitle: series.title,
  likeCount: postStats.likeCount,
  viewCount: postStats.viewCount,
  commentCount: postStats.commentCount,
} as const;

export async function fetchPostsByUserId(
  userId: string,
  currentUserId?: string
) {
  const where =
    currentUserId !== userId
      ? and(eq(posts.userId, userId), eq(posts.visibility, 'public'))
      : eq(posts.userId, userId);

  return await db
    .select(POST_SELECT_FIELDS)
    .from(posts)
    .leftJoin(users, eq(posts.userId, users.id))
    .leftJoin(series, eq(posts.seriesId, series.id))
    .leftJoin(postStats, eq(posts.id, postStats.postId))
    .where(where)
    .orderBy(desc(posts.createdAt));
}

export async function fetchPostsOwnership(postIds: string[]) {
  if (postIds.length === 0) {
    return [];
  }

  return await db
    .select({
      id: posts.id,
      user_id: posts.userId,
    })
    .from(posts)
    .where(inArray(posts.id, postIds));
}

export async function fetchPost(postId: string) {
  const data = await db
    .select(POST_SELECT_FIELDS)
    .from(posts)
    .leftJoin(users, eq(posts.userId, users.id))
    .leftJoin(series, eq(posts.seriesId, series.id))
    .leftJoin(postStats, eq(posts.id, postStats.postId))
    .where(eq(posts.id, postId))
    .limit(1);

  if (!data[0]) {
    throw new NotFoundError('게시물을 찾을 수 없습니다');
  }

  return data[0];
}

export async function fetchPostForAuth(postId: string) {
  const data = await db
    .select({
      userId: posts.userId,
      passwordHash: posts.passwordHash,
    })
    .from(posts)
    .where(eq(posts.id, postId))
    .limit(1);

  if (!data[0]) {
    throw new NotFoundError('게시물을 찾을 수 없습니다');
  }

  return data[0];
}

export async function searchPosts({
  query,
  limit,
  cursorScore,
  cursorId,
}: {
  query: string;
  limit: number;
  cursorScore?: number;
  cursorId?: string;
}) {
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
  contentJson,
  tags,
  passwordHash,
  visibility,
  userId,
  preview,
  contentText,
}: {
  title: string;
  contentJson: object;
  tags: string[];
  passwordHash: string | null;
  visibility: PostVisibility;
  userId: string;
  preview: string;
  contentText: string;
}) {
  const [post] = await db
    .insert(posts)
    .values({
      title,
      contentJson,
      preview,
      contentText,
      tags,
      passwordHash,
      visibility,
      userId,
    })
    .returning({ id: posts.id });

  if (!post) {
    throw new NotFoundError('게시물을 찾을 수 없습니다');
  }

  return await fetchPost(post.id);
}

export async function updatePost({
  postId,
  title,
  contentJson,
  tags,
  seriesId,
  seriesOrder,
  visibility,
  preview,
  contentText,
}: {
  postId: string;
  title?: string;
  contentJson?: JSONContent;
  tags?: string[];
  seriesId?: string | null;
  seriesOrder?: number | null;
  visibility?: PostVisibility;
  preview?: string;
  contentText?: string;
}) {
  const updates: Partial<InferInsertModel<typeof posts>> = {
    updatedAt: new Date().toISOString(),
    ...(title !== undefined ? { title } : {}),
    ...(contentJson !== undefined ? { contentJson } : {}),
    ...(tags !== undefined ? { tags } : {}),
    ...(seriesId !== undefined ? { seriesId } : {}),
    ...(seriesOrder !== undefined ? { seriesOrder } : {}),
    ...(visibility !== undefined ? { visibility } : {}),
    ...(preview !== undefined ? { preview } : {}),
    ...(contentText !== undefined ? { contentText } : {}),
  };

  const [post] = await db
    .update(posts)
    .set(updates)
    .where(eq(posts.id, postId))
    .returning({ id: posts.id });

  if (!post) {
    throw new NotFoundError('게시물을 찾을 수 없습니다');
  }

  return await fetchPost(post.id);
}

export async function updatePostsInSeries(
  postsToUpdate: Pick<Post, 'id' | 'seriesId' | 'seriesOrder'>[]
) {
  await db.transaction(async tx => {
    for (const { id, seriesId, seriesOrder } of postsToUpdate) {
      await tx
        .update(posts)
        .set({ seriesId, seriesOrder })
        .where(eq(posts.id, id));
    }
  });
}

export async function deletePost(postId: string) {
  await db.delete(posts).where(eq(posts.id, postId));
}
