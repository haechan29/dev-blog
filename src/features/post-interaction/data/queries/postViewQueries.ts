import { db } from '@/db/index';
import { postViews, posts } from '@/db/schema';
import { desc, eq } from 'drizzle-orm';
import 'server-only';

const POST_VIEW_SELECT_FIELDS = {
  postId: postViews.postId,
  seriesId: posts.seriesId,
} as const;

export async function fetchViewedPosts(userId: string) {
  return await db
    .select(POST_VIEW_SELECT_FIELDS)
    .from(postViews)
    .innerJoin(posts, eq(postViews.postId, posts.id))
    .where(eq(postViews.userId, userId))
    .orderBy(desc(postViews.createdAt))
    .limit(1000);
}

export async function createPostView(
  userId: string,
  postId: string,
  readDuration: number
) {
  await db.insert(postViews).values({
    userId,
    postId,
    readDuration,
  });
}
