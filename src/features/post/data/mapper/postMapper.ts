import { PostDto } from '@/features/post/data/dto/postDto';
import {
  PostEntity,
  PostEntityFlat,
} from '@/features/post/data/entities/postEntities';
import { toPostVisibility } from '@/features/post/domain/types/postVisibility';

export function toDto(post: PostEntity): PostDto {
  return {
    id: post.id,
    title: post.title,
    tags: post.tags,
    contentJson: post.contentJson as object,
    preview: post.preview,
    createdAt: post.createdAt,
    updatedAt: post.updatedAt ?? post.createdAt,
    userId: post.userId,
    authorName: post.nickname,
    bio: post.bio,
    profileImageUrl: post.profileImageUrl,
    deletedAt: post.deletedAt,
    registeredAt: post.registeredAt,
    seriesId: post.seriesId,
    seriesOrder: post.seriesOrder,
    seriesTitle: post.seriesTitle,
    likeCount: post.likeCount ?? 0,
    viewCount: post.viewCount ?? 0,
    commentCount: post.commentCount ?? 0,
    visibility: toPostVisibility(post.visibility),
  };
}

export function toFlatDto(post: PostEntityFlat): PostDto {
  return {
    id: post.id,
    title: post.title,
    tags: post.tags,
    contentJson: post.content_json as object,
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
    commentCount: post.comment_count ?? 0,
    visibility: post.visibility,
  };
}
