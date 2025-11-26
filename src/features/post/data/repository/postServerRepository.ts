import { PostResponseDto } from '@/features/post/data/dto/postResponseDto';
import { toData } from '@/features/post/data/mapper/postMapper';
import * as PostQueries from '@/features/post/data/queries/postQueries';
import { Post } from '@/features/post/domain/types/post';
import 'server-only';

export async function fetchPosts(): Promise<PostResponseDto[]> {
  const posts: Post[] = await PostQueries.fetchPosts();
  return posts.map(toData);
}

export async function fetchPost(postId: string): Promise<PostResponseDto> {
  const post: Post = await PostQueries.fetchPost(postId);
  return toData(post);
}
