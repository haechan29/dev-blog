import * as InteractionQueries from '@/features/post-interaction/data/queries/interactionQueries';
import 'server-only';

export async function recordView(
  userId: string,
  postId: string,
  readDuration: number,
  fromFeed: boolean = false
) {
  const results: Promise<void>[] = [];
  results.push(InteractionQueries.insertView(userId, postId, readDuration));

  if (fromFeed) {
    results.push(InteractionQueries.decrementSkip(userId, postId));
  }

  await Promise.all(results);
}
