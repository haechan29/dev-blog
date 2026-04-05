import { PostProps } from '@/features/post/ui/postProps';

export interface PostsPage {
  posts: PostProps[];
  nextCursor: string | null;
}
