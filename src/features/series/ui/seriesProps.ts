import { formatDate } from '@/features/post/domain/lib/date';
import { formatViewCount, PostProps } from '@/features/post/ui/postProps';
import { Series } from '@/features/series/domain/model/series';
import { toUserNickname } from '@/features/user/ui/userProps';

export interface SeriesProps {
  id: string;
  title: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
  userId: string;
  authorName: string;
  profileImageUrl: string | null;
  posts: Pick<
    PostProps,
    | 'id'
    | 'title'
    | 'createdAt'
    | 'seriesId'
    | 'seriesOrder'
    | 'likeCount'
    | 'viewCount'
    | 'commentCount'
    | 'visibility'
  >[];
  postCount: number;
}

export function createProps(series: Series): SeriesProps {
  return {
    id: series.id,
    title: series.title,
    description: series.description,
    createdAt: formatDate(series.createdAt),
    updatedAt: formatDate(series.updatedAt),
    userId: series.userId,
    authorName: toUserNickname({
      id: series.userId,
      nickname: series.authorName,
    }),
    profileImageUrl: series.profileImageUrl,
    posts: series.posts.map(post => {
      return {
        ...post,
        viewCount: formatViewCount(post.viewCount),
        createdAt: formatDate(post.createdAt),
      };
    }),
    postCount: series.postCount,
  };
}
