import * as InteractionQueries from '@/features/post-interaction/data/queries/interactionQueries';
import { FeedPostEntity } from '@/features/post/data/entities/feedPostEntities';
import { toDto } from '@/features/post/data/mapper/feedMapper';
import * as FeedQueries from '@/features/post/data/queries/feedQueries';
import * as SubscriptionQueries from '@/features/subscription/data/queries/subscriptionQueries';

const FEED_LIMIT = 20;

export async function getFeedPosts(
  cursor: string | null,
  userId?: string,
  excludeId?: string
) {
  if (!userId) {
    const fetchedPosts = await FeedQueries.fetchFeedPosts({
      limit: FEED_LIMIT + 1,
      cursor,
      excludeIds: excludeId ? [excludeId] : [],
    });

    const isLastPage = fetchedPosts.length <= FEED_LIMIT;
    const posts = fetchedPosts.slice(0, FEED_LIMIT);

    return {
      posts: posts.map(toDto),
      nextCursor: isLastPage
        ? null
        : posts.at(-1)?.post_stats.popularity.toString() ?? null,
    };
  }

  const [followingIds, viewedPosts, skippedPosts] = await Promise.all([
    SubscriptionQueries.getFollowingIds(userId),
    InteractionQueries.fetchViewedPosts(userId),
    InteractionQueries.fetchSkippedPosts(userId),
  ]);

  const viewedPostIds = viewedPosts.map(v => v.post_id);
  const viewedSeriesIds = [
    ...new Set(viewedPosts.map(v => v.posts[0]?.series_id).filter(Boolean)),
  ];
  const skipMap = new Map(skippedPosts.map(s => [s.post_id, s.skip_count]));

  const fetchedPosts = await FeedQueries.fetchFeedPosts({
    limit: FEED_LIMIT + 1,
    excludeIds: excludeId ? [...viewedPostIds, excludeId] : viewedPostIds,
    cursor,
  });

  const isLastPage = fetchedPosts.length <= FEED_LIMIT;
  const posts = fetchedPosts.slice(0, FEED_LIMIT);

  const seriesFirstUnread = findSeriesFirstUnread(posts, viewedSeriesIds);

  const scoredPosts = calculateScores(posts, {
    followingIds,
    seriesFirstUnread,
    skipMap,
  });

  scoredPosts.sort((a, b) => b.score - a.score);

  const postIds = scoredPosts.map(p => p.id);
  await InteractionQueries.incrementSkips(userId, postIds);

  return {
    posts: scoredPosts.map(p => toDto(p)),
    nextCursor: isLastPage
      ? null
      : posts.at(-1)?.post_stats.popularity.toString() ?? null,
  };
}

function findSeriesFirstUnread(
  posts: FeedPostEntity[],
  viewedSeriesIds: string[]
): Set<string> {
  const seriesFirstUnread = new Set<string>();
  const seenSeries = new Set<string>();

  posts
    .filter(post => post.series_id && viewedSeriesIds.includes(post.series_id))
    .sort((a, b) => (a.series_order ?? 0) - (b.series_order ?? 0))
    .forEach(post => {
      if (!seenSeries.has(post.series_id!)) {
        seenSeries.add(post.series_id!);
        seriesFirstUnread.add(post.id);
      }
    });

  return seriesFirstUnread;
}

function calculateScores(
  posts: FeedPostEntity[],
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
    const popularity = post.post_stats.popularity ?? 0;
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
