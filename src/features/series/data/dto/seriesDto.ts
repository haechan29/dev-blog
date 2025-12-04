import { PostDto } from '@/features/post/data/dto/postDto';

export interface SeriesDto {
  id: string;
  title: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
  userId: string;
  authorName: string;
  posts: Pick<PostDto, 'id' | 'title' | 'seriesOrder'>[];
  postCount: number;
}
