import * as FeedQueries from '@/features/post/data/queries/feedQueries';

export type FeedPostEntity = Awaited<
  ReturnType<typeof FeedQueries.fetchFeedPosts>
>[number];
