import { PostDto } from '@/features/post/data/dto/postDto';
import {
  PostEntity,
  PostEntityFlat,
} from '@/features/post/data/entities/postEntities';

export function toDto(post: PostEntity): PostDto {
  return {
    id: post.id,
    title: post.title,
    tags: post.tags,
    content: post.content,
    contentJson: post.content_json,
    preview: post.preview,
    createdAt: post.created_at,
    updatedAt: post.updated_at ?? post.created_at,
    userId: post.user_id,
    authorName: post.users.nickname,
    bio: post.users.bio,
    profileImageUrl: post.users.profile_image_url,
    deletedAt: post.users.deleted_at,
    registeredAt: post.users.registered_at,
    seriesId: post.series_id,
    seriesOrder: post.series_order,
    seriesTitle: post.series?.title ?? null,
    likeCount: post.post_stats?.like_count ?? 0,
    viewCount: post.post_stats?.view_count ?? 0,
    visibility: post.visibility,
  };
}

export function toFlatDto(post: PostEntityFlat): PostDto {
  return {
    id: post.id,
    title: post.title,
    tags: post.tags,
    content: post.content,
    contentJson: post.content_json,
    preview: post.preview,
    createdAt: post.created_at,
    updatedAt: post.updated_at ?? post.created_at,
    userId: post.user_id,
    authorName: post.nickname,
    bio: post.bio,
    profileImageUrl: post.profile_image_url,
    deletedAt: post.deleted_at,
    registeredAt: post.registered_at,
    seriesId: post.series_id,
    seriesOrder: post.series_order,
    seriesTitle: post.series_title,
    likeCount: post.like_count ?? 0,
    viewCount: post.view_count ?? 0,
    visibility: post.visibility,
  };
}
