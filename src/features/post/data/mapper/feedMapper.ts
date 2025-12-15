import { PostDto } from '@/features/post/data/dto/postDto';
import { FeedPost } from '@/features/post/data/usecases/feedUsecase';

export function toDto(post: FeedPost): PostDto {
  return {
    id: post.id,
    title: post.title,
    tags: post.tags,
    content: post.content,
    createdAt: post.created_at,
    updatedAt: post.updated_at ?? post.created_at,
    userId: post.user_id,
    authorName:
      post.users[0]?.nickname ?? `Guest#${post.user_id?.slice(0, 4) ?? '0000'}`,
    deletedAt: post.users[0]?.deleted_at ?? null,
    registeredAt: post.users[0]?.registered_at ?? null,
    seriesId: post.series_id,
    seriesOrder: post.series_order,
    seriesTitle: post.series[0]?.title ?? null,
  };
}
