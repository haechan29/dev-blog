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

function calculateScores(
  posts: FeedPost[],
  {
    followingIds,
    seriesFirstUnread,
    skipMap,
  }: {
    followingIds: string[];
    seriesFirstUnread: Set<string>;
    skipMap: Map<string, number>;
  }
) {
  return posts.map(post => {
    const popularity = post.post_stats[0]?.popularity ?? 0;
    let multiplier = 1.0;

    if (followingIds.includes(post.user_id)) multiplier += 0.3;
    if (seriesFirstUnread.has(post.id)) multiplier += 0.3;

    const skipCount = skipMap.get(post.id) ?? 0;
    if (skipCount === 1) multiplier -= 0.2;
    else if (skipCount === 2) multiplier -= 0.4;
    else if (skipCount >= 3) multiplier -= 0.8;

    multiplier = Math.max(0.2, Math.min(2.0, multiplier));

    return {
      ...post,
      popularity,
      multiplier,
      score: popularity * multiplier,
    };
  });
}
