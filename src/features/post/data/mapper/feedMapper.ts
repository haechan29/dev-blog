import { PostDto } from '@/features/post/data/dto/postDto';
import { FeedPostEntity } from '@/features/post/data/entities/feedPostEntities';

export function toDto(post: FeedPostEntity): PostDto {
  return {
    id: post.id,
    title: post.title,
    tags: post.tags,
    content: post.content,
    createdAt: post.created_at,
    updatedAt: post.updated_at ?? post.created_at,
    userId: post.user_id,
    authorName:
      post.users.nickname ?? `Guest#${post.user_id?.slice(0, 4) ?? '0000'}`,
    deletedAt: post.users.deleted_at ?? null,
    registeredAt: post.users.registered_at ?? null,
    seriesId: post.series_id,
    seriesOrder: post.series_order,
    seriesTitle: post.series?.title ?? null,
    likeCount: post.post_stats?.like_count ?? 0,
    viewCount: post.post_stats?.view_count ?? 0,
  };
}
