import { PostResponseDto } from '@/features/post/data/dto/postResponseDto';

export interface SeriesDto {
  id: string;
  title: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
  userId: string;
  authorName: string;
  posts: Pick<PostResponseDto, 'id' | 'title' | 'seriesOrder'>[];
  postCount: number;
}
