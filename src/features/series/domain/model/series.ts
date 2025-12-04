import Post from '@/features/post/domain/model/post';

export interface Series {
  id: string;
  title: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
  userId: string;
  authorName: string;
  posts: Pick<Post, 'id' | 'title' | 'createdAt' | 'seriesOrder'>[];
  postCount: number;
}
