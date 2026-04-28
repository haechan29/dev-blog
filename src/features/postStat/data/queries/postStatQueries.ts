import { db } from '@/db/index';
import { postStats } from '@/db/schema';
import { PostStatCreationError } from '@/features/postStat/data/errors/postStatErrors';
import { InferInsertModel, eq, sql } from 'drizzle-orm';
import 'server-only';

const POST_STAT_SELECT_FIELDS = {
  postId: postStats.postId,
  likeCount: postStats.likeCount,
  viewCount: postStats.viewCount,
  commentCount: postStats.commentCount,
  avgReadTime: sql<number>`${postStats.avgReadTime}::float8`,
  popularity: sql<number>`${postStats.popularity}::float8`,
} as const;

export async function fetchPostStatByPostId(postId: string) {
  const data = await db
    .select(POST_STAT_SELECT_FIELDS)
    .from(postStats)
    .where(eq(postStats.postId, postId))
    .limit(1);

  return data[0] ?? null;
}

export async function createPostStat(postId: string) {
  try {
    await db.insert(postStats).values({
      postId,
      viewCount: 0,
      likeCount: 0,
    });
  } catch {
    throw new PostStatCreationError('게시글 통계 생성 실패', postId);
  }
}

export async function updatePostStat({
  postId,
  likeCount,
  commentCount,
  viewCount,
  avgReadTime,
}: {
  postId: string;
  likeCount?: number;
  commentCount?: number;
  viewCount?: number;
  avgReadTime?: number;
}) {
  const updates: Partial<InferInsertModel<typeof postStats>> = {
    ...(likeCount !== undefined && { likeCount }),
    ...(commentCount !== undefined && { commentCount }),
    ...(viewCount !== undefined && { viewCount }),
    ...(avgReadTime !== undefined && { avgReadTime: String(avgReadTime) }),
  };

  await db.update(postStats).set(updates).where(eq(postStats.postId, postId));
}
