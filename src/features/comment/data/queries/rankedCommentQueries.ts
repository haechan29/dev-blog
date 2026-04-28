import { db } from '@/db';
import { comments, users } from '@/db/schema';
import { asc, desc, eq, sql } from 'drizzle-orm';
import 'server-only';

const COMMENT_FIELDS = {
  id: comments.id,
  postId: comments.postId,
  content: comments.content,
  createdAt: comments.createdAt,
  updatedAt: comments.updatedAt,
  likeCount: comments.likeCount,
  userId: comments.userId,
};

const COMMENT_USER_FIELDS = {
  nickname: users.nickname,
  deletedAt: users.deletedAt,
  registeredAt: users.registeredAt,
  profileImageUrl: users.profileImageUrl,
};

export async function fetchRankedComments({
  postId,
  userId,
  timestamp,
  limit,
  cursorScore,
  cursorId,
}: {
  postId: string;
  userId?: string;
  timestamp?: string;
  limit: number;
  cursorScore?: number;
  cursorId?: number;
}) {
  const score = sql<number>`
    FLOOR((
      ${userId ? sql`CASE WHEN ${comments.userId} = ${userId} THEN 1000 ELSE 0 END` : sql`0`}
      + LN(${comments.likeCount} + 1)
      + EXP(-0.1 * EXTRACT(EPOCH FROM (${timestamp ?? new Date().toISOString()}::timestamptz - ${comments.createdAt})) / 86400) * 3
    ) * 1000000)::bigint
  `.as('score');

  const scored = db
    .select({
      ...COMMENT_FIELDS,
      score,
    })
    .from(comments)
    .where(eq(comments.postId, postId))
    .as('scored');

  const cursorCondition =
    cursorScore != null && cursorId != null
      ? sql`(
          ${scored.score} < ${cursorScore}
          OR (${scored.score} = ${cursorScore} AND ${scored.id} > ${cursorId})
        )`
      : undefined;

  return await db
    .select({
      id: scored.id,
      postId: scored.postId,
      content: scored.content,
      createdAt: scored.createdAt,
      updatedAt: scored.updatedAt,
      likeCount: scored.likeCount,
      userId: scored.userId,
      score: scored.score,
      user: COMMENT_USER_FIELDS,
    })
    .from(scored)
    .innerJoin(users, eq(users.id, scored.userId))
    .where(cursorCondition)
    .orderBy(desc(scored.score), asc(scored.id))
    .limit(limit);
}
