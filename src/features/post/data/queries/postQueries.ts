import { db } from '@/db/index';
import { postStats, posts, series, users } from '@/db/schema';
import { NotFoundError } from '@/errors/errors';
import { PostEntity } from '@/features/post/data/entities/postEntities';
import { PostVisibility } from '@/features/post/domain/types/postVisibility';
import { JSONContent } from '@tiptap/core';
import { InferInsertModel, and, desc, eq, inArray, sql } from 'drizzle-orm';
import 'server-only';

const SIMILARITY_THRESHOLD = 0.1;

const POST_FIELDS = {
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
};

const USER_FIELDS = {
  nickname: users.nickname,
  deletedAt: users.deletedAt,
  registeredAt: users.registeredAt,
  bio: users.bio,
  profileImageUrl: users.profileImageUrl,
};

const SERIES_FIELDS = {
  title: series.title,
};

const POST_STATS_FIELDS = {
  likeCount: postStats.likeCount,
  viewCount: postStats.viewCount,
  commentCount: postStats.commentCount,
};

const POST_SELECT_FIELDS = {
  ...POST_FIELDS,
  user: USER_FIELDS,
  series: SERIES_FIELDS,
  postStat: POST_STATS_FIELDS,
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
    .innerJoin(users, eq(posts.userId, users.id))
    .leftJoin(series, eq(posts.seriesId, series.id))
    .innerJoin(postStats, eq(posts.id, postStats.postId))
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
    .innerJoin(users, eq(posts.userId, users.id))
    .leftJoin(series, eq(posts.seriesId, series.id))
    .innerJoin(postStats, eq(posts.id, postStats.postId))
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
  const relevanceScore = sql<number>`
    ROUND(GREATEST(
      similarity(${posts.title}, ${query}) * 2,
      similarity(immutable_array_to_string(${posts.tags}, ' '), ${query})
    ) * 1000000)::bigint
  `.as('relevance_score');

  const matchCondition = sql`(
    ${posts.title} % ${query}
    OR immutable_array_to_string(${posts.tags}, ' ') % ${query}
  )`;

  const scored = db
    .select({
      ...POST_FIELDS,
      relevanceScore,
    })
    .from(posts)
    .where(and(matchCondition, eq(posts.visibility, 'public')))
    .as('scored');

  const cursorCondition =
    cursorScore != null && cursorId != null
      ? sql`(
          ${scored.relevanceScore} < ${cursorScore}
          OR (${scored.relevanceScore} = ${cursorScore} AND ${scored.id} < ${cursorId})
        )`
      : undefined;

  return await db.transaction(async tx => {
    await tx.execute(
      sql`SELECT set_config('pg_trgm.similarity_threshold', ${String(SIMILARITY_THRESHOLD)}, true)`
    );

    return tx
      .select({
        user: USER_FIELDS,
        series: SERIES_FIELDS,
        postStat: POST_STATS_FIELDS,
        id: scored.id,
        title: scored.title,
        contentJson: scored.contentJson,
        preview: scored.preview,
        tags: scored.tags,
        createdAt: scored.createdAt,
        updatedAt: scored.updatedAt,
        userId: scored.userId,
        seriesId: scored.seriesId,
        seriesOrder: scored.seriesOrder,
        visibility: scored.visibility,
        relevanceScore: scored.relevanceScore,
      })
      .from(scored)
      .innerJoin(users, eq(users.id, scored.userId))
      .leftJoin(series, eq(series.id, scored.seriesId))
      .innerJoin(postStats, eq(postStats.postId, scored.id))
      .where(cursorCondition)
      .orderBy(desc(scored.relevanceScore), desc(scored.id))
      .limit(limit);
  });
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
    ...(title !== undefined && { title }),
    ...(contentJson !== undefined && { contentJson }),
    ...(tags !== undefined && { tags }),
    ...(seriesId !== undefined && { seriesId }),
    ...(seriesOrder !== undefined && { seriesOrder }),
    ...(visibility !== undefined && { visibility }),
    ...(preview !== undefined && { preview }),
    ...(contentText !== undefined && { contentText }),
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
  postsToUpdate: Pick<PostEntity, 'id' | 'seriesId' | 'seriesOrder'>[]
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
