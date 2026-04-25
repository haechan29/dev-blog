import { PostDto } from '@/features/post/data/dto/postDto';

export interface Series {
  id: string;
  title: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
  userId: string;
  authorName: string | null;
  profileImageUrl: string | null;
  posts: (Pick<
    PostDto,
    'id' | 'title' | 'createdAt' | 'seriesId' | 'seriesOrder' | 'visibility'
  > &
    Pick<PostDto['postStat'], 'likeCount' | 'viewCount' | 'commentCount'>)[];
  postCount: number;
}
