import * as PostQueries from '@/features/post/data/queries/postQueries';
import 'server-only';

export async function fetchAllPosts(userId?: string) {
  return await PostQueries.fetchAllPosts(userId);
}

export async function fetchPost(postId: string) {
  return await PostQueries.fetchPost(postId);
}
