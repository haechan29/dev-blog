import { PostDto } from '@/features/post/data/dto/postDto';

export interface SeriesDto {
  id: string;
  title: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
  userId: string;
  authorName: string | null;
  profileImageUrl: string | null;
  posts: Pick<
    PostDto,
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
