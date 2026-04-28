import { PostDto } from '@/features/post/data/dto/postDto';

export interface SeriesDto {
  id: string;
  title: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
  userId: string;
  user: {
    nickname: string | null;
    profileImageUrl: string | null;
  };
  posts: (Pick<
    PostDto,
    'id' | 'title' | 'createdAt' | 'seriesId' | 'seriesOrder' | 'visibility'
  > & {
    postStat: Pick<
      PostDto['postStat'],
      'likeCount' | 'viewCount' | 'commentCount'
    >;
  })[];
  postCount: number;
}
