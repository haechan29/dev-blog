import { PostDto } from '@/features/post/data/dto/postDto';
import { FeedPostEntity } from '@/features/post/data/entities/feedPostEntities';

export function toDto(post: FeedPostEntity): PostDto {
  return {
    id: post.id,
    title: post.title,
    tags: post.tags,
    contentJson: post.content_json,
    preview: post.preview,
    createdAt: post.created_at,
    updatedAt: post.updated_at ?? post.created_at,
    userId: post.user_id,
    authorName: post.users.nickname,
    bio: post.users.bio ?? null,
    profileImageUrl: post.users.profile_image_url ?? null,
    deletedAt: post.users.deleted_at ?? null,
    registeredAt: post.users.registered_at ?? null,
    seriesId: post.series_id,
    seriesOrder: post.series_order,
    seriesTitle: post.series?.title ?? null,
    likeCount: post.post_stats?.like_count ?? 0,
    viewCount: post.post_stats?.view_count ?? 0,
    commentCount: post.post_stats?.comment_count ?? 0,
    visibility: post.visibility,
  };
}
