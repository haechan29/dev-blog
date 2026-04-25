import { PostDto } from '@/features/post/data/dto/postDto';
import { fetchPost } from '@/features/post/data/queries/postQueries';
import { toPostVisibility } from '@/features/post/domain/types/postVisibility';

type PostEntity = Awaited<ReturnType<typeof fetchPost>>;

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
    authorName: post.user.nickname,
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
