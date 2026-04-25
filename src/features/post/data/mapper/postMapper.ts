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
