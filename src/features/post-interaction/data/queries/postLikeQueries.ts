import { db } from '@/db/index';
import { postLikes } from '@/db/schema';
import { and, eq } from 'drizzle-orm';
import 'server-only';

export async function fetchPostLike(userId: string, postId: string) {
  const data = await db
    .select({ userId: postLikes.userId })
    .from(postLikes)
    .where(and(eq(postLikes.userId, userId), eq(postLikes.postId, postId)))
    .limit(1);

  return Boolean(data[0]);
}

export async function createPostLike(userId: string, postId: string) {
  await db.insert(postLikes).values({ userId, postId });
}

export async function deletePostLike(userId: string, postId: string) {
  await db
    .delete(postLikes)
    .where(and(eq(postLikes.userId, userId), eq(postLikes.postId, postId)));
}
