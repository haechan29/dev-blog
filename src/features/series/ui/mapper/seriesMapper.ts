import { formatDate } from '@/features/post/domain/lib/date';
import { formatViewCount } from '@/features/post/ui/postProps';
import { SeriesDto } from '@/features/series/data/dto/seriesDto';
import { SeriesProps } from '@/features/series/ui/props/seriesProps';
import { toUserNickname } from '@/features/user/ui/userProps';

export function toProps(series: SeriesDto): SeriesProps {
  return {
    id: series.id,
    title: series.title,
    description: series.description,
    createdAt: formatDate(series.createdAt),
    updatedAt: formatDate(series.updatedAt),
    userId: series.userId,
    authorName: toUserNickname({
      id: series.userId,
      nickname: series.user.nickname,
    }),
    profileImageUrl: series.user.profileImageUrl,
    posts: series.posts.map(post => ({
      id: post.id,
      title: post.title,
      createdAt: formatDate(post.createdAt),
      seriesId: post.seriesId,
      seriesOrder: post.seriesOrder,
      likeCount: post.postStat.likeCount,
      viewCount: formatViewCount(post.postStat.viewCount),
      commentCount: post.postStat.commentCount,
      visibility: post.visibility,
    })),
    postCount: series.postCount,
  };
}
