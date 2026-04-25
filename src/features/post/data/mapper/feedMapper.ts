import { PostDto } from '@/features/post/data/dto/postDto';
import * as FeedQueries from '@/features/post/data/queries/feedQueries';
import { toPostVisibility } from '@/features/post/domain/types/postVisibility';

export type FeedPostEntity = Awaited<
  ReturnType<typeof FeedQueries.fetchFeedPosts>
>[number];

export function toDto(post: FeedPostEntity): PostDto {
  return {
    id: post.id,
    title: post.title,
    tags: post.tags,
    contentJson: post.contentJson as object,
    preview: post.preview,
    createdAt: post.createdAt,
    updatedAt: post.updatedAt ?? post.createdAt,
    userId: post.userId,
    authorName: post.user.nickname ?? null,
    bio: post.user.bio,
    profileImageUrl: post.user.profileImageUrl,
    deletedAt: post.user.deletedAt,
    registeredAt: post.user.registeredAt,
    seriesId: post.seriesId,
    seriesOrder: post.seriesOrder,
    seriesTitle: post.series?.title ?? null,
    likeCount: post.postStat.likeCount,
    viewCount: post.postStat.viewCount,
    commentCount: post.postStat.commentCount,
    visibility: toPostVisibility(post.visibility),
  };
}
