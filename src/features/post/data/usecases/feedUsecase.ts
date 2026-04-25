import * as PostSkipQueries from '@/features/post-interaction/data/queries/postSkipQueries';
import * as PostViewQueries from '@/features/post-interaction/data/queries/postViewQueries';
import { FeedPostEntity } from '@/features/post/data/entities/feedPostEntities';
import { toDto } from '@/features/post/data/mapper/feedMapper';
import * as FeedQueries from '@/features/post/data/queries/feedQueries';
import * as SubscriptionQueries from '@/features/subscription/data/queries/subscriptionQueries';

const FEED_LIMIT = 5;

export async function getFeedPosts({
  cursor,
  userId,
  excludeId,
  tag,
}: {
  cursor: string | null;
  userId?: string;
  excludeId?: string;
  tag?: string;
}) {
  if (!userId) {
    const fetchedPosts = await FeedQueries.fetchFeedPosts({
      limit: FEED_LIMIT + 1,
      cursor,
      excludeIds: excludeId ? [excludeId] : [],
      tag,
    });

    const isLastPage = fetchedPosts.length <= FEED_LIMIT;
    const posts = fetchedPosts.slice(0, FEED_LIMIT);

    return {
      posts: posts.map(toDto),
      nextCursor: isLastPage
        ? null
        : (posts.at(-1)?.postStat.popularity.toString() ?? null),
    };
  }

  const [followingIds, viewedPosts, skippedPosts] = await Promise.all([
    SubscriptionQueries.getFollowingIds(userId),
    PostViewQueries.fetchViewedPosts(userId),
    PostSkipQueries.fetchSkippedPosts(userId),
  ]);

  const viewedSeriesIds = [
    ...new Set(viewedPosts.map(v => v.posts[0]?.series_id).filter(Boolean)),
  ];
  const skipMap = new Map(skippedPosts.map(s => [s.post_id, s.skip_count]));

  const fetchedPosts = await FeedQueries.fetchFeedPosts({
    limit: FEED_LIMIT + 1,
    excludeIds: excludeId ? [excludeId] : [],
    excludeUserId: userId,
    cursor,
    tag,
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
  await PostSkipQueries.incrementPostSkips(userId, postIds);

  return {
    posts: scoredPosts.map(p => toDto(p)),
    nextCursor: isLastPage
      ? null
      : (posts.at(-1)?.postStat.popularity.toString() ?? null),
  };
}

function findSeriesFirstUnread(
  posts: FeedPostEntity[],
  viewedSeriesIds: string[]
): Set<string> {
  const seriesFirstUnread = new Set<string>();
  const seenSeries = new Set<string>();

  posts
    .filter(post => post.seriesId && viewedSeriesIds.includes(post.seriesId))
    .sort((a, b) => (a.seriesOrder ?? 0) - (b.seriesOrder ?? 0))
    .forEach(post => {
      if (!seenSeries.has(post.seriesId!)) {
        seenSeries.add(post.seriesId!);
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
    const popularity = post.postStat.popularity ?? 0;
    let multiplier = 1.0;

    if (followingIds.includes(post.userId)) multiplier += 0.3;
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
