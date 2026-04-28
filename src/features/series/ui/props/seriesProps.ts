import { PostProps } from '@/features/post/ui/postProps';

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
