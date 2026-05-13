import { db } from '@/db/index';
import { postSkips } from '@/db/schema';
import { and, desc, eq, sql } from 'drizzle-orm';
import 'server-only';

const POST_SKIP_SELECT_FIELDS = {
  postId: postSkips.postId,
  skipCount: postSkips.skipCount,
} as const;

export async function fetchSkippedPosts(userId: string) {
  return await db
    .select(POST_SKIP_SELECT_FIELDS)
    .from(postSkips)
    .where(eq(postSkips.userId, userId))
    .orderBy(desc(postSkips.updatedAt))
    .limit(1000);
}

export async function incrementPostSkips(userId: string, postIds: string[]) {
  if (postIds.length === 0) return;

  await db
    .insert(postSkips)
    .values(postIds.map(postId => ({ userId, postId, skipCount: 1 })))
    .onConflictDoUpdate({
      target: [postSkips.userId, postSkips.postId],
      set: {
        skipCount: sql`${postSkips.skipCount} + 1`,
        updatedAt: new Date().toISOString(),
      },
    });
}

export async function decrementPostSkip(userId: string, postId: string) {
  await db
    .update(postSkips)
    .set({
      skipCount: sql`GREATEST(${postSkips.skipCount} - 1, 0)`,
      updatedAt: new Date().toISOString(),
    })
    .where(and(eq(postSkips.userId, userId), eq(postSkips.postId, postId)));
}
