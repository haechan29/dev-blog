import { db } from '@/db/index';
import { postSkips } from '@/db/schema';
import { desc, eq } from 'drizzle-orm';
import { supabase } from '@/lib/supabase';
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
  const { error } = await supabase.rpc('increment_skips', {
    p_user_id: userId,
    p_post_ids: postIds,
  });

  if (error) {
    throw new Error(error.message);
  }
}

export async function decrementPostSkip(userId: string, postId: string) {
  const { error } = await supabase.rpc('decrement_skip', {
    p_user_id: userId,
    p_post_id: postId,
  });

  if (error) {
    throw new Error(error.message);
  }
}
