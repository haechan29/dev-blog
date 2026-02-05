import Post from '@/features/post/domain/model/post';

export interface Series {
  id: string;
  title: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
  userId: string;
  authorName: string | null;
  posts: Pick<
    Post,
    | 'id'
    | 'title'
    | 'createdAt'
    | 'seriesId'
    | 'seriesOrder'
    | 'likeCount'
    | 'viewCount'
    | 'visibility'
  >[];
  postCount: number;
}
