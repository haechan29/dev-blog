import { db } from '@/db/index';
import { postStats, posts, series, users } from '@/db/schema';
import {
  and,
  arrayContains,
  desc,
  eq,
  lt,
  ne,
  notInArray,
  sql,
} from 'drizzle-orm';
import 'server-only';

const FEED_POST_FIELDS = {
  id: posts.id,
  title: posts.title,
  contentJson: posts.contentJson,
  preview: posts.preview,
  tags: posts.tags,
  createdAt: posts.createdAt,
  updatedAt: posts.updatedAt,
  userId: posts.userId,
  seriesId: posts.seriesId,
  seriesOrder: posts.seriesOrder,
  visibility: posts.visibility,
};

const FEED_USER_FIELDS = {
  nickname: users.nickname,
  deletedAt: users.deletedAt,
  registeredAt: users.registeredAt,
  bio: users.bio,
  profileImageUrl: users.profileImageUrl,
};

const FEED_SERIES_FIELDS = {
  title: series.title,
};

const FEED_POST_STATS_FIELDS = {
  likeCount: postStats.likeCount,
  viewCount: postStats.viewCount,
  commentCount: postStats.commentCount,
  popularity: sql<number>`${postStats.popularity}::float8`,
};

const FEED_POST_SELECT_FIELDS = {
  ...FEED_POST_FIELDS,
  user: FEED_USER_FIELDS,
  series: FEED_SERIES_FIELDS,
  postStat: FEED_POST_STATS_FIELDS,
};

export async function fetchFeedPosts({
  limit,
  excludeIds = [],
  excludeUserId,
  cursor,
  tag,
}: {
  limit: number;
  excludeIds?: string[];
  excludeUserId?: string;
  cursor: string | null;
  tag?: string;
}) {
  const conditions = [eq(posts.visibility, 'public')];

  if (excludeIds.length > 0) {
    conditions.push(notInArray(posts.id, excludeIds));
  }

  if (excludeUserId) {
    conditions.push(ne(posts.userId, excludeUserId));
  }

  if (cursor) {
    conditions.push(lt(postStats.popularity, cursor));
  }

  if (tag) {
    conditions.push(arrayContains(posts.tags, [tag]));
  }

  const data = await db
    .select(FEED_POST_SELECT_FIELDS)
    .from(posts)
    .innerJoin(users, eq(posts.userId, users.id))
    .leftJoin(series, eq(posts.seriesId, series.id))
    .innerJoin(postStats, eq(posts.id, postStats.postId))
    .where(and(...conditions))
    .orderBy(desc(postStats.popularity))
    .limit(limit);

  return data;
}
