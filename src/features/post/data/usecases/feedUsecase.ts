import * as FeedQueries from '@/features/post/data/queries/feedQueries';

export type FeedPost = Awaited<
  ReturnType<typeof FeedQueries.fetchFeedPosts>
>[number];

function findSeriesFirstUnread(
  posts: FeedPost[],
  viewedSeriesIds: string[]
): Set<string> {
  const seriesFirstUnread = new Set<string>();
  const seenSeries = new Set<string>();

  posts
    .filter(post => post.series_id && viewedSeriesIds.includes(post.series_id))
    .sort((a, b) => (a.series_order ?? 0) - (b.series_order ?? 0))
    .forEach(post => {
      if (!seenSeries.has(post.series_id)) {
        seenSeries.add(post.series_id);
        seriesFirstUnread.add(post.id);
      }
    });

  return seriesFirstUnread;
}
