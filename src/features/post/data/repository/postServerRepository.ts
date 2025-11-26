import { PostResponseDto } from '@/features/post/data/dto/postResponseDto';
import { toData } from '@/features/post/data/mapper/postMapper';
import {
  getPostFromDB,
  getPostsFromDB,
} from '@/features/post/data/queries/postQueries';
import { Post } from '@/features/post/domain/types/post';
import 'server-only';

export async function fetchPosts(): Promise<PostResponseDto[]> {
  const posts: Post[] = await getPostsFromDB();
  return posts.map(toData);
}

export async function fetchPost(postId: string): Promise<PostResponseDto> {
  const post: Post = await getPostFromDB(postId);
  return toData(post);
}
