import * as PostQueries from '@/features/post/data/queries/postQueries';
import 'server-only';

export async function fetchAllPosts() {
  return await PostQueries.fetchAllPosts();
}

export async function fetchPost(postId: string) {
  return await PostQueries.fetchPost(postId);
}

export async function fetchPostsByUserId(userId: string) {
  return await PostQueries.fetchPostsByUserId(userId);
}
