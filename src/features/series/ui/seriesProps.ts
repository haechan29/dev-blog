import { formatDate } from '@/features/post/domain/lib/date';
import { Series } from '@/features/series/domain/model/series';

export interface SeriesProps {
  id: string;
  title: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
  userId: string;
  authorName: string;
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
    postCount: series.postCount,
    authorName: series.authorName,
  };
}
