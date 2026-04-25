import { PostDto } from '@/features/post/data/dto/postDto';
import { FeedPostEntity } from '@/features/post/data/entities/feedPostEntities';
import { toPostVisibility } from '@/features/post/domain/types/postVisibility';

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
    seriesId: post.seriesId,
    seriesOrder: post.seriesOrder,
    visibility: toPostVisibility(post.visibility),
    user: post.user,
    series: post.series,
    postStat: post.postStat,
  };
}
