import { toPostVisibility } from '@/features/post/domain/types/postVisibility';
import { SeriesDto } from '@/features/series/data/dto/seriesDto';
import { SeriesEntity } from '@/features/series/data/entities/seriesEntities';

export function toDto(entity: SeriesEntity): SeriesDto {
  return {
    id: entity.id,
    title: entity.title,
    description: entity.description,
    createdAt: entity.createdAt,
    updatedAt: entity.updatedAt,
    userId: entity.userId,
    user: {
      nickname: entity.user.nickname,
      profileImageUrl: entity.user.profileImageUrl,
    },
    posts: entity.posts.map(post => ({
      id: post.id,
      title: post.title,
      createdAt: post.createdAt,
      seriesId: post.seriesId,
      seriesOrder: post.seriesOrder,
      visibility: toPostVisibility(post.visibility),
      postStat: {
        likeCount: post.postStats?.likeCount ?? 0,
        viewCount: post.postStats?.viewCount ?? 0,
        commentCount: post.postStats?.commentCount ?? 0,
      },
    })),
    postCount: entity.posts.length,
  };
}
