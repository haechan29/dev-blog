import * as PostQueries from '@/features/post/data/queries/postQueries';
import 'server-only';

export async function fetchPosts(userId?: string) {
  return await PostQueries.fetchPosts(userId);
}

export async function fetchPost(postId: string) {
  return await PostQueries.fetchPost(postId);
}
