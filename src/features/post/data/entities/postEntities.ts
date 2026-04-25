import { posts, postStats, series, users } from '@/db/schema';
import { fetchPost } from '@/features/post/data/queries/postQueries';
import { PostVisibility } from '@/features/post/domain/types/postVisibility';
import { InferSelectModel } from 'drizzle-orm';

type PostRow = InferSelectModel<typeof posts>;
type UserRow = InferSelectModel<typeof users>;
type SeriesRow = InferSelectModel<typeof series>;
type PostStatsRow = InferSelectModel<typeof postStats>;

export type PostEntity = Awaited<ReturnType<typeof fetchPost>>;

export type PostEntityFlat = {
  id: PostRow['id'];
  title: PostRow['title'];
  tags: PostRow['tags'];
  content_json: PostRow['contentJson'];
  preview: PostRow['preview'];
  created_at: PostRow['createdAt'];
  updated_at: PostRow['updatedAt'];
  user_id: PostRow['userId'];
  series_id: PostRow['seriesId'];
  series_order: PostRow['seriesOrder'];
  visibility: PostVisibility;
  nickname: UserRow['nickname'];
  deleted_at: UserRow['deletedAt'];
  registered_at: UserRow['registeredAt'];
  bio: UserRow['bio'];
  profile_image_url: UserRow['profileImageUrl'];
  series_title: SeriesRow['title'];
  like_count: PostStatsRow['likeCount'] | null;
  view_count: PostStatsRow['viewCount'] | null;
  comment_count: PostStatsRow['commentCount'] | null;
  relevance_score: number;
};
