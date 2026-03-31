import * as PostSkipQueries from '@/features/post-interaction/data/queries/postSkipQueries';
import * as PostViewQueries from '@/features/post-interaction/data/queries/postViewQueries';
import 'server-only';

export async function recordView(
  userId: string,
  postId: string,
  readDuration: number,
  fromFeed: boolean = false
) {
  const results: Promise<void>[] = [];
  results.push(PostViewQueries.createPostView(userId, postId, readDuration));

  if (fromFeed) {
    results.push(PostSkipQueries.decrementPostSkip(userId, postId));
  }

  await Promise.all(results);
}
