import { formatDate } from '@/features/post/domain/lib/date';
import { PostProps } from '@/features/post/ui/postProps';
import { Series } from '@/features/series/domain/model/series';

export interface SeriesProps {
  id: string;
  title: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
  userId: string;
  authorName: string;
  posts: Pick<
    PostProps,
    | 'id'
    | 'title'
    | 'createdAt'
    | 'seriesId'
    | 'seriesOrder'
    | 'likeCount'
    | 'viewCount'
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
    authorName: series.authorName,
    posts: series.posts.map(post => {
      return { ...post, createdAt: formatDate(post.createdAt) };
    }),
    postCount: series.postCount,
  };
}
